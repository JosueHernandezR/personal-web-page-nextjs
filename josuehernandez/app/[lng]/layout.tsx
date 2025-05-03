import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono, Inter, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/styles/globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    lng: string;
  }>;
}>) {
  const { lng } = await params;
  return (
    <html lang={lng} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${bebasNeue.variable} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider initialLng={lng}>
          <ThemeProvider>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

