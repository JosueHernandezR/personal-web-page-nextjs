import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'carousel' | 'card' | 'text' | 'image';
  className?: string;
  children?: React.ReactNode;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'text', 
  className = '',
  children 
}) => {
  const baseClasses = "animate-pulse bg-gray-700 rounded-lg";
  
  switch (variant) {
    case 'carousel':
      return (
        <div 
          className={`w-full relative overflow-hidden bg-gray-900 ${className}`}
          style={{ height: "100vh", minHeight: "600px" }}
          role="status"
          aria-label="Cargando contenido del carrusel"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 z-10 p-6 md:p-8 lg:p-12 md:mt-[64px] flex flex-col justify-start items-start">
            <div className="w-full pr-16 pt-8">
              {/* Título skeleton */}
              <div className={`h-16 ${baseClasses} mb-4 w-3/4`}></div>
              {/* Descripción skeleton */}
              <div className={`h-6 ${baseClasses} mb-2 w-1/2`}></div>
              <div className={`h-6 ${baseClasses} mb-8 w-2/3`}></div>
              {/* Iconos sociales skeleton */}
              <div className="flex gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-8 h-8 ${baseClasses.replace('rounded-lg', 'rounded-full')}`}></div>
                ))}
              </div>
            </div>
          </div>
          {/* Indicadores skeleton */}
          <div className="absolute bottom-8 right-6 md:right-12 z-20 px-6 md:px-12 xl:px-16">
            <div className="flex space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-3 h-3 ${baseClasses.replace('rounded-lg', 'rounded-full')}`}></div>
              ))}
            </div>
          </div>
        </div>
      );
      
    case 'card':
      return (
        <div className={`${baseClasses} p-6 ${className}`} role="status" aria-label="Cargando tarjeta">
          <div className={`h-4 ${baseClasses} mb-4 w-3/4`}></div>
          <div className={`h-4 ${baseClasses} mb-2 w-1/2`}></div>
          <div className={`h-4 ${baseClasses} w-2/3`}></div>
          {children}
        </div>
      );
      
    case 'image':
      return (
        <div 
          className={`${baseClasses} aspect-video ${className}`}
          role="status"
          aria-label="Cargando imagen"
        >
          {children}
        </div>
      );
      
    case 'text':
    default:
      return (
        <div className={`${baseClasses} h-4 ${className}`} role="status" aria-label="Cargando texto">
          {children}
        </div>
      );
  }
};

export default LoadingSkeleton; 