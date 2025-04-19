import { cookies } from 'next/headers';
import { fallbackLng, cookieName, languages } from '../../i18n/settings';
import ClientThemeProvider from '../theme_provider';
import { Footer, Header } from '@/components';
import { NotFoundPage } from '@/components/NotFoundPage';
import { dir } from 'i18next';

export default async function BlogNotFound() {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(cookieName)?.value;
  const lng = cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng;

  return (
    <ClientThemeProvider>
      <div className="relative" dir={dir(lng)}>
        <Header />
        <NotFoundPage 
          lng={lng} 
          customMessage={{
            title: "Artículo no encontrado",
            description: "Lo sentimos, no pudimos encontrar el artículo que estás buscando. Es posible que haya sido eliminado o movido.",
            goBack: "Volver al blog",
            goBackPrevious: "Volver a la página anterior"
          }}
        />
        <Footer />
      </div>
    </ClientThemeProvider>
  );
} 