import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Reglas nuevas de eslint-plugin-react-hooks v7 (incluidas en eslint-config-next 16.3.5)
    // que marcan patrones intencionales del código existente:
    // - immutability: efectos de init con refs que llaman funciones declaradas después
    //   (Morphing.tsx) — funciona en runtime porque se ejecutan tras el render.
    // - set-state-in-effect: sincronización de estado dentro de useEffect.
    // Se pueden re-activar y corregir los componentes incrementalmente.
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // Scripts Node.js en CommonJS: require() es el estilo correcto aquí
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
