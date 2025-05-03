import Link from "next/link";
import { JSX } from "react";
import { FadeIn } from "./Fade";

interface SocialLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  icon: React.ComponentType<{ className?: string }>;
  download?: boolean;
}

export default function SocialLink({
  icon: Icon,
  download,
  href,
  ...props
}: SocialLinkProps): JSX.Element {
  if (download) {
    return (
      <FadeIn>
        <a
          className="group"
          href={href as string}
          download
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!href) {
              e.preventDefault();
            }
          }}
        >
          <Icon className="h-8 w-8 fill-white transition group-hover:fill-zinc-100" />
        </a>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <Link className="group" target={"_blank"} href={href} {...props}>
        <Icon className="h-8 w-8 fill-white transition group-hover:fill-zinc-100" />
      </Link>
    </FadeIn>
  );
}
