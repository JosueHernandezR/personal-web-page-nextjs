# Configuración de Producción

## Variables de Entorno Requeridas

Para que el formulario de contacto funcione correctamente en producción, necesitas configurar las siguientes variables de entorno:

### Variables SMTP (Obligatorias)
```env
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=tu-email@icloud.com
SMTP_PASSWORD=tu-contraseña-de-app-especifica
CONTACT_EMAIL=tu-email@icloud.com
SMTP_FROM_NAME=Formulario de Contacto
SMTP_FROM_EMAIL=tu-email@icloud.com
```

### Variables reCAPTCHA (Obligatorias)
```env
RECAPTCHA_SECRET_KEY=tu-clave-secreta-recaptcha
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu-clave-publica-recaptcha
```

## Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings > Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Asegúrate de que estén disponibles para Production, Preview y Development

## Configuración de iCloud+ Email

1. Ve a [appleid.apple.com](https://appleid.apple.com)
2. Inicia sesión con tu Apple ID
3. Ve a "Sign-In and Security" > "App-Specific Passwords"
4. Genera una nueva contraseña específica para la aplicación
5. Usa esta contraseña en `SMTP_PASSWORD`

## Configuración de reCAPTCHA

1. Ve a [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin)
2. Crea un nuevo sitio con reCAPTCHA v3
3. Agrega tu dominio (ej: josuehernandez.dev)
4. Copia la Site Key y Secret Key
5. Configura las variables de entorno correspondientes

## Verificación de Configuración

El sistema incluye logging detallado para diagnosticar problemas:

- Revisa los logs de Vercel Functions para ver si las variables están configuradas
- El error 500 generalmente indica variables de entorno faltantes
- Los errores de favicon se resuelven automáticamente con la configuración actual

## Errores Comunes

### Error 500 en /api/contact
- **Causa**: Variables SMTP no configuradas
- **Solución**: Verificar que `SMTP_USER` y `SMTP_PASSWORD` estén configuradas

### Error de reCAPTCHA
- **Causa**: Claves de reCAPTCHA incorrectas o dominio no autorizado
- **Solución**: Verificar las claves y agregar el dominio en la consola de reCAPTCHA

### Errores de Favicon 404
- **Causa**: Referencias a iconos inexistentes
- **Solución**: Ya corregido en el layout, usa solo favicon.ico

## Monitoreo

- Los logs de la API incluyen información detallada sobre errores
- El rate limiting está configurado para 5 emails por día por IP
- Los errores se categorizan para mejor debugging

## Contacto de Emergencia

Si el formulario no funciona, los usuarios pueden contactarte directamente por email usando la información que proporciones en el sitio. 