"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import TranslateSelector from "./TranslateSelector";
import ThemeSelector from "./ThemeSelector";
import { usePathname } from "next/navigation";
import { useTranslationWithContext } from "@/contexts/LanguageContext";
import { classNames } from "@/utils/tools";
import { navigation } from "@/constants/navigation";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/public/photos/avatar.webp";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { t, lng } = useTranslationWithContext("navbar");

  // Referencias del menú móvil (overlay custom controlado por GSAP)
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSidebarOpen]);

  // Bloquear el scroll del body mientras el menú está abierto
  useEffect(() => {
    if (!isSidebarOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isSidebarOpen]);

  // Enfocar el panel al abrir para gestión básica de foco
  useEffect(() => {
    if (isSidebarOpen) {
      panelRef.current?.focus();
    }
  }, [isSidebarOpen]);

  // Timeline de apertura/cierre con GSAP: backdrop fade + panel slide + items stagger
  useGSAP(
    () => {
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      if (!backdrop || !panel) return;

      if (isSidebarOpen) {
        // Apertura
        gsap
          .timeline()
          .to(backdrop, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
          .fromTo(
            panel,
            { xPercent: -100, x: 0 },
            { xPercent: 0, x: 0, duration: 0.6, ease: "power3.out" },
            "<",
          )
          .fromTo(
            panel.querySelectorAll(".menu-item"),
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.08,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.25",
          );
      } else {
        // Cierre
        gsap
          .timeline()
          .to(panel.querySelectorAll(".menu-item"), {
            opacity: 0,
            x: -16,
            stagger: 0.04,
            duration: 0.2,
            ease: "power2.in",
          })
          .to(
            panel,
            { xPercent: -100, x: 0, duration: 0.5, ease: "power3.in" },
            "-=0.1",
          )
          .to(
            backdrop,
            { autoAlpha: 0, duration: 0.35, ease: "power2.out" },
            "<",
          );
      }
    },
    { dependencies: [isSidebarOpen] },
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-md bg-black/20"
            : "backdrop-blur-none bg-transparent"
        }`}
      >
        <div className="w-full px-2 sm:px-6 lg:px-8 mx-0">
          <div className="relative flex h-16 items-center justify-between z-50 max-w-7xl mx-auto py-4">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="relative rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 backdrop-blur transition dark:bg-black/90 dark:ring-principal-dark/10 dark:hover:ring-principal-dark/20 dark:hover:bg-black/50  hover:cursor-pointer"
              >
                <span className="absolute -inset-0.5" />
                <span className="relative block h-6 w-6">
                  <XMarkIcon
                    className={`absolute inset-0 h-6 w-6 stroke-zinc-400 dark:stroke-zinc-100 transition-all duration-300 ease-out ${
                      isSidebarOpen
                        ? "rotate-0 scale-100 opacity-100"
                        : "rotate-90 scale-50 opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                  <Bars3Icon
                    className={`absolute inset-0 h-6 w-6 stroke-zinc-400 dark:stroke-zinc-100 transition-all duration-300 ease-out ${
                      isSidebarOpen
                        ? "-rotate-90 scale-50 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:justify-start">
              <div className="flex shrink-0 items-center md:mr-2">
                <Link href={`/${lng}`}>
                  <Image
                    src={Avatar}
                    alt="logo"
                    className="rounded-full h-12 w-12"
                    loading="eager"
                  />
                </Link>
              </div>
              {/* Navegación desktop */}
              <div className="hidden sm:block">
                <div className="flex gap-x-4">
                  {navigation.map(
                    (item) =>
                      item.isVisibleDesktop === true && (
                        <Link
                          key={item.name}
                          href={`/${lng}${item.href}`}
                          prefetch
                          className={classNames(
                            " hover:bg-secundary/80 hover:text-white rounded-lg px-3 py-2 font-medium text-lg transition-colors duration-500",
                            scrolled
                              ? "text-white"
                              : isHomePage
                                ? "text-white"
                                : "text-principal-dark dark:text-white",
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {t(item.name)}
                        </Link>
                      ),
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
      </nav>

      {/* Mobile menu overlay — overlay propio controlado por GSAP */}
      <div
        className={`fixed inset-0 z-50 ${isSidebarOpen ? "" : "pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
      >
        {/* Backdrop con fade — scrim oscuro con blur sutil */}
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0"
          onClick={() => setIsSidebarOpen(false)}
        />
        {/* Panel lateral con slide suave (inicia fuera de pantalla con CSS) */}
        <div
          ref={panelRef}
          tabIndex={-1}
          data-lenis-prevent
          className="absolute inset-y-0 left-0 w-screen max-w-xs bg-white dark:bg-black shadow-xl -translate-x-full outline-none"
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-secundary-dark dark:text-white">
                  Menú
                </h2>
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-black text-secundary-dark dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="sr-only">Cerrar menú</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <ul className="space-y-2">
                  {navigation.map(
                    (item) =>
                      item.isVisibleMobile && (
                        <li key={item.name} className="menu-item">
                          <Link
                            href={`/${lng}${item.href}`}
                            prefetch
                            className="block px-3 py-2 rounded-md text-base font-medium text-secundary-dark dark:text-white transition-all duration-200 hover:translate-x-1 hover:bg-black/10 dark:hover:bg-gray-700/50"
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            {t(item.name)}
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
