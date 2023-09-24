import Image from "next/image";
import { Suspense } from "react";
import About from "./About";
import Server from "./Server";

export default function Home() {
  return (
  <>
    <Suspense>
      <About/>
    </Suspense>
    <Suspense>
      <Server component="Educations"/>
    </Suspense>
  </>);
}

