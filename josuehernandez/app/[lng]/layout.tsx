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
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Josue Hernandez - Desarrollador FullStack & Fotógrafo",
    template: "%s | Josue Hernandez"
  },
  description: "Desarrollador FullStack especializado en Flutter, React, Next.js y AWS. Fotógrafo apasionado. Experiencia en arquitecturas robustas y microservicios. Líder de proyectos tecnológicos innovadores.",
  keywords: ["desarrollador", "fullstack", "flutter", "react", "nextjs", "aws", "fotografía", "mobile", "typescript", "javascript"],
  authors: [{ name: "Josue Hernandez" }],
  creator: "Josue Hernandez",
  publisher: "Josue Hernandez",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: 'https://josuehernandez.dev',
    siteName: 'Josue Hernandez Portfolio',
    title: 'Josue Hernandez - Desarrollador FullStack & Fotógrafo',
    description: 'Desarrollador FullStack especializado en Flutter, React, Next.js y AWS. Fotógrafo apasionado. Experiencia en arquitecturas robustas y microservicios.',
    images: [
      {
        url: '/photos/horizontal/personal_web_page-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Josue Hernandez - Desarrollador FullStack & Fotógrafo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Josue Hernandez - Desarrollador FullStack & Fotógrafo',
    description: 'Desarrollador FullStack especializado en Flutter, React, Next.js y AWS. Fotógrafo apasionado.',
    images: ['/photos/horizontal/personal_web_page-01.jpg'],
    creator: '@josue',
  },
  alternates: {
    canonical: 'https://josuehernandez.dev',
    languages: {
      'es-ES': 'https://josuehernandez.dev/es',
      'en-US': 'https://josuehernandez.dev/en',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
      <head>
        {/* Preconnect para fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Manifest para PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Íconos para diferentes dispositivos */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preload de recursos críticos */}
        <link rel="preload" href="/photos/horizontal/personal_web_page-01.jpg" as="image" type="image/jpeg" />
        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${bebasNeue.variable} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider initialLng={lng}>
          <ThemeProvider>
            <Navbar />
            <main id="main-content" role="main">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
        <SpeedInsights />
        <Analytics />
        
        {/* Registro del Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}