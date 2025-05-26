const nodemailer = require('nodemailer');

async function verifySMTPConfig() {
  console.log('🔍 Verificando configuración SMTP de iCloud+...\n');

  // Verificar variables de entorno
  const requiredVars = ['SMTP_USER', 'SMTP_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
    console.error('💡 Asegúrate de crear el archivo .env.local con todas las variables necesarias');
    process.exit(1);
  }

  console.log('✅ Variables de entorno encontradas');
  console.log(`📧 Usuario SMTP: ${process.env.SMTP_USER}`);
  console.log(`🏠 Servidor: ${process.env.SMTP_HOST || 'smtp.mail.me.com'}`);
  console.log(`🔌 Puerto: ${process.env.SMTP_PORT || '587'}\n`);

  // Crear transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.mail.me.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔄 Verificando conexión al servidor SMTP...');
    await transporter.verify();
    console.log('✅ ¡Conexión SMTP exitosa!\n');

    // Enviar email de prueba
    console.log('📨 Enviando email de prueba...');
    const testEmail = {
      from: {
        name: 'Test',
        address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
      },
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: '✅ Prueba de configuración SMTP - iCloud+',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">🎉 ¡Configuración SMTP exitosa!</h2>
          <p>Este es un email de prueba para verificar que tu configuración SMTP con iCloud+ está funcionando correctamente.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Detalles de la configuración:</h3>
            <ul>
              <li><strong>Servidor:</strong> ${process.env.SMTP_HOST || 'smtp.mail.me.com'}</li>
              <li><strong>Puerto:</strong> ${process.env.SMTP_PORT || '587'}</li>
              <li><strong>Usuario:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
            </ul>
          </div>
          
          <p style="color: #666;">Tu formulario de contacto está listo para recibir mensajes. 🚀</p>
        </div>
      `,
      text: `
        ¡Configuración SMTP exitosa!
        
        Este es un email de prueba para verificar que tu configuración SMTP con iCloud+ está funcionando correctamente.
        
        Detalles:
        - Servidor: ${process.env.SMTP_HOST || 'smtp.mail.me.com'}
        - Puerto: ${process.env.SMTP_PORT || '587'}
        - Usuario: ${process.env.SMTP_USER}
        - Fecha: ${new Date().toLocaleString('es-ES')}
        
        Tu formulario de contacto está listo para recibir mensajes.
      `,
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ ¡Email de prueba enviado exitosamente!');
    console.log(`📧 Message ID: ${result.messageId}\n`);

    console.log('🎉 ¡Todo está configurado correctamente!');
    console.log('💡 Puedes usar tu formulario de contacto ahora.');
    console.log('📱 Ve a: http://localhost:3000/contact (cuando ejecutes npm run dev)');

  } catch (error) {
    console.error('❌ Error en la configuración SMTP:');
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Error de autenticación - Verifica:');
      console.error('   • Que estés usando una contraseña específica de app, no tu contraseña normal');
      console.error('   • Que la autenticación de dos factores esté habilitada');
      console.error('   • Que el email sea correcto');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Error de conexión - Verifica:');
      console.error('   • Tu conexión a internet');
      console.error('   • Que el puerto 587 no esté bloqueado');
      console.error('   • Configuración de firewall');
    } else {
      console.error(`💥 Error: ${error.message}`);
    }
    
    console.error('\n📚 Consulta SMTP_SETUP.md para más información sobre solución de problemas');
    process.exit(1);
  }
}

// Ejecutar verificación
verifySMTPConfig().catch(console.error); 