# Parallax con giroscopio en iOS — Investigación y decisiones

> Contexto para agentes que trabajen en el parallax móvil de `ParallaxCard`.
> Fecha: 2026-09. Dispositivo de prueba: iPhone 16 Pro, Safari y Opera (iOS).

## Resumen

El efecto parallax de `components/ui/ParallaxCard.tsx` debe moverse en móvil
"como el mouse en escritorio". La vía llamativa es el **giroscopio**
(`DeviceOrientationEvent`), pero en iOS tiene dos obstáculos grandes:

1. **Solo funciona en contexto seguro (HTTPS o localhost)** — en `http://IP:3000`
   la API no existe y el permiso nunca se concede.
2. **Singularidad de Euler**: al cruzar la posición horizontal (pantalla al cielo,
   `beta=0°`, o al suelo, `beta=180°`), el sensor salta `gamma` 180° y el mapeo
   naive invierte izquierda/derecha.

Además hay un fallback táctil (Pointer Events) que replica el mouse en cualquier
dispositivo sin permisos.

---

## 1. La API `DeviceOrientationEvent` en iOS

- **Contexto seguro obligatorio**: MDN y el spec W3C marcan la API como
  _secure-context only_. En iOS Safari, acceder por `http://192.168.1.79:3000`
  (HTTP en LAN) hace que el giroscopio **nunca** funcione — ni siquiera aparece
  el diálogo de permiso. Fuentes:
  - https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent
  - https://www.w3.org/TR/orientation-event/
  - Stack Overflow: _"Your localhost probably does not run on https... device
    orientation gets blocked. You are only able to use them in a secure context."_
- **Permiso por gesto (iOS 13+)**: `DeviceOrientationEvent.requestPermission()`
  debe llamarse **dentro de un gesto real del usuario** (`click`/`touchend` son
  los fiables; `pointerdown` no siempre cuenta). El resultado se cachea por sitio:
  si el usuario toca "No permitir", hay que resetear en
  _Ajustes → Safari → Avanzado → Datos de sitios web_ (o cerrar Safari).
- **No existe el constructor** `new DeviceOrientationEvent()` en Safari, pero el
  global y los eventos sí existen (en contexto seguro).
- **Eventos**: `window.addEventListener("deviceorientation", handler)` con
  `alpha` (yaw, 0-360), `beta` (pitch, -180..180), `gamma` (roll, -90..90).

### Flujo de permiso robusto (implementado)

```ts
// iOS: el permiso debe pedirse en un gesto real del usuario.
document.addEventListener("click", initiate, { capture: true, passive: true });
window.addEventListener("touchend", initiate, { capture: true, passive: true });
window.addEventListener("pointerdown", initiate, {
  capture: true,
  passive: true,
});
```

Con guard `gestureBusy` para evitar dobles diálogos y `orientationListening`
para no añadir el listener dos veces. Ver `handleOrientation` y el `useEffect`
de orientación en `ParallaxCard.tsx`.

---

## 2. La singularidad de Euler (causa raíz del "flip")

Los ángulos `(alpha, beta, gamma)` son ángulos de Euler. Cuando `beta` cruza
**0°** (pantalla al cielo) o **180°** (pantalla al suelo), la descomposición
es ambigua y el sensor **salta `gamma` 180°** (gimbal lock). Consecuencia:

- Mapeo naive `x = gamma - baseGamma` → la izquierda/derecha se **invierte**
  de golpe al inclinar hacia el cielo/suelo.
- Verificado empíricamente por el usuario: _"si estaba orientado a la izquierda
  y se inclina hacia abajo viendo al suelo, el texto se mueve a la derecha"_.

### Por qué fallan los enfoques simples

| Enfoque                                            | Problema                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `gamma`/`beta` crudos (absoluto o delta calibrado) | Salta 180° en la singularidad → flip                                              |
| Cuaternión absoluto                                | Correcto pero complejo; el delta local sigue dependiendo del frame                |
| Vector de gravedad absoluto (calibrado `g0→g`)     | Suave en rango normal, pero si el sensor salta `gamma`, `g → -g` y también flipea |

---

## 3. Solución implementada: gravedad + integración incremental + compensación de frame

### 3.1 Vector de gravedad en el frame del dispositivo

Derivado de la matriz de rotación del W3C aplicada al vector "abajo" del mundo
`(0,0,-1)`:

```ts
// a=alpha, b=beta, g=gamma (radianes)
gx = cos(a)·sin(g) − sin(a)·cos(g)·sin(b)
gy = −sin(a)·sin(g) − cos(a)·cos(g)·sin(b)
gz = −cos(g)·cos(b)
```

Es un **vector suave** (a diferencia de los ángulos de Euler) y captura el tilt
real del teléfono. Verificado: erguido → `(0,−1,0)`.

### 3.2 Mapeo absoluto calibrado (autocorregible)

Se guarda la gravedad de calibración `g0` (primera lectura) y en cada evento se
calcula la **rotación (eje-ángulo) de `g0` a `g` actual** en el frame del
dispositivo:

```ts
const dot  = g0·g;
const cross = g0 × g;              // eje de rotación (frame dispositivo)
const deg = acos(clamp(dot))·180/π;      // grados de inclinación desde la calibración
x = clamp(deg · (cross.z/|cross|) · sign / SENS);  // izquierda/derecha (eje Z)
y = clamp(deg · (cross.x/|cross|) · sign / SENS);  // arriba/abajo (eje X)
```

**Por qué es mejor que la integración incremental**: al ser absoluto (siempre
calculado desde `g0` y el `g` actual), **se autocorrige** — tras un movimiento
brusco o una interrupción, el contenido refleja inmediatamente la inclinación
real en lugar de quedarse en un valor acumulado obsoleto.

### 3.3 Compensación del frame (`frameSignRef`) + recalibración por interrupción

Al cruzar la singularidad el sensor invierte su representación (`g → −g`), lo
que invertiría el signo del mapeo. Se detecta por el salto entre frames
consecutivos y se compensa:

```ts
if (prev·g < −0.5) frameSignRef.current *= −1;   // cruce de singularidad (g -> -g)
x = deg · az · frameSignRef.current;
y = deg · ax · frameSignRef.current;
```

**Bloqueo de pantalla / suspensión**: si pasa >1 s sin eventos (la pantalla se
bloqueó o el navegador se suspendió), se **recalibra** (`g0 = g`, `frameSign = 1`)
para que el contenido vuelva a responder en lugar de quedarse estático:

```ts
if (now - lastEventTimeRef.current > 1000) {
  calibrationGravityRef.current = g;
  frameSignRef.current = 1;
  return;
}
```

### 3.4 Suavizado exponencial

Para fluidez (evita tirones del sensor):

```ts
setCoords((prev) => ({
  x: prev.x + (targetX − prev.x) · 0.45,
  y: prev.y + (targetY − prev.y) · 0.45,
}));
```

### 3.5 Sensibilidad

`SENS = 35` → 35° de inclinación = recorrido completo (`±1`). El contenido
satura antes de llegar a la singularidad, que queda en zona "extrema".

---

## 4. Fallback táctil (Pointer Events)

Independiente del giroscopio, garantiza el comportamiento "como el mouse" en
cualquier dispositivo sin permisos ni HTTPS:

```ts
window.addEventListener("pointermove", updatePointerPosition, {
  passive: true,
});
// x = (clientX / innerWidth)·2 − 1,  y = (clientY / innerHeight)·2 − 1
```

- Desktop: `pointermove` por hover del mouse.
- Móvil: `pointermove` mientras el dedo arrastra (el scroll cancela el pointer,
  así que no pelea con el scroll).
- Ambos inputs conviven: el último evento gana.

---

## 5. HTTPS local para probar en iOS (`dev:https`)

El giroscopio exige HTTPS. `next dev --experimental-https` usa `mkcert`:

- Script: `scripts/dev-https.mjs` → detecta la IP de la LAN y ejecuta
  `next dev --turbopack --experimental-https -H <IP>`.
- **El `-H <IP>` es imprescindible**: sin él, el certificado solo cubre
  `localhost` y el iPhone lo rechaza (SAN sin la IP).
- Certificados: `./certificates/` (server) y CA en
  `~/Library/Application Support/mkcert/rootCA.pem` (estable entre IPs).
- iOS (una vez): instalar el CA como perfil
  (_Ajustes → General → VPN y gestión de dispositivos_) y activar **confianza
  total** (_Ajustes → General → Información → Ajustes de confianza de
  certificados_).
- **Trampa de Safari**: el header `Strict-Transport-Security` con `preload`
  prohíbe saltarse el error de certificado. Si el cert no está confiado, Safari
  muestra "Se interrumpió la conexión de red" (Opera sí deja continuar). Si
  ocurre, limpiar _Ajustes → Safari → Avanzado → Datos de sitios web_.
- Solo puede correr **un** servidor dev a la vez (Next.js lo bloquea).

---

## 6. Archivos clave

| Archivo                                     | Rol                                                                                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/ParallaxCard.tsx`            | Componente parallax: pointer + giroscopio                                                                                                      |
| `components/cards/thumbnailMotionStores.ts` | Store compartido para `ProjectGlowImageFrame` (usa `preferOrientationMotion`, mapeo absoluto — **pendiente de migrar** al enfoque de gravedad) |
| `scripts/dev-https.mjs`                     | Dev HTTPS con detección de IP                                                                                                                  |
| `next.config.ts`                            | `allowedDevOrigins`, `qualities`, `remotePatterns` (Unsplash)                                                                                  |

## 7. Pendientes / a validar en dispositivo

- [ ] Confirmar que el mapeo absoluto + compensación de frame elimina el
      "trabado" al cruzar la singularidad repetidamente y tras bloquear/
      desbloquear la pantalla.
- [ ] Confirmar dirección de ejes (si algún eje queda invertido, cambiar signo
      en `targetX` / `targetY`).
- [ ] Migrar `thumbnailMotionStores.ts` al mismo enfoque (gravedad + mapeo
      absoluto) para que las tarjetas `ProjectGlowImageFrame` no flipeen.
- [ ] Ajustar `SENS` (35) y el factor de suavizado (0.45) según la sensación.
