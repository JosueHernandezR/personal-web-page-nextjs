import { useEffect, useCallback, useState } from 'react';

interface ImagePreloaderOptions {
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

export function useImagePreloader(
  imageSources: string[], 
  options: ImagePreloaderOptions = {}
) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const preloadImage = useCallback((src: string, index: number = 0) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Optimizar para diferentes formatos
      if (options.format === 'webp' && src.includes('.jpg')) {
        img.src = src.replace('.jpg', '.webp');
      } else if (options.format === 'avif' && src.includes('.jpg')) {
        img.src = src.replace('.jpg', '.avif');
      } else {
        img.src = src;
      }

      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(src));
        resolve();
      };

      img.onerror = () => {
        // Fallback a formato original si falla
        if (options.format && src !== img.src) {
          img.src = src;
        } else {
          reject(new Error(`Failed to load image: ${src}`));
        }
      };

      // Priorizar las primeras imágenes
      if (options.priority && index === 0) {
        img.fetchPriority = 'high';
      }
    });
  }, [options.format, options.priority]);

  useEffect(() => {
    if (imageSources.length === 0) {
      setIsLoading(false);
      return;
    }

    const loadImages = async () => {
      setIsLoading(true);
      
      try {
        // Cargar la primera imagen inmediatamente
        if (imageSources[0]) {
          await preloadImage(imageSources[0], 0);
        }

        // Cargar el resto con un pequeño delay para no bloquear
        const remainingImages = imageSources.slice(1);
        
        for (let i = 0; i < remainingImages.length; i++) {
          setTimeout(() => {
            preloadImage(remainingImages[i], i + 1).catch(console.error);
          }, i * 100); // 100ms entre cada imagen
        }
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [imageSources.join(','), options.format, options.priority]); // Evitar dependencia circular

  return {
    loadedImages,
    isLoading,
    isImageLoaded: (src: string) => loadedImages.has(src),
    preloadImage
  };
}

export default useImagePreloader; 