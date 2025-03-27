import { Metadata } from "next";
import { Suspense } from "react";
import ListProjects from "./ListProjects";
import { getServerTranslation } from "../../i18n";
import { SimpleLayout } from "@/components";

export const metadata: Metadata = {
  title: "Projects",
  description: "",
};

interface PageProps {
  params: Promise<{
    lng: string;
  }>;
}

export default async function Projects({ params }: PageProps): Promise<JSX.Element> {
  const { lng } = await params;
  const t = await getServerTranslation(lng, "projects");

  return (
    <SimpleLayout title={t("title_page")} intro={t("introduction_page")}>
      <div className="mt-16 sm:mt-20">
          <ListProjects lng={lng} />
      </div>
    </SimpleLayout>
  );
}
