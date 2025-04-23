'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
// import Link from "next/link";
import { FadeIn } from "./Fade";

interface HeroCarouselProps {
  images: string[];
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
  autoPlayInterval = 5000
}: HeroCarouselProps) {
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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, [isMounted, isMobile, handleScroll]);
  
  // Lógica del carrusel
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
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
  const containerStyle = useCallback(() => ({
    borderRadius: `${Math.max(0, 32 - (scrollProgress * 32))}px`,
    marginLeft: `${Math.max(0, 20 - (scrollProgress * 20))}px`,
    marginRight: `${Math.max(0, 20 - (scrollProgress * 20))}px`,
    marginTop: `${Math.max(0, 64 - (scrollProgress * 64))}px`,
    width: `calc(100% - ${Math.max(0, 20 - (scrollProgress * 20)) * 2}px)`,
    height: `calc(100vh)`,
    minHeight: '600px',
    transition: 'all 0.1s ease-out',
    overflow: 'hidden',
    position: 'relative' as const,
  }), [scrollProgress]) as () => React.CSSProperties;

  if (!isMounted) return null;

  return (
    <div className="w-full relative overflow-hidden">
      <div 
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={isMobile ? containerStyle() : {
          height: '100vh',
          minHeight: '600px',
          position: 'relative'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imágenes del carrusel */}
        {images.map((src, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out
              ${index === currentIndex ? 'opacity-100 z-0 translate-x-0' : 'opacity-0 -z-10'}
              ${!isMobile && index < currentIndex ? '-translate-x-full' : ''}
              ${!isMobile && index > currentIndex ? 'translate-x-full' : ''}
            `}
            style={{ height: '100%', position: 'absolute', overflow: 'hidden' }}
          >
            <Image
              src={src}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Overlay oscuro uniforme para toda la imagen */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}
        
        {/* Overlay con textos y botón - Rediseñado */}
        <div className={`absolute inset-0 z-10 p-6 md:p-8 lg:p-12 md:mt-[64px]
          ${isMobile ? 'flex flex-col justify-start items-start' : 
          'flex flex-col lg:items-start lg:justify-start lg:pt-16'}`}>
          <div className={`
            ${isMobile ? 'w-full pr-16 pt-8' : 
            'max-w-2xl pr-20 lg:max-w-3xl lg:pl-20 lg:pr-12 lg:text-left'}`}>
            
            {/* Título principal */}
            <FadeIn>
              <h1 className={`font-medium leading-none tracking-tight font-geist text-white mb-3 md:mb-4 ${
                'text-6xl lg:text-7xl xl:text-8xl lg:text-left'}`}>
                {titles[currentIndex]}
              </h1>
            </FadeIn>
            
            {/* Descripción */}
            <FadeIn>
              <p className={`text-white/90 font-inter text-xl lg:text-2xl text-left ${
                isMobile ? ' mb-8 text-lg' : 
                'mb-8 max-w-xl lg:max-w-2xl lg:ml-auto'}`}>
                {descriptions[currentIndex]}
              </p>
            </FadeIn>
            
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
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center z-20">
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
        
        {/* Indicador de slide en la parte inferior izquierda */}
        {/* <div className="absolute bottom-8 left-6 md:left-12 z-20">
          <div className="flex items-center space-x-2">
            <div className="bg-black/30 rounded-full p-1 backdrop-blur-sm">
              <span className="text-white/90 text-sm font-medium">
                {String(currentIndex + 1)}
              </span>
            </div>
            <span className="text-white/90 text-sm">
              {titles[currentIndex].split(' ')[0]} {titles[currentIndex].split(' ')[1] || ''}
            </span>
          </div>
        </div> */}
        
        {/* Indicadores de slides (puntos) */}
        <div className="absolute bottom-8 right-6 md:right-12 z-20 px-6 md:px-12 xl:px-16">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}