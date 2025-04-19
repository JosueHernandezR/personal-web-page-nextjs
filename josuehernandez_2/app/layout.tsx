import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import { dir } from "i18next";
import Providers from "./[lng]/providers";
import { fallbackLng, cookieName, languages } from "./i18n/settings";

import "@/styles/globals.css";
import DynamicWavesWrapper from "./[lng]/components/ui/DynamicWavesWrapper";

// Optimizar la fuente
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
  // Añadir metadatos para optimización
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(cookieName)?.value;
  const lng =
    cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-zinc-900 antialiased`}>
        <Providers lng={lng}>
          {/* Fondo con waves */}
          <div className="fixed inset-0">
            <DynamicWavesWrapper />
          </div>
          
          {/* Contenedor principal con decoración y contenido */}
          <div className="sm:px-8">
            <div className="mx-auto max-w-7xl lg:px-8">
              <div className="relative ring-1 bg-white/80 ring-zinc-100 dark:bg-white/5 dark:ring-zinc-300/20">
                {children}
              </div>
            </div>
          </div>

          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
