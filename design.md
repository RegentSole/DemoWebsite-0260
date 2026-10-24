# Demo Portfolio — Design

> Starter design brief. Replace this content with the app you're building before writing any UI.
> Keep it short and concrete — it's the single source of truth for palette, typography, pages,
> screens, and flows across web, mobile, and desktop.

Russian demo portfolio, web only. Reference: supplied screenshot with oversized bold name upper left, glossy purple spheres cropped upper right, wide negative space and rounded project surface. Keep original user content only. Light default with saved dark theme.

## Brand & Colors

One token set, consumed per platform:

- **Web & desktop**: CSS variables in `packages/web/src/web/styles.css` (desktop loads the web UI).
- **Mobile**: `Colors.light` / `Colors.dark` in `packages/mobile/constants/theme.ts`, read via `useColors()`; `userInterfaceStyle: "automatic"` follows the system light/dark setting.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| primary | #7451D9 | #BBA3FF | Buttons, active tab, accents |
| background | #F7F6F2 | #111210 | Page/screen background |
| card | #EFEEE8 | #1B1D18 | Cards, surfaces |
| foreground | #222321 | #F2EEDF | Primary text |
| mutedForeground | #696963 | #AFB0A7 | Secondary text |
| border | #DCDCD3 | #34372E | Hairlines |
| destructive | #DC2626 | #EF4444 | Delete / errors |

## Typography

Poppins Latin / Manrope Cyrillic with sans fallback. Bold display 80–110px, body 15–18px with generous line height. Maximum width 1120px, 80px desktop gutters and 24px mobile gutters. Rounded 28px surfaces. Restrained staggered entrance, reduced-motion support.

## Pages & Screens

One home route: asymmetric hero, introduction, featured Palette Lab with 5 copyable HEX swatches, then Focus Timer and Weather Cards in a two-column panel. Mobile stacks everything. CSS spheres are decorative, no external photography required.

- **Web — Home** (`packages/web/src/web/pages/index.tsx`) — what the user sees first.
- **Mobile — Home** (`packages/mobile/app/(tabs)/index.tsx`) — main tab.
- Add web pages under `src/web/pages/` (+ route in `app.tsx`); mobile tabs under `app/(tabs)/`, stack/modal screens under `app/`.

## Key User Flows

1. Generate 5 random colors, copy a HEX with accessible status feedback.
2. Toggle light/dark and save theme locally. Start/pause/reset a 25/5 Pomodoro. Switch weather city with explicitly static demo data. No fabricated personal contacts or project links.

## Architecture

- **API**: typed oRPC client (`lib/api.ts` in each package) → the backend in `@template/web`. Query/mutation hooks live in `queries/` (one file per feature); pages/screens call them with `@tanstack/react-query`.
- **State/sync**: TanStack Query with optimistic updates for instant-feel interactions.
- **Auth / payments / uploads**: see `skills/app/references/` when those features are needed.
