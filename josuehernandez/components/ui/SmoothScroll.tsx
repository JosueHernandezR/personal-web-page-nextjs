"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * Wrapper cliente que activa el smooth scroll (Lenis) en toda la app.
 * Es transparente: no añade nodos al DOM.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
