"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import avatarImage from "@/images/avatar.jpg";
import { Avatar, AvatarContainer, clamp } from "./Avatar";
import { usePathname } from "next/navigation";

import { Container } from "./Container";
import { MobileNavigation } from "./MobileNavigation";
import { DesktopNavigation } from "./DesktopNavigation";
import ThemeSelector from "./ThemeSelector";
import { NavRoutes } from "@/constants/nav_routes";

export default function HeaderComponent() {
  let isHomePage = usePathname() === "/";

  let headerRef = useRef<HTMLHeadingElement>();
  let avatarRef = useRef<HTMLDivElement>(null);
  let isInitial = useRef(true);

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0;
    let upDelay = 64;

    function setProperty({ property, value }: { [key: string]: any }): void {
      document.documentElement.style.setProperty(property, value);
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property);
    }

    function updateHeaderStyles() {
      let { top, height } = headerRef.current?.getBoundingClientRect() ?? {
        top: 0,
        height: 0,
      };
      let scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      );

      if (isInitial.current) {
        setProperty({ property: "--header-position", value: "sticky" });
      }

      setProperty({ property: "--content-offset", value: `${downDelay}px` });

      if (isInitial.current || scrollY < downDelay) {
        setProperty({
          property: "--header-height",
          value: `${downDelay + height}px`,
        });
        setProperty({ property: "--header-mb", value: `${-downDelay}px` });
      } else if (top + height < -upDelay) {
        let offset = Math.max(height, scrollY - upDelay);
        setProperty({ property: "--header-height", value: `${offset}px` });
        setProperty({ property: "--header-mb", value: `${height - offset}px` });
      } else if (top === 0) {
        setProperty({
          property: "--header-height",
          value: `${scrollY + height}px`,
        });
        setProperty({ property: "--header-mb", value: `${-scrollY}px` });
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty({
          property: "--header-height",
          value: `${scrollY + height}px`,
        });
        setProperty({ property: "--header-mb", value: `${-scrollY}px` });
      } else {
        removeProperty("--header-inner-position");
        setProperty({ property: "--header-top", value: "0px" });
        setProperty({ property: "--avatar-top", value: "0px" });
      }
    }

    function updateAvatarStyles(): void {
      if (!isHomePage) {
        return;
      }

      let fromScale = 1;
      let toScale = 36 / 64;
      let fromX = 0;
      let toX = 2 / 16;

      let scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty({
        property: "--avatar-image-transform",
        value: `translate3d(${x}rem, 0, 0) scale(${scale})`,
      });

      let borderScale = 1 / (toScale / scale);
      let borderX = (-toX + x) * borderScale;
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty({
        property: "--avatar-border-transform",
        value: borderTransform,
      });
      setProperty({
        property: "--avatar-border-opacity",
        value: scale === toScale ? 1 : 0,
      });
    }

    function updateStyles() {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    }

    updateStyles();
    window.addEventListener("scroll", updateStyles, { passive: true });
    window.addEventListener("resize", updateStyles);

    return () => {
      window.removeEventListener("scroll", updateStyles);
      window.removeEventListener("resize", updateStyles);
    };
  }, [isHomePage]);

  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex flex-col"
        style={{
          height: "var(--header-height)",
          marginBottom: "var(--header-mb)",
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef}
              className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
            />
            <Container
              className="top-0 order-last -mb-3 pt-3"
              style={{ position: "var(--header-position)" as any}}
            >
              <div className="relative">
                <AvatarContainer
                  className="absolute left-0 top-3 origin-left transition-opacity"
                  style={{
                    opacity: "var(--avatar-border-opacity, 0)",
                    transform: "var(--avatar-border-transform)",
                  }}
                />
                <Avatar
                  large
                  className="block h-16 w-16 origin-left"
                  style={{ transform: "var(--avatar-image-transform)" }}
                />
              </div>
            </Container>
          </>
        )}
        <div
          ref={headerRef as any}
          className="top-0 z-10 h-16 pt-6"
          style={{ position: "var(--header-position)" as any}}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{ position: "var(--header-inner-position)" }}
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )}
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <MobileNavigation links={NavRoutes} className="pointer-events-auto md:hidden"/>
                <DesktopNavigation links={NavRoutes} className="pointer-events-auto hidden md:block" />
              </div>
              <div className="flex justify-end md:flex-1">
                <div className="pointer-events-auto">
                  <ThemeSelector />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && <div style={{ height: "var(--content-offset)" }} />}
    </>
  );
}
