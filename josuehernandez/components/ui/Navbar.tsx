"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import TranslateSelector from "./TranslateSelector";
import ThemeSelector from "./ThemeSelector";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslationWithContext } from "@/contexts/LanguageContext";
import { classNames } from "@/utils/tools";
import { navigation } from "@/constants/navigation";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/public/photos/avatar.webp";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { t, lng } = useTranslationWithContext("navbar");

  // Verificar si estamos en la página principal
  const isHomePage = pathname === `/${lng}` || pathname === `/${lng}/`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all ${
        scrolled ? "backdrop-blur bg-black/20" : ""
      }`}
    >
      <div className="w-full px-2 sm:px-6 lg:px-8 mx-0">
        <div className="relative flex h-16 items-center justify-between z-50 max-w-7xl mx-auto py-4">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="relative rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 backdrop-blur transition dark:bg-principal-dark/90 dark:ring-principal-dark/10 dark:hover:ring-principal-dark/20 dark:hover:bg-principal-dark/50  hover:cursor-pointer"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">{t("title")}</span>
              {isSidebarOpen ? (
                <XMarkIcon
                  className="block h-6 w-6 stroke-zinc-400 dark:stroke-zinc-100 transition hover:stroke-zinc-500"
                  aria-hidden="true"
                />
              ) : (
                <Bars3Icon
                  className="block h-6 w-6 stroke-zinc-400 dark:stroke-zinc-100 transition hover:stroke-zinc-500"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <div className="flex flex-shrink-0 items-center md:mr-2">
              <Link href={"/"}>
                <Image
                  src={Avatar}
                  alt="logo"
                  className="rounded-full h-12 w-12"
                />
              </Link>
            </div>
            {/* Navegación desktop */}
            <div className="hidden sm:block">
              <div className="flex gap-x-4">
                {navigation.map(
                  (item) =>
                    item.isVisibleDesktop === true && (
                      <a
                        key={item.name}
                        href={`/${lng}${item.href}`}
                        className={classNames(
                          " hover:bg-secundary/80 hover:text-white rounded-lg px-3 py-2 font-medium text-lg",
                          scrolled
                            ? "text-white"
                            : isHomePage
                            ? "text-white"
                            : "text-principal-dark dark:text-white"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {t(item.name)}
                      </a>
                    )
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-1">
            <TranslateSelector />
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dialog */}
      <Dialog
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        as="div"
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

        <div className="fixed inset-0 z-50 overflow-hidden">
          <DialogPanel>
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
                <div
                  className="pointer-events-auto w-screen max-w-xs transform transition duration-300 ease-in-out"
                  style={{
                    transform: isSidebarOpen
                      ? "translateX(0)"
                      : "translateX(-100%)",
                  }}
                >
                  <div className="flex h-full flex-col overflow-y-scroll bg-principal dark:bg-principal-dark shadow-xl">
                    <div className="px-4 py-6">
                      <div className="flex items-center justify-between mb-4">
                        <DialogTitle className="text-xl font-bold text-secundary-dark dark:text-white">
                          Menú
                        </DialogTitle>
                        <button
                          type="button"
                          className="rounded-md bg-principal dark:bg-principal-dark text-secundary-dark dark:text-white hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <span className="sr-only">Cerrar menú</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <div>
                        <ul className="space-y-2">
                          {navigation.map(
                            (item, index) =>
                              item.isVisibleMobile && (
                                <motion.li
                                  key={item.name}
                                  initial={{ opacity: 0, x: -50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <a
                                    href={`/${lng}${item.href}`}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-secundary-dark dark:text-white hover:bg-principal-dark/10 dark:hover:bg-gray-700/50 transition-colors"
                                    onClick={() => setIsSidebarOpen(false)}
                                  >
                                    {t(item.name)}
                                  </a>
                                </motion.li>
                              )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </nav>
  );
}
