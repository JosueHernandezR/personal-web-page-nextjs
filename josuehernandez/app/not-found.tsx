import { cookies } from 'next/headers'
import { fallbackLng, cookieName, languages } from './i18n/settings'
import ClientThemeProvider from './[lng]/theme_provider'
import { Footer, Header } from '@/components'
import { NotFoundPage } from '@/components/NotFoundPage'
import { dir } from 'i18next'

// Usamos una función asíncrona para poder usar await con cookies()
export default async function NotFound() {
  // Obtener el idioma de la cookie o usar el predeterminado
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get(cookieName)?.value
  const lng = cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng
  
  return (
    <ClientThemeProvider>
      <div className="relative" dir={dir(lng)}>
        <Header />
        <NotFoundPage lng={lng} />
        <Footer />
      </div>
    </ClientThemeProvider>
  )
} 