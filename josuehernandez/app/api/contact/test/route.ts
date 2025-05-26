import { NextResponse } from 'next/server';
import { sendContactEmail, validateSMTPConfig } from '@/utils/mailer';

export async function POST() {
  console.log('=== TEST ENDPOINT ===');
  
  try {
    // Validar configuración SMTP
    console.log('Validando SMTP...');
    validateSMTPConfig();
    console.log('SMTP válido');

    // Datos de prueba simples
    const testEmailData = {
      name: 'Test Usuario',
      email: 'test@example.com',
      subject: 'Test desde API',
      message: 'Este es un mensaje de prueba desde el endpoint de test.'
    };

    console.log('Enviando email de prueba...');
    const result = await sendContactEmail(testEmailData);
    console.log('Test exitoso:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      messageId: result.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en test:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 