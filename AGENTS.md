# AGENTS.md

Guidance for AI agents working in this repository.

## Project Structure

- `josuehernandez/` — the actual Next.js app (Next.js 16 + Tailwind CSS 4 + React 19, pnpm workspace).
  - `app/[lng]/` — main pages (Home `page.tsx`, `Experience.tsx`, `projects/`, `contact/`).
  - `components/` — custom components (`ui/`, `cards/`, `projects/`, `3d/`, `icons/`).
  - `public/content/` — static content (projects, experiences, education).
  - `styles/` — Tailwind global styles.
- `.agents/skills/` — agent skills for Zed (GSAP suite + motion).
- `.zed/` — Zed project settings (`settings.json`, `mcp.json`).

## Agent Skills (Zed)

Skills live in `.agents/skills/` and are loaded automatically by Zed. The GSAP suite comes from the official [greensock/gsap-skills](https://github.com/greensock/gsap-skills) repo:

- `gsap-core` — tweens, easing, stagger, defaults
- `gsap-timeline` — sequencing, position parameter, playback
- `gsap-scrolltrigger` — scroll-linked animations, pinning, scrub
- `gsap-plugins` — ScrollTo, Flip, Draggable, SplitText, CustomEase, etc.
- `gsap-utils` — clamp, mapRange, normalize, snap, etc.
- `gsap-react` — useGSAP hook, refs, cleanup, SSR
- `gsap-performance` — 60fps best practices
- `gsap-frameworks` — Vue/Svelte lifecycle (not used here)
- `motion-framer` — Framer Motion / motion (React)

**Rule:** When the user asks for animation in this React/Next.js project, prefer GSAP (use `gsap-react` + `gsap-core` + `gsap-scrolltrigger` as needed) unless the user explicitly asks for Framer Motion. GSAP is the recommended library for timelines and scroll-driven animation.

## Goal

This repo is being evolved into a **new version** of the personal web page. Expect animation-heavy work (hero, scroll effects, cards) using GSAP + ScrollTrigger. Keep changes minimal, consistent with existing patterns, and validate with `pnpm run lint` / `pnpm run build` inside `josuehernandez/`.
