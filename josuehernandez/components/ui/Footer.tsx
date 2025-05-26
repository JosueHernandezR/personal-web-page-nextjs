'use client';

import { navigation } from "@/constants/navigation";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import { useTranslationWithContext } from "@/contexts/LanguageContext";
import DitheredWaves from "./Dither";

export default function Footer() {
  const { t } = useTranslationWithContext("navbar");

  return (
    <footer>
      <div className="h-60 md:h-80">
        <DitheredWaves
          waveSpeed={0.03}
          waveFrequency={1.7}
          waveAmplitude={0.5}
          colorNum={16}
          pixelSize={3}
          enableMouseInteraction={true}
          mouseRadius={0.5}
        />
      </div>
      <Container.Outer>
        <div className="border-t border-zinc-100 pt-8 pb-16 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {navigation.map((navigation) => (
                  <NavLink 
                    key={navigation.href} 
                    href={`${navigation.href}`}
                  >
                    {t(navigation.name)}
                  </NavLink>
                ))}
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                © {new Date().getFullYear()} all rights reserved.
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  );
}