# Codebase Structure

**Analysis Date:** 2026-04-04

## Directory Layout

```
bundled-kubejs/
├── apps/                           # Standalone applications
│   └── cf-server/                  # NestJS server for CurseForge proxy
│       ├── src/
│       │   ├── main.ts             # Application entry point
│       │   ├── app.module.ts       # NestJS root module
│       │   ├── api.ts              # CurseForge API client with caching
│       │   ├── env.ts              # Environment variable definitions
│       │   ├── common/             # Shared pipes, filters, interceptors
│       │   ├── curseforge/         # CurseForge endpoints and DTOs
│       │   ├── health/             # Health check endpoints
│       │   └── minecraft/          # Minecraft version endpoints and DTOs
│       ├── test/                   # E2E tests
│       ├── package.json            # App-specific dependencies
│       └── vite.config.ts          # Vite build configuration
│
├── libs/                           # Shared libraries
│   ├── core/                       # Core utilities and types
│   │   ├── src/
│   │   │   ├── main.ts             # Barrel export
│   │   │   ├── api/                # External API clients
│   │   │   │   └── server-fetch.ts # CurseForge API fetch with caching
│   │   │   ├── core/               # Core classes
│   │   │   │   └── archiver.ts     # ZIP file archiving utility
│   │   │   ├── types/              # Type definitions
│   │   │   │   ├── curseforge/     # CurseForge API types
│   │   │   │   ├── minecraft/      # Minecraft version types
│   │   │   │   ├── mod-loader-type.ts
│   │   │   │   └── template-generate-options.ts
│   │   │   ├── utils/              # Utility functions and helpers
│   │   │   │   ├── logger/         # Logging system
│   │   │   │   ├── curseforge/     # CurseForge utilities
│   │   │   │   │   ├── generate-manifest.ts
│   │   │   │   │   ├── generate-mod-list-html.ts
│   │   │   │   │   └── resolve-mods.ts
│   │   │   │   ├── minecraft/      # Minecraft utilities
│   │   │   │   │   └── get-latest-modloader-for-version.ts
│   │   │   │   ├── prepare-archiver.ts
│   │   │   │   ├── queue.ts
│   │   │   │   └── save-dialog.ts
│   │   │   ├── dialog.ts           # Dialog utilities (export point)
│   │   │   └── env.ts              # Environment configuration
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── generator/                  # Project generator CLI tool
│   │   ├── src/
│   │   │   ├── main.ts             # CLI entry point (yargs commands)
│   │   │   ├── core/
│   │   │   │   ├── generate.ts     # Project generation orchestrator
│   │   │   │   └── migrate.ts      # Migration logic (stub)
│   │   │   ├── types/              # CLI and template type definitions
│   │   │   │   ├── arg-options.ts
│   │   │   │   ├── template-config.ts
│   │   │   │   ├── commands/       # Command option types
│   │   │   │   └── mc/
│   │   │   │       └── required-mod-files.ts
│   │   │   ├── utils/
│   │   │   │   ├── template.ts     # EJS template renderer
│   │   │   │   ├── templates.ts    # Template loader and manager
│   │   │   │   ├── questionary.ts  # Interactive CLI prompts
│   │   │   │   ├── command/        # Command execution utilities
│   │   │   │   │   ├── command-builder.ts
│   │   │   │   │   └── command-executor.ts
│   │   │   │   ├── generator/
│   │   │   │   │   ├── generator-extension.ts
│   │   │   │   │   └── git.ts
│   │   │   │   └── minecraft/
│   │   │   │       └── get-minecraft-versions.ts
│   │   │   └── (no main export)
│   │   ├── templates/              # EJS project templates
│   │   ├── bin/                    # Executable scripts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── plugin/                     # Vite plugin and build tool
│       ├── src/
│       │   ├── main.ts             # Vite plugin export
│       │   ├── cli.ts              # CLI entry point (yargs command)
│       │   ├── const.ts            # Constants
│       │   ├── core/
│       │   │   ├── program.ts      # Build program orchestrator
│       │   │   └── vite.ts         # Vite builder abstraction
│       │   ├── types/
│       │   │   ├── args.ts         # CLI argument types
│       │   │   └── entry.ts        # Vite entry point types
│       │   ├── plugins/
│       │   │   ├── vite.plugin.ts  # Main Vite plugin (node internal check)
│       │   │   ├── swc.plugin.ts   # SWC transformation plugin
│       │   │   └── stats.plugins.ts # Build statistics plugin
│       │   ├── utils/
│       │   │   ├── debounce.ts
│       │   │   ├── is-node-internal-module.ts
│       │   │   └── programmatically-pause.ts
│       │   └── (no main export as library)
│       ├── types/                  # TypeScript type definitions
│       ├── bin/                    # CLI executable
│       ├── package.json
│       └── vite.config.ts
│
├── samples/                        # Sample projects
│   └── sample-1.18.2/              # Example KubeJS project
│       ├── src/                    # User project source (client/server/startup)
│       ├── mods/                   # Dependencies
│       └── .vscode/                # Editor configuration
│
├── .planning/                      # Planning and analysis documents
│   └── codebase/                   # Architecture and code analysis
│
├── .github/                        # CI/CD workflows
├── .idea/                          # IDE configuration
├── .nx/                            # Nx workspace data
├── node_modules/                   # Root dependencies
├── package.json                    # Monorepo root config
├── tsconfig.base.json              # TypeScript base configuration
├── nx.json                         # Nx workspace configuration
├── .prettierrc                     # Code formatting configuration
└── .yarnrc.yml                     # Yarn package manager configuration
```

## Directory Purposes

**`apps/`:**
- Purpose: Standalone applications (servers, services) that consume libraries
- Contains: NestJS applications, build servers
- Key files: `main.ts` (entry points), `app.module.ts` (module definitions)

**`libs/`:**
- Purpose: Reusable libraries exported via path aliases (@kubejs/core, @kubejs/generator, @kubejs/plugin)
- Contains: Shared utilities, types, logic consumed across monorepo
- Key files: `main.ts` (barrel exports), `package.json` (individual library config)

**`libs/core/src/api/`:**
- Purpose: External service integrations
- Contains: CurseForge API client (serverFetch), caching logic
- Key files: `server-fetch.ts` - cached fetch wrapper for CurseForge API v1

**`libs/core/src/core/`:**
- Purpose: Core abstractions and business classes
- Contains: Archiver class for ZIP creation
- Key files: `archiver.ts` - wraps archiver npm package with fluent API

**`libs/core/src/types/`:**
- Purpose: TypeScript type definitions for all major domains
- Contains: CurseForge API schemas, Minecraft version types, configuration interfaces
- Key files: Organized by domain (curseforge/, minecraft/)

**`libs/core/src/utils/`:**
- Purpose: Utility functions and helper classes
- Contains: Logger, CurseForge operations, Minecraft version resolution, archiving setup
- Key files: `logger/logger.ts` - centralized logging, `prepare-archiver.ts` - temp file setup

**`libs/generator/src/core/`:**
- Purpose: Generation orchestration logic
- Contains: Project generation and migration workflows
- Key files: `generate.ts` - main generation flow (template → manifest → archive)

**`libs/generator/src/utils/`:**
- Purpose: Generator tool utilities and helpers
- Contains: Template rendering, CLI prompts, command execution, Git integration
- Key files: `template.ts` - EJS renderer, `templates.ts` - template loader

**`libs/generator/templates/`:**
- Purpose: EJS project templates for different Minecraft versions/loaders
- Contains: Template files with .ejs extension, template configuration
- Key files: Organized by modloader (forge, neoforge) and version

**`libs/plugin/src/core/`:**
- Purpose: Build system orchestration
- Contains: Vite builder configuration and lifecycle management
- Key files: `vite.ts` - Vite builder facade, `program.ts` - build orchestrator

**`libs/plugin/src/plugins/`:**
- Purpose: Custom Vite plugins for build optimization
- Contains: Node module validation, SWC transformation, build statistics
- Key files: `vite.plugin.ts` - enforces Rhino compatibility

**`apps/cf-server/src/common/`:**
- Purpose: NestJS shared infrastructure
- Contains: Pipes, filters, interceptors, custom logger
- Key files: Module definitions for request handling

**`apps/cf-server/src/curseforge/`:**
- Purpose: CurseForge API proxy endpoints
- Contains: Controllers and DTOs for mod/project queries
- Key files: Organized by endpoint type

## Key File Locations

**Entry Points:**
- `libs/generator/src/main.ts`: Generator CLI (yargs) - spawned by `yarn kubejs:generator`
- `libs/plugin/src/cli.ts`: Plugin/build CLI (yargs) - spawned by `kubejs build`
- `apps/cf-server/src/main.ts`: NestJS server bootstrap
- `libs/plugin/src/main.ts`: Vite plugin export (used by other Vite configs)

**Configuration:**
- `tsconfig.base.json`: Base TypeScript configuration with path aliases for @kubejs/* imports
- `nx.json`: Nx workspace configuration defining build targets and plugins
- `package.json`: Root monorepo configuration with workspaces
- `libs/*/vite.config.ts`: Individual library Vite configs
- `apps/*/vite.config.ts`: Application Vite configs

**Core Logic:**
- `libs/core/src/core/archiver.ts`: ZIP file creation
- `libs/core/src/api/server-fetch.ts`: CurseForge API client
- `libs/generator/src/core/generate.ts`: Project generation orchestration
- `libs/generator/src/utils/template.ts`: EJS template rendering
- `libs/plugin/src/core/vite.ts`: Vite build configuration and execution

**Type Definitions:**
- `libs/core/src/types/curseforge/`: CurseForge API response types
- `libs/core/src/types/minecraft/`: Minecraft game version types
- `libs/core/src/types/template-generate-options.ts`: Generation options interface
- `libs/plugin/src/types/args.ts`: CLI argument types

**Utilities:**
- `libs/core/src/utils/logger/logger.ts`: Centralized logging
- `libs/core/src/utils/curseforge/`: Mod resolution and manifest generation
- `libs/core/src/utils/minecraft/`: Minecraft version lookup
- `libs/generator/src/utils/command/`: Child process execution with logging

## Naming Conventions

**Files:**
- `.ts` extension for TypeScript source files
- `*.plugin.ts` for Vite plugin implementations
- `*.decorator.ts` (not found but pattern for decorators)
- Descriptive names with hyphens: `server-fetch.ts`, `command-executor.ts`

**Directories:**
- Lowercase with hyphens: `client_scripts`, `server_scripts`, `startup_scripts`
- Domain-based grouping: `curseforge/`, `minecraft/`, `common/`
- Functional grouping: `utils/`, `types/`, `plugins/`, `core/`

**Classes and Exports:**
- PascalCase: `Archiver`, `Logger`, `Template`, `Vite`, `Program`
- Interfaces: `TemplateGenerateOptions`, `CfFetchResponse`, `Args`
- Constants: `ModLoaderType` enum, module names for Logger

**Functions:**
- camelCase: `generateManifest()`, `resolveMods()`, `prepareArchiver()`
- Descriptive action verbs: `generate`, `resolve`, `prepare`, `save`

## Where to Add New Code

**New Feature (Generator Command):**
- New command logic: `libs/generator/src/core/[command-name].ts`
- CLI registration: Add `.command()` in `libs/generator/src/main.ts`
- Types: `libs/generator/src/types/[domain]/`
- Tests: `libs/generator/[test structure to be determined]`

**New Utility in Core:**
- Implementation: `libs/core/src/utils/[feature]/[function].ts`
- Index export: Update `libs/core/src/utils/index.ts`
- Types: Colocate in `libs/core/src/types/`
- Usage: Import via `@kubejs/core` path alias

**New Vite Plugin Feature:**
- Plugin implementation: `libs/plugin/src/plugins/[feature].plugin.ts`
- Registration: Add to plugins array in `libs/plugin/src/core/vite.ts` createBuilderFor()
- Types: `libs/plugin/src/types/`

**New Minecraft Version Support:**
- Logic: `libs/core/src/utils/minecraft/`
- Types: `libs/core/src/types/minecraft/`
- Integration: Update version lookup functions

**New CurseForge Integration:**
- API function: `libs/core/src/utils/curseforge/`
- Types: `libs/core/src/types/curseforge/`
- Caching: Use `serverFetch()` for API calls

**Server Endpoints (cf-server):**
- Controller: `apps/cf-server/src/[domain]/[domain].controller.ts`
- Service: `apps/cf-server/src/[domain]/[domain].service.ts`
- DTO: `apps/cf-server/src/[domain]/dto/`
- Module: Import service/controller in domain module

## Special Directories

**`libs/generator/templates/`:**
- Purpose: EJS project templates for modpack generation
- Generated: No - templates are committed source files
- Committed: Yes
- Structure: Each template has `package.json` with `template.config.json` metadata

**`samples/sample-1.18.2/`:**
- Purpose: Example KubeJS project demonstrating structure
- Generated: Yes (produced by generator tool, but committed as reference)
- Committed: Yes
- Contents: `src/` (user code), `mods/` (dependencies)

**`.nx/workspace-data/`:**
- Purpose: Nx cache and workspace metadata
- Generated: Yes - automatically by Nx during builds
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes - by yarn install
- Committed: No (in .gitignore)
- Note: Monorepo root has single node_modules; workspaces may have local installations

**`.planning/codebase/`:**
- Purpose: Architecture and codebase analysis documents
- Generated: No (manually maintained)
- Committed: Yes
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

---

*Structure analysis: 2026-04-04*
