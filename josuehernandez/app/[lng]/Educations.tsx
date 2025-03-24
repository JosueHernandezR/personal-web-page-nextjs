"use client";
import { Container } from "@/components/Container";
import EducationCard from "@/components/EducationCard";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Icons";
import { useRef, useState } from "react";
import { useTranslation } from "../i18n/client";
import { educations } from "@/constants/educations";
import { Education } from "@/types";

interface EducationsProps {
  lng: string;
}
export default function Educations({ lng }: EducationsProps): JSX.Element {
  let [isExpanded, setIsExpanded] = useState(false);
  const parentRef = useRef();
  const { t } = useTranslation(lng, "educations");

  // Mapear las educaciones con las traducciones
  const translatedEducations = educations.map((education) => {
    // No traducir la ruta de la imagen, usar directamente la ruta definida en las constantes
    return {
      school: t(education.school),
      schoolURL: t(education.schoolURL),
      schoolLogo: education.schoolLogo, // Usar directamente la ruta
      schoolLocation: t(education.schoolLocation),
      degree: t(education.degree),
      major: t(education.major),
      minor: t(education.minor),
      date: t(education.date),
      description: t(education.description),
      activitiesandsocieties: education.activitiesandsocieties,
    };
  });

  return (
    <>
      {educations.length > 0 && (
        <Container className="mt-9">
          <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-zinc-800 dark:text-zinc-100">
            {t("education_title")}
          </h3>
          {translatedEducations
            .slice(0, 2)
            .map((education: Education, index: number) => (
              <EducationCard key={index} education={education} />
            ))}
          {translatedEducations
            .slice(2)
            .map((education: Education, index: number) => (
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
                <EducationCard key={index} education={education} />
              </div>
            ))}
          {educations.length > 2 && (
            <div className="flex justify-center">
              <button
                className="group flex items-center text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-cyan-500 dark:hover:text-cyan-500"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    {t("showLess", "Show less")}
                    <ChevronUpIcon className="ml-3 h-auto w-[10px] stroke-zinc-500 group-hover:stroke-cyan-500 dark:group-hover:stroke-cyan-500" />
                  </>
                ) : (
                  <>
                    {t("showMore", "Show more")}
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
