<!--
Purpose: concise, actionable guidance for automated coding agents working in this workspace.
Keep this file small (20-50 lines). Only include facts discoverable in the repo.
-->
# Copilot / Automated Agent Instructions — Clutch monorepo

Quick context
- This repository is a multi-project monorepo for Clutch Protocol. Key folders:
  - `clutch-node/` — Rust blockchain node (Docker first, Rust/Cargo supported).
  - `clutch-hub-api/` — Rust backend (GraphQL/REST), normally run with Docker Compose.
  - `clutch-hub-sdk-js/` — TypeScript SDK used by demo and external apps.
  - `clutch-hub-demo-app/` — React/Vite demo app that depends on `clutch-hub-sdk-js`.
  - `clutchprotocol.github.io/` — Static marketing site (this folder).

What to do first (developer workflows)
- For quick website previews: open `clutchprotocol.github.io/index.html` or run a static server
  - Python: `python -m http.server 8000` from this directory
  - Node: `npx serve .`
- For backend/node development prefer Docker: both `clutch-node` and `clutch-hub-api` provide
  docker scripts and Dockerfiles. Use `docker-compose up --build` in each project or
  the root Docker Compose where applicable.
- Node/demo app: `cd clutch-hub-demo-app && npm install && npm run dev` (uses Vite).
- SDK: `cd clutch-hub-sdk-js && npm run build` to produce `dist/` (uses tsc).

Project-specific conventions (do not invent new rules)
- Use Conventional Commits for commit messages (see root READMEs). Prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`.
- Docker-first for reproducibility. When in doubt prefer editing Dockerfiles / ps1 scripts used in CI.
- Tests & CI: Rust crates use Cargo; JS packages rely on npm scripts. There are no centralized test harnesses in this repo — only module-level commands.

Architecture notes an agent should know
- clutc-node is the blockchain core (Rust) and exposes RPC/HTTP on configured ports (see `clutch-node/config/`).
- clutch-hub-api is the application bridge (Rust) offering GraphQL/REST to clients and talks to one or more nodes.
- clutch-hub-sdk-js performs signing, encoding, and HTTP requests to the Hub API — use it as the canonical client implementation.
- Demo app (`clutch-hub-demo-app`) is the integration consumer of the SDK; changes to the SDK often require bumping the demo's dependency and running `npm run update:sdk`.

Common tasks and exact examples
- Run website locally (from `clutchprotocol.github.io/`):
  - `python -m http.server 8000` or `npx serve .` or use VS Code Live Server.
- Build and run Hub API with Docker Compose (recommended):
  - `cd clutch-hub-api && cp env.example .env && docker-compose up --build`
- Dev on clutch-node (local):
  - `cd clutch-node && cargo run -- --env node1` or use provided scripts `scripts/docker-build.ps1` on Windows.
- Demo app dev:
  - `cd clutch-hub-demo-app && npm install && npm run dev`
- SDK package build:
  - `cd clutch-hub-sdk-js && npm run build`

Hints for edits and PRs
- When modifying the SDK, update `clutch-hub-demo-app/package.json` if API/exports change, then run demo `npm run update:sdk` and verify the demo builds.
- Avoid changing Docker network/port defaults unless a good reason — many scripts and READMEs assume default ports (node ~8081, hub-api ~3000).
- Preserve existing CSS/JS patterns in `clutchprotocol.github.io` (vanilla JS, no build step). Small interactive features live in `script.js` — prefer minimal, DOM-friendly changes.

Where to look for more details
- `clutch-node/README.md`, `clutch-hub-api/README.md`, `clutch-hub-demo-app/package.json`, and `clutch-hub-sdk-js/package.json` contain authoritative commands and conventions.

If anything here is ambiguous, ask for confirmation before making broad infra changes (CI, Docker Hub, DNS, or semantic-release config).

---
Please review and tell me if you want this shortened, more prescriptive, or expanded with CI/action examples.
