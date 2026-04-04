# External Integrations

**Analysis Date:** 2026-04-04

## APIs & External Services

**CurseForge API:**
- Service: CurseForge Mod Database API (https://api.curseforge.com/v1/)
- What it's used for:
  - Fetching Minecraft mod metadata in `libs/core/src/api/server-fetch.ts`
  - Getting mod version compatibility information in `libs/generator/src/utils/minecraft/get-minecraft-versions.ts`
  - Resolving mod dependencies for project manifests
  - Querying mod loader version compatibility for Forge/NeoForge
- SDK/Client: Native `fetch()` API with custom wrapper
- Auth: API key via `CURSEFORGE_API_KEY` environment variable (required in `apps/cf-server/src/env.ts`)
- Key endpoints:
  - `GET /v1/mods/{modId}` - Fetch mod details
  - Returns CfMod data structure from `libs/core/src/types/curseforge/cf-mod.ts`

**Minecraft Forge/NeoForge API:**
- Service: Minecraft mod loader version data
- What it's used for:
  - Determining compatible Minecraft versions for KubeJS and ProbeJS mods
  - Selecting appropriate mod loader type (Forge vs NeoForge)
- Accessed via: CurseForge API (mod metadata includes game version info)
- ProbeJS mod interaction:
  - Expects `.probe/{client|server|startup}/probe-types/` directory structure
  - Generates type definitions for autocomplete (`libs/plugin/src/core/vite.ts` line 267-282)

## Data Storage

**Databases:**
- Not used - No persistent database integration detected

**File Storage:**
- Local filesystem only
  - Temporary directories for project generation (`temp-dir` 3.0.0)
  - ZIP file creation via archiver in `libs/core/src/core/archiver.ts`
  - Minecraft mod directory structure: `mods/`, `kubejs/client_scripts`, `kubejs/server_scripts`, `kubejs/startup_scripts`
  - Node modules cache: `node_modules/.kubejs/types/` for generated type definitions

**Caching:**
- In-memory cache for CurseForge API responses:
  - `libs/core/src/api/server-fetch.ts` - Simple Map-based caching
  - `apps/cf-server/src/api.ts` - CurseForge fetch wrapper with caching
- No external cache service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- Custom/None - No user authentication system
- CurseForge API authentication only (API key-based)

**Git Integration:**
- Git operations via simple-git in `libs/generator/src/utils/generator/generator-extension.ts`
- Supports:
  - Initializing local repository
  - Adding remote repository
  - Configuring git user name/email
  - Initial commit and push to remote
- No GitHub OAuth or advanced git features

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service integrated

**Logs:**
- Custom Logger utility in `libs/core/src/utils/logger/logger.ts`
- Used with @LogActions decorator for method tracing
- Outputs to console (stdout/stderr)
- Log levels: info, warn, error
- Examples:
  - `libs/core/src/core/archiver.ts` - Archive process logging
  - `libs/plugin/src/core/vite.ts` - Build watch/rebuild logging
  - `libs/generator/src/utils/generator/generator-extension.ts` - Git operation logging

## CI/CD & Deployment

**Hosting:**
- NPM Registry - Package distribution
- GitHub - Source code repository (https://github.com/MDReal32/bundled-kubejs.git)

**CI Pipeline:**
- GitHub Actions: `.github/workflows/publish-to-npm.yml`
- Triggered on: Push to master branch
- Process:
  1. Detects changed packages in `libs/` workspace
  2. Checks npm registry for existing published version
  3. Compares git tags with current changes
  4. Builds only changed/new packages
  5. Publishes to npm with `publish:me` script
- Matrix strategy for parallel package publishing
- Requires `NPM_TOKEN` secret for authentication

**Build Process:**
- Nx task orchestration with caching (`nx.json`)
- Per-package Vite builds with source maps and type definitions
- Build dependencies:
  - `@kubejs/core` - depended on by `@kubejs/plugin` and `@kubejs/generator`
  - `@kubejs/plugin` and `@kubejs/generator` - standalone publishable packages
  - `@kubejs/cf-server` - NestJS app, not published

## Environment Configuration

**Required env vars:**
- `CURSEFORGE_API_KEY` - API key for CurseForge API (apps/cf-server)
- `NODE_AUTH_TOKEN` - NPM registry authentication token (CI/CD only)
- `API_URL` - Core library API configuration (libs/core/src/env.ts)

**Secrets location:**
- `.yarnrc.yml` - References `$NODE_AUTH_TOKEN` for npm authentication
- GitHub Actions secrets (not in repo):
  - `NPM_TOKEN` - Used in `publish-to-npm.yml` workflow
- `.env` file pattern supported but not committed (typical pattern)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Git push operations in `libs/generator/src/utils/generator/generator-extension.ts`
  - Optional git repository push when `gitRepo` option provided
  - Push to master branch after initial commit

## Project Generation & Templates

**Template System:**
- EJS templating in `libs/generator` for project scaffolding
- Templates directory included in package distribution
- Dynamic template loading via `libs/generator/src/utils/templates.ts`
- Supports multiple Minecraft/mod loader versions:
  - Minecraft 1.18.2 (Forge, NeoForge)
  - Minecraft 1.21.1 (Forge, NeoForge)

**Manifest Generation:**
- CurseForge manifest.json creation in `libs/core/src/utils/curseforge/generate-manifest.ts`
- Modlist HTML generation in `libs/core/src/utils/curseforge/generate-mod-list-html.ts`
- Dynamic mod resolution based on required mods (KubeJS, ProbeJS)

## External Module Dependencies

**Compilation & Transformation:**
- SWC (Rust-based transpiler) - High-performance TypeScript compilation
- Babel - For additional transformation plugins
- Rollup/Vite - Module bundling and optimization

**Development Tools:**
- Actions/checkout@v4 - Git checkout in CI
- Actions/setup-node@v4 - Node.js environment setup in CI
- jq - JSON query tool in CI scripts
- corepack - Node.js package manager version manager

---

*Integration audit: 2026-04-04*
