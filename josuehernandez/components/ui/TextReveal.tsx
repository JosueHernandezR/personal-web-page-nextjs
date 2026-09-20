"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Reveal de texto con SplitText: las líneas entran desde abajo con máscara
 * (overflow: clip) cuando el elemento entra al viewport. Una sola vez.
 */
export function TextReveal({ text, as = "h2", className }: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const split = SplitText.create(el, { type: "lines", mask: "lines" });

      gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  const Tag = as;

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
