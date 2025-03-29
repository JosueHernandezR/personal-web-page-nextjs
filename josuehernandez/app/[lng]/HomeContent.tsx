"use client";

import About from "./About";
import Educations from "./Educations";
import Experiences from "./Experiences";
import Dither from "../../components/Dither";
import { Suspense } from "react";

export default function HomeContent() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Suspense fallback={
          <div 
            style={{ 
              backgroundColor: 'rgb(38, 38, 38)',
              opacity: 0.5,
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        }>
          <Dither />
        </Suspense>
      </div>
      <div className="relative z-10">
        <About />
        <Educations />
        <Experiences />
      </div>
    </div>
  );
} 