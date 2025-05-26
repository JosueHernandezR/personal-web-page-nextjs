'use client';

import { useEffect, useState, createContext, useContext } from 'react';

interface ReCaptchaContextType {
  executeRecaptcha: (action: string) => Promise<string | null>;
  isLoaded: boolean;
}

const ReCaptchaContext = createContext<ReCaptchaContextType>({
  executeRecaptcha: async () => null,
  isLoaded: false,
});

export const useReCaptcha = () => useContext(ReCaptchaContext);

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReCaptchaWrapperProps {
  children: React.ReactNode;
  siteKey: string;
}

export function ReCaptchaWrapper({ children, siteKey }: ReCaptchaWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Verificar si el script ya está cargado
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    const loadRecaptchaScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            setIsLoaded(true);
          });
        }
      };
      script.onerror = () => {
        console.error('Error al cargar reCAPTCHA');
      };
      document.head.appendChild(script);
    };

    loadRecaptchaScript();

    // Cleanup
    return () => {
      const script = document.querySelector(
        `script[src="https://www.google.com/recaptcha/api.js?render=${siteKey}"]`
      );
      if (script) {
        document.head.removeChild(script);
      }
      
      // Remover badge si existe
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA no está listo');
      return null;
    }

    try {
      return await window.grecaptcha.execute(siteKey, { action });
    } catch (error) {
      console.error('Error ejecutando reCAPTCHA:', error);
      return null;
    }
  };

  const contextValue: ReCaptchaContextType = {
    executeRecaptcha,
    isLoaded,
  };

  return (
    <ReCaptchaContext.Provider value={contextValue}>
      {children}
    </ReCaptchaContext.Provider>
  );
} 