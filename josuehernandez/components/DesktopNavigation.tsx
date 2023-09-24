import { NavItem } from "./NavItem";

interface DesktopNavigationProps {
    links: { label: string; href: string }[];
    className: string;
  }

export function DesktopNavigation({
  links,
  className,
}: DesktopNavigationProps): JSX.Element {
    return (
      <nav className={className}>
        <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        {links.map(({ href, label }, index) => (
          <NavItem key={index} href={href}>
            {label}
          </NavItem>
        ))}
        </ul>
      </nav>
    )
  }