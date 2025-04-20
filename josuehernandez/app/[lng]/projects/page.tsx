import LiquidSphere from "@/components/ui/LiquidSphere";
import { Metadata } from "next";
import { getServerTranslation } from "../../i18n";

export const metadata: Metadata = {
  title: "Proyectos | Josue Hernandez",
  description: "Proyectos desarrollados para mejorar mis habilidades de desarrollo",
};

interface PageProps {
  params: {
    lng: string;
  };
}

export default async function ProjectsPage({ params: { lng } }: PageProps) {
  const t = await getServerTranslation(lng, "projects");

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col justify-center w-full px-4 md:px-8 max-w-7xl mx-auto mt-[64px] min-h-screen">
        <div className="flex flex-col lg:flex-row gap-12 pb-24 justify-center items-center">
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-sm uppercase text-violet-600 dark:text-violet-400 mb-4 tracking-wider font-medium">Propósito de mis proyectos</div>
            <h1 className="font-medium leading-none tracking-tight font-geist text-5xl lg:text-7xl xl:text-8xl font-bold text-black dark:text-white mb-6">
              {t("title_page")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-2xl">
              {t("introduction_page")}
            </p>
            <div className="flex space-x-4 items-center">
              {/* <a href="#proyectos" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider">
                Ver proyectos
              </a> */}
              <div className="flex items-center text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="m17 12-5 5-5-5"/>
                  <path d="M12 7v10"/>
                </svg>
                <span className="text-sm">Desplázate para más</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative min-h-[500px] w-full max-w-[600px]">
            <LiquidSphere />
          </div>
        </div>

        {/* <div id="proyectos" className="mt-12 md:mt-24">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="text-7xl font-bold text-violet-600 dark:text-violet-400 opacity-90">01</div>
            <div className="flex-1">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">2023-08-30</div>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                Primer laboratorio central en investigación clínica
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-3xl">
                JOSUEDEV es un laboratorio global de investigación dedicado a proyectos de desarrollo con acreditaciones y reconocimientos por la calidad de su trabajo desde 2020 hasta la actualidad.
              </p>
              <a href="#" className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 inline-flex items-center group">
                <span className="mr-2">Ver detalles</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
}
