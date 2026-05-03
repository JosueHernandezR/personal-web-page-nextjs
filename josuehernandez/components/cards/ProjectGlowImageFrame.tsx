"use client";

import type { CSSProperties, JSX, ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  clamp,
  subscribeThumbnailParallax,
  getParallaxDrive,
  preferOrientationMotion,
} from "./thumbnailMotionStores";

/** Marco + tilt + foco (--spot-*). Vars `--pv*`/`--spot-*` quedan en este nodo (.pgf-shell); no son globales. */
export default function ProjectGlowImageFrame({
  children,
  postId,
}: {
  children: ReactNode;
  postId: number;
}): JSX.Element {

  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const parallaxRaf = useRef(0);
  const spotRaf = useRef(0);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const parallaxTick = () => {
      const { x, y } = getParallaxDrive();
      shell.style.setProperty("--pvx", x.toFixed(4));
      shell.style.setProperty("--pvy", y.toFixed(4));

      if (preferOrientationMotion()) {
        shell.style.setProperty(
          "--spot-x",
          `${clamp(50 + x * 18, 5, 95).toFixed(2)}%`,
        );
        shell.style.setProperty(
          "--spot-y",
          `${clamp(50 + y * 18, 5, 95).toFixed(2)}%`,
        );
      }
      parallaxRaf.current = 0;
    };

    const scheduleParallax = () => {
      if (parallaxRaf.current) return;
      parallaxRaf.current = window.requestAnimationFrame(parallaxTick);
    };

    parallaxTick();
    const unsubParallax = subscribeThumbnailParallax(scheduleParallax);

    const spotlightFromPointer = (clientX: number, clientY: number) => {
      const host = innerRef.current;
      if (!host || preferOrientationMotion()) return;
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = ((clientX - r.left) / r.width) * 100;
      const py = ((clientY - r.top) / r.height) * 100;
      shell.style.setProperty("--spot-x", `${clamp(px, 0, 100).toFixed(2)}%`);
      shell.style.setProperty("--spot-y", `${clamp(py, 0, 100).toFixed(2)}%`);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (spotRaf.current) return;
      spotRaf.current = window.requestAnimationFrame(() => {
        spotlightFromPointer(e.clientX, e.clientY);
        spotRaf.current = 0;
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      unsubParallax();
      window.removeEventListener("pointermove", onPointerMove);
      if (parallaxRaf.current) window.cancelAnimationFrame(parallaxRaf.current);
      if (spotRaf.current) window.cancelAnimationFrame(spotRaf.current);
    };
  }, [postId]);

  return (
    <div className="pgf-view pgf-view--media w-full min-w-0 max-w-none">
      <div
        ref={shellRef}
        className="pgf-shell"
        data-project-glow-card={postId}
        style={
          {
            "--spot-x": "50%",
            "--spot-y": "50%",
          } as CSSProperties
        }
      >
        <div className="pgf-frame">
          <div ref={innerRef} className="pgf-inner pgf-inner--media">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
