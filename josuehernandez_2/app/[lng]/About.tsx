'use client';

import Link from "next/link";

import { useTranslationWithContext } from "@/contexts/LanguageContext";
import { Container, DownloadFileIcon, GitHubIcon, GoogleScholarIcon, LinkedInIcon, TwitterIcon } from "@/components";
import { socialLinks } from "@/constants/social_links";

function SocialLink({
  icon: Icon,
  ...props
}: {
  [key: string]: any;
}): JSX.Element {
  return (
    <Link href={""} className="group -m-1 p-1" target={"_blank"} {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  );
}

export default function About(): JSX.Element {
  const { t } = useTranslationWithContext('about');

  return (
    <Container className="mt-9">
      <h1 className="title">{t("name")}</h1>
      <h2 className="subtitle">
        {t("designation")}{" "}
        <Link
          className="font-semibold"
          href={t("company.url")}
          target="_blank"
        >
          {t("company.name")}
        </Link>
      </h2>
      <p className="paragraph" style={{ whiteSpace: "pre-line" }}>
        {t("description")}
      </p>
      <div className="mt-6 flex gap-6">
        {socialLinks.map((socialLink: any, index: any) => (
          <SocialLink
            key={index}
            href={socialLink.url}
            icon={
              socialLink.name === "github"
                ? GitHubIcon
                : socialLink.name === "linkedin"
                ? LinkedInIcon
                : socialLink.name === "twitter"
                ? TwitterIcon
                : socialLink.name === "google-scholar"
                ? GoogleScholarIcon
                : null
            }
          />
        ))}
        <SocialLink
          href={t("resume")}
          icon={DownloadFileIcon}
          download
        />
      </div>
    </Container>
  );
}
