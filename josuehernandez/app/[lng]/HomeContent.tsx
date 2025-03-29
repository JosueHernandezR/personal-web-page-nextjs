"use client";

import About from "./About";
import Educations from "./Educations";
import Experiences from "./Experiences";
import Dither from "../../components/Dither";
import { Suspense } from "react";

export default function HomeContent() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10">
        <About />
        <Educations />
        <Experiences />
      </div>
    </div>
  );
} 