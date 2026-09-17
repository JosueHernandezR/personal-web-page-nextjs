"use client";
import React, { useEffect, useState, useRef } from "react";
import { Bebas_Neue } from "next/font/google";
import Image from "next/image";
const beba = Bebas_Neue({ weight: "400", subsets: ["latin"] });

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

interface ParallaxCardProps {
  title: string;
  subtitle?: string;
  location?: string;
  backgroundImage: string;
  middleImage: string;
  icon?: React.ReactNode;
}

export function ParallaxCard({
  title,
  subtitle = "Osaka Castle",
  location = "Osaka, Japan",
  backgroundImage,
  middleImage,
  icon,
}: ParallaxCardProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const middleImageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // Giroscopio: gravedad de calibración (g0) y signo del frame del sensor.
  // El mapeo es absoluto (g0 -> g actual): se autocorrige, no se queda estático
  // tras movimientos bruscos ni tras bloquear/desbloquear la pantalla.
  const calibrationGravityRef = useRef<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const prevGravityRef = useRef<{ x: number; y: number; z: number } | null>(
    null,
  );
  // Compensa la inversión del frame del sensor al cruzar la singularidad de Euler.
  const frameSignRef = useRef(1);
  const lastEventTimeRef = useRef(0);

  // Usar una función memoizada para evitar recreaciones innecesarias
  const updatePointerPosition = React.useCallback((e: PointerEvent) => {
    // Calcular posición relativa al viewport (ratón en escritorio, dedo en táctiles)
    const x = e.clientX;
    const y = e.clientY;

    // Actualizar estado solo cuando haya un cambio significativo
    setCoords((prev) => {
      // Usar un umbral para evitar actualizaciones minúsculas
      const threshold = 2;
      if (
        Math.abs(prev.x - x) > threshold ||
        Math.abs(prev.y - y) > threshold
      ) {
        return {
          x: (x / window.innerWidth) * 2 - 1,
          y: (y / window.innerHeight) * 2 - 1,
        };
      }
      return prev;
    });
  }, []);

  // Gravedad en el frame del dispositivo (matriz de rotación del W3C sobre el vector "abajo" del mundo).
  // Es un vector suave: a diferencia de los ángulos de Euler (alpha/beta/gamma), no salta en la
  // singularidad cuando la pantalla apunta al cielo (beta=0) o al suelo (beta=180).
  const gravityInDeviceFrame = React.useCallback(
    (alphaDeg: number, betaDeg: number, gammaDeg: number) => {
      const d2r = Math.PI / 180;
      const a = alphaDeg * d2r;
      const b = betaDeg * d2r;
      const g = gammaDeg * d2r;
      return {
        x: Math.cos(a) * Math.sin(g) - Math.sin(a) * Math.cos(g) * Math.sin(b),
        y: -Math.sin(a) * Math.sin(g) - Math.cos(a) * Math.cos(g) * Math.sin(b),
        z: -Math.cos(g) * Math.cos(b),
      };
    },
    [],
  );

  // Función para manejar la orientación del dispositivo (móviles)
  const handleOrientation = React.useCallback(
    (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      if (alpha === null || beta === null || gamma === null) return;

      const now = Date.now();
      const g = gravityInDeviceFrame(alpha, beta, gamma);

      // Interrupción (bloqueo de pantalla, suspensión del navegador): recalibrar
      // para que el contenido vuelva a responder en lugar de quedarse estático.
      if (now - lastEventTimeRef.current > 1000) {
        calibrationGravityRef.current = g;
        frameSignRef.current = 1;
        lastEventTimeRef.current = now;
        return;
      }
      lastEventTimeRef.current = now;

      const g0 = calibrationGravityRef.current;
      if (!g0) {
        calibrationGravityRef.current = g;
        return;
      }

      // Detectar inversión del frame del sensor (singularidad de Euler: g -> -g).
      const prev = prevGravityRef.current;
      if (prev) {
        const dotPrev = prev.x * g.x + prev.y * g.y + prev.z * g.z;
        if (dotPrev < -0.5) {
          frameSignRef.current *= -1;
        }
      }
      prevGravityRef.current = g;

      // Mapeo absoluto calibrado: rotación (eje-ángulo) de g0 a g en el frame del dispositivo.
      const dot = g0.x * g.x + g0.y * g.y + g0.z * g.z;
      const cross = {
        x: g0.y * g.z - g0.z * g.y,
        y: g0.z * g.x - g0.x * g.z,
        z: g0.x * g.y - g0.y * g.x,
      };
      const len = Math.hypot(cross.x, cross.y, cross.z);
      if (len < 1e-6) return;

      const deg = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
      const sign = frameSignRef.current;
      const ax = cross.x / len;
      const az = cross.z / len;

      const SENS = 35; // sensibilidad: 35 grados de inclinación = recorrido completo
      const targetX = Math.max(-1, Math.min(1, (deg * az * sign) / SENS));
      const targetY = Math.max(-1, Math.min(1, (deg * ax * sign) / SENS));

      // Suavizado exponencial: movimiento fluido sin tirones (0.45 por frame a ~60 Hz)
      setCoords((prevCoords) => ({
        x: prevCoords.x + (targetX - prevCoords.x) * 0.45,
        y: prevCoords.y + (targetY - prevCoords.y) * 0.45,
      }));
    },
    [gravityInDeviceFrame],
  );
  // Aplicar los valores de transformación directamente en el DOM mediante CSS variables
  useEffect(() => {
    if (!cardRef.current) return;

    // Usar requestAnimationFrame para sincronizar con el ciclo de renderizado del navegador
    const updateStyles = () => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", coords.x.toString());
        cardRef.current.style.setProperty("--y", coords.y.toString());
      }

      // Aplicar transformaciones directamente a las imágenes para efecto parallax
      if (bgImageRef.current) {
        // Movimiento menor para el fondo
        bgImageRef.current.style.transform = `translate(${coords.x * -10}px, ${coords.y * -10}px)`;
      }

      if (middleImageRef.current) {
        // Movimiento mayor para el castillo
        middleImageRef.current.style.transform = `translate(${coords.x * -15}px, ${coords.y * -15}px)`;
      }

      if (titleRef.current) {
        titleRef.current.style.transform = `translate(${coords.x * 20}px, ${coords.y * 20}px)`;
      }

      requestRef.current = requestAnimationFrame(updateStyles);
    };

    requestRef.current = requestAnimationFrame(updateStyles);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [coords]);

  // Configurar los listeners de eventos (ratón en escritorio, dedo en táctiles)
  useEffect(() => {
    const options = { passive: true }; // Optimización para eventos táctiles/mouse

    window.addEventListener("pointermove", updatePointerPosition, options);

    return () => {
      window.removeEventListener("pointermove", updatePointerPosition);
    };
  }, [updatePointerPosition]);

  // Configurar el listener de orientación del dispositivo (giroscopio en móviles)
  useEffect(() => {
    let orientationListening = false;
    let gestureBusy = false;
    let warnedInsecure = false;

    const attachOrientationListening = () => {
      if (orientationListening) return;
      orientationListening = true;
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
    };

    const initiate = () => {
      // Algunos navegadores (p. ej. escritorio) no exponen DeviceOrientationEvent
      if (typeof DeviceOrientationEvent === "undefined") return;

      // La API de orientación solo existe en contextos seguros (HTTPS o localhost)
      if (!window.isSecureContext) {
        if (process.env.NODE_ENV === "development" && !warnedInsecure) {
          warnedInsecure = true;
          console.warn(
            "[ParallaxCard] El giroscopio requiere HTTPS (contexto seguro). " +
              "Prueba con `pnpm dev:https` o un túnel HTTPS (ngrok) en iOS.",
          );
        }
        return;
      }

      if (orientationListening || gestureBusy) return;
      gestureBusy = true;

      const requestPermission = (
        DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
      ).requestPermission;

      if (typeof requestPermission === "function") {
        // iOS 13+: el permiso debe solicitarse dentro del gesto del usuario
        void requestPermission()
          .then((result) => {
            if (result === "granted") attachOrientationListening();
          })
          .finally(() => {
            gestureBusy = false;
          });
      } else {
        // Android y demás navegadores: sin permiso previo
        attachOrientationListening();
        gestureBusy = false;
      }
    };

    // iOS: el permiso debe pedirse en un gesto real del usuario.
    // click/touchend son los gestos fiables en iOS; pointerdown cubre el primer toque.
    document.addEventListener("click", initiate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchend", initiate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointerdown", initiate, {
      capture: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("click", initiate, true);
      window.removeEventListener("touchend", initiate, true);
      window.removeEventListener("pointerdown", initiate, true);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [handleOrientation]);

  return (
    <article
      ref={cardRef}
      className="w-full aspect-4/3 max-h-[calc(100svh-1rem)] relative overflow-hidden max-w-[calc(100%)] portrait:min-h-[330px] rounded-2xl mx-auto md:mx-0"
      style={
        {
          "--x": "0",
          "--y": "0",
        } as React.CSSProperties
      }
    >
      <div className="assets absolute inset-0 overflow-hidden">
        {/* Sky Background Image */}
        <div
          ref={bgImageRef}
          className="absolute top-0 left-0 w-full h-full will-change-transform transition-transform duration-50 scale-[1.05]"
        >
          <Image
            className="object-cover select-none pointer-events-none saturate-[1.5] brightness-[0.9] scale-[1.2]"
            src={backgroundImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            preload
          />
        </div>

        {/* Title - Responsive size and positioning */}
        <h3
          ref={titleRef}
          className={`${beba.className} absolute top-[6%] left-[50%] -translate-x-[50%] m-0 text-[5rem] md:text-[8rem] uppercase text-white z-10 w-full text-center`}
        >
          {title}
        </h3>

        {/* Castle/Temple Image */}
        <div
          ref={middleImageRef}
          className="absolute top-0 left-0 w-full h-full will-change-transform transition-transform duration-50 scale-[1.05]"
        >
          <Image
            className="object-cover object-[center_75%] select-none pointer-events-none scale-[1.2]"
            src={middleImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            preload
          />
        </div>
      </div>

      {/* Implementación del blur exactamente como en el ejemplo proporcionado */}
      <div className="blurs absolute inset-0 [--layers:5] z-15">
        <div>
          <div
            className="layer absolute inset-0"
            style={{ "--index": 1 } as React.CSSProperties}
          />
          <div
            className="layer absolute inset-0"
            style={{ "--index": 2 } as React.CSSProperties}
          />
          <div
            className="layer absolute inset-0"
            style={{ "--index": 3 } as React.CSSProperties}
          />
          <div
            className="layer absolute inset-0"
            style={{ "--index": 4 } as React.CSSProperties}
          />
          <div
            className="layer absolute inset-0"
            style={{ "--index": 5 } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Content Section - Using the CSS classes from the provided code */}
      <div
        className="content z-20"
        style={{
          transform: `translate(calc(var(--x) * -5px), calc(var(--y) * -5px))`,
        }}
      >
        <p className="flex items-center gap-1 sm:gap-2 text-[1rem] sm:text-[1.2rem] relative">
          {icon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <title>Location Pin</title>
              <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{subtitle}</span>
        </p>
        <p>{location}</p>
      </div>
    </article>
  );
}
