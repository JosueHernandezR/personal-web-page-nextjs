"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Solo se muestra en la primera carga de la sesión (no en cada navegación).
// IMPORTANTE: se marca como visto SOLO al completar la animación — si se
// marcara antes de crear el timeline, React StrictMode (doble mount en dev)
// revertiría el timeline del primer mount y el segundo mount no crearía ninguno
// (el preloader quedaría pegado en 00).
let hasShownPreloader = false;

/**
 * Preloader de la página: contador 00→100 + reveal de cortina (GSAP).
 * - Se muestra solo en la primera carga por sesión.
 * - Respeta prefers-reduced-motion (se omite).
 * - Timeout de seguridad: nunca bloquea la página (fuerza el cierre a los 5s).
 */
export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isDone, setIsDone] = useState(false);

  useGSAP(
    () => {
      if (hasShownPreloader) {
        setIsDone(true);
        return;
      }

      // Reduced motion: sin preloader
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        hasShownPreloader = true;
        setIsDone(true);
        return;
      }

      const overlay = overlayRef.current;
      const counter = counterRef.current;
      if (!overlay || !counter) return;

      // Seguridad: si el timeline fallara por cualquier motivo, cerrar igual
      const timeoutId = window.setTimeout(() => {
        hasShownPreloader = true;
        setIsDone(true);
      }, 5000);

      const complete = () => {
        hasShownPreloader = true;
        setIsDone(true);
        window.clearTimeout(timeoutId);
      };

      const counterObj = { value: 0 };

      gsap
        .timeline({ onComplete: complete })
        .to(counterObj, {
          value: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(counterObj.value)).padStart(
              2,
              "0",
            );
          },
        })
        .to(overlay, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
        });
    },
    { scope: overlayRef },
  );

  if (hasShownPreloader || isDone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background"
      aria-hidden="true"
    >
      <span
        ref={counterRef}
        className="font-geist text-8xl font-medium tracking-tight text-foreground"
      >
        00
      </span>
      <span className="mt-6 text-sm uppercase tracking-[0.35em] text-foreground opacity-70">
        Josue Hernandez
      </span>
    </div>
  );
}
