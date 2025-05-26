# Pasos de Diagnóstico - Error 500

## 🔍 Situación Actual
- ✅ Variables de entorno configuradas correctamente
- ❌ Error 500 en `/api/contact`
- ❓ Causa desconocida

## 📋 Pasos de Diagnóstico

### 1. Probar Endpoint Simple
Después del despliegue, prueba:
```bash
curl -X POST https://josuehernandez.dev/api/contact/test
```

O visita en el navegador y abre DevTools > Network, luego haz POST a:
`https://josuehernandez.dev/api/contact/test`

### 2. Revisar Logs de Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a "Functions" 
4. Busca los logs de `/api/contact/test`
5. Revisa los logs detallados que agregamos

### 3. Verificar Logs Específicos
Los logs ahora incluyen:
- `=== API CONTACT - INICIO ===`
- `Verificando variables de entorno...`
- `Validando configuración SMTP...`
- `=== MAILER: Iniciando envío de email ===`
- `Configurando transporter con:`
- `Configuración de email preparada, enviando...`

### 4. Posibles Causas

#### A. Error de Autenticación SMTP
**Síntomas**: Error después de "Configurando transporter"
**Causa**: Contraseña de app incorrecta o expirada
**Solución**: 
1. Generar nueva contraseña de app en iCloud+
2. Actualizar `SMTP_PASSWORD` en Vercel
3. Redesplegar

#### B. Error de Red/Firewall
**Síntomas**: Timeout o conexión rechazada
**Causa**: Vercel no puede conectar a smtp.mail.me.com
**Solución**: Cambiar a otro proveedor SMTP (Gmail, SendGrid)

#### C. Error de Configuración de Email
**Síntomas**: Error en "Mail options"
**Causa**: Formato incorrecto en FROM/TO
**Solución**: Verificar formato de emails

#### D. Error de reCAPTCHA
**Síntomas**: Error antes de enviar email
**Causa**: Verificación de reCAPTCHA falla
**Solución**: Verificar dominio en reCAPTCHA console

## 🛠️ Soluciones Rápidas

### Opción 1: Cambiar a Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password-gmail
```

### Opción 2: Usar SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=tu-sendgrid-api-key
```

### Opción 3: Verificar iCloud+ Settings
1. Asegurar que 2FA esté habilitado
2. Generar nueva contraseña de app
3. Verificar que el email sea @icloud.com, @me.com o @mac.com

## 📊 Endpoints de Diagnóstico

1. **Variables**: `GET /api/contact/debug`
2. **Test Simple**: `POST /api/contact/test`
3. **Formulario Real**: `POST /api/contact`

## 🔄 Próximos Pasos

1. **Despliega** los cambios con logging
2. **Prueba** el endpoint `/api/contact/test`
3. **Revisa** los logs en Vercel Functions
4. **Identifica** dónde exactamente falla
5. **Aplica** la solución específica

## 🧹 Limpieza

Después de resolver, eliminar endpoints de debug:
```bash
rm app/api/contact/debug/route.ts
rm app/api/contact/test/route.ts
``` 