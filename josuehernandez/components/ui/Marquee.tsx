"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Marquee infinito: el track se duplica y se anima a xPercent -50% con
 * ease "none" para un loop perfecto. `mr-8` en cada item mantiene el
 * espaciado consistente en el punto de loop.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        xPercent: -50,
        duration: 24,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef },
  );

  return (
    <div className="overflow-hidden whitespace-nowrap" aria-hidden="true">
      <div ref={trackRef} className="flex">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className={`${className} mr-8`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
