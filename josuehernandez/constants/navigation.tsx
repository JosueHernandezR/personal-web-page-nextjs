import { NavigationItem } from "@/models/navigation_item";

export const navigation: NavigationItem[] = [
    {
      name: "nav_start_label",
      href: "/",
      current: false,
      isVisibleMobile: true,
      isVisibleDesktop: false,
    },
    {
      name: "nav_projects_label",
      href: "/projects",
      current: false,
      isVisibleMobile: true,
      isVisibleDesktop: true,
    },
  ];
  