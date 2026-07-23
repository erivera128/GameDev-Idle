# Local development

## Prerequisites

- Node.js 22 LTS (Corepack enabled)
- pnpm 10 (Corepack installs the pinned version)
- Docker Desktop, for PostgreSQL and Redis

## Start the stack

1. Copy `.env.example` to `.env` and replace all development secrets before any public deployment.
2. Run `corepack enable` and `pnpm install`.
3. Run `docker compose up -d postgres redis`.
4. Run `pnpm dev`.

The web app is available at `http://localhost:3000`. The API health endpoint is `http://localhost:3001/health`; it returns 200 only when PostgreSQL and Redis are reachable.

To run the complete containerized stack, use `docker compose up --build`.

## Foundation conventions

- The API is authoritative for all game state.
- Time-based gameplay is stored as timestamps and durations, never in-memory timers.
- Cross-app API contracts belong in `packages/contracts`.
- New mutations must be transactional and auditable.
