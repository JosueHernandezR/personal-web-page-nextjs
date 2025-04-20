"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "../icons/ThemeIcons";

export default function ThemeSelector() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("[&_*]:!transition-none");
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }

  function toggleTheme(): void {
    disableTransitionsTemporarily();
    if (currentTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
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
      type="button"
      aria-label="Toggle dark mode"
      className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 backdrop-blur transition dark:bg-black/90 dark:ring-principal-dark/10 dark:hover:ring-principal-dark/20 dark:hover:bg-black/50  hover:cursor-pointer"
      onClick={toggleTheme}
    >
      <div className="relative h-6 w-6">
        <div 
          className={`absolute inset-0 transform transition-transform duration-500 ${
            currentTheme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
          }`}
        >
          <MoonIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-400 transition group-hover:stroke-zinc-200 group-hover:fill-slate-200" />
        </div>
        <div 
          className={`absolute inset-0 transform transition-transform duration-500 ${
            currentTheme === 'dark' ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        >
          <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-400 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-500" />
        </div>
      </div>
    </button>
  );
}