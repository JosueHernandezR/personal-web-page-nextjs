import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, validateSMTPConfig, EmailData } from '@/utils/mailer';

// Simple rate limiting usando Map (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Máximo 5 emails por día por IP
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    // Primer intento o ventana expirada
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetTime: userLimit.resetTime };
  }
  
  // Incrementar contador
  userLimit.count++;
  rateLimitMap.set(ip, userLimit);
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  console.log('=== API CONTACT NO-CAPTCHA - INICIO ===');
  console.log('Environment:', process.env.NODE_ENV);
  
  try {
    // Verificar variables de entorno críticas al inicio
    console.log('Verificando variables de entorno...');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'OK' : 'FALTANTE');
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'OK' : 'FALTANTE');
    
    // Obtener IP del cliente
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // Verificar rate limiting
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime!);
      return NextResponse.json(
        { 
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Has alcanzado el límite diario de mensajes',
          resetTime: resetDate.toISOString(),
          details: 'Puedes enviar hasta 5 mensajes por día'
        },
        { status: 429 }
      );
    }

    // Validar configuración SMTP
    console.log('Validando configuración SMTP...');
    try {
      validateSMTPConfig();
      console.log('Configuración SMTP válida');
    } catch (smtpError) {
      console.error('Error de configuración SMTP:', smtpError);
      return NextResponse.json(
        { 
          error: 'EMAIL_SERVICE_ERROR',
          message: 'Servicio de email no configurado correctamente',
          details: smtpError instanceof Error ? smtpError.message : 'Error de configuración SMTP'
        },
        { status: 500 }
      );
    }

    // Obtener los datos del formulario
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validar datos requeridos
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          error: 'Todos los campos son requeridos',
          details: 'name, email, subject y message son obligatorios'
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Sanitizar datos (prevenir XSS básico)
    const emailData: EmailData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // Validar longitud de campos
    if (emailData.name.length > 100) {
      return NextResponse.json(
        { error: 'El nombre no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    if (emailData.subject.length > 200) {
      return NextResponse.json(
        { error: 'El asunto no puede exceder 200 caracteres' },
        { status: 400 }
      );
    }

    if (emailData.message.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje no puede exceder 2000 caracteres' },
        { status: 400 }
      );
    }

    // Enviar email
    console.log('Intentando enviar email...');
    console.log('Email data:', { 
      name: emailData.name, 
      email: emailData.email, 
      subject: emailData.subject,
      messageLength: emailData.message.length 
    });
    
    const result = await sendContactEmail(emailData);
    console.log('Email enviado exitosamente:', result.messageId);

    return NextResponse.json(
      {
        success: true,
        message: 'Email enviado exitosamente (SIN CAPTCHA)',
        messageId: result.messageId,
        note: 'Versión temporal sin reCAPTCHA para debugging'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en API de contacto (NO-CAPTCHA):', error);
    
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      // Error de configuración SMTP
      if (error.message.includes('Variables de entorno faltantes')) {
        return NextResponse.json(
          { 
            error: 'EMAIL_SERVICE_ERROR',
            message: 'Servicio de email temporalmente no disponible',
            details: 'Configuración SMTP incompleta'
          },
          { status: 500 }
        );
      }
      
      // Error de autenticación SMTP
      if (error.message.includes('Invalid login') || error.message.includes('Authentication failed')) {
        return NextResponse.json(
          { 
            error: 'EMAIL_SERVICE_ERROR',
            message: 'Servicio de email temporalmente no disponible',
            details: 'Error de autenticación del servidor de email'
          },
          { status: 500 }
        );
      }
      
      // Error de conexión de red
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          { 
            error: 'EMAIL_SERVICE_ERROR',
            message: 'Servicio de email temporalmente no disponible',
            details: 'Error de conexión con el servidor de email'
          },
          { status: 503 }
        );
      }
      
      // Error de límite de envío del proveedor
      if (error.message.includes('rate limit') || error.message.includes('quota exceeded')) {
        return NextResponse.json(
          { 
            error: 'RATE_LIMIT_EXCEEDED',
            message: 'Límite de envío alcanzado',
            details: 'El servicio ha alcanzado su límite de envío. Inténtalo mañana.'
          },
          { status: 429 }
        );
      }
      
      // Error de datos inválidos
      if (error.message.includes('Invalid') || error.message.includes('validation')) {
        return NextResponse.json(
          { 
            error: 'INVALID_DATA',
            message: 'Los datos enviados no son válidos',
            details: error.message
          },
          { status: 400 }
        );
      }
    }

    // Error genérico del servidor
    return NextResponse.json(
      { 
        error: 'SERVER_ERROR',
        message: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Manejar método no permitido
export async function GET() {
  return NextResponse.json(
    { message: 'Endpoint temporal sin reCAPTCHA para debugging - usar POST' },
    { status: 200 }
  );
} 