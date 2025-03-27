import { cookies } from 'next/headers'
import { fallbackLng, cookieName, languages } from '../i18n/settings'
import ClientThemeProvider from '../[lng]/theme_provider'
import { Footer, Header } from '@/components'
import { NotFoundPage } from '@/components/NotFoundPage'
import { dir } from 'i18next'

interface CatchAllProps {
  params: {
    slug: string[]
  }
}

// Este componente captura todas las rutas que no coinciden con ninguna otra ruta
export default async function CatchAll({ params }: CatchAllProps) {
  // Detectar el idioma y mostrar la página 404 adecuada
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get(cookieName)?.value
  
  // Usar el fallback si no hay cookie o el idioma no está soportado
  const lng = cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng
  
  // Construir la URL original
  const originalPath = `/${params.slug.join('/')}`

  return (
    <ClientThemeProvider>
      <div className="relative" dir={dir(lng)}>
        <Header />
        <NotFoundPage 
          lng={lng} 
          customMessage={{
            title: "Página no encontrada",
            description: `La página "${originalPath}" no existe. Es posible que la URL sea incorrecta o que la página se haya movido.`,
            goBack: "Volver al inicio",
            goBackPrevious: "Volver a la página anterior"
          }}
        />
        <Footer />
      </div>
    </ClientThemeProvider>
  )
} 