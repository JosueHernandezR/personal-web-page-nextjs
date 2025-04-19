import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}
export function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="transition hover:text-cyan-500 dark:hover:text-cyan-400"
    >
      {children}
    </Link>
  );
}
