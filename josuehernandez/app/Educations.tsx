"use client";
import { Container } from "@/components/Container";
import EducationCard from "@/components/EducationCard";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/Icons";
import { useRef, useState } from "react";

export default function Educations({ educations }: any): JSX.Element {
  let [isExpanded, setIsExpanded] = useState(false);
  const parentRef = useRef();

  return (
    <>
      {educations.length > 0 && (
        <Container className="mt-9">
            <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-zinc-800 dark:text-zinc-100">
              Educations
            </h3>
            {educations.slice(0, 2).map((education: any, index: any) => (
              <EducationCard key={index} props={education} />
            ))}
            {educations.slice(2).map((education: any, index: any) => (
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
                <EducationCard key={index} props={education} />
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
                      Show less
                      <ChevronUpIcon className="ml-3 h-auto w-[10px] stroke-zinc-500 group-hover:stroke-cyan-500 dark:group-hover:stroke-cyan-500" />
                    </>
                  ) : (
                    <>
                      Show more
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