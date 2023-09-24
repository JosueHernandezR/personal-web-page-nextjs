import { Container } from "@/components/Container";
import { NavLink } from "./NavLink";
import { NavRoutes } from "@/constants/nav_routes";

export default function Footer(): JSX.Element {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pt-8 pb-16 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {NavRoutes.map((navigation) => (
                  <NavLink key={navigation.href} href={navigation.href}>
                    {navigation.label}
                  </NavLink>
                ))}
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                © {new Date().getFullYear()} all rights reserved.
              </p>
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  );
}