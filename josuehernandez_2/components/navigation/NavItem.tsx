"use client";
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
    href: string;
    children: React.ReactNode;
  }

export function NavItem({ href, children }: NavItemProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (pathname && href && href !== '/' && pathname.startsWith(href))
  
    return (
      <li>
        <Link
          href={href}
          className={clsx(
            'relative block px-3 py-2 transition',
            isActive
              ? 'text-cyan-500 dark:text-cyan-400'
              : 'hover:text-cyan-500 dark:hover:text-cyan-400'
          )}
        >
          {children}
          {isActive && (
            <span className="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 dark:from-cyan-400/0 dark:via-cyan-400/40 dark:to-cyan-400/0" />
          )}
        </Link>
      </li>
    )
  }