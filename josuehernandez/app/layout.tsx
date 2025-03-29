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
      <body
        className={`${inter.className} flex h-full flex-col bg-white dark:bg-black min-h-screen antialiased`}
      >
        <Providers lng={lng}>
          <WavesWrapper />
          <div className="fixed inset-0 flex justify-center sm:px-8">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="w-full ring-1 bg-white/80 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20">
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
