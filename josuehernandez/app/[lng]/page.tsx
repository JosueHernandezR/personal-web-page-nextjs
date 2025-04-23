'use client';
import HeroCarousel from "@/components/ui/HeroCarousel";
import { useLanguage } from "@/contexts/LanguageContext";
import PersonalWebPhoto1 from "@/public/photos/horizontal/personal_web_page-01.jpg";
import PersonalWebPhoto2 from "@/public/photos/horizontal/personal_web_page-02.jpg";
import PersonalWebPhoto3 from "@/public/photos/horizontal/personal_web_page-03.jpg";
import PersonalWebPhoto4 from "@/public/photos/horizontal/personal_web_page-07.jpg";
import { useTranslation } from "../i18n/client";
import { useEffect, useState } from "react";
import Experience from "./Experience";


export default function Home() {
  const { lng: contextLng } = useLanguage();
  const [currentLng, setCurrentLng] = useState(contextLng);
  const { t } = useTranslation(contextLng);

  useEffect(() => {
    if (contextLng !== currentLng) {
      setCurrentLng(contextLng);
    }
  }, [contextLng, currentLng]);

  const carouselImages = [
    PersonalWebPhoto1.src,
    PersonalWebPhoto2.src,
    PersonalWebPhoto3.src,
    PersonalWebPhoto4.src,
  ];
  
  const carouselButton = t("carousel_button_1");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full overflow-x-hidden">
      <section className="w-full relative overflow-hidden">
        <HeroCarousel
          images={carouselImages}
          titles={Array(carouselImages.length).fill(t("name"))}
          descriptions={Array(carouselImages.length).fill(t("bio"))}
          buttonText={carouselButton}
          buttonTexts={Array(carouselImages.length).fill(carouselButton)}
          autoPlayInterval={6000}
        />
      </section>
      
      <Experience />
    </main>
  );
}

