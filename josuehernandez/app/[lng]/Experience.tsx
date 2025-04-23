"use client";
import { ParallaxCard } from "@/components/ui/ParallaxCard";
import { useTranslation } from "../i18n/client";
import { experiences } from "@/constants/experiences";
import { useLanguage } from "@/contexts/LanguageContext";
import { JSX } from "react";

export default function Experience(): JSX.Element {
  const { lng: contextLng } = useLanguage();
  const { t } = useTranslation(contextLng, "experiences");

  // Mapear las experiencias con las traducciones
  const translatedExperiences = experiences.map((experience) => ({
    title: t(experience.title),
    company: t(experience.company),
    companyURL: experience.companyURL,
    description: t(experience.description),
    date: t(experience.date),
  }));

  return (
    <section className="py-16 xl:py-24 2xl:py-32 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Encabezado */}
        <div className="mb-20">
          <div className="inline-block px-6 py-2 rounded-full border border-gray-300 dark:border-zinc-700 mb-8">
            <h3 className="font-geist text-base font-medium text-gray-800 dark:text-gray-200">
              {t("title")}
            </h3>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row gap-10">
            <h2 className="font-geist text-4xl md:text-5xl xl:text-8xl font-medium text-gray-900 dark:text-white max-w-xl leading-tight xl:leading-none">
              {t("snapshot_title")}
            </h2>
            <ParallaxCard
              title={t("parallax_title")}
              subtitle={t("parallax_subtitle")}
              location={t("parallax_location")}
              backgroundImage={'/card/jaguar_background.png'}
              middleImage={'/card/jaguar_object.png'}
            />
          </div>
        </div>
        
        {/* Lista de experiencias */}
        {translatedExperiences.map((experience, index) => (
          <div key={index} className={index < translatedExperiences.length - 1 ? "mb-10 pb-10 border-b border-gray-200 dark:border-zinc-800" : ""}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <h3 className="font-geist text-2xl font-medium text-gray-900 dark:text-white mb-2">
                  {experience.title} {t("at")} {experience.company}
                </h3>
                <p className="font-inter text-gray-500 dark:text-gray-400 leading-relaxed pr-6">
                  {experience.description}
                </p>
              </div>
              <div className="flex md:justify-end items-start">
                <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {experience.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 