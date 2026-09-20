# Estrategia v2 — Animaciones y Micro-interacciones con GSAP

> **Fecha:** 2026-09-17
> **Objetivo:** Evolucionar la página personal hacia un diseño _clean_ con animaciones _smooth_ nivel premio (Awwwards / Framer Awards), usando **GSAP + ScrollTrigger** como motor de animación.
> **Referencias base:** [details.so/inspo](https://www.details.so/inspo) · [The Blueprint Library](https://the-blueprint-library.webflow.io/admin/components) · [motionprompts.dev](https://motionprompts.dev)

---

## ✅ Progreso

- **2026-09-17 — Fase 0 completada:** `gsap` + `@gsap/react` + `lenis` instalados; `lib/gsap.ts` (registro central de plugins + defaults), `hooks/useSmoothScroll.ts` (Lenis + ScrollTrigger sync, respeta `prefers-reduced-motion`), `components/ui/SmoothScroll.tsx` integrado en `app/[lng]/layout.tsx`; MCP de motionprompts agregado a `.zed/mcp.json`.
- **2026-09-17 — Hero collapse/expand (patrón Apple):** el carrusel del hero ahora usa GSAP ScrollTrigger + `scrub` en móvil **y desktop** (antes solo móvil). Inicia como tarjeta redondeada (radio 32px, inset 20px, top 64px) y se expande hasta llenar la pantalla al hacer scroll; se reduce al subir. Se eliminó el `setState` + `transition` CSS que causaba re-renders y jank. Con `prefers-reduced-motion` el carrusel siempre ocupa la pantalla completa.
- **2026-09-17 — Restauración del comportamiento original del carrusel:** verificado contra el commit `dd9e2a2`. Se restauró el cálculo exacto de scroll (`progress = clamp(0,1, (scroll - 64) / (altura_tarjeta * 0.25))`), el lag de `transition: all 0.1s ease-out` (replicado con `scrub: 0.1`), la geometría móvil (altura `max(100vh, 600px)`, inset 20px, radio 32px, extensión de 64px bajo el fold con `overflow-visible`) y el **desktop fullscreen estático** (sin efecto de tarjeta, como el original). El efecto de expansión queda **solo en móvil**, como en la versión original.
- **2026-09-17 — Decisión: carrusel restaurado a la implementación original (setState + RAF + CSS transition).** Tras 3 iteraciones, la migración del scroll-collapse a GSAP ScrollTrigger causó regresiones visuales (bordes inferiores recortados, dots estáticos, salto a progreso 1 al cargar). Se restauró `HeroCarousel.tsx` al commit `dd9e2a2` y se mantuvo el fix de `page.tsx` (`overflow-hidden` → `overflow-x-hidden` en la sección del hero), que hace visibles los 64px inferiores de la tarjeta (bordes redondeados + dots) bajo el fold. **La infraestructura GSAP (Fase 0) se mantiene** y se usará para el resto del sitio (preloader, text reveals, marquee, micro-interacciones), pero el carrusel conserva su mecanismo original que el usuario aprobó.
- **2026-09-17 — Smooth scroll afinado (Lenis):** se descubrió que Lenis siempre usa el modo `lerp` (el `duration`/`easing` que se pasaban eran ignorados porque `lerp` tiene default `0.1`). Se cambió a `lerp: 0.07` (~238ms de catch-up vs ~167ms antes), lo que mantiene la sensación suave y consistente incluso en scroll rápido (antes la página casi seguía al input nativo y se perdía el glide). `wheelMultiplier: 1` mantiene la velocidad 1:1 para no frenar al usuario. Ajuste futuro: `0.1` = más directo, `0.05` = más flotante.
- **2026-09-17 — Micro-interacciones del menú móvil (Navbar):** el cierre era instantáneo porque Headless UI aplicaba `hidden` (display:none) al cerrar. Se agregó el prop `transition` al `Dialog` (mantiene el panel montado durante la transición de salida) + variantes `data-closed:` en `DialogBackdrop` (fade del backdrop) y `DialogPanel` (slide del panel con easing expo-out `cubic-bezier(0.16,1,0.3,1)`). Los items del menú ahora entran con **stagger suave de GSAP** (`gsap.from`, `power3.out`, delay 0.12s) reemplazando a framer-motion. Además: swap suave del ícono hamburguesa↔X (rotación + fade), hover con `scale` en el botón de cerrar y `translate-x` en los links.
- **2026-09-17 — Menú móvil: overlay propio con GSAP (reemplaza el Dialog de Headless UI).** El enfoque con `transition` + `data-closed` de Headless UI no funcionó (el Dialog monta el panel de forma asíncrona → `Invalid scope` y `GSAP target .menu-item not found`; el menú se abría sin transición). Se reemplazó por un **overlay custom siempre montado** con timeline de GSAP: apertura (backdrop fade 0.3s + panel slide `power3.out` 0.45s + items stagger 60ms) y cierre (items fade + panel slide out + backdrop fade). Se implementaron manualmente: cierre con Escape, bloqueo de scroll del body, foco al panel al abrir, `aria-modal`/`aria-hidden`/`inert`. El panel inicia fuera de pantalla con CSS (`-translate-x-full`) para evitar flash en SSR.
- **2026-09-17 — Fixes del menú móvil:** (1) el overlay estaba dentro del `<nav>` y el `backdrop-blur` del nav (al hacer scroll) crea un _containing block_ que confinaba el overlay `fixed inset-0` al alto del nav (~64px) → solo se veía "Menú". Se movió el overlay **fuera del `<nav>`** (hermano, en un fragment). (2) El `syncTouch` de Lenis añadía lag en iOS/WebKit (Opera/Safari/Chrome iOS) → ahora se detecta iOS (incluye iPadOS vía `MacIntel` + `maxTouchPoints`) y se usa **scroll nativo** (ya suave); en Android se mantiene el glide de Lenis.
- **2026-09-17 — Transición de tema suave (View Transitions API) + morph de icono luna↔sol (MorphIcons):** se agregó `morphicons` + `lucide`. El `ThemeSelector` ahora usa `<MorphIcon icon={dark ? Moon : Sun} spring="smooth" />` (morph con física de spring, `reducedMotion="user"`). El cambio de tema usa `document.startViewTransition(() => flushSync(setTheme))` con un **wipe circular** que crece desde el botón del tema (600ms, expo-out), con fallback a cambio directo si la API no existe o hay `prefers-reduced-motion`. Se reemplazó el hack `**:transition-none!` (probablemente inválido en Tailwind v4) por una clase `.disable-transitions` robusta en `globals.css`, y se agregó CSS para un wipe limpio (`::view-transition-old/new(root)` sin crossfade). `TranslateSelector`: `transition-colors` en los botones de idioma. Se eliminó `components/icons/ThemeIcons.tsx` (los iconos custom fueron reemplazados por datos de Lucide).

## 1. Estado del MCP / Skills de GSAP ✅

**Verificado y listo para usar.** Los skills oficiales de GSAP están instalados en `.agents/skills/` y cargan correctamente:

| Skill                | Estado        | Uso                                          |
| -------------------- | ------------- | -------------------------------------------- |
| `gsap-core`          | ✅ Verificado | Tweens, easing, stagger, defaults            |
| `gsap-timeline`      | ✅ Instalado  | Secuencias y coreografía                     |
| `gsap-scrolltrigger` | ✅ Verificado | Scroll-linked, pinning, scrub                |
| `gsap-plugins`       | ✅ Verificado | SplitText, Flip, Draggable, ScrollTo, etc.   |
| `gsap-react`         | ✅ Verificado | Hook `useGSAP()`, cleanup, SSR               |
| `gsap-performance`   | ✅ Instalado  | 60fps, transforms, layout thrashing          |
| `gsap-utils`         | ✅ Instalado  | `clamp`, `mapRange`, `random`, `snap`        |
| `motion-framer`      | ✅ Instalado  | Alternativa (solo si se pide explícitamente) |

### ⚠️ Acción pendiente: instalar la librería GSAP

El proyecto **no tiene `gsap` en `package.json`** (solo `framer-motion@^13.3.0`). Para empezar:

```bash
cd josuehernandez
pnpm add gsap @gsap/react
```

> **Nota de arquitectura:** `AGENTS.md` establece que **GSAP es la librería recomendada** para este proyecto (timelines + scroll-driven). `framer-motion` ya está instalado y se usa en `components/ui/Fade.tsx` y `Navbar.tsx`; la estrategia es **migrar progresivamente a GSAP** sin romper lo existente (ver Fase 1).

### 💡 Opcional: MCP de motionprompts

Existe un MCP server oficial sobre el catálogo de [motionprompts.dev](https://motionprompts.dev) (236 componentes GSAP con prompts listos para agentes de IA). Se puede agregar a `.zed/mcp.json`:

```json
{
  "mcp_servers": {
    "motionprompts": {
      "command": "npx",
      "args": ["-y", "motionprompts-mcp"]
    }
  }
}
```

---

## 2. Benchmark — Mejores sitios diseñados con Motion (premiados)

### 🏆 Framer Awards 2025 (los "Oscars" de Motion)

| Ganador             | Categoría         | Sitio                                                                | Por qué ganó                                                                                                                       |
| ------------------- | ----------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Analogue Agency** | Best Animations   | [panton.vitra.com](https://panton.vitra.com)                         | _"Un sitio que simplemente se siente bien al hacer scroll"_ — animaciones geométricas simples, colores audaces, motion súper suave |
| **Bogdan Skripka**  | Best Interactions | [bohdan.design](https://bohdan.design)                               | _"Cada hover, tap y transición tiene intención real detrás"_ — micro-interacciones con propósito                                   |
| **27b**             | Best Storytelling | [spotlight.i-d.co/ellefanning](https://spotlight.i-d.co/ellefanning) | Editorial inmersivo — cada sección se despliega manteniendo la curiosidad                                                          |
| **Trueform**        | Best Big Site     | [miro.com](https://miro.com)                                         | Sitio enorme que se siente ligero y juguetón                                                                                       |
| **Asia Gawron**     | Best Newcomer     | [bychudy.com](https://bychudy.com)                                   | Frescura, audacia y pulido                                                                                                         |
| **Gunnar Gray**     | Best Plugin       | Kinetic Type                                                         | Tipografía animada con presets, scroll triggers y hovers                                                                           |

**Finalistas a revisar:** panicframe.com · startups.gallery · akiflow.com · kitro.ch · matcha-cartel.com · midlife.engineering · layolab.com · slixel.com · sunhung.net · nommo.space

### 🏆 Awwwards 2025

| Sitio                        | Logro                        | Lección para nosotros                                                 |
| ---------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| **Messenger**                | Site of the Year 2025        | WebGL inmersivo (planeta jugable) — el navegador aún puede sorprender |
| **Lando Norris** (OFF+BRAND) | Site of the Year 2025        | Velocidad, personalidad y precisión — storytelling deportivo          |
| **Bruno Simon**              | Site of the Month (ene 2026) | Portfolio 3D interactivo — la navegación es una experiencia           |

### 🎬 Showcases de GSAP (referencia directa de técnica)

- [awwwards.com/websites/gsap](https://www.awwwards.com/websites/gsap) — selección oficial de sitios GSAP premiados
- [landing.love/collection/gsap](https://www.landing.love/collection/gsap) — **191 páginas reales** con GSAP en producción (videos de página completa)
- [madewithgsap.com](https://madewithgsap.com) — 50 efectos premium (scroll, drag, mouse move, infinitos) de un equipo con **27 Awwwards SOTD combinados**

### 🔍 Patrones comunes de los ganadores (el "por qué" ganan)

1. **Smooth scroll** (Lenis / ScrollSmoother) + `scrub` en ScrollTrigger → el scroll se siente físico
2. **Tipografía cinética** (SplitText): reveals palabra por palabra, líneas con máscara
3. **Preloaders y transiciones de página** → la entrada es parte del diseño
4. **Micro-interacciones**: botones magnéticos, hovers con intención (Bogdan Skripka es el referente)
5. **Marquees** infinitos (texto/logos) que reaccionan a la velocidad del scroll
6. **Image reveals** con `clip-path`/máscara en lugar de simples fades
7. **Secciones pinned** con storytelling en scroll (scrub multi-paso)
8. **Scroll horizontal** en galerías/proyectos (técnica `containerAnimation`)
9. **Custom cursor** que reacciona al contenido
10. **Parallax** sutil por capas (nunca exagerado)

> **Conclusión del benchmark:** los sitios premiados no animan "todo" — animan **pocas cosas, bien coreografiadas, con easing suave y timing consistente**. El diseño _clean_ + motion _smooth_ es la combinación ganadora.

---

## 3. Análisis del proyecto actual

### Stack actual

- **Next.js 16** (App Router, Turbopack) + **React 19** + **Tailwind CSS 4**
- **i18n** (i18next, es/en) · **next-themes** (dark/light)
- **framer-motion** ^13.3.0 (Fade.tsx, Navbar) · **three.js** (LiquidSphere, Morphing)
- Hero: carrusel full-screen con autoplay/swipe · Footer: canvas dithering

### ✅ Fortalezas (lo que ya está bien)

| Área                   | Detalle                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Performance base**   | Lazy loading (`Suspense` + `lazy`), preload de imagen crítica, `blurDataURL`, `quality` escalonado                      |
| **i18n + SEO**         | Metadata completa, canonical, alternates, OpenGraph, sitemap                                                            |
| **ParallaxCard**       | Implementación muy avanzada: giroscopio con calibración, suavizado exponencial, RAF (ver `docs/parallax-giroscopio.md`) |
| **3D**                 | three.js integrado (esfera líquida, morphing)                                                                           |
| **Accesibilidad base** | `aria` en carrusel, focus rings, `prefers-reduced-motion` parcial en `Fade.tsx`                                         |
| **Footer**             | Canvas de dithering con interacción de mouse (toque creativo único)                                                     |

### ⚠️ Áreas de oportunidad (mapeadas por sección)

| Sección / Archivo                          | Problema actual                                                                                                            | Oportunidad v2                                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Hero** (`HeroCarousel.tsx`)              | Transiciones con CSS `transition` + estado React; el colapso por scroll en móvil usa `setState` en cada frame (re-renders) | Timeline GSAP con crossfade + scale/blur; colapso con `ScrollTrigger` + `scrub` (sin re-renders); parallax de capas |
| **Títulos** (`page.tsx`, `Experience.tsx`) | Texto estático, sin reveal                                                                                                 | `SplitText` + máscara de líneas con stagger                                                                         |
| **Entrada del sitio**                      | No hay preloader ni intro                                                                                                  | Preloader con contador + reveal de hero (patrón "Curtain Hero Reveal" de motionprompts)                             |
| **Scroll general**                         | Scroll nativo, sin inercia                                                                                                 | **Lenis** (smooth scroll) + `ScrollTrigger.scrollerProxy()` o `ScrollSmoother`                                      |
| **Fade.tsx**                               | Framer Motion (contra la regla de AGENTS.md)                                                                               | Migrar a GSAP: `useGSAP` + `ScrollTrigger.batch()` para reveals con stagger                                         |
| **Navbar** (`Navbar.tsx`)                  | Sin micro-interacciones; cambio de estado en scroll                                                                        | Pill activo animado, links con subrayado animado, navbar que se oculta al bajar / aparece al subir                  |
| **Experience** (`Experience.tsx`)          | Lista estática con bordes                                                                                                  | Sticky de títulos, reveals escalonados, línea de tiempo animada                                                     |
| **ParallaxCard**                           | RAF manual (funciona, pero es código propio a mantener)                                                                    | Opcional: `gsap.quickTo()` para suavizar el pointer (menos código, mismo resultado)                                 |
| **Projects** (`app/[lng]/projects/`)       | Por revisar                                                                                                                | Galería con scroll horizontal o grid con image reveals + hover direction-aware                                      |
| **Footer** (`Footer.tsx`)                  | Aparece de golpe                                                                                                           | Curtain reveal / parallax al llegar al final (patrón "Motion Footer" de 21st.dev)                                   |
| **Botones / links**                        | Hovers CSS básicos                                                                                                         | Botones magnéticos + hover con intención (referente: Bohdan Skripka)                                                |
| **Cursor**                                 | Cursor nativo                                                                                                              | Custom cursor con `gsap.quickTo` (solo desktop, respetando `prefers-reduced-motion`)                                |
| **Transiciones de página**                 | Navegación instantánea                                                                                                     | Transiciones suaves entre rutas (overlay reveal)                                                                    |
| **Bundle**                                 | framer-motion + three.js juntos                                                                                            | Migrar Fade.tsx a GSAP libera el bundle de framer-motion; evaluar `SplitText` solo donde se use                     |

---

## 4. Roadmap propuesto (fases)

### Fase 0 — Setup (½ día)

```bash
pnpm add gsap @gsap/react
```

1. Crear `lib/gsap.ts` con registro central de plugins y defaults:

```ts
// lib/gsap.ts
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Defaults globales: easing suave y consistente en todo el sitio
gsap.defaults({ ease: "power3.out", duration: 0.8 });

export { gsap, useGSAP, ScrollTrigger, SplitText };
```

2. Instalar **Lenis** para smooth scroll: `pnpm add lenis`
3. Crear hook `useSmoothScroll` (cliente, con cleanup) + `ScrollTrigger.scrollerProxy()` o integrar con `ScrollTrigger.update` listener.
4. _(Opcional)_ Agregar MCP de motionprompts a `.zed/mcp.json`.

### Fase 1 — Fundamentos (2-3 días)

| Entregable          | Técnica GSAP                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Preloader**       | Timeline: contador + barra + reveal de cortina (patrón "Curtain Hero Reveal")                                                            |
| **Hero v2**         | Timeline de entrada (título con SplitText, imagen con scale), transición entre slides con crossfade+scale, colapso al scroll con `scrub` |
| **Text reveals**    | `SplitText.create(el, { type: "lines", mask: "lines" })` + `ScrollTrigger` con stagger                                                   |
| **Migrar Fade.tsx** | `useGSAP` + `ScrollTrigger.batch()` (reemplaza framer-motion)                                                                            |
| **Marquee**         | Texto infinito con `gsap.utils.wrap` + velocidad reactiva al scroll                                                                      |

### Fase 2 — Scroll storytelling (3-4 días)

| Entregable                        | Técnica GSAP                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------- |
| **Sección Experience**            | Título sticky + reveals escalonados por tarjeta                                  |
| **Scroll horizontal en Projects** | `pin` + `containerAnimation` (⚠️ `ease: "none"` obligatorio)                     |
| **Image reveals**                 | `clip-path: inset()` animado con ScrollTrigger (patrón "Image Reveal On Scroll") |
| **Parallax de capas**             | `scrub` con velocidades distintas por capa                                       |
| **Footer reveal**                 | Curtain reveal con parallax al final de la página                                |

### Fase 3 — Micro-interacciones (2-3 días)

| Entregable               | Técnica GSAP                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| **Botones magnéticos**   | `gsap.quickTo()` en `pointermove` + `elastic.out` al soltar            |
| **Custom cursor**        | `quickTo` con lag suave; escala al hover de elementos interactivos     |
| **Hover en cards**       | Direction-aware (detectar entrada por 4 lados con `gsap.utils`)        |
| **Navbar**               | Pill activo con `Flip` o animación de fondo; ocultar/mostrar al scroll |
| **Theme/i18n selectors** | Transiciones suaves al cambiar idioma/tema                             |

### Fase 4 — Pulido (1-2 días)

- Transiciones de página (overlay reveal con `usePathname`)
- `gsap.matchMedia()` para responsive + `prefers-reduced-motion`
- Auditoría de performance (ver §7)
- `pnpm run lint` + `pnpm run build` ✅

---

## 5. Micro-interacciones clave (detalle)

Estas son las que separan un sitio "bonito" de uno **premiado** (referente: Bohdan Skripka):

1. **Botones magnéticos** — el botón "atrae" al cursor dentro de un radio; al soltar, vuelve con overshoot. Patrón: `gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" })`.
2. **Links con subrayado animado** — `scaleX` del underline con `transform-origin` según dirección de entrada.
3. **Cards direction-aware** — el hover detecta de qué lado entra el cursor y la animación (glow/translate) viene de ese lado.
4. **Custom cursor** — círculo con lag (`quickTo` con duraciones distintas para dot y ring); crece sobre elementos interactivos.
5. **Contador animado** — números que se cuentan al entrar en viewport (`gsap.to` sobre objeto + `onUpdate`).
6. **Magnetic + marquee** — marquee que acelera/desacelera con la velocidad del scroll (táctil, no decorativo).
7. **Theme toggle** — transición de color con morph suave (evitar flash).
8. **Scroll progress indicator** — barra/progreso en el navbar con `ScrollTrigger` + `scrub`.

> **Regla de oro:** cada micro-interacción debe tener **intención** (feedback a una acción), durar **150-400ms** y usar el **mismo easing global** para que el sitio se sienta coherente.

---

## 6. Referencias para la implementación

| Recurso                                                                            | Qué aporta                                                    | Cómo usarlo                                                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [details.so/inspo](https://www.details.so/inspo)                                   | Inspiración curada: heroes, footers, preloaders, transiciones | Definir el _look & feel_ antes de codificar                                    |
| [The Blueprint Library](https://the-blueprint-library.webflow.io/admin/components) | 90+ layouts + 65+ UI components con scroll-triggered visuals  | Referencia de estructura y patrones de sección                                 |
| [motionprompts.dev](https://motionprompts.dev)                                     | **236 componentes GSAP** con prompts listos para agentes      | Copiar el prompt en el agente → reconstruye el componente adaptado al proyecto |
| [madewithgsap.com](https://madewithgsap.com)                                       | 50 efectos premium con código                                 | Técnica pura de GSAP sin WebGL                                                 |
| [landing.love/collection/gsap](https://www.landing.love/collection/gsap)           | 191 sitios GSAP en producción                                 | Ver qué patrones se ven bien en contexto real                                  |
| [awwwards.com/websites/gsap](https://www.awwwards.com/websites/gsap)               | Sitios GSAP premiados                                         | Benchmark de calidad                                                           |

---

## 7. Performance y accesibilidad (no negociable)

- **`prefers-reduced-motion`**: usar `gsap.matchMedia()` para desactivar scroll-heavy animations y micro-interacciones cuando el usuario lo pida.
- **Solo transforms + opacity** en animaciones (nunca `top/left/width/height`) → 60fps garantizado.
- **`will-change`** solo en elementos activamente animados; quitarlo al terminar.
- **Registrar plugins perezosamente**: `SplitText` solo en componentes que lo usen (import dinámico si es necesario).
- **`ScrollTrigger.refresh()`** después de cargar fuentes/imágenes (`document.fonts.ready`).
- **Cleanup obligatorio**: `useGSAP()` revierte todo automáticamente (contexto + ScrollTriggers) al desmontar.
- **No animar en SSR**: todo dentro de `useGSAP`/`useEffect` (cliente).
- **Bundle**: al migrar `Fade.tsx` a GSAP, evaluar eliminar `framer-motion` del proyecto (menos JS, más coherencia con AGENTS.md).

---

## 8. Checklist de implementación

- [ ] `pnpm add gsap @gsap/react lenis`
- [ ] `lib/gsap.ts` con registro de plugins + defaults
- [ ] Hook `useSmoothScroll` (Lenis + ScrollTrigger sync)
- [ ] Preloader con reveal de cortina
- [ ] Hero v2: SplitText + timeline de entrada + scrub de colapso
- [ ] Migrar `Fade.tsx` de framer-motion → GSAP (`ScrollTrigger.batch`)
- [ ] Text reveals con máscara en Experience y Projects
- [ ] Marquee de skills/tecnologías
- [ ] Scroll horizontal en Projects (`containerAnimation`)
- [ ] Botones magnéticos + custom cursor (desktop)
- [ ] Navbar con pill activo + ocultar al scroll
- [ ] Footer con curtain reveal
- [ ] `gsap.matchMedia()` + `prefers-reduced-motion`
- [ ] `pnpm run lint` ✅ · `pnpm run build` ✅
- [ ] Lighthouse ≥ 90 en performance, accesibilidad y best practices

---

## Resumen ejecutivo

El proyecto tiene **bases sólidas** (performance, i18n, 3D, accesibilidad) pero la animación actual es **funcional, no memorable**. Los sitios premiados con Motion comparten un patrón claro: _smooth scroll + tipografía cinética + micro-interacciones con intención + reveals coreografiados_. Con **GSAP + ScrollTrigger + SplitText + Lenis** y el roadmap de 4 fases (~2 semanas), la v2 puede alcanzar ese nivel sin cambiar el stack base. Los skills de GSAP están **verificados y listos**; solo falta instalar la librería y empezar.
