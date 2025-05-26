# Configuración SMTP con iCloud+ para NextJS 15

Esta guía te ayudará a configurar el servidor SMTP usando iCloud+ para el formulario de contacto de tu sitio web.

## 📋 Requisitos previos

1. Una cuenta de iCloud activa
2. Autenticación de dos factores habilitada en tu cuenta de Apple
3. Una contraseña específica de aplicación generada

## 🔐 Paso 1: Generar contraseña específica de aplicación

### En iCloud.com:
1. Ve a [appleid.apple.com](https://appleid.apple.com)
2. Inicia sesión con tu Apple ID
3. Ve a la sección **"Iniciar sesión y seguridad"**
4. Busca **"Contraseñas específicas de app"**
5. Haz clic en **"Generar una contraseña específica de app"**
6. Escribe un nombre descriptivo (ej: "Mi Sitio Web - Contacto")
7. **¡IMPORTANTE!** Copia la contraseña generada inmediatamente (no podrás verla después)

## 🔧 Paso 2: Configurar variables de entorno

Crea un archivo `.env.local` (o `.env`) en la raíz de tu proyecto (josuehernandez/) con la siguiente configuración:

```bash
# Configuración SMTP de iCloud+
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=no-reply@josuehernandez.dev
SMTP_PASSWORD=tu-contraseña-especifica-de-app
SMTP_FROM_NAME=Josue Hernandez
SMTP_FROM_EMAIL=no-reply@josuehernandez.dev

# Email de destino para recibir los mensajes del formulario
CONTACT_EMAIL=contact@josuehernandez.dev
```

### ⚠️ Importante:
- Reemplaza `no-reply@josuehernandez.dev` con tu email real (puede ser @icloud.com o tu dominio personalizado)
- Reemplaza `tu-contraseña-especifica-de-app` con la contraseña que generaste en el paso 1
- NO uses tu contraseña normal de iCloud, debe ser la contraseña específica de app
- NextJS carga automáticamente variables de `.env.local`, `.env.development`, `.env.production` y `.env`
- Los archivos `.env.local` y `.env` deben estar en tu `.gitignore` para mantener seguras tus credenciales

### 🌐 Usando dominios personalizados con iCloud+:
Si tienes un dominio personalizado configurado en tu cuenta de iCloud (como `@josuehernandez.dev`):
- **SMTP_USER**: Usa tu email con dominio personalizado (ej: `no-reply@josuehernandez.dev`)
- **SMTP_FROM_EMAIL**: Usa el mismo email personalizado para el remitente
- **CONTACT_EMAIL**: Puede ser cualquier email válido donde quieras recibir los mensajes
- La autenticación sigue siendo la misma (contraseña específica de app de tu cuenta de Apple)
- El servidor SMTP sigue siendo `smtp.mail.me.com` (no cambia)

### 📧 Ejemplo con múltiples dominios personalizados:
Si tienes varios emails configurados (ej: `no-reply@`, `contact@`, `ventas@josuehernandez.dev`):
- **SMTP_USER** y **SMTP_FROM_EMAIL**: `no-reply@josuehernandez.dev` (para envío automático)
- **CONTACT_EMAIL**: `contact@josuehernandez.dev` (donde recibes y respondes)
- **Flujo**: Los visitantes envían → `no-reply` reenvía → tú recibes en `contact` → respondes desde `contact`
- **Ventaja**: Separas emails automáticos de tu bandeja principal de trabajo

## 📧 Configuración SMTP de iCloud+

Los parámetros de configuración son:

| Parámetro | Valor |
|-----------|-------|
| **Servidor SMTP** | smtp.mail.me.com |
| **Puerto** | 587 (con TLS) |
| **Seguridad** | TLS/STARTTLS |
| **Autenticación** | Requerida |
| **Usuario** | Tu email completo (@icloud.com o dominio personalizado) |
| **Contraseña** | Contraseña específica de app |

## 🚀 Paso 3: Probar la configuración

1. Primero, verifica que tu configuración SMTP esté correcta:
   ```bash
   npm run verify-smtp
   ```

2. Asegúrate de que tu servidor de desarrollo esté ejecutándose:
   ```bash
   npm run dev
   ```

3. Ve a la página de contacto: `http://localhost:3000/contact`

4. Llena el formulario y envía un mensaje de prueba

5. Verifica que recibas el email en tu bandeja de entrada de iCloud

## 🐛 Solución de problemas

### Error: "Invalid login"
- ✅ Verifica que estés usando la contraseña específica de app, no tu contraseña normal
- ✅ Confirma que el email en `SMTP_USER` sea correcto
- ✅ Asegúrate de que la autenticación de dos factores esté habilitada

### Error: "Connection timeout"
- ✅ Verifica tu conexión a internet
- ✅ Confirma que el puerto 587 no esté bloqueado por tu firewall
- ✅ Intenta cambiar a puerto 465 con SSL si es necesario

### El email no llega
- ✅ Revisa tu carpeta de spam
- ✅ Verifica que `CONTACT_EMAIL` esté configurado correctamente
- ✅ Confirma que tu cuenta de iCloud esté activa

### Error: "Variables de entorno faltantes"
- ✅ Asegúrate de que tengas un archivo `.env.local` o `.env` en la raíz del proyecto
- ✅ Verifica que todas las variables requeridas estén definidas
- ✅ Reinicia tu servidor de desarrollo después de crear/modificar el archivo
- ✅ NextJS carga automáticamente las variables de entorno en el orden correcto

## 📁 Estructura de archivos creada

```
josuehernandez/
├── .env.local                     # Variables de entorno (¡no incluir en git!)
├── utils/
│   └── mailer.ts                  # Utilidad para envío de emails
├── app/
│   └── api/
│       └── contact/
│           └── route.ts           # API endpoint para contacto
├── components/
│   └── ContactForm.tsx            # Componente del formulario
├── scripts/
│   └── verify-smtp.js             # Script de verificación SMTP
└── app/[lng]/contact/
    └── page.tsx                   # Página de contacto
```

> **Nota**: NextJS carga automáticamente variables de `.env.local`, `.env.development`, `.env.production` y `.env` sin configuración adicional.

## 🔧 Tecnologías utilizadas

- **NextJS 15**: Framework React con carga automática de variables de entorno
- **Nodemailer**: Librería para envío de emails
- **TypeScript**: Tipado estático
- **TailwindCSS**: Estilos modernos y responsive
- **Node.js nativo**: Sin dependencias adicionales para variables de entorno

## 🔒 Seguridad

- **Nunca** compartas tu contraseña específica de app
- Agrega `.env.local` a tu `.gitignore`
- Considera usar servicios como Vercel Environment Variables para producción
- Regenera la contraseña específica de app si crees que se ha comprometido

## 🌐 Despliegue en producción

Para desplegar en Vercel, Netlify u otros servicios:

1. Ve a la configuración de tu proyecto en la plataforma
2. Agrega las variables de entorno en el panel de administración
3. No incluyas el archivo `.env.local` en tu repositorio
4. Verifica que las variables estén correctamente configuradas antes del despliegue

## 💡 Límites de iCloud Mail

- **Límite diario**: 1,000 emails por día
- **Destinatarios por mensaje**: 500 máximo
- Para volúmenes mayores, considera servicios como SendGrid, Resend o Nodemailer con otros proveedores

## 🏃‍♂️ Comandos útiles

- **Verificar configuración SMTP**: `npm run verify-smtp`
- **Desarrollo**: `npm run dev`
- **Construir para producción**: `npm run build`
- **Linting**: `npm run lint`

## 📞 Soporte

Si tienes problemas con la configuración:
1. Ejecuta `npm run verify-smtp` para diagnóstico automático
2. Verifica que hayas seguido todos los pasos
3. Revisa los logs del servidor para errores específicos
4. Confirma que tu cuenta de iCloud esté en buen estado

¡Tu formulario de contacto con iCloud+ está listo! 🎉 