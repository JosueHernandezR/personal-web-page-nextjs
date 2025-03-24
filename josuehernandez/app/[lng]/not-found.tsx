import { Container } from '@/components/Container'
import Link from 'next/link'
import { getServerTranslation } from '../i18n'

interface PageProps {
  params?: {
    lng: string;
  };
}

export default async function NotFound({ params }: PageProps) {
  // Usa un valor predeterminado si params o params.lng no están disponibles
  const lng = params?.lng || 'en'; // 'en' como idioma predeterminado
  const t = await getServerTranslation(lng);
  
  return (
    <div className="bg-orange-100 dark:bg-amber-900 min-h-screen flex items-center">
      <Container className="flex h-full items-center pt-16 sm:pt-32">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-zinc-400 dark:text-zinc-500">
            404
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {t('notFound.title')}
          </h1>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            {t('notFound.description')}
          </p>
          <Link href={`/${lng}`} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            {t('notFound.goBack')}
          </Link>
        </div>
      </Container>
    </div>
  )
}