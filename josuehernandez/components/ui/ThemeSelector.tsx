"use client";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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

  function toggleTheme(): void {
    disableTransitionsTemporarily();

    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const button = buttonRef.current;

    // Fallback: sin View Transitions API o reduced motion → cambio directo
    if (
      !button ||
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // Círculo que crece desde el botón del tema (View Transitions API)
    const { top, left, width, height } = button.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 600,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
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
