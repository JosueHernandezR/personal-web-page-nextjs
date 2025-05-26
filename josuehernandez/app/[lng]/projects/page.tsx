import LiquidSphere from "@/components/ui/LiquidSphere";
import { Metadata, Viewport } from "next";
import { getServerTranslation } from "../../i18n";
import { FadeIn, FadeInStaggerSection } from "@/components/ui/Fade";
import DetailedDSLRCamera from "@/components/3d/Camera";
import SuperformulaWireframe from "@/components/3d/Morphing";

export const metadata: Metadata = {
  title: "Proyectos | Josue Hernandez",
  description:
    "Proyectos desarrollados para mejorar mis habilidades de desarrollo",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function Page({
  params,
}: {
  params: Promise<{
    lng: string;
  }>;
}) {
  const { lng } = await params;
  const t = await getServerTranslation(lng, "projects");

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <FadeInStaggerSection className="flex flex-col justify-center w-full  max-w-7xl mx-auto mt-[64px] min-h-screen">
        <div className="flex flex-col lg:flex-row gap-12 pb-24 justify-center items-center">
          <div className="flex-1 flex flex-col justify-center px-4 md:px-8">
            <FadeIn className="text-sm uppercase text-violet-600 dark:text-violet-400 mb-4 tracking-wider font-medium">
              Propósito de mis proyectos
            </FadeIn>
            <FadeIn>
              <h1 className="font-medium leading-none tracking-tight font-geist text-5xl lg:text-7xl xl:text-8xl text-black dark:text-white mb-6">
                {t("title_page")}
              </h1>
            </FadeIn>
            <FadeIn>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-2xl">
                {t("introduction_page")}
              </p>
            </FadeIn>
            <FadeIn className="flex space-x-4 items-center">
              {/* <a href="#proyectos" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider">
                Ver proyectos
              </a> */}
              <div className="flex items-center text-gray-400 dark:text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m17 12-5 5-5-5" />
                  <path d="M12 7v10" />
                </svg>
                <span className="text-sm">Desplázate para más</span>
              </div>
            </FadeIn>
          </div>
          <FadeIn className="flex-1 relative min-h-[500px] w-full">
            <LiquidSphere />
          </FadeIn>
        </div>
      </FadeInStaggerSection>
      <FadeInStaggerSection className="flex flex-col justify-center w-full px-4 md:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="font-geist text-6xl md:text-9xl font-medium mb-12 text-center md:text-left text-black dark:text-white">
            Proyectos
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          {/* Tarjeta de Proyectos de Ingeniería */}
          <FadeIn className="relative overflow-hidden rounded-3xl min-h-[400px]">
            <a href={`/${lng}/projects/engineering`} className="block absolute inset-0">
              <div className="absolute inset-0">
                <DetailedDSLRCamera />
              </div>
              {/* Contenedor para el efecto glassmorphism */}
              <div className="absolute left-0 right-0 bottom-0 h-2/5 pointer-events-none backdrop-blur-md custom-mask" />
              {/* Contenedor del texto separado del blur */}
              <div className="absolute left-0 right-0 bottom-0 h-2/5 flex items-end z-20">
                <div className="p-6 text-white">
                  <h3 className="text-white text-4xl font-medium mb-3">
                    Ingeniería
                  </h3>
                  <p className="text-zinc-300 text-xl">
                    Proyectos de ingeniería y desarrollo de software
                  </p>
                </div>
              </div>
            </a>
          </FadeIn>

          {/* Tarjeta de Proyectos de Arte */}
          <FadeIn className="relative overflow-hidden rounded-3xl min-h-[400px]">
            <a href={`/${lng}/projects/art`} className="block absolute inset-0">
              <div className="absolute inset-0">
                <SuperformulaWireframe />
              </div>
              {/* Contenedor para el efecto glassmorphism */}
              <div className="absolute left-0 right-0 bottom-0 h-2/5 pointer-events-none backdrop-blur-md custom-mask" />
              {/* Contenedor del texto separado del blur */}
              <div className="absolute left-0 right-0 bottom-0 h-2/5 flex items-end z-20">
                <div className="p-6 text-white">
                  <h3 className="text-4xl font-medium mb-3">Arte</h3>
                  <p className="text-xl text-zinc-300">
                    Colección de fotografías y grabados artísticos
                  </p>
                </div>
              </div>
            </a>
          </FadeIn>
        </div>
      </FadeInStaggerSection>
    </main>
  );
}
