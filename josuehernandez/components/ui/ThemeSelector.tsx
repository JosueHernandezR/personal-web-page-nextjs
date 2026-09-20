"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { MorphIcon } from "morphicons/react";
import { Moon, Sun } from "lucide";

export default function ThemeSelector() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("disable-transitions");
    window.setTimeout(() => {
      document.documentElement.classList.remove("disable-transitions");
    }, 0);
  }

  /**
   * Cambio de tema con "iris wipe" manual (sin View Transitions API):
   * la VT API crea un stacking context en el snapshot y los elementos con
   * backdrop-filter (navbar, ParallaxCard) pierden su blur durante la
   * transición (bug de especificación). Con un overlay de círculo + WAAPI,
   * el DOM queda vivo y el blur nunca se pierde.
   */
  function toggleTheme(): void {
    disableTransitionsTemporarily();

    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const button = buttonRef.current;

    // Fallback: reduced motion → cambio directo
    if (
      !button ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // Color de fondo del tema ACTUAL (para el overlay del círculo)
    const styles = getComputedStyle(document.documentElement);
    const oldBg = styles.getPropertyValue("--background").trim() || "#ffffff";

    // Centro del botón + radio máximo hasta la esquina más lejana
    const { top, left, width, height } = button.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    // Overlay del círculo con el color del tema anterior
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:${oldBg};clip-path:circle(${maxRadius}px at ${cx}px ${cy}px);pointer-events:none;`;
    document.body.appendChild(overlay);

    // Cambiar el tema DEBAJO del overlay (queda oculto)
    setTheme(nextTheme);

    // El círculo se cierra: revela el nuevo tema (backdrop-filter intactos)
    overlay
      .animate(
        {
          clipPath: [
            `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            `circle(0px at ${cx}px ${cy}px)`,
          ],
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      )
      .finished.then(() => overlay.remove());
  }

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle dark mode"
        className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-black/90 dark:ring-principal-dark/10 dark:hover:ring-principal-dark/20 dark:hover:bg-black/50"
      >
        <div className="h-6 w-6" />
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Toggle dark mode"
      className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 backdrop-blur transition dark:bg-black/90 dark:ring-principal-dark/10 dark:hover:ring-principal-dark/20 dark:hover:bg-black/50  hover:cursor-pointer"
      onClick={toggleTheme}
    >
      {/* Morph suave luna ↔ sol con física de spring */}
      <MorphIcon
        icon={currentTheme === "dark" ? Moon : Sun}
        spring="smooth"
        reducedMotion="user"
        className="h-6 w-6 stroke-zinc-400 dark:stroke-zinc-100 transition group-hover:stroke-zinc-500 dark:group-hover:stroke-zinc-200"
      />
    </button>
  );
}
