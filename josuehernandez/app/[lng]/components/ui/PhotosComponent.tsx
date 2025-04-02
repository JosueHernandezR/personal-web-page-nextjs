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
      {/* Contenedor principal */}
      <div className="relative">
        {/* 
          Contenedor con ancho fijo igual al viewport que se centrará
          y estará limitado por el ancho de la pantalla
        */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 w-screen overflow-hidden"
        >
          {/* 
            Usamos flex con justify-center para centrar las imágenes.
            El overflow-hidden en el contenedor superior garantiza que
            se recorten todas las imágenes que excedan el ancho de la pantalla.
          */}
          <div className="-my-4 flex justify-center gap-5 py-4 sm:gap-8">
            {[Image1, Image2, Image3, Image4, Image5].map((image, imageIndex) => (
              <div
                key={image.src}
                className={clsx(
                  'relative aspect-9/10 w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
                  rotations[imageIndex % rotations.length],
                )}
              >
                <Image
                  src={image}
                  alt=""
                  sizes="(min-width: 640px) 18rem, 11rem"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Espacio para mantener el layout */}
        <div className="h-80"></div>
      </div>
      
      {/* Garantizar que no haya scroll horizontal a nivel de página */}
      <style jsx global>{`
        body, html {
          overflow-x: hidden !important;
          max-width: 100vw;
          position: relative;
        }
      `}</style>
    </div>
  );
}