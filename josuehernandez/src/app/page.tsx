import { Suspense } from "react";
import About from "./About";
import AboutPlaceholder from "@/components/skeleton/AboutPlaceholder";
import fs from "fs";

export default async function Home(): Promise<JSX.Element> {
  // if (fs.existsSync("public")) {
  //   await generateRss();
  // }

  return (
    <>
      <Suspense fallback={<AboutPlaceholder />}>
        <About />
      </Suspense>
    </>
  );
}
