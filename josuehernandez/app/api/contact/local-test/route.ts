import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, validateSMTPConfig, EmailData } from '@/utils/mailer';

export async function POST(request: NextRequest) {
  console.log('=== LOCAL TEST - SIN RECAPTCHA ===');
  console.log('Environment:', process.env.NODE_ENV);
  
  try {
    // Verificar variables de entorno críticas al inicio
    console.log('Verificando variables de entorno...');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'OK' : 'FALTANTE');
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'OK' : 'FALTANTE');
    
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
        message: 'Email enviado exitosamente (LOCAL TEST)',
        messageId: result.messageId,
        note: 'Este es un test local sin reCAPTCHA'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en LOCAL TEST:', error);
    
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
            message: 'Error de autenticación SMTP',
            details: 'Verificar credenciales SMTP'
          },
          { status: 500 }
        );
      }
      
      // Error de conexión de red
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          { 
            error: 'EMAIL_SERVICE_ERROR',
            message: 'Error de conexión SMTP',
            details: 'No se puede conectar al servidor SMTP'
          },
          { status: 503 }
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
    { message: 'Endpoint de prueba local - usar POST con datos del formulario' },
    { status: 200 }
  );
} 