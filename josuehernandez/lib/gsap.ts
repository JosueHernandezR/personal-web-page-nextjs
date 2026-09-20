import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Registro central de plugins de GSAP.
 * Importar desde aquí en lugar de "gsap" directamente para garantizar
 * que los plugins estén registrados antes de cualquier uso.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Defaults globales: easing suave y consistente en todo el sitio.
gsap.defaults({ ease: "power3.out", duration: 0.8 });

export { gsap, useGSAP, ScrollTrigger, SplitText };
