import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { languages } from "../i18n/settings";

export const metadata: Metadata = {
  title: "Josue Hernandez",
  description: "FullStack Developer",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function LngLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
