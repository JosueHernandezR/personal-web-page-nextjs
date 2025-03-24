import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookieName, fallbackLng, languages } from "./app/i18n/settings";
import acceptLanguage from "accept-language";

// Configurar los idiomas soportados una sola vez
acceptLanguage.languages(languages);

// Constantes
const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = [
  "api",
  "_next/static",
  "_next/image",
  "assets",
  "favicon.ico",
  "sw.js",
  "icon",
  "chrome"
];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"]
};

export function middleware(req: NextRequest) {
  // Comprobar si la ruta debe ser excluida
  const pathname = req.nextUrl.pathname;
  
  if (EXCLUDED_PATHS.some(path => pathname.includes(path))) {
    return NextResponse.next();
  }

  // Comprobar si es un archivo público
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // Determinar el idioma
  let lng = null;

  // 1. Intentar obtener el idioma de la cookie
  const cookie = req.cookies.get(cookieName);
  if (cookie) {
    lng = acceptLanguage.get(cookie.value);
  }

  // 2. Intentar obtener el idioma del header Accept-Language
  if (!lng) {
    const acceptLangHeader = req.headers.get("Accept-Language");
    lng = acceptLangHeader ? acceptLanguage.get(acceptLangHeader) : null;
  }

  // 3. Usar idioma por defecto si no se encontró ninguno
  lng = lng || fallbackLng;

  // Verificar si estamos en la raíz y redirigir
  if (pathname === '/') {
    const newUrl = new URL(`/${lng}`, req.url);
    return NextResponse.redirect(newUrl);
  }

  // Verificar si ya estamos en una ruta con idioma
  const pathnameHasLang = languages.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (!pathnameHasLang) {
    // Redirigir a la ruta con el idioma
    const newUrl = new URL(`/${lng}${pathname}`, req.url);
    return NextResponse.redirect(newUrl);
  }

  // Manejar el referer para mantener consistencia en la navegación
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const lngInReferer = languages.find(l =>
        refererUrl.pathname.startsWith(`/${l}`)
      );
      if (lngInReferer) {
        const response = NextResponse.next();
        response.cookies.set(cookieName, lngInReferer);
        return response;
      }
    } catch (error) {
      console.error('Error parsing referer URL:', error);
    }
  }

  // Si llegamos aquí, continuar normalmente
  const response = NextResponse.next();
  response.cookies.set(cookieName, lng);
  return response;
}