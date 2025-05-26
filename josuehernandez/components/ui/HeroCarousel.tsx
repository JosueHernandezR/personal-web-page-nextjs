"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { FadeIn } from "./Fade";
import SocialLink from "./SocialLinks";
import { socialLinks } from "@/constants/social_links";
import {
  GitHubIcon,
  GoogleScholarIcon,
  LinkedInIcon,
  TwitterIcon,
} from "../icons/SocialIcons";
import LoadingSkeleton from "./LoadingSkeleton";

interface SocialLink {
  name: string;
  url: string;
}

interface HeroCarouselProps {
  images: { src: string; blurDataURL?: string }[];
  titles: string[];
  descriptions: string[];
  buttonText: string;
  buttonTexts?: string[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  images,
  titles,
  descriptions,
  // buttonText,
  // buttonTexts,
  autoPlayInterval = 5000,
}: HeroCarouselProps) {
  // Simplificado para evitar loop infinito
  const [isLoading, setIsLoading] = useState(true);

  // Referencias y estados
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Detectar si estamos en móvil o desktop
  useEffect(() => {
    setIsMounted(true);
    setIsLoading(false); // Simplificado
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Lógica de scroll para efecto en móvil
  const handleScroll = useCallback(() => {
    if (!heroRef.current || !isMobile || isScrollingRef.current) return;

    // Limpiar el timeout anterior si existe
    if (scrollTimeoutRef.current) {
      window.cancelAnimationFrame(scrollTimeoutRef.current);
    }

    isScrollingRef.current = true;

    // Usar RAF para la animación
    scrollTimeoutRef.current = window.requestAnimationFrame(() => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const scrollRange = rect.height * 0.25;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));

      setScrollProgress(progress);

      // Establecer un timeout para permitir más actualizaciones después de un breve retraso
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 50);
    });
  }, [isMobile]);

  useEffect(() => {
    if (!isMounted || !isMobile) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        window.cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, [isMounted, isMobile, handleScroll]);

  // Lógica del carrusel
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  // Autoplay
  useEffect(() => {
    if (autoPlayInterval <= 0 || !isMounted) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval, isMounted]);

  // Manejo táctil (swipe)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const difference = touchStart - touchEnd;
    if (Math.abs(difference) > 100) {
      if (difference > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  // Cálculos para las transformaciones basadas en el scroll (solo móvil)
  const containerStyle = useCallback(
    () => ({
      borderRadius: `${Math.max(0, 32 - scrollProgress * 32)}px`,
      marginLeft: `${Math.max(0, 20 - scrollProgress * 20)}px`,
      marginRight: `${Math.max(0, 20 - scrollProgress * 20)}px`,
      marginTop: `${Math.max(0, 64 - scrollProgress * 64)}px`,
      width: `calc(100% - ${Math.max(0, 20 - scrollProgress * 20) * 2}px)`,
      height: `calc(100vh)`,
      minHeight: "600px",
      transition: "all 0.1s ease-out",
      overflow: "hidden",
      position: "relative" as const,
    }),
    [scrollProgress]
  ) as () => React.CSSProperties;

  // Mostrar skeleton mientras las imágenes cargan
  if (!isMounted || isLoading) {
    return <LoadingSkeleton variant="carousel" />;
  }

  return (
    <div className="w-full relative overflow-hidden" style={{ height: "100vh", minHeight: "600px" }}>
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
          ...(isMobile ? containerStyle() : {})
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Preconnect para recursos externos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Placeholder para reservar espacio */}
        <div className="absolute inset-0 bg-gray-900" style={{ height: "100%", width: "100%" }} />
        
        {/* Imágenes del carrusel con optimizaciones */}
        {images.map(({ src, blurDataURL }, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out
              ${
                index === currentIndex
                  ? "opacity-100 z-0 translate-x-0"
                  : "opacity-0 -z-10"
              }
              ${!isMobile && index < currentIndex ? "-translate-x-full" : ""}
              ${!isMobile && index > currentIndex ? "translate-x-full" : ""}
            `}
            style={{ height: "100%", position: "absolute", overflow: "hidden" }}
          >
            <Image
              src={src}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0} // Solo la primera imagen con priority
              loading={index === 0 ? "eager" : "lazy"} // Lazy loading para el resto
              sizes="100vw"
              placeholder={blurDataURL ? "blur" : "empty"}
              blurDataURL={blurDataURL}
              quality={index === 0 ? 85 : 75} // Mayor calidad solo para la primera imagen
              onLoad={() => {
                // Precargar la siguiente imagen
                if (index === currentIndex && index < images.length - 1) {
                  const nextImage = new window.Image();
                  nextImage.src = images[index + 1].src;
                }
              }}
            />
            {/* Overlay oscuro uniforme para toda la imagen */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* Overlay con textos y botón - Rediseñado */}
        <div
          className={`absolute inset-0 z-10 p-6 md:p-8 lg:p-12 md:mt-[64px]
          ${
            isMobile
              ? "flex flex-col justify-start items-start"
              : "flex flex-col lg:items-start lg:justify-start lg:pt-16"
          }`}
        >
          <div
            className={`
            ${
              isMobile
                ? "w-full pr-16 pt-8"
                : "max-w-2xl pr-20 lg:max-w-3xl lg:pl-20 lg:pr-12 lg:text-left"
            }`}
          >
            {/* Título principal */}
            <FadeIn>
              <h1
                className={`font-medium leading-none tracking-tight font-geist text-white mb-3 md:mb-4 ${"text-6xl lg:text-7xl xl:text-8xl lg:text-left"}`}
              >
                {titles[currentIndex]}
              </h1>
            </FadeIn>

            {/* Descripción */}
            <FadeIn>
              <p
                className={`text-white/90 font-inter text-xl lg:text-2xl text-left ${
                  isMobile
                    ? " mb-8 text-lg"
                    : "mb-8 max-w-xl lg:max-w-2xl lg:ml-auto"
                }`}
              >
                {descriptions[currentIndex]}
              </p>
            </FadeIn>
            <div className="mt-6 flex flex-row gap-x-6">
              {socialLinks.map((socialLink: SocialLink, index: number) => (
                <SocialLink
                  key={index}
                  href={socialLink.url}
                  icon={
                    socialLink.name === "github"
                      ? GitHubIcon
                      : socialLink.name === "linkedin"
                      ? LinkedInIcon
                      : socialLink.name === "twitter"
                      ? TwitterIcon
                      : GoogleScholarIcon
                  }
                />
              ))}
              {/* <FadeIn>
                <a
                  href={t("resume")}
                  download
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <DownloadFileIcon className="h-8 w-8 fill-white transition group-hover:fill-zinc-100" />
                  <span className="sr-only">Descargar CV</span>
                </a>
              </FadeIn> */}
            </div>

            {/* Botón */}
            {/* <FadeIn>
              <div className="text-left">
                <Link href='/booking' className={`bg-secundary-dark hover:bg-secundary-dark/90 rounded-full shadow-lg ${
                  isMobile ? 'text-white px-6 py-3 text-base font-medium' : 
                  'text-gray-100 px-6 py-3 lg:px-8 lg:py-4 text-lg lg:text-xl font-medium'}`}>
                  {buttonTexts && buttonTexts[currentIndex] ? buttonTexts[currentIndex] : buttonText}
                </Link>
              </div>
            </FadeIn> */}
          </div>
        </div>

        {/* Controles de navegación - Solo en desktop */}
        {!isMobile && (
          <>
            <div className="absolute inset-y-0 left-4 flex items-center z-20">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                aria-label="Ir a la imagen anterior del carrusel"
                type="button"
              >
                <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center z-20">
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                aria-label="Ir a la siguiente imagen del carrusel"
                type="button"
              >
                <ChevronRightIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </>
        )}

        {/* Indicadores de slides (puntos) con mejor accesibilidad */}
        <div 
          className="absolute bottom-8 right-6 md:right-12 z-20 px-6 md:px-12 xl:px-16"
          role="tablist"
          aria-label="Navegación del carrusel"
        >
          <div className="flex space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                role="tab"
                type="button"
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }}
                className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 ${
                  index === currentIndex 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Ir a la imagen ${index + 1} de ${images.length}`}
                aria-selected={index === currentIndex}
                tabIndex={index === currentIndex ? 0 : -1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
