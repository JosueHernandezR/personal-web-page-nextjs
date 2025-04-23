"use client";
import React, { useEffect, useState, useRef } from "react";
import { Bebas_Neue } from "next/font/google";
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

  // Usar una función memoizada para evitar recreaciones innecesarias
  const updateMousePosition = React.useCallback((e: MouseEvent) => {
    // Calcular posición relativa al viewport
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

  // Función para manejar la orientación del dispositivo (móviles)
  const handleOrientation = React.useCallback(
    (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;

      if (beta !== null && gamma !== null) {
        // Limitar la tasa de actualizaciones
        setCoords({
          x: isLandscape
            ? Math.max(-1, Math.min(1, beta / 45))
            : Math.max(-1, Math.min(1, gamma / 45)),
          y: isLandscape
            ? Math.max(-1, Math.min(1, ((Math.abs(gamma) - 45) / 25) * -1))
            : Math.max(-1, Math.min(1, ((beta - 45) / 25) * -1)),
        });
      }
    },
    []
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
      requestRef.current = requestAnimationFrame(updateStyles);
    };

    requestRef.current = requestAnimationFrame(updateStyles);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [coords]);

  // Configurar los listeners de eventos
  useEffect(() => {
    const options = { passive: true }; // Optimización para eventos táctiles/mouse

    window.addEventListener("mousemove", updateMousePosition, options);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [updateMousePosition]);

  // Configurar el listener de orientación del dispositivo
  useEffect(() => {
    const initiate = () => {
      const requestPermission = (
        DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
      ).requestPermission;
      const iOS = typeof requestPermission === "function";

      if (iOS) {
        Promise.all([requestPermission()]).then((results) => {
          if (results.every((result: string) => result === "granted")) {
            window.addEventListener("deviceorientation", handleOrientation, {
              passive: true,
            });
          }
        });
      } else {
        window.addEventListener("deviceorientation", handleOrientation, {
          passive: true,
        });
      }
    };

    document.body.addEventListener("click", initiate, { once: true });

    return () => {
      document.body.removeEventListener("click", initiate);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [handleOrientation]);

  return (
    <article
      ref={cardRef}
      className="w-full aspect-[4/3] max-h-[calc(100svh-1rem)] relative overflow-hidden max-w-[calc(100%)] portrait:min-h-[330px] rounded-2xl mx-auto md:mx-0"
      style={{
        "--x": "0",
        "--y": "0",
      } as React.CSSProperties}
    >
      <div className="assets absolute inset-0 overflow-hidden">
        {/* Sky Background Image */}
        <img
          className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none saturate-[1.5] brightness-[0.9] scale-[1.1]"
          src={backgroundImage}
          alt=""
        />
        
        {/* Title - Responsive size and positioning */}
        <h3
          className={`${beba.className} absolute left-1/2 top-[6%] m-0 text-[8rem] uppercase text-white z-10`}
        >
          {title}
        </h3>
        
        {/* Castle/Temple Image */}
        <img
          className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none scale-[1.1]"
          src={middleImage}
          alt=""
        />
      </div>

      {/* Implementación del blur exactamente como en el ejemplo proporcionado */}
      <div className="blurs absolute inset-0 [--layers:5] z-[15]">
        <div>
          <div className="layer absolute inset-0" style={{"--index": 1} as React.CSSProperties}/>
          <div className="layer absolute inset-0" style={{"--index": 2} as React.CSSProperties}/>
          <div className="layer absolute inset-0" style={{"--index": 3} as React.CSSProperties}/>
          <div className="layer absolute inset-0" style={{"--index": 4} as React.CSSProperties}/>
          <div className="layer absolute inset-0" style={{"--index": 5} as React.CSSProperties}/>
        </div>
      </div>

      {/* Content Section - Using the CSS classes from the provided code */}
      <div className="content z-20">
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