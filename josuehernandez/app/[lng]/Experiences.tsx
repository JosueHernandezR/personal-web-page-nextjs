"use client";
import { Container } from "@/components/Container";
import ExperienceCard from "@/components/ExperienceCard";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Icons";
import { experiences } from "@/constants/experiences";
import { useRef, useState } from "react";
import { useTranslation } from "../i18n/client";
import { Experience } from "@/types";

interface ExperiencesProps {
  lng: string;
}

export default function Experiences({ lng }: ExperiencesProps): JSX.Element {
  let [isExpanded, setIsExpanded] = useState(false);
  const parentRef = useRef();
  const { t } = useTranslation(lng, 'experiences');

  // Mapear las experiencias con las traducciones
  const translatedExperiences = experiences.map(experience => {
    // No traducir la ruta de la imagen, usar directamente la ruta definida en las constantes
    return {
      title: t(experience.title),
      company: t(experience.company),
      companyURL: t(experience.companyURL),
      companyLogo: experience.companyLogo, // Usar directamente la ruta
      location: t(experience.location),
      type: t(experience.type),
      date: t(experience.date),
      description: t(experience.description),
      skills: experience.skills
    };
  });

  return (
    <>
      {experiences.length > 0 && (
        <Container className="mt-9">
          <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-zinc-800 dark:text-zinc-100">
            {t('title', 'Experiences')}
          </h3>

          {translatedExperiences.slice(0, 2).map((experience: Experience, index: number) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
          {translatedExperiences.slice(2).map((experience: Experience, index: number) => (
            <div
              key={index}
              className={
                "h-0 overflow-hidden transition-height ease-in-out duration-[400ms] "
              }
              ref={parentRef as any}
              style={{
                height: isExpanded
                  ? (parentRef.current as any).scrollHeight
                  : 0,
              }}
            >
              <ExperienceCard key={index} experience={experience} />
            </div>
          ))}
          {experiences.length > 2 && (
            <div className="flex justify-center">
              <button
                className="group flex items-center text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-cyan-500 dark:hover:text-cyan-500"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    {t('showLess', 'Show less')}
                    <ChevronUpIcon className="ml-3 h-auto w-[10px] stroke-zinc-500 group-hover:stroke-cyan-500 dark:group-hover:stroke-cyan-500" />
                  </>
                ) : (
                  <>
                    {t('showMore', 'Show more')}
                    <ChevronDownIcon className="ml-3 h-auto w-[10px] stroke-zinc-500 group-hover:stroke-cyan-500 dark:group-hover:stroke-cyan-500" />
                  </>
                )}
              </button>
            </div>
          )}
        </Container>
      )}
    </>
  );
}
