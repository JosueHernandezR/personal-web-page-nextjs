import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import { dir } from "i18next";
import Providers from "./[lng]/providers";
import WavesWrapper from "./[lng]/components/ui/WavesWrapper";
import { fallbackLng, cookieName, languages } from "./i18n/settings";

import "@/styles/globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detectar el idioma en uso
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(cookieName)?.value;
  const lng =
    cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-zinc-900 antialiased`}>
        <Providers lng={lng}>
          {/* Fondo con waves */}
          <div className="fixed inset-0">
            <WavesWrapper />
          </div>
          
          {/* Contenedor principal con decoración y contenido */}
          <div className="sm:px-8">
            <div className="mx-auto max-w-7xl lg:px-8">
              <div className="relative ring-1 bg-white/80 ring-zinc-100 dark:bg-white/5 dark:ring-zinc-300/20 pt-16">
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
