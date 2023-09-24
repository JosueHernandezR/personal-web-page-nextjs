import { Metadata } from "next";
import { Suspense } from "react";
import SimpleLayout from "@/components/SimpleLayout";
import ListProjects from "./ListProjects";

export const metadata: Metadata = {
  title: "Projects",
  description: "",
};

export default function Projects(): JSX.Element {
  return (
    <SimpleLayout title="Things I’ve made trying to improve my software dev skills." intro="During my university years and after being a university student I've carried out various projects to learn some development technology and others have been to participate in hackathons.">
      <div className="mt-16 sm:mt-20">
        <Suspense>
            <ListProjects/>
        </Suspense>
      </div>
    </SimpleLayout>
  );
}
