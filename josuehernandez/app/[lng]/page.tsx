import Image from "next/image";
import { Suspense } from "react";
import About from "./About";
import Server from "./Server";
interface PageProps {
  params: {
    lng: string;
  };
}
export default async function Home({ params }: PageProps) {
  const { lng } = await params;

  return (
    <>
      <Suspense>
        <About params={{ lng }} />
      </Suspense>
      <Suspense>
        <Server component="Educations" params={{ lng }} />
      </Suspense>
      <Suspense>
        <Server component="Experiences" params={{ lng }} />
      </Suspense>
    </>
  );
}

