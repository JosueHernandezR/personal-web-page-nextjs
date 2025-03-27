'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { cookieName } from '@/app/i18n/settings';

export function useLanguageChange() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = useCallback(async (newLang: string) => {
    // Obtener el idioma actual de la URL
    const currentLang = pathname.split('/')[1];
    
    // Si el nuevo idioma es el mismo que el actual, no hacer nada
    if (currentLang === newLang) {
      return;
    }

    // Actualizar la cookie
    document.cookie = `${cookieName}=${newLang};path=/;max-age=31536000`;
    
    // Si estamos en la raíz o en una ruta con idioma
    if (pathname === '/' || /^\/[a-z]{2}$/.test(pathname)) {
      // Redirigir directamente a la página principal del nuevo idioma
      window.location.href = `/${newLang}`;
      return;
    }
    
    // Para otras rutas, mantener la ruta actual pero cambiar el idioma
    const basePath = pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLang}${basePath}`;
    window.location.href = newPath;
  }, [pathname]);

  return { changeLanguage };
} 