#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# ========================================
# CONFIGURACIÓN DE ENTORNO - DESARROLLO
# ========================================
# IMPORTANTE: Este archivo contiene información sensible.
# NO lo subas a control de versiones (debe estar en .gitignore)

# ========================================
# GOOGLE RECAPTCHA v3
# ========================================
# Obtén estas claves en: https://www.google.com/recaptcha/admin
# NOTA: Las claves de abajo son de PRUEBA de Google (solo para desarrollo)
# Clave pública (visible en el frontend)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

# Clave secreta (solo para el servidor)
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# ========================================
# CONFIGURACIÓN SMTP - iCloud+
# ========================================
# Configuración para envío de emails del formulario de contacto
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=tu-email@icloud.com
SMTP_PASSWORD=tu-contraseña-especifica-de-app

SMTP_FROM_EMAIL=tu-email@icloud.com

# Email donde recibirás los mensajes del formulario
CONTACT_EMAIL=tu-email@icloud.com

# ========================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ========================================
# URL base de la aplicación (para desarrollo)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Entorno de ejecución
NODE_ENV=development

# ========================================
# CONFIGURACIÓN DE SEGURIDAD
# ========================================
# Umbral mínimo para reCAPTCHA (0.0 - 1.0)
RECAPTCHA_MIN_SCORE=0.5

# ========================================
# INSTRUCCIONES DE CONFIGURACIÓN
# ========================================
# 
# 1. RECAPTCHA (REEMPLAZA LAS CLAVES DE PRUEBA):
#    - Ve a https://www.google.com/recaptcha/admin
#    - Crea un nuevo sitio con reCAPTCHA v3
#    - Agrega 'localhost' y tu dominio de producción
#    - Reemplaza las claves de ejemplo arriba con las tuyas
#
# 2. SMTP (iCloud+):
#    - Ve a https://appleid.apple.com
#    - Genera una contraseña específica de app
#    - Reemplaza 'tu-email@icloud.com' con tu email real
#    - Reemplaza 'tu-contraseña-especifica-de-app' con la contraseña generada
#
# 3. VERIFICACIÓN:
#    - Ejecuta: npm run verify-smtp
#    - Prueba el formulario en: http://localhost:3000/es/contact
#
# ========================================
`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  // Verificar si ya existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe.');
    console.log('   Si quieres recrearlo, elimínalo primero y ejecuta este script nuevamente.');
    process.exit(0);
  }

  // Crear el archivo
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  console.log('✅ Archivo .env.local creado exitosamente!');
  console.log('');
  console.log('📋 PRÓXIMOS PASOS:');
  console.log('');
  console.log('1. 🔐 CONFIGURAR RECAPTCHA:');
  console.log('   - Ve a: https://www.google.com/recaptcha/admin');
  console.log('   - Crea un sitio con reCAPTCHA v3');
  console.log('   - Agrega "localhost" como dominio');
  console.log('   - Reemplaza las claves en .env.local');
  console.log('');
  console.log('2. 📧 CONFIGURAR SMTP (iCloud+):');
  console.log('   - Ve a: https://appleid.apple.com');
  console.log('   - Genera una contraseña específica de app');
  console.log('   - Actualiza las variables SMTP_* en .env.local');
  console.log('');
  console.log('3. 🧪 VERIFICAR CONFIGURACIÓN:');
  console.log('   - Ejecuta: npm run verify-smtp');
  console.log('   - Prueba: http://localhost:3000/es/contact');
  console.log('');
  console.log('📄 Documentación completa:');
  console.log('   - RECAPTCHA_SETUP.md');
  console.log('   - SMTP_SETUP.md');
  console.log('');

} catch (error) {
  console.error('❌ Error al crear .env.local:', error.message);
  process.exit(1);
} 