import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, validateSMTPConfig, EmailData } from '@/utils/mailer';

// Función para verificar el token de reCAPTCHA
async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    return { success: false, error: 'Configuración de reCAPTCHA incompleta' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    
    if (!data.success) {
      return { 
        success: false, 
        error: 'Token de reCAPTCHA inválido',
        score: data.score 
      };
    }

    // Verificar score mínimo (0.5 es un umbral razonable)
    const minimumScore = 0.5;
    if (data.score < minimumScore) {
      return { 
        success: false, 
        error: 'Verificación de seguridad fallida',
        score: data.score 
      };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('Error verificando reCAPTCHA:', error);
    return { success: false, error: 'Error en la verificación de seguridad' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar configuración SMTP
    validateSMTPConfig();

    // Obtener los datos del formulario
    const body = await request.json();
    const { name, email, subject, message, recaptchaToken } = body;

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

    // Validar token de reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Token de verificación de seguridad requerido' },
        { status: 400 }
      );
    }

    // Verificar reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      console.log('reCAPTCHA falló:', recaptchaResult.error, 'Score:', recaptchaResult.score);
      return NextResponse.json(
        { 
          error: 'Verificación de seguridad fallida',
          details: 'Por favor, inténtalo de nuevo'
        },
        { status: 400 }
      );
    }

    console.log('reCAPTCHA exitoso. Score:', recaptchaResult.score);

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
    const result = await sendContactEmail(emailData);

    return NextResponse.json(
      {
        success: true,
        message: 'Email enviado exitosamente',
        messageId: result.messageId,
        recaptchaScore: recaptchaResult.score,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en API de contacto:', error);
    
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      if (error.message.includes('Variables de entorno faltantes')) {
        return NextResponse.json(
          { 
            error: 'Error de configuración del servidor',
            details: 'Configuración SMTP incompleta'
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('Invalid login')) {
        return NextResponse.json(
          { 
            error: 'Error de autenticación del servidor de email',
            details: 'Credenciales SMTP inválidas'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: 'No se pudo enviar el email. Inténtalo más tarde.'
      },
      { status: 500 }
    );
  }
}

// Manejar método no permitido
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
} 