# Guía de Pruebas en Producción

## 🎯 **Situación Actual**
- ✅ **Local funciona**: Email se envía correctamente en desarrollo
- ❌ **Producción falla**: Error 500 en `/api/contact`
- 🔍 **Diagnóstico**: Necesitamos identificar la diferencia

## 📋 **Endpoints de Prueba Disponibles**

### 1. **Variables de Entorno**
```
GET https://josuehernandez.dev/api/contact/debug
```
**Resultado esperado**: Todas las variables como "Configurado"

### 2. **Test Simple (Sin validaciones)**
```
POST https://josuehernandez.dev/api/contact/test
```
**Resultado esperado**: Email enviado exitosamente

### 3. **Test Sin reCAPTCHA (Completo)**
```
POST https://josuehernandez.dev/api/contact/no-captcha
```
**Datos de prueba**:
```json
{
  "name": "Test Usuario",
  "email": "test@example.com",
  "subject": "Prueba desde producción",
  "message": "Este es un mensaje de prueba."
}
```

### 4. **Formulario Original (Con reCAPTCHA)**
```
POST https://josuehernandez.dev/api/contact
```

## 🧪 **Pasos de Prueba**

### **Paso 1: Verificar Variables**
1. Visita: `https://josuehernandez.dev/api/contact/debug`
2. Confirma que todas las variables estén "Configurado"

### **Paso 2: Test Simple**
```bash
curl -X POST https://josuehernandez.dev/api/contact/test
```

### **Paso 3: Test Sin reCAPTCHA**
```bash
curl -X POST https://josuehernandez.dev/api/contact/no-captcha \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Usuario",
    "email": "test@example.com",
    "subject": "Prueba desde producción",
    "message": "Este es un mensaje de prueba."
  }'
```

### **Paso 4: Revisar Logs**
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a "Functions"
4. Busca los logs de los endpoints probados
5. Identifica dónde exactamente falla

## 🔍 **Interpretación de Resultados**

### **Si Paso 1 falla**
- **Problema**: Variables de entorno no configuradas
- **Solución**: Revisar configuración en Vercel

### **Si Paso 2 funciona**
- **Problema**: No está en la configuración SMTP
- **Continúa**: Paso 3

### **Si Paso 3 funciona**
- **Problema**: reCAPTCHA está causando el error
- **Solución**: Revisar configuración de reCAPTCHA

### **Si Paso 3 falla**
- **Problema**: Diferencia entre local y producción
- **Revisar**: Logs específicos del error

## 🛠️ **Posibles Soluciones**

### **Problema: reCAPTCHA**
1. Verificar que el dominio `josuehernandez.dev` esté agregado en reCAPTCHA console
2. Verificar que las claves sean correctas
3. Verificar que el score mínimo no sea muy alto

### **Problema: SMTP**
1. Regenerar contraseña de app en iCloud+
2. Verificar que el email sea correcto (@icloud.com, @me.com, @mac.com)
3. Considerar cambiar a Gmail SMTP

### **Problema: Formato de Email**
1. Verificar que `SMTP_FROM_EMAIL` sea un email válido
2. Verificar que `CONTACT_EMAIL` sea un email válido

## 📞 **Resultados Esperados**

### **Éxito en Paso 2 y 3**
```json
{
  "success": true,
  "message": "Email enviado exitosamente",
  "messageId": "<mensaje-id>",
  "note": "..."
}
```

### **Error Típico**
```json
{
  "error": "EMAIL_SERVICE_ERROR",
  "message": "...",
  "details": "..."
}
```

## 🔄 **Próximos Pasos**

1. **Despliega** los cambios
2. **Ejecuta** las pruebas en orden
3. **Revisa** los logs de Vercel
4. **Identifica** el problema específico
5. **Aplica** la solución correspondiente

## 🧹 **Limpieza**

Una vez resuelto el problema:
1. Eliminar endpoints de debug
2. Restaurar el endpoint original
3. Verificar que el formulario funcione completamente

## 📧 **Contacto de Emergencia**

Si nada funciona, considera:
1. Cambiar a Gmail SMTP temporalmente
2. Usar un servicio como SendGrid
3. Implementar un webhook a un servicio externo 