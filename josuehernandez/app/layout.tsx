import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import { fallbackLng, cookieName, languages } from "./i18n/settings";
import "@/styles/globals.css";
import { dir } from "i18next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Detectar el idioma en uso
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(cookieName)?.value;
  const lng = cookieLang && languages.includes(cookieLang) ? cookieLang : fallbackLng;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning data-theme="dark">
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-black min-h-screen">
        <div className="fixed inset-0 flex justify-center sm:px-8">
          <div className="flex w-full max-w-7xl lg:px-8">
            <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
          </div>
        </div>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
} 