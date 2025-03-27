import { getServerTranslation } from "@/app/i18n";
import { Card } from "@/components/Card";
import { LinkIcon } from "@/components/Icons";
import { server } from "@/config";
import { projects } from "@/constants/projects";
import { useTranslationWithContext } from "@/contexts/LanguageContext";

import fs, { promises as ps } from "fs";
import Image from "next/image";

interface ListProjectsProps {
  lng: string;
}
export default async function ListProjects({
  lng,
}: ListProjectsProps): Promise<JSX.Element> {
  const  t  = await getServerTranslation(lng, "projects");
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <Card as="li" key={t(project.title)}>
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <Image
              src={project.logo.src}
              //src={`/images/${project.logo.src}`}
              alt={project.logo.alt}
              height={32}
              width={32}
              className="h-8 w-8"
              unoptimized
            />
          </div>
          <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
            <Card.Link href={project.link.href}>{t(project.title)}</Card.Link>
          </h2>
          <Card.Description>{t(project.description)}</Card.Description>
          <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-cyan-500 dark:text-zinc-200">
            <LinkIcon className="h-6 w-6 flex-none" />
            <span className="ml-2">{t(project.link.label)}</span>
          </p>
        </Card>
      ))}
    </ul>
  );
}
