# 🔧 Configuración de Variables de Entorno

## 📋 Resumen

Este proyecto requiere varias variables de entorno para funcionar correctamente. Esta guía te ayudará a configurarlas paso a paso.

## 🚀 Configuración Rápida

### 1. Generar archivo .env.local

```bash
npm run setup-env
```

Este comando creará automáticamente el archivo `.env.local` con todas las variables necesarias y valores de ejemplo.

### 2. Configurar las claves reales

Edita el archivo `.env.local` generado y reemplaza los valores de ejemplo con tus claves reales.

## 📝 Variables Requeridas

### 🔐 Google reCAPTCHA v3

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_clave_publica_aqui
RECAPTCHA_SECRET_KEY=tu_clave_secreta_aqui
```

**Cómo obtenerlas:**
1. Ve a [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Crea un nuevo sitio con reCAPTCHA v3
3. Agrega estos dominios:
   - `localhost` (para desarrollo)
   - Tu dominio de producción
4. Copia las claves generadas

### 📧 Configuración SMTP (iCloud+)

```env
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=tu-email@icloud.com
SMTP_PASSWORD=tu-contraseña-especifica-de-app
SMTP_FROM_NAME=Tu Nombre o Empresa
SMTP_FROM_EMAIL=tu-email@icloud.com
CONTACT_EMAIL=tu-email@icloud.com
```

**Cómo configurar:**
1. Ve a [Apple ID](https://appleid.apple.com)
2. Inicia sesión con tu cuenta de iCloud
3. Ve a "Iniciar sesión y seguridad"
4. Busca "Contraseñas específicas de app"
5. Genera una nueva contraseña para tu sitio web
6. Usa esa contraseña en `SMTP_PASSWORD`

### ⚙️ Configuración de la Aplicación

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
RECAPTCHA_MIN_SCORE=0.5
```

## 🧪 Verificación

### 1. Verificar SMTP

```bash
npm run verify-smtp
```

### 2. Probar el formulario

1. Inicia el servidor: `npm run dev`
2. Ve a: `http://localhost:3000/es/contact`
3. Completa y envía el formulario
4. Verifica que recibas el email

## 📁 Estructura de Archivos

```
josuehernandez/
├── .env.local              # Variables de entorno (NO subir a git)
├── .env.example            # Plantilla de ejemplo (opcional)
├── scripts/
│   └── setup-env.js        # Script para generar .env.local
└── ENV_SETUP.md           # Esta documentación
```

## 🔒 Seguridad

### ⚠️ Importante

- **NUNCA** subas `.env.local` a control de versiones
- El archivo debe estar en `.gitignore`
- Usa contraseñas específicas de app, no tu contraseña principal
- Regenera las claves si crees que se han comprometido

### 🛡️ Claves de Prueba

El script incluye claves de prueba de Google reCAPTCHA que funcionan en `localhost`:

```env
# Claves de PRUEBA (solo para desarrollo local)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

**⚠️ IMPORTANTE:** Estas claves solo funcionan en desarrollo. Para producción necesitas generar tus propias claves.

## 🌐 Despliegue en Producción

### Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega todas las variables de `.env.local`
4. Redeploy tu aplicación

### Netlify

1. Ve a tu proyecto en Netlify
2. Site settings → Environment variables
3. Agrega todas las variables de `.env.local`
4. Redeploy tu aplicación

### Otros Servicios

Consulta la documentación de tu proveedor de hosting para agregar variables de entorno.

## 🐛 Solución de Problemas

### Error: "Variables de entorno faltantes"

```bash
# Verificar que el archivo existe
ls -la .env.local

# Recrear el archivo
rm .env.local
npm run setup-env
```

### Error: "reCAPTCHA failed"

1. Verifica que las claves sean correctas
2. Asegúrate de que `localhost` esté en los dominios permitidos
3. Para producción, agrega tu dominio real

### Error: "SMTP connection failed"

1. Verifica tu email y contraseña específica de app
2. Asegúrate de que la autenticación de dos factores esté habilitada
3. Ejecuta: `npm run verify-smtp`

### El formulario no envía emails

1. Revisa la consola del navegador para errores
2. Verifica los logs del servidor
3. Confirma que `CONTACT_EMAIL` esté configurado
4. Revisa tu carpeta de spam

## 📚 Documentación Relacionada

- [RECAPTCHA_SETUP.md](./RECAPTCHA_SETUP.md) - Configuración detallada de reCAPTCHA
- [SMTP_SETUP.md](./SMTP_SETUP.md) - Configuración detallada de SMTP
- [TRANSLATIONS_SETUP.md](./TRANSLATIONS_SETUP.md) - Sistema de traducciones

## 🎯 Comandos Útiles

```bash
# Configuración inicial
npm run setup-env

# Verificar SMTP
npm run verify-smtp

# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Linting
npm run lint
```

## ✅ Checklist de Configuración

- [ ] Archivo `.env.local` creado
- [ ] Claves de reCAPTCHA configuradas
- [ ] Configuración SMTP completada
- [ ] SMTP verificado con `npm run verify-smtp`
- [ ] Formulario probado en desarrollo
- [ ] Variables configuradas en producción (si aplica)

¡Tu configuración de variables de entorno está lista! 🎉 