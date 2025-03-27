"use client";
import { languages } from "@/app/i18n/settings";
import { classNames } from "@/utils/tools";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguageChange } from "@/hooks/useLanguageChange";
import { usePathname } from "next/navigation";
import { JSX } from "react";

export default function TranslateSelector(): JSX.Element {
  const pathname = usePathname();
  const { changeLanguage } = useLanguageChange();
  const currentLang = pathname.split('/')[1];

  return (
    <>
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-sm transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20">
              <LanguageIcon
                className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 [@media(prefers-color-scheme:dark)]:fill-cyan-50 [@media(prefers-color-scheme:dark)]:stroke-cyan-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-cyan-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-cyan-600"
              />
            </PopoverButton>
            <AnimatePresence>
              {open && (
                <PopoverPanel
                  static
                  as={motion.div}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  anchor="bottom"
                  className="flex origin-top flex-col bg-white dark:bg-black/90 z-30 mt-2 rounded-2xl p-1.5"
                >
                  {languages.map((lang) => (
                    <div
                      key={lang}
                      className={classNames(
                        "flex flex-col px-2.5 py-1.5 rounded-xl cursor-pointer",
                        currentLang === lang ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      )}
                      onClick={() => changeLanguage(lang)}
                    >
                      <span className="text-sm/6 text-principal dark:text-white">
                        {lang.toLocaleUpperCase()}
                      </span>
                    </div>
                  ))}
                </PopoverPanel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
    </>
  );
}
