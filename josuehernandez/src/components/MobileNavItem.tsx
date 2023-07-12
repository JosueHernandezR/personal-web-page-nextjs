import { Popover } from "@headlessui/react";
import Link from "next/link";
import { UrlObject } from "url";

interface MobileNavItemProps {
    href: string | UrlObject;
    children: React.ReactNode;
  }

export function MobileNavItem({ href, children }: MobileNavItemProps) {
    return (
      <li>
        <Popover.Button as={Link} href={href} className="block py-2">
          {children}
        </Popover.Button>
      </li>
    )
  }