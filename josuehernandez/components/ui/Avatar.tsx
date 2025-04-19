import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import avatarImage from "@/public/photos/avatar.webp";
import React from "react";

interface AvatarContainerProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface AvatarProps {
  large?: boolean;
  className?: string;
  [key: string]: unknown;
}

export function clamp(number: number, a: number, b: number) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
}

export function AvatarContainer({
  className,
  children,
  ...props
}: AvatarContainerProps): React.ReactElement {
  return (
    <div
      className={clsx(
        className,
        "h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10"
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Avatar({
  large = false,
  className,
  ...props
}: AvatarProps): React.ReactElement {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={clsx(className, "pointer-events-auto")}
      {...props}
    >
      <Image
        src={avatarImage}
        alt=""
        sizes={large ? "4rem" : "2.25rem"}
        className={clsx(
          "rounded-full bg-zinc-100 object-cover dark:bg-zinc-800",
          large ? "h-16 w-16" : "h-9 w-9"
        )}
        priority
      />
    </Link>
  );
}
