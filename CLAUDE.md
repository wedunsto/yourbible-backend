# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is an early-stage skeleton, not the full system described in README.md. The README describes a product
vision (Ionic Angular frontend, TypeScript Node.js backend, Anthropic API, PostgreSQL), but the actual code
in this repo is a **plain JavaScript Express backend** (`server.js`) — there is no TypeScript anywhere (no
`.ts` files, no `tsconfig.json`, `package.json` sets `"type": "commonjs"`). Treat `server.js` and
`package.json` as the source of truth for what exists today, not the README.

Also note the README's "Backend Setup" section still has leftover `dotnet restore` / `dotnet run` steps from
an earlier .NET-based version of the plan — those don't apply; use the npm commands below instead.

Currently implemented: a single Express app with one health-check route. There is no database connection
code, no models/controllers, no routing modules, and no auth yet — all of that is greenfield.

## Commands

- `npm start` — run the server (`node server.js`)
- `npm run dev` — run with autoreload (`nodemon server.js`)
- `npm test` — not implemented (script exits with an error placeholder)

There is no lint config or test framework wired up yet. If asked to add tests, ask which framework the user
wants before picking one.

## Architecture notes

- Single entry point: `server.js`. Express app listens on a hardcoded `PORT = 3000` (no `process.env.PORT`
  fallback yet).
- `database/.env` holds Postgres connection settings (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`,
  `PGDATA`) but nothing in the codebase reads it yet — there's no `dotenv` dependency and no `pg`/ORM client
  wired in. This looks like it's staged for a future Postgres/Docker setup rather than active config.
- `.gitignore` excludes `.env`/`.env.*` everywhere in the repo, so `database/.env` stays untracked — don't
  add exceptions for it.
