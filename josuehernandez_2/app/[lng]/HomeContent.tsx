"use client";

import About from "./About";
import Educations from "./Educations";
import Experiences from "./Experiences";
import PhotosComponent from "./components/ui/PhotosComponent";

export default function HomeContent() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10">
        <About />
        <PhotosComponent />
        <Educations />
        <Experiences />
      </div>
    </div>
  );
} 