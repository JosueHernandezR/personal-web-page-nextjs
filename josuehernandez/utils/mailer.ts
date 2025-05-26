import nodemailer from 'nodemailer';

// Configuración del transporter para iCloud+
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.mail.me.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD, // Contraseña específica de app
    },
    tls: {
      // No fallar en certificados inválidos
      rejectUnauthorized: false,
    },
  });
};

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (emailData: EmailData) => {
  try {
    const transporter = createTransporter();

    // Configuración del email
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || 'Formulario de Contacto',
        address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
      },
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `[Contacto Web] ${emailData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${emailData.name}</p>
            <p><strong>Email:</strong> ${emailData.email}</p>
            <p><strong>Asunto:</strong> ${emailData.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #555; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #333;">
              ${emailData.message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <div style="margin-top: 20px; padding: 10px; background-color: #f0f8ff; border-radius: 5px; font-size: 12px; color: #666;">
            <p>Este mensaje fue enviado desde el formulario de contacto de tu sitio web.</p>
            <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      `,
      text: `
        Nuevo mensaje de contacto
        
        Nombre: ${emailData.name}
        Email: ${emailData.email}
        Asunto: ${emailData.subject}
        
        Mensaje:
        ${emailData.message}
        
        Enviado el: ${new Date().toLocaleString('es-ES')}
      `,
    };

    // Enviar el email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error(`Error al enviar email: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Función para validar la configuración SMTP
export const validateSMTPConfig = () => {
  const requiredEnvVars = ['SMTP_USER', 'SMTP_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
  }
  
  return true;
}; 