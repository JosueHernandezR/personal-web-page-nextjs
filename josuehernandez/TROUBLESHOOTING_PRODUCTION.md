# Solución Error 500 en Producción

## 🚨 Problema Actual
```
POST https://josuehernandez.dev/api/contact 500 (Internal Server Error)
```

## 🔍 Diagnóstico

### Paso 1: Verificar Variables de Entorno
Después del despliegue, visita: `https://josuehernandez.dev/api/contact/debug`

Esto te mostrará qué variables están configuradas y cuáles faltan.

### Paso 2: Revisar Logs de Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions"
4. Busca los logs de `/api/contact`
5. Revisa los errores específicos

## ⚙️ Configuración en Vercel

### Variables de Entorno Requeridas

Ve a **Settings > Environment Variables** en tu proyecto de Vercel y agrega:

```env
# SMTP Configuration (OBLIGATORIAS)
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USER=tu-email@icloud.com
SMTP_PASSWORD=tu-contraseña-app-especifica
CONTACT_EMAIL=tu-email@icloud.com
SMTP_FROM_NAME=Formulario de Contacto
SMTP_FROM_EMAIL=tu-email@icloud.com

# reCAPTCHA (OBLIGATORIAS)
RECAPTCHA_SECRET_KEY=tu-clave-secreta
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu-clave-publica
```

### ⚠️ Puntos Importantes:

1. **SMTP_PASSWORD**: Debe ser una contraseña específica de app de iCloud+, NO tu contraseña normal
2. **Todas las variables**: Deben estar marcadas para Production, Preview y Development
3. **NEXT_PUBLIC_**: Las variables que empiezan con esto son públicas

## 📋 Checklist de Configuración

### iCloud+ App Password
- [ ] Ir a [appleid.apple.com](https://appleid.apple.com)
- [ ] Sign-In and Security > App-Specific Passwords
- [ ] Generar nueva contraseña para "Portfolio Website"
- [ ] Copiar la contraseña generada (formato: xxxx-xxxx-xxxx-xxxx)
- [ ] Usar esta contraseña en `SMTP_PASSWORD`

### reCAPTCHA v3
- [ ] Ir a [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin)
- [ ] Crear nuevo sitio con reCAPTCHA v3
- [ ] Agregar dominio: `josuehernandez.dev`
- [ ] Copiar Site Key → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- [ ] Copiar Secret Key → `RECAPTCHA_SECRET_KEY`

### Vercel Environment Variables
- [ ] Todas las variables SMTP configuradas
- [ ] Todas las variables reCAPTCHA configuradas
- [ ] Variables disponibles para Production
- [ ] Redesplegar después de configurar

## 🔧 Pasos de Resolución

### 1. Configurar Variables de Entorno
```bash
# En Vercel Dashboard > Settings > Environment Variables
# Agregar cada variable una por una
```

### 2. Redesplegar
Después de configurar las variables, haz un redeploy:
- Ve a Deployments
- Busca el último deployment
- Click en "..." > "Redeploy"

### 3. Verificar
- Visita `/api/contact/debug` para verificar configuración
- Prueba el formulario de contacto
- Revisa los logs en Vercel Functions

## 🐛 Errores Comunes

### "Variables de entorno faltantes: SMTP_USER, SMTP_PASSWORD"
- **Causa**: Variables no configuradas en Vercel
- **Solución**: Configurar en Environment Variables

### "Authentication failed"
- **Causa**: Contraseña incorrecta o no es app-specific
- **Solución**: Generar nueva app-specific password en iCloud+

### "reCAPTCHA verification failed"
- **Causa**: Claves incorrectas o dominio no autorizado
- **Solución**: Verificar claves y agregar dominio en reCAPTCHA console

## 📞 Verificación Final

Una vez configurado todo:

1. **Endpoint de debug**: `https://josuehernandez.dev/api/contact/debug`
   - Debe mostrar todas las variables como "Configurado"

2. **Formulario de contacto**: Probar envío real
   - Debe mostrar notificación de éxito
   - Debe llegar email a tu bandeja

3. **Logs de Vercel**: No debe haber errores 500

## 🗑️ Limpieza

Después de resolver el problema, eliminar el endpoint de debug:
```bash
rm app/api/contact/debug/route.ts
```

## 📧 Contacto de Emergencia

Si el problema persiste, los usuarios pueden contactarte directamente:
- Email directo visible en el sitio
- Redes sociales
- Formulario alternativo (si tienes) 