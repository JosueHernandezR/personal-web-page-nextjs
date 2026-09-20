"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Solo se muestra en la primera carga de la sesión (no en cada navegación).
// IMPORTANTE: se marca como visto SOLO al completar la animación — si se
// marcara antes de crear el timeline, React StrictMode (doble mount en dev)
// revertiría el timeline del primer mount y el segundo mount no crearía ninguno.
let hasShownPreloader = false;

const ORBIT_TEXT = "DEVELOPER • PHOTOGRAPHER • FULLSTACK • ";
const BRAND_NAME = "Josue Hernandez";

// Anillos orbitales: radio (en viewBox 200), dirección de rotación y opacidad base
const RINGS = [
  { radius: 86, direction: 1, opacity: 0.5 },
  { radius: 68, direction: -1, opacity: 0.34 },
  { radius: 50, direction: 1, opacity: 0.2 },
];

/**
 * Preloader Órbita: contador 00→100 en el centro, anillos de texto
 * concéntricos girando (direcciones alternadas), línea de progreso
 * sincronizada y cortina de salida. Solo en la primera carga por sesión.
 */
export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
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
      const progress = progressRef.current;
      if (!overlay || !counter || !progress) return;

      // Seguridad: si el timeline fallara, cerrar igual
      const timeoutId = window.setTimeout(() => {
        hasShownPreloader = true;
        setIsDone(true);
      }, 6500);

      const complete = () => {
        hasShownPreloader = true;
        setIsDone(true);
        window.clearTimeout(timeoutId);
      };

      const counterObj = { value: 0 };

      const tl = gsap.timeline({ onComplete: complete });

      // Contador 0 → 100
      tl.to(counterObj, {
        value: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          counter.textContent = String(Math.round(counterObj.value)).padStart(
            2,
            "0",
          );
        },
      });

      // Línea de progreso sincronizada con el contador
      tl.fromTo(
        progress,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.2, ease: "power2.inOut" },
        0,
      );

      // Anillos: rotan (alternando dirección), escalan y se desvanecen
      tl.fromTo(
        ".orbit-ring",
        {
          rotation: (i: number) => i * 40,
          scale: 1,
          opacity: (i: number) => RINGS[i % RINGS.length].opacity,
        },
        {
          rotation: (i: number) => RINGS[i % RINGS.length].direction * 360,
          scale: 1.25,
          opacity: 0,
          stagger: 0.12,
          duration: 2.2,
          ease: "power2.inOut",
        },
        "<",
      );

      // El centro respira suavemente mientras giran los anillos
      tl.fromTo(
        ".orbit-center",
        { scale: 1 },
        {
          scale: 1.04,
          duration: 1.1,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        "<",
      );

      // Cortina final: se ve el 100% y luego sube
      tl.to(
        overlay,
        { yPercent: -100, duration: 0.9, ease: "power3.inOut" },
        "+=0.15",
      );
    },
    { scope: overlayRef },
  );

  if (hasShownPreloader || isDone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-background"
      aria-hidden="true"
    >
      {/* Resplandor radial de fondo (profundidad) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[65vmin] w-[65vmin] rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute h-[40vmin] w-[40vmin] rounded-full bg-foreground/5 blur-2xl" />
      </div>

      {/* Composición central */}
      <div className="relative flex flex-col items-center">
        {/* Anillo ancla estático (estructura) */}
        <div className="absolute h-[58vmin] w-[58vmin] rounded-full border border-foreground/10" />

        {/* Anillos orbitales de texto */}
        {RINGS.map((ring, i) => (
          <svg
            key={i}
            className="orbit-ring absolute text-foreground"
            style={{ width: "88vmin", height: "88vmin" }}
            viewBox="0 0 200 200"
            fill="none"
          >
            <defs>
              <path
                id={`preloader-orbit-${i}`}
                d={`M 100,${100 - ring.radius} a ${ring.radius},${ring.radius} 0 1,1 0,${2 * ring.radius} a ${ring.radius},${ring.radius} 0 1,1 0,${-2 * ring.radius}`}
              />
            </defs>
            <text
              fill="currentColor"
              fontSize="8.5"
              letterSpacing="4"
              style={{ opacity: ring.opacity }}
            >
              <textPath href={`#preloader-orbit-${i}`}>
                {ORBIT_TEXT.repeat(3)}
              </textPath>
            </text>
          </svg>
        ))}

        {/* Centro: contador + marca */}
        <div className="orbit-center relative z-10 flex flex-col items-center">
          <span className="font-geist text-6xl font-medium tracking-tight text-foreground md:text-7xl">
            <span ref={counterRef}>00</span>
            <span className="align-top text-3xl text-foreground/50 md:text-4xl">
              %
            </span>
          </span>
          <span className="mt-4 text-[11px] uppercase tracking-[0.45em] text-foreground/55">
            {BRAND_NAME}
          </span>
        </div>
      </div>

      {/* Línea de progreso inferior */}
      <div className="absolute bottom-16 left-1/2 w-56 -translate-x-1/2">
        <div
          ref={progressRef}
          className="h-px origin-left scale-x-0 bg-foreground/50"
        />
      </div>
    </div>
  );
}
