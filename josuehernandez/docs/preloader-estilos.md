# Estilos de Preloader — Referencia

Guía de los estilos/patrones de preloader que se pueden implementar con **GSAP** en este proyecto. El actual es el **#1 (Contador + cortina)**.

---

## 1. Contador + cortina _(actual)_

- **Cómo se ve:** un contador `00 → 100` grande en el centro; al terminar, el overlay sube como cortina revelando la página.
- **Sensación:** limpia, editorial, "Awwwards clásico".
- **Tech:** `gsap.to(counterObj)` + `gsap.to(overlay, { yPercent: -100 })`.

## 2. Contador + barra de progreso

- **Cómo se ve:** el número desliza (rolling counter) mientras una **barra fina** se llena sincronizada debajo; al completar, se descubre con fade.
- **Sensación:** SaaS / producto, precisa.
- **Tech:** contador GSAP + `scaleX` de la barra (transform-origin left).

## 3. Contador masivo + wipe circular

- **Cómo se ve:** el número ocupa toda la pantalla y, al completar, se desvanece con un **clip-path circular** tipo "lente".
- **Sensación:** cinematográfica, experimental.
- **Tech:** `clip-path: circle()` animado con ScrollTrigger no — con timeline al completar.

## 4. Revelado de logo (blur + scale)

- **Cómo se ve:** el logo/nombre aparece con **blur(12px) → 0** y escala 0.95 → 1, se queda un momento y el overlay hace fade-out.
- **Sensación:** marca, minimalista, "branded intro".
- **Tech:** `gsap.fromTo(logo, { filter: "blur(12px)", scale: 0.95 }, ...)`.

## 5. Letra por letra (letter-by-letter)

- **Cómo se ve:** el nombre se revela **carácter a carácter** (fade + blur + slide), luego sube.
- **Sensación:** tipográfica, elegante (Johannes Leonardo style).
- **Tech:** `SplitText` (chars) + stagger.

## 6. Saludo multilingüe (Greeting loader)

- **Cómo se ve:** secuencia de saludos ("Hello", "Hola", "Bonjour"...) que se intercambian y el último se queda.
- **Sensación:** internacional, agencias.
- **Tech:** timeline con swap de palabras + fade.

## 7. Órbita de texto (Orbit / Maxmilkin)

- **Cómo se ve:** **anillos de texto concéntricos** que "respiran" (rotan, escalan, se desvanecen hacia afuera).
- **Sensación:** high-end, agency, muy "motion".
- **Tech:** varios textos rotando + `gsap.to` con rotaciones/opacidades escalonadas. _(Existe en motionprompts: "Maxmilkin Orbit Text Preloader".)_

## 8. Texto scramble (descifrado)

- **Cómo se ve:** el texto se "descifra" de caracteres aleatorios hasta la palabra final.
- **Sensación:** cyberpunk, tech, desarrollo.
- **Tech:** `TextPlugin`/`ScrambleTextPlugin` de GSAP (o una utilidad custom con `gsap.utils`).

## 9. Cortina (curtain) — variantes

- **Vertical (actual):** el overlay sube.
- **Horizontal:** los dos bordes (superior/inferior) se separan.
- **Split panels:** dos mitades del overlay se abren como puertas.
- **Persiana (shutter):** 4-8 franjas suben escalonadas.
- **Sensación:** según variante — limpia, teatral, dinámica.
- **Tech:** `gsap.to(panel, { yPercent/xPercent, stagger })`.

## 10. Wipe con clip-path

- **Cómo se ve:** el overlay se retira con un **clip-path** (círculo, cuadrado, media luna) desde un punto (logo, botón o centro).
- **Sensación:** moderna, suave.
- **Tech:** `clip-path: inset()` o `circle()` animado.

## 11. Barras de carga (bar loader)

- **Cómo se ve:** 3-5 barras horizontales que se llenan a distintas velocidades (tipo "carga de app").
- **Sensación:** app-like, casual.
- **Tech:** `scaleX` con staggers + `repeat: -1` o una sola pasada.

## 12. Desintegración de píxeles

- **Cómo se ve:** el overlay se desintegra en bloques de píxeles retro.
- **Sensación:** gaming, streetwear, bold.
- **Tech:** grid de divs con escala/opacidad escalonada (rAF o GSAP).

## 13. Llenado con agua (water fill)

- **Cómo se ve:** el logo se "llena con agua" de abajo hacia arriba.
- **Sensación:** premium, marcas.
- **Tech:** máscara/`clip-path: inset()` + una ola (`feTurbulence` o SVG path animado).

## 14. Blur reveal de página

- **Cómo se ve:** la página comienza borrosa y se **enfoca** mientras el overlay se desvanece.
- **Sensación:** minimal, suave.
- **Tech:** `filter: blur()` en el contenido + fade del overlay.

## 15. Zoom out (scale reveal)

- **Cómo se ve:** el overlay hace **zoom out** (scale 1.1 → 1) como si la cámara retrocediera.
- **Sensación:** cinematográfica.
- **Tech:** `gsap.to(overlay, { scale: 1.1, transformOrigin: "center" })` (overlay con la foto de fondo escalada).

---

## 📚 Dónde ver ejemplos en vivo

| Recurso                                                                                                              | Qué hay                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [motionprompts.dev](https://motionprompts.dev)                                                                       | Preloaders GSAP con demo: **Counter Curtain Hero Reveal**, **Orbit Text Preloader (Maxmilkin)**, **Sci-Fi Preloader**, **Magnetic Spotlight Marquee**, etc. (cada uno con prompt listo para agentes) |
| [details.so/inspo](https://www.details.so/inspo)                                                                     | Filtro de inspiración **preloaders** con sitios reales                                                                                                                                               |
| [oma-kase.com/blog/best-framer-preloader-components](https://www.oma-kase.com/blog/best-framer-preloader-components) | 17 preloaders (conceptos del 1 al 15)                                                                                                                                                                |
| [madewithgsap.com](https://madewithgsap.com)                                                                         | Técnicas GSAP puras                                                                                                                                                                                  |

---

## ✅ Recomendados para este proyecto

Dado el estilo del sitio (fotografía + desarrollo + serio pero moderno):

1. **#7 Órbita de texto** — el más distintivo y "motion".
2. **#4 Revelado de logo (blur + scale)** — sobrio y con marca.
3. **#5 Letra por letra** — tipográfico y elegante.
4. Mantener **#1 Contador + cortina** si te gusta el actual.

## ✅ Implementado (final): Órbita premium

El usuario se quedó con la variante **#7 Órbita** y se le agregaron detalles estéticos para evitar el plano:

- **Contador 00→100%** en el centro (pantalla completa para la marca debajo: `tracking-[0.45em]`).
- **3 anillos SVG con `textPath`** (radios 86/68/50) con **opacidades distintas** (0.5/0.34/0.2), **rotación alternada** (+360° / −360° / +360°) y stagger de 120ms.
- **Resplandor radial** de fondo (2 círculos `bg-foreground/5` con blur) para dar profundidad.
- **Anillo ancla estático** (borde fino `border-foreground/10`) para estructura.
- **Línea de progreso fina** inferior (`scaleX` 0→1) sincronizada con el contador.
- **Respiración** sutil del centro (scale yoyo).
- **Cortina de salida** (0.9s, `power3.inOut`) tras ver el 100%.

Todo tema-safe (`text-foreground`/`bg-background`), flag de sesión, StrictMode-safe, `prefers-reduced-motion` y timeout de seguridad (6.5s).
