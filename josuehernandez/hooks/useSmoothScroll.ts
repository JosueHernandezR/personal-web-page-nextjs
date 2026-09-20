"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scroll (Lenis) sincronizado con ScrollTrigger.
 *
 * Configuración:
 * - `lerp: 0.07` — modo de interpolación lineal (Lenis ignora `duration`/`easing`
 *   cuando `lerp` está definido). Da un "catch-up" consistente y suave incluso
 *   en scroll rápido: la página persigue al input con un glide constante en vez
 *   de seguir casi nativamente (que era lo que pasaba con `lerp: 0.1`).
 *   Ajuste: 0.1 = más directo · 0.05 = más flotante/lento.
 * - `syncTouch` — fuerza el mismo smooth scroll en táctil (móvil/tablet),
 *   independientemente del OS/navegador. En iOS se desactiva (scroll nativo):
 *   el scroll nativo de iOS ya es suave y el `syncTouch` de Lenis añade lag en
 *   WebKit (Safari/Opera/Chrome iOS). En Android sí se activa (mejora el glide).
 * - `prevent` — deja pasar el scroll nativo de elementos anidados marcados con
 *   `data-lenis-prevent` (p. ej. el panel del menú móvil con overflow-y-auto).
 * - `wheelMultiplier: 1` — el scroll del mouse/trackpad mantiene 1:1 (no se
 *   frena al usuario).
 * - El ticker de GSAP impulsa el RAF de Lenis para mantener scroll y
 *   animaciones perfectamente sincronizados.
 * - `lagSmoothing(0)` evita que las animaciones scrub se queden atrás.
 * - Respeta `prefers-reduced-motion` (se desactiva automáticamente).
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // iOS (incluye iPadOS, que se reporta como MacIntel con touch): el scroll
    // nativo ya es suave; forzar syncTouch añade lag en WebKit.
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: !isIOS,
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
