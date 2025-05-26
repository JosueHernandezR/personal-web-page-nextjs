# Configuración de Google reCAPTCHA v3

## Pasos para configurar reCAPTCHA v3

### 1. Obtener las claves de reCAPTCHA

1. Ve a la [Consola de administración de Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en el botón "+" para crear un nuevo sitio
4. Completa el formulario:
   - **Etiqueta**: Nombre de tu proyecto (ej: "Mi Sitio Web")
   - **Tipo de reCAPTCHA**: Selecciona "reCAPTCHA v3"
   - **Dominios**: Agrega tus dominios:
     - `localhost` (para desarrollo)
     - `tu-dominio.com` (para producción)
5. Acepta los términos de servicio
6. Haz clic en "Enviar"

### 2. Copiar las claves

Después de crear el sitio, obtendrás dos claves:
- **Clave del sitio**: Esta es pública y se usa en el frontend
- **Clave secreta**: Esta es privada y se usa en el backend

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz de tu proyecto con las siguientes variables:

```env
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_clave_de_sitio_aqui
RECAPTCHA_SECRET_KEY=tu_clave_secreta_aqui
```

### 4. Configuración adicional

#### Umbral de puntuación
El sistema está configurado con un umbral mínimo de 0.5 para el score de reCAPTCHA. Puedes ajustar este valor en el archivo `app/api/contact/route.ts`:

```typescript
const minimumScore = 0.5; // Ajusta este valor según tus necesidades
```

#### Puntuaciones de reCAPTCHA v3:
- **1.0**: Muy probablemente una interacción humana legítima
- **0.9**: Probablemente humano
- **0.7**: Posiblemente humano
- **0.5**: Neutral
- **0.3**: Posiblemente bot
- **0.1**: Muy probablemente bot
- **0.0**: Definitivamente bot

### 5. Verificar la implementación

1. Inicia tu servidor de desarrollo: `npm run dev`
2. Ve a la página de contacto
3. Completa y envía el formulario
4. Verifica en la consola del servidor que aparezcan los logs de reCAPTCHA
5. Revisa que el badge de reCAPTCHA aparezca en la esquina inferior derecha

### 6. Solución de problemas

#### El badge no aparece
- Verifica que `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` esté configurada correctamente
- Asegúrate de que el dominio esté registrado en la consola de reCAPTCHA

#### Error de verificación en el servidor
- Verifica que `RECAPTCHA_SECRET_KEY` esté configurada correctamente
- Asegúrate de que no haya espacios extra en las claves

#### Score muy bajo
- Esto puede suceder en desarrollo o con ciertos navegadores
- Considera ajustar el umbral mínimo para desarrollo
- En producción, los scores suelen ser más altos

### 7. Consideraciones de seguridad

- Nunca expongas la clave secreta en el frontend
- Mantén las claves seguras y no las subas al control de versiones
- Considera implementar rate limiting adicional
- Monitorea los logs para detectar patrones de abuso

### 8. Personalización

El componente `ReCaptchaWrapper` permite personalizar:
- La acción del reCAPTCHA (actualmente "contact_form")
- El manejo de errores
- La limpieza del badge cuando no se necesita

Para más información, consulta la [documentación oficial de reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3). 