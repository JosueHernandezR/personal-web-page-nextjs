import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Experience } from "@/types";

export default function ExperienceCard({
  classNames,
  experience,
}: {
  classNames?: string;
  experience: Experience;
}): JSX.Element {
  // Validar y limpiar la URL de la imagen
  let imageUrl = '';
  try {
    // Si es una URL absoluta, usarla directamente
    if (experience.companyLogo.startsWith('http')) {
      imageUrl = experience.companyLogo;
    } else {
      // Si es una ruta relativa, asegurarse de que comience con '/'
      imageUrl = experience.companyLogo.startsWith('/') 
        ? experience.companyLogo 
        : `/${experience.companyLogo}`;
    }
  } catch (error) {
    console.error("Error con la URL de la imagen:", error);
    // Fallback a una imagen por defecto o placeholder
    imageUrl = '/images/placeholder.png';
  }

  return (
    <div
      className={clsx(
        "mb-4 hover:shadow-lg rounded-xl transition-all duration-200 relative border border-zinc-100 dark:border-zinc-700/40",
        classNames
      )}
    >
      <Link href={experience.companyURL} target={"_blank"}>
        <div className="flex items-start dark:bg-zinc-800/90 dark:border-zinc-700/40 rounded-sm p-4 relative">
          <div className="mt-2">
            <Image
              src={imageUrl}
              alt={experience.company + " logo"}
              width={50}
              height={45}
              className="h-7 w-8 ml-2 mr-12"
            />
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              {experience.title}
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-5">
              {experience.company} · {experience.type} · {experience.date}{" "}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-5">
              {experience.location}
            </p>{" "}
            <p className="leading-5 text-zinc-600 dark:text-zinc-400 mt-2">
              {experience.description}
            </p>
            <div className="pt-2 flex md:flex-row flex-wrap">
              {experience.skills.map((skill, index) => (
                <p
                  key={index}
                  className="leading-5 dark:border dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 dark:bg-transparent rounded-md text-xs italic bg-gray-50  mr-2 px-1"
                >
                  {skill}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Link>
      <span className="absolute w-[50%] -bottom-px right-px h-px bg-linear-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 dark:from-cyan-400/0 dark:via-cyan-400/40 dark:to-cyan-400/0"></span>
      <span className="absolute w-px -left-px top-[40%] h-[40%] bg-linear-to-b from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 dark:from-cyan-400/0 dark:via-cyan-400/40 dark:to-cyan-400/0"></span>
    </div>
  );
}