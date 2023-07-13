import { Suspense } from "react";
import About from "./About";
import AboutPlaceholder from "@/components/skeleton/AboutPlaceholder";

export default async function Home(): Promise<JSX.Element> {
  return (
    <>
      <Suspense fallback={<AboutPlaceholder />}>
        <About />
      </Suspense>
    </>
  );
}

