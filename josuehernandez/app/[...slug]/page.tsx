import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { fallbackLng, cookieName, languages } from '../i18n/settings'

// Este componente captura todas las rutas que no coinciden con ninguna otra ruta
export default async function CatchAll() {
  // Detectar el idioma y mostrar la página 404 adecuada
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get(cookieName)?.value
  
  // Usar el fallback si no hay cookie o el idioma no está soportado
  const lng = cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng
  
  // Mostrar la página not-found
  return notFound()
} 