"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scroll (Lenis) sincronizado con ScrollTrigger.
 *
 * Integración oficial de Lenis con GSAP:
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

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
