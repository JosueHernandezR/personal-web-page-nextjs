"use client";
import { useRef, useState } from "react";
import { useTranslationWithContext } from "@/contexts/LanguageContext";
import { experiences } from "@/constants/experiences";
import { Experience } from "@/types";
import { ChevronDownIcon, ChevronUpIcon, Container, ExperienceCard } from "@/components";

export default function Experiences(): JSX.Element {
  let [isExpanded, setIsExpanded] = useState(false);
  const parentRef = useRef();
  const { t } = useTranslationWithContext("experiences");

  // Mapear las experiencias con las traducciones
  const translatedExperiences = experiences.map((experience) => ({
    title: t(experience.title),
    company: t(experience.company),
    companyURL: experience.companyURL,
    companyLogo: experience.companyLogo,
    location: t(experience.location),
    type: t(experience.type),
    date: t(experience.date),
    description: t(experience.description),
    skills: experience.skills,
  }));

  return (
    <>
      {experiences.length > 0 && (
        <Container className="mt-9">
          <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-zinc-800 dark:text-zinc-100">
            {t("title")}
          </h3>
          {translatedExperiences
            .slice(0, 2)
            .map((experience: Experience, index: number) => (
              <ExperienceCard key={index} experience={experience} />
            ))}
          {translatedExperiences
            .slice(2)
            .map((experience: Experience, index: number) => (
              <div
                key={`expanded-${index}`}
                className="h-0 overflow-hidden transition-height ease-in-out duration-[400ms]"
                ref={parentRef as any}
                style={{
                  height: isExpanded
                    ? (parentRef.current as any).scrollHeight
                    : 0,
                }}
              >
                <ExperienceCard key={`card-${index}`} experience={experience} />
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
                    {t("showLess")}
                    <ChevronUpIcon className="ml-3 h-auto w-[10px] stroke-zinc-500 group-hover:stroke-cyan-500 dark:group-hover:stroke-cyan-500" />
                  </>
                ) : (
                  <>
                    {t("showMore")}
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
