import { MoonIcon, SunIcon } from "./Icons";

interface ModeToggleProps {
  onClick: () => void;
}

export function ModeToggle({ onClick }: ModeToggleProps) {
  function disableTransitionsTemporarily() {
    document.documentElement.classList.add("[&_*]:!transition-none");
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }

  function toggleMode() {
    disableTransitionsTemporarily();

    let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let isSystemDarkMode = darkModeMediaQuery.matches;
    let isDarkMode = document.documentElement.classList.toggle("dark");

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode.toString();
    }

    onClick();
  }

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
      onClick={toggleMode}
    >
      <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600" />
      <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500" />
    </button>
  );
}

export function clamp(number: number, a: number, b: number) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
}
