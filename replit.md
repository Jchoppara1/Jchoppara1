# Del Bar Wine List Manager

## Overview

pnpm workspace monorepo hosting the Del Bar Wine List Manager app — a restaurant wine catalog with automatic food pairings, wine profiles, price categorization, and an admin panel. Uses CSV-based in-memory storage (no database required).

## Artifacts

- **`artifacts/delbar-wine`** — React + Vite frontend (mounted at `/`)
- **`artifacts/api-server`** — Express API server (mounted at `/api`)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS v3
- **API framework**: Express 5
- **Storage**: CSV-based in-memory (MemStorage) — no PostgreSQL needed
- **Validation**: Zod, `drizzle-zod`
- **Routing**: Wouter (frontend)
- **Build**: esbuild (server bundle)

## Data Files

- `delbarcsv/wine_list.csv` — bottle wine list (66 wines)
- `delbarcsv/food_menu.csv` — food menu (37 dishes)
- `attached_assets/wines_by_glass.csv` — by-the-glass wines (23 wines)

## Shared Modules

Shared types and business logic (schemas, pairing engine, wine profiles, etc.) live at:
- `artifacts/api-server/src/shared/` — used by the backend
- `artifacts/delbar-wine/src/shared/` — used by the frontend via `@shared/` alias

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/delbar-wine run dev` — run frontend locally

## Environment Variables

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — required for admin panel login
- `SESSION_SECRET` — session signing secret (defaults to fallback if not set)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
