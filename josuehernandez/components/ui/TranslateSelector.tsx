"use client";

import { languages } from "@/app/i18n/settings";
import { useLanguage } from "@/contexts/LanguageContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export default function TranslateSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const { lng, changeLanguage } = useLanguage();

  const handleLanguageChange = (language: string) => {
    // Si el idioma seleccionado es el mismo que el actual, no hacer nada
    if (language === lng) {
      return;
    }
    
    // Cambiar el idioma en el contexto
    changeLanguage(language);
    
    // Navegar a la nueva URL con el idioma actualizado
    router.push(`/${language}${pathname.slice(3)}`);
  };

  return (
    <>
      <Popover>
        {({ open, close }) => (
          <>
            <PopoverButton className="z-10 group rounded-full bg-white/90 px-3 py-2 shadow-lg  backdrop-blur transition dark:bg-black/90 dark:ring-principal-dark/10 dark:hover:ring-principal-dark/20 dark:hover:bg-black/50 hover:cursor-pointer">
              <LanguageIcon className="h-6 w-6 stroke-zinc-400 dark:stroke-zinc-100 transition hover:stroke-zinc-500" />
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
                  className="flex origin-top flex-col bg-white dark:bg-black z-30 mt-2 rounded-2xl shadow-lg  backdrop-blur px-2 py-2"
                >
                  {languages.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col px-2.5 py-1.5 rounded-2xl hover:bg-black/10"
                    >
                      <button
                        onClick={() => {
                          handleLanguageChange(item);
                          close();
                        }}
                        className={`font-medium text-sm text-principal-dark dark:text-white cursor-pointer ${
                          item === lng ? "font-bold" : ""
                        }`}
                      >
                        {item.toLocaleUpperCase()}
                      </button>
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
