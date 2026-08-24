# Steal-decision frontend

React + TypeScript (Vite) + shadcn/ui web UI for `backend/`'s
steal-decision API. See the repo root `README.md`'s "Web app" section
for the full picture.

## Prerequisites

- Node 18+
- The backend running (see `backend/README.md`) — this app has no
  standalone mode, every prediction and player search goes through it.

## Running

```bash
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`, or the
next free port if that's taken). In dev, `/api/*` requests are proxied
to the backend at `http://localhost:8080` (see `vite.config.ts`) — if
the backend is running on a different port, override it:

```bash
BACKEND_URL=http://localhost:9001 npm run dev
```

## Building

```bash
npm run build
```

Routes are lazy-loaded per page (`App.tsx`), and `vite.config.ts`
manually splits large vendor libraries (`motion`/`framer-motion`,
`radix-ui`, `react`/`react-dom`) into their own chunks — keeps any
single chunk well under the 500KB warning threshold instead of one
large shared bundle.

## Project layout

```
frontend/src/
  App.tsx                          # react-router routes, one lazy-loaded page per route
  pages/
    HomePage.tsx                     # landing page
    PredictorPage.tsx                  # the situation form + result
    ModelPerformancePage.tsx             # backtest numbers/tables
    AboutPage.tsx                          # project + Retrosheet attribution
  components/
    layout/
      AppLayout.tsx      hell (NavBar + Footer +<Outlet/>)
      NavBar.tsx         p nav + mobile hamburgermenu
      Footer.tsx
    graphics/
      DiamondField.tsx, Dsite's diamondmark/graphics
    ui/                  adcn/ui primitives + amotion/animation component set
    SituationForm.tsxinning/half/outs/base-state/score/target/count/double-steal
    PlayerCombobox.tsx    # shadcn Command+Popoversearch, reused for runner/pitcher/catcher
    PlayerInput.tsx, Play    # player selection +read-only stat summary
    ManualStatsForm.tsx        # manual stat entrywhen a role isn't set to a real player
    ResultCard.tsx               # GO/HOLD badge,win probabilities, break-even, share link
  lib/
    types.ts                          # mirrors backend/internal/decision's
types + API DTOs field-fo
    api.ts                              # typed fetch wrapper (searchPlayers,
predictStealDecision)
    manual-entry-defaults.ts              # clamp ranges + defaults for manual
stat fields
    manual-player-storage.ts                # per-role localStorage
persistence for manual en
    share-link.ts                             # encodes/decodes a full
Situation into the `?s=`
    backtest-data.ts                            # static data behind the Model
Performance page
  hooks/
    useSlowRequestHint.tsthe server" hint after arequest runs long (Render cold starts)
    useClickOutside.tsx,
```

Player search auto-fills a real player's stats into the situation by
default. Switching a roletatsForm.tsx`)
lets you type stats directly instead — the form remembers what you
last entered per role vialayer-storage.ts`).

## Security

`vercel.json` sets a stri`, no
unsafe-inline/eval), plus `X-Content-Type-Options`, `X-Frame-Options:
DENY`, `Referrer-Policy`,sions-Policy`. If a
future change needs a new script/font/analytics origin, it has to be
added explicitly to the r's an allowlist,
not permissive by default.

## Adding more shadcn/ui components

```bash
npx shadcn@latest add <co
```

This project was initialized with `-t vite -b radix -p nova` (Vite
target, Radix-based primi) — keep new
components consistent with that unless you deliberately want to change
the look.
