# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page dashboard for tracking hackathons in real time: countdown header, team member
cards, an editable task board with one-click status actions, a milestone timeline, workload
summary, wins log, and a parking lot for postponed ideas. Supports multiple hackathons (list +
detail view), each with its own participants, milestones, tasks, wins, and parking lot.

The frontend works standalone with `localStorage` persistence, or syncs to MongoDB via the
optional backend — the header shows a **Live**/**Offline** chip indicating which mode is active.

## Commands

Frontend (repo root):
```bash
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run preview
```

Backend (`server/`, optional — only needed for MongoDB persistence):
```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI
npm run dev             # tsx watch, http://localhost:4000
npm run start            # tsx (no watch)
```

There are no test suites configured in either package.

## Architecture

**Two deployment shapes share the same Express app.** `server/src/app.ts` exports the Express
app (routes, middleware, lazy `connectDB()` via `ready()`). Locally, `server/src/index.ts`
calls `ready()` then `app.listen()`. On Vercel, `api/index.ts` re-exports the same app as a
serverless function (no `.listen()`); `vercel.json` rewrites `/api/:path*` to it and everything
else to `index.html`. `server/src/db.ts` caches the Mongoose connection on `globalThis` so
warm serverless invocations reuse it.

**Frontend is fully decoupled from the backend's presence.** `src/api.ts` picks `API_BASE` from
`VITE_API_URL`, defaulting to `http://localhost:4000/api` in dev or same-origin `/api` in prod
builds. Pages using the API (`src/pages/HackathonList.tsx`, `src/pages/HackathonDetail.tsx`)
fall back to `localStorage` (via `src/hooks/useLocalStorage.ts` and seed data in
`src/data/defaults.ts`) when the API is unreachable — this is what drives the Live/Offline
indicator in `src/components/Header.tsx`.

**Routing**: `src/App.tsx` defines two routes — `/` (`HackathonList`) and
`/hackathons/:hackathonId` (`HackathonDetail`). All dashboard widgets
(`TaskBoard`, `TeamMembers`, `Timeline`, `TeamWorkload`, `WinsToday`, `ParkingLot`, etc. in
`src/components/`) are rendered inside `HackathonDetail` and scoped to one hackathon.

**API shape mismatch is intentional and handled in `src/api.ts`.** Mongo documents use `_id`
and a separate `taskId` field for tasks; the frontend's `Task`/`Hackathon`/etc. types (in
`src/types.ts`) use `id`. The `toTask`/`toHackathon`/`toHackathonSummary` converters in
`src/api.ts` do this translation in both directions — extend them if you change either the
Mongoose schemas (`server/src/models/`) or the frontend types.

**Data model**: One `Hackathon` document embeds its `participants` and `milestones` directly
(see `server/src/models/Hackathon.ts`); `Task`, `Win`, and `ParkingLotItem` are separate
collections referencing `hackathonId`. Mongoose collection names are prefixed `hackathon_*`
(e.g. `hackathon_tasks`) to namespace them if the database is shared. Tasks use their own
generated `taskId` string (not Mongo `_id`) as the stable external identifier, and support a
`primaryOwner` plus a `secondaryOwners` array for multi-owner assignment.

**Route nesting**: `server/src/routes/tasks.ts`, `wins.ts`, and `parkingLot.ts` are mounted with
`Router({ mergeParams: true })` under `/api/hackathons/:hackathonId/...` in `server/src/app.ts`,
so every task/win/parking-lot query is implicitly scoped to a hackathon via `req.params.hackathonId`.

## Notes

- There is no authentication on the API — local/team use only.
- `server/.env` is gitignored (holds `MONGO_URI`, which may contain credentials).
- Keyboard shortcuts in the UI: `/` focuses task search, `N` focuses the "add a win" input,
  `D` toggles dark mode.
