import type { CSSProperties, JSX } from "react";

/** Halo difuminado de la foto; aislamiento de capa por `isolationId` (una instancia ≠ otra por compositor). */
export default function ProjectGlowThumbnail({
  src,
  alt = "",
  isolationId,
}: {
  src: string;
  alt?: string;
  isolationId: number;
}): JSX.Element {
  /* Claves distintas en cada <img>: evita pooling agresivo con la misma dimensión + filter blur */
  const k = `${isolationId}-${src.slice(-24)}`;

  return (
    <div
      className="project-glow-thumb absolute inset-0 size-full min-w-0 overflow-hidden rounded-2xl"
      style={
        {
          "--pg-front-inset": "3.5%",
          "--pg-icon-blur": 32,
          "--pg-icon-saturate": 6.5,
          "--pg-icon-brightness": 1.45,
          "--pg-icon-contrast": 1.55,
          "--pg-icon-scale": 4,
          "--pg-icon-opacity": 0.72,
        } as CSSProperties
      }
    >
      <div className="project-glow-thumb__plate pointer-events-none absolute inset-0 min-w-0 overflow-hidden rounded-[inherit]">
        <div className="project-glow-thumb__ambient" aria-hidden>
          <img
            key={`amb-${k}`}
            alt=""
            src={src}
            className="project-glow-thumb__layer-img max-h-none max-w-none select-none"
            decoding="async"
            draggable={false}
          />
        </div>
        <img
          key={`front-${k}`}
          alt={alt}
          src={src}
          className="project-glow-thumb__front absolute select-none"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}
