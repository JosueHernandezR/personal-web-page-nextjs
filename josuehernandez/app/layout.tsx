import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientThemeProvider from "./theme_provider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "@/styles/globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          " flex h-full flex-col bg-zinc-50 dark:bg-black min-h-screen"
        }
      >
        <ClientThemeProvider>
          <div className="fixed inset-0 flex justify-center sm:px-8">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
            </div>
          </div>
          <div className="relative">
            <Header />
            {children}
            <Footer />
          </div>
        </ClientThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

