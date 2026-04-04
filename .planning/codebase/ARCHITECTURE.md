# Architecture

**Analysis Date:** 2026-04-04

## Pattern Overview

**Overall:** Monorepo with library-based modular architecture using Nx as the build orchestrator.

**Key Characteristics:**
- Nx workspace for dependency management and caching
- ESM module format with TypeScript
- Three distinct functional layers: libraries (shared), applications (servers/tools), and samples
- Command-driven architecture for both generator and build tool
- Vite-based compilation with custom plugin system

## Layers

**Core Library (`@kubejs/core`):**
- Purpose: Provides core utilities, types, and business logic for KubeJS ecosystem
- Location: `libs/core/src/`
- Contains: Type definitions, CurseForge API client, archiving utilities, logger, Minecraft version resolution
- Depends on: External packages (archiver, axios-like fetch)
- Used by: Generator library, cf-server app, plugin library

**Generator Library (`@kubejs/generator`):**
- Purpose: CLI tool for generating new KubeJS projects from templates
- Location: `libs/generator/src/`
- Contains: Command-line interface (yargs), template rendering engine (EJS), project generation logic
- Depends on: Core library, EJS rendering, yargs CLI framework
- Used by: End users via CLI command; not directly by other code

**Plugin Library (`@kubejs/plugin`):**
- Purpose: Vite plugin and build tool for KubeJS projects
- Location: `libs/plugin/src/`
- Contains: Vite plugin implementation, CLI for build orchestration, SWC compilation plugin, file watching
- Depends on: Vite, Chokidar for file watching, SWC for transformation
- Used by: KubeJS projects during development and build phases

**CurseForge Server App (`apps/cf-server`):**
- Purpose: NestJS server providing REST endpoints for CurseForge data
- Location: `apps/cf-server/src/`
- Contains: NestJS modules for health checks, CurseForge API proxying, Minecraft version endpoints
- Depends on: Core library, NestJS framework
- Used by: Generator and other tools as data source for mod/version resolution

## Data Flow

**Project Generation Flow:**

1. User invokes: `kubejs:generator generate [options]`
2. `libs/generator/src/main.ts` parses CLI arguments via yargs
3. `generate()` function in `libs/generator/src/core/generate.ts`:
   - Calls `questionary()` for user prompts (if args incomplete)
   - Creates `Template` instance and loads template from `libs/generator/templates/`
   - Renders EJS templates to temporary directory
   - Calls `generateManifest()` from core to fetch mod metadata
   - Calls `generateModListHtml()` to create mod list documentation
   - Uses `Archiver` class to package everything into ZIP
   - Saves via file dialog or to specified output path
4. Returns: ZIP file containing complete CurseForge modpack

**Build Compilation Flow:**

1. User invokes: `kubejs build [options]`
2. `libs/plugin/src/cli.ts` parses arguments
3. `Program` class orchestrates Vite compilation
4. `Vite<TArgs>` class in `libs/plugin/src/core/vite.ts`:
   - Scans `src/` directory for entry points: `client`, `server`, `startup`
   - Creates Vite builder configuration with entry graph
   - Applies custom plugins (statsPlugin, swcPlugin, vitePlugin)
   - Builds or watches for changes
   - Outputs to `kubejs/{client_scripts, server_scripts, startup_scripts}/`
5. Optional watch mode: Uses chokidar to detect topology changes and rebuild incrementally

**CurseForge API Flow:**

1. Generator/tools call `resolveMods()` from `libs/core/src/utils/curseforge/`
2. Uses `serverFetch()` in `libs/core/src/api/server-fetch.ts` for server-side calls
3. Constructs URL to CurseForge v1 API: `https://api.curseforge.com/v1/...`
4. Caches responses in memory Map for subsequent requests
5. Returns typed response objects (CfFile, CfMod, CfManifest)

**State Management:**

- **Immutable request caching**: In-memory Map in `serverFetch()` caches API responses per URL
- **Temporary file management**: `prepareArchiver()` creates isolated temp directories with cleanup on process exit
- **Template state**: Template class scans and caches file list in memory during prepare phase
- **Logger state**: Logger instances track context prefix for formatted output

## Key Abstractions

**Archiver Class:**
- Purpose: Abstracts ZIP file creation with recursive directory/file appending
- Examples: `libs/core/src/core/archiver.ts`
- Pattern: Builder pattern with chainable methods; wraps archiver npm package
- Usage: Generator loads file/directory into archiver, then calls `archive()` to finalize ZIP

**Logger Class:**
- Purpose: Centralized prefix-based logging with depth control for objects
- Examples: `libs/core/src/utils/logger/logger.ts`
- Pattern: Singleton-style class instantiated with prefix context
- Usage: All modules create Logger("ModuleName") and call `info()`, `warn()`, `error()`

**Template Class:**
- Purpose: Encapsulates EJS template rendering and Git initialization
- Examples: `libs/generator/src/utils/template.ts`
- Pattern: Orchestrator that manages template lifecycle (prepare → generate)
- Usage: Generator loads template by name, calls `prepare()` then `generate(options)`

**Vite Class:**
- Purpose: Orchestrates Vite compiler configuration and build/watch lifecycle
- Examples: `libs/plugin/src/core/vite.ts`
- Pattern: Facade over Vite API; handles entry point discovery and plugin composition
- Usage: Program passes build args to Vite, which executes build or watch mode

**CommandExecutor Class:**
- Purpose: Decorates spawning of child processes with logging
- Examples: `libs/generator/src/utils/command/command-executor.ts`
- Pattern: Executes shell commands and pipes stdout; decorated with @LogActions
- Usage: GeneratorExtension extends this to run git commands

## Entry Points

**CLI: Generate Command:**
- Location: `libs/generator/src/main.ts`
- Triggers: User runs `yarn kubejs:generator generate [options]`
- Responsibilities: Argument parsing, questionary prompts, delegation to generate() function

**CLI: Build Command:**
- Location: `libs/plugin/src/cli.ts`
- Triggers: User runs `kubejs build [--root] [--watch]`
- Responsibilities: Argument parsing, Program instantiation, execution delegation

**Server: Bootstrap:**
- Location: `apps/cf-server/src/main.ts`
- Triggers: NestJS application startup
- Responsibilities: NestFactory creates app, binds to PORT from env

**NestJS Module:**
- Location: `apps/cf-server/src/app.module.ts`
- Triggers: During application initialization
- Responsibilities: Minimal setup; logs request paths via middleware

## Error Handling

**Strategy:** Promise rejections bubble to process.exit(1) in CLI tools; NestJS handles HTTP errors

**Patterns:**
- CLI commands wrap in try-catch, log error, exit with code 1
- Generator template rendering throws on missing variables
- Archiver emits "error" event and rejects promise on failure
- Fetch operations throw on HTTP error status (5xx, 4xx)
- Logger @LogActions decorator logs method calls and catch errors

## Cross-Cutting Concerns

**Logging:**
- All modules use Logger class instantiated with module name prefix
- Output to console.log/warn/error with formatted template "[ModuleName] message"

**Validation:**
- CLI argument validation via yargs options (type, choices)
- Template options validated through questionary prompts with defaults
- Type safety via TypeScript interfaces (TemplateGenerateOptions, TemplateConfig, Args)

**Authentication:**
- CurseForge API key passed via env.CURSEFORGE_API_KEY header
- cf-server wraps public API calls with internal cache

---

*Architecture analysis: 2026-04-04*
