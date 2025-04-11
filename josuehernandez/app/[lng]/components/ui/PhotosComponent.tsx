import Image from "next/image";
import clsx from "clsx";
import Image1 from "@/public/images/photos/image_2.jpg";
import Image2 from "@/public/images/photos/image_3.jpg";
import Image3 from "@/public/images/photos/image_4.jpg";
import Image4 from "@/public/images/photos/image_5.jpg";
import Image5 from "@/public/images/photos/image_6.jpg";
import { classNames } from "@/utils/tools";

export default function PhotosComponent() {
  let rotations = [
    "rotate-2",
    "-rotate-2",
    "rotate-2",
    "rotate-2",
    "-rotate-2",
  ];

  return (
    <div className="mt-16 sm:mt-20">
      {/* Contenedor principal con padding extra para las rotaciones */}
      <div className="relative py-20">
        {/* Contenedor con scroll horizontal en móviles */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-screen overflow-x-auto md:overflow-x-hidden">
          {/* Contenedor de imágenes con scroll y padding adecuado */}
          <div className="flex justify-center gap-5 py-4 sm:gap-8 px-6 sm:px-10 md:px-16" style={{ scrollPadding: '0 24px', minWidth: 'min-content' }}>
            {[Image1, Image2, Image3, Image4, Image5].map((image, imageIndex) => (
              <div
                key={image.src}
                className={clsx(
                  'relative aspect-[3/4] w-64 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-80 sm:rounded-2xl dark:bg-zinc-800 transform-gpu',
                  rotations[imageIndex % rotations.length],
                )}
              >
                <Image
                  src={image}
                  alt=""
                  sizes="(min-width: 640px) 20rem, 16rem"
                  className="absolute inset-0 h-full w-full object-cover"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Espacio para mantener el layout y acomodar las rotaciones */}
        <div className="h-[500px]"></div>
      </div>
      
      {/* Estilos para mejorar la experiencia de scroll */}
      <style jsx global>{`
        /* Ocultar la barra de scroll pero mantener la funcionalidad */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overscroll-behavior-x: contain;
        }
        /* Asegurar que no haya scroll horizontal a nivel de página */
        body, html {
          overflow-x: hidden !important;
          max-width: 100vw;
          position: relative;
        }
        /* Asegurar que las imágenes son completamente scrolleables en móviles */
        @media (max-width: 767px) {
          .overflow-x-auto {
            scroll-snap-type: x proximity;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
}