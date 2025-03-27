import { Container } from '@/components/Container'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { fallbackLng, cookieName, languages } from './i18n/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ClientThemeProvider from './[lng]/theme_provider'

// Usamos una función asíncrona para poder usar await con cookies()
export default async function NotFound() {
  // Obtener el idioma de la cookie o usar el predeterminado
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get(cookieName)?.value
  const lng = cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng
  
  // Mensajes por idioma
  const messages = {
    es: {
      title: "Página no encontrada",
      description: "Lo sentimos, no pudimos encontrar la página que estás buscando.",
      goBack: "Volver al inicio"
    },
    en: {
      title: "Page not found",
      description: "Sorry, we couldn't find the page you're looking for.",
      goBack: "Go back home"
    },
    fr: {
      title: "Page non trouvée",
      description: "Désolé, nous n'avons pas pu trouver la page que vous cherchez.",
      goBack: "Retour à l'accueil"
    }
  }
  
  // Obtener mensajes según el idioma
  const t = messages[lng as keyof typeof messages]
  
  return (
    <ClientThemeProvider>
      <div className="relative">
        <Header />
        <div className="bg-orange-100 dark:bg-amber-900 min-h-screen flex items-center">
          <Container className="flex h-full items-center pt-16 sm:pt-32">
            <div className="flex flex-col items-center">
              <p className="text-base font-semibold text-zinc-400 dark:text-zinc-500">
                404
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                {t.title}
              </h1>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                {t.description}
              </p>
              <Link href={`/${lng}`} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
                {t.goBack}
              </Link>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    </ClientThemeProvider>
  )
} 