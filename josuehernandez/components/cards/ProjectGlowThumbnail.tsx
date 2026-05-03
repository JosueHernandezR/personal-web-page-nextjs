import type { JSX } from "react";

/** Halo difuminado de la foto; aislamiento de capa por `isolationId` (una instancia ≠ otra por compositor).
 * Saturación/brillo/opacidad del halo siguen tema en globals.css (--pg-icon-* sobre .project-glow-thumb). */
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
    <div className="project-glow-thumb absolute inset-0 size-full min-w-0 overflow-hidden rounded-[inherit]">
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
