import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientThemeProvider from "./theme_provider";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "@/styles/globals.css";
import { languages } from "../i18n/settings";

// Usar la interfaz que espera Next.js
interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lng } = params;

  return (
    <html lang={lng} className={inter.className} suppressHydrationWarning>
      <body
        className="bg-zinc-50 dark:bg-black min-h-screen"
        suppressHydrationWarning
      >
        <ClientThemeProvider>
          <div className="relative">
            <Header lng={lng} />
            {children}
            <Footer lng={lng} />
            <Analytics />
            <SpeedInsights />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}