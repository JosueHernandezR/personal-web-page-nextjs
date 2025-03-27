"use client";
import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationWithContext } from "@/contexts/LanguageContext";
import { educations } from "@/constants/educations";
import { Education } from "@/types";
import { ChevronDownIcon, ChevronUpIcon, Container, EducationCard } from "@/components";

export default function Educations(): JSX.Element {
  let [isExpanded, setIsExpanded] = useState(false);
  const parentRef = useRef();
  const { t } = useTranslationWithContext("educations");

  // Mapear las educaciones con las traducciones
  const translatedEducations = educations.map((education) => ({
    school: t(education.school),
    schoolURL: education.schoolURL,
    schoolLogo: education.schoolLogo,
    schoolLocation: t(education.schoolLocation),
    degree: t(education.degree),
    major: t(education.major),
    minor: education.minor ? t(education.minor) : "",
    date: t(education.date),
    description: t(education.description),
    activitiesandsocieties: education.activitiesandsocieties,
  }));

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
                key={`expanded-${index}`}
                className="h-0 overflow-hidden transition-height ease-in-out duration-[400ms]"
                ref={parentRef as any}
                style={{
                  height: isExpanded
                    ? (parentRef.current as any).scrollHeight
                    : 0,
                }}
              >
                <EducationCard key={`card-${index}`} education={education} />
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
