<!-- GSD:project-start source:PROJECT.md -->
## Project

**bundled-kubejs + bundled_kubejs_dev Mod**

A TypeScript monorepo (bundled-kubejs) providing tooling for KubeJS Minecraft modpacks — including a Vite-based build plugin, a project generator, and a CurseForge API proxy. The project is now expanding to include **`bundled_kubejs_dev`**: a companion Kotlin NeoForge mod that serves as an in-game dev bridge scaffold, providing a clean foundation for future game-side integration with the existing toolchain.

**Core Value:** The TypeScript toolchain reliably builds and packages KubeJS projects; the Kotlin mod provides the in-game counterpart to that toolchain — starting from a correct, empty scaffold.

### Constraints

- **Platform**: NeoForge only (not Fabric, not legacy Forge) — user specified
- **Language**: Kotlin only — no Java source files (except possibly generated stubs)
- **No logic**: All implementation files are placeholders — no functional code
- **Gradle**: Build system must be Gradle with Kotlin DSL (`build.gradle.kts`)
- **Scaffold purity**: Do not add any features that weren't explicitly requested
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.9.3 - Used throughout monorepo for all source code in `libs/core`, `libs/plugin`, `libs/generator`, and `apps/cf-server`
- JavaScript - Build configuration files and CLI entry points
- HTML - Generated modlist output (EJS templates)
## Runtime
- Node.js 20 (specified in GitHub Actions workflow)
- ES2018+ target for builds (`libs/plugin/vite.config.ts`)
- ESNext module format throughout
- Yarn 4.10.3 (monorepo package manager)
- Lockfile: Present (`.yarnrc.yml` configured with node-modules linker)
## Frameworks
- NestJS 10.0.0 - HTTP server framework in `apps/cf-server` for CurseForge API proxy
- Electron 38.2.1 - Desktop application framework for file dialogs in `libs/core`
- Vite 7.0.0 / 7.1.9 - Module bundler for all library builds (`libs/core/vite.config.ts`, `libs/plugin/vite.config.ts`, `libs/generator/vite.config.ts`)
- vite-node 3.2.4 - Programmatic Vite API for CLI tools
- Nx 21.6.3 - Monorepo task runner with caching support
- @nx/vite 21.6.3 - NX plugin for Vite integration
- @nx/web 21.6.3 - NX plugin for web projects
- Vitest 3.0.0 - Unit test runner
- @vitest/ui 3.0.0 - Test UI dashboard
- SWC 1.13.5 (@swc/core, @swc/cli) - TypeScript/JavaScript transpiler used in Vite pipelines via plugin (`libs/plugin/src/plugins/swc.plugin.ts`)
- Babel 7.28.x (@babel/core, @babel/preset-env) - JavaScript transpilation in `libs/plugin`
- @rollup/plugin-babel 6.0.4 - Babel integration for Rollup
## Key Dependencies
- archiver 7.0.1 - ZIP archive creation for CurseForge packages in `libs/core/src/core/archiver.ts`
- Zod 4.1.12 - Runtime schema validation for environment variables in `apps/cf-server/src/env.ts` and `libs/generator`
- @t3-oss/env-core 0.13.8 - Environment variable parsing with Zod in `libs/core/src/env.ts` and `apps/cf-server`
- yargs 18.0.0 - Command-line argument parser in `libs/plugin/src/cli.ts` and `libs/generator/src/main.ts`
- @inquirer/prompts 7.8.6 - Interactive CLI prompts for generator in `libs/generator/src/utils/questionary.ts`
- lodash 4.17.21 - Utility functions (deep merge, omit, capitalize) in multiple packages
- simple-git 3.28.0 - Git operations (init, commit, push) in `libs/generator/src/utils/generator/generator-extension.ts`
- chokidar 4.0.3 - File watching for rebuilds in `libs/plugin/src/core/vite.ts`
- glob 11.0.3 - File pattern matching in `libs/plugin/src/core/vite.ts`
- magic-string 0.30.19 - String manipulation for AST transformations
- semver 7.7.2 - Semantic version parsing and validation
- yaml 2.8.1 - YAML parsing in `libs/generator`
- EJS 3.1.10 - Template rendering for project generation
- Prettier 3.6.2 - Code formatter
- @trivago/prettier-plugin-sort-imports 5.2.2 - Import sorting plugin
- prettier-plugin-packagejson 2.5.19 - Package.json formatting
- TSConfig Paths 4.2.0 - TypeScript path alias resolution
- vite-tsconfig-paths 5.1.4 - Vite integration for TS path aliases
- vite-plugin-dts 4.5.4 - Type definition generation from TypeScript
- Express types 5.0.0 - Type definitions for Express
- reflect-metadata 0.2.0 - Decorator metadata reflection (NestJS dependency)
- RxJS 7.8.1 - Reactive programming library (NestJS dependency)
- @nestjs/platform-express 10.0.0 - HTTP adapter for NestJS
## Configuration
- NestJS app reads from `apps/cf-server/src/env.ts`:
- `tsconfig.base.json` - Shared TypeScript config with path aliases:
- Individual library `tsconfig.json` files extend base config
- `.prettierrc` - Prettier configuration with import sorting and 100-char print width
- `nx.json` - NX monorepo configuration with build caching
- `.yarnrc.yml` - Yarn configuration with custom plugin for environment variable loading
- Individual `vite.config.ts` files in `libs/core`, `libs/plugin`, `libs/generator`
- `libs/plugin/bin/cli.js` - KubeJS plugin build tool CLI
- `libs/generator/bin/generator.js` - KubeJS project generator CLI
## Platform Requirements
- Node.js 20+
- Yarn 4.10.3
- Unix-like shell for scripts (Bash/Zsh)
- Minecraft Forge/NeoForge project structure for plugin usage
- ProbeJS mod for type generation
- Node.js 20+ for cf-server application
- Electron runtime for file dialog functionality
- Access to CurseForge API (https://api.curseforge.com/)
- Minecraft modding ecosystem (Forge/NeoForge 1.18.2, 1.21.1+)
- NPM registry for package distribution
- GitHub Actions for CI/CD automation
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- TypeScript source files: `camelCase` with `.ts` extension
- Class files: `camelCase` matching class name
- Type/interface files: `camelCase` with type-specific names
- Index files: `index.ts` used as barrel exports in each directory
- Regular functions: `camelCase`
- Async functions: `camelCase` with no prefix, await-able based on usage
- Factory/builder functions: `camelCase` prefixed with verb
- Local variables: `camelCase`
- Constants: `camelCase` (not UPPER_CASE, which is not used)
- Private class members: `camelCase` prefixed with `__` (double underscore)
- Private properties: `camelCase` prefixed with `__`
- PascalCase for types and interfaces
- Generic types: PascalCase with `T` prefix for generics
- Union/literal types: descriptive PascalCase or lowercase literals
- PascalCase
- Private methods: `camelCase` with no prefix convention, marked as `private`
- Getter methods: `camelCase` using TypeScript `get` keyword
## Code Style
- Tool: Prettier 3.6.2
- Print width: 100 characters
- Tab width: 2 spaces
- Quotes: Double quotes (not single)
- Semicolons: Required (`semi: true`)
- Trailing commas: None (`trailingComma: "none"`)
- Bracket spacing: Enabled (`bracketSpacing: true`)
- Arrow function parentheses: Avoid when possible (`arrowParens: "avoid"`)
- No ESLint configuration detected in codebase
- TypeScript strict mode enabled with custom rules in `tsconfig.base.json`:
## Import Organization
- `@kubejs/core`: Points to `libs/core/src/main.ts`
- `@kubejs/core/dialog`: Points to `libs/core/src/dialog.ts`
- `@kubejs/generator`: Points to `libs/generator/src/main.ts`
- `@kubejs/plugin`: Points to `libs/plugin/src/main.ts`
- Use aliases for cross-package imports, relative imports for same-package
- Separate import groups with blank lines
- Alphabetically sort specifiers within each import line
- Use `type` keyword for type-only imports: `import type { Type } from "module"`
## Error Handling
- Try-catch blocks used in async functions
- Promise `.then()/.catch()` chains for rejected promises
- Custom Error objects with cause information passed as second parameter
- Console errors logged and process exit with code 1 on critical failures
- Logger class used for structured logging with prefixes
## Logging
- Constructor takes `prefix` (string) and optional `options` with `objectDepth`
- Methods: `info()`, `warn()`, `error()`
- All messages prefixed with `[prefix]` in output
- Objects inspected with configurable depth (default: 2)
- Undefined values converted to "undefined" string
- Use `Logger` for component initialization: `private readonly logger = new Logger("ComponentName")`
- Always log at operation start: `this.logger.info("Starting operation...")`
- Log results/completion: `this.logger.info("Completed with result")`
- Log warnings for expected issues: `this.logger.warn("We got a warning:", err)`
- Log errors before throwing/exiting: `this.logger.error("Error message:", err)`
- `libs/core/src/core/archiver.ts`: Logs file additions, archive process, finalization
- `libs/plugin/src/core/vite.ts`: Logs build status, watch state, entry graph changes
- `libs/generator/src/main.ts`: Logs generation progress via logger instance
## Comments
- Comments are minimal throughout codebase
- Focus is on self-documenting code through clear naming
- Comments used only for non-obvious logic or temporary workarounds
- Commented-out code blocks observed in `libs/plugin/src/cli.ts` for future features
- Not consistently used across codebase
- TypeScript types serve as primary documentation
- Type definitions and interfaces provide inline documentation
## Function Design
- Use parameter objects for multiple related parameters
- Generic parameters used for flexible type handling
- Explicit return types always specified on function signatures
- Async functions return `Promise<T>`
- Methods often return `this` for fluent/builder patterns
## Module Design
- Barrel exports (index files) used to aggregate module exports
- Example `libs/core/src/main.ts`:
- Selective exports for specific submodules
- Used extensively for clean public APIs
- Each subdirectory has `index.ts` for re-exports
- Reduces import path complexity for consumers
- Example: `libs/core/src/api/index.ts`, `libs/core/src/utils/index.ts`
- Monorepo using workspaces: `apps/*`, `libs/*`, `samples/*`
- Each library/app is independent with own `package.json` and `tsconfig.json`
- Libraries extend base `tsconfig.base.json` for consistent TypeScript config
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Nx workspace for dependency management and caching
- ESM module format with TypeScript
- Three distinct functional layers: libraries (shared), applications (servers/tools), and samples
- Command-driven architecture for both generator and build tool
- Vite-based compilation with custom plugin system
## Layers
- Purpose: Provides core utilities, types, and business logic for KubeJS ecosystem
- Location: `libs/core/src/`
- Contains: Type definitions, CurseForge API client, archiving utilities, logger, Minecraft version resolution
- Depends on: External packages (archiver, axios-like fetch)
- Used by: Generator library, cf-server app, plugin library
- Purpose: CLI tool for generating new KubeJS projects from templates
- Location: `libs/generator/src/`
- Contains: Command-line interface (yargs), template rendering engine (EJS), project generation logic
- Depends on: Core library, EJS rendering, yargs CLI framework
- Used by: End users via CLI command; not directly by other code
- Purpose: Vite plugin and build tool for KubeJS projects
- Location: `libs/plugin/src/`
- Contains: Vite plugin implementation, CLI for build orchestration, SWC compilation plugin, file watching
- Depends on: Vite, Chokidar for file watching, SWC for transformation
- Used by: KubeJS projects during development and build phases
- Purpose: NestJS server providing REST endpoints for CurseForge data
- Location: `apps/cf-server/src/`
- Contains: NestJS modules for health checks, CurseForge API proxying, Minecraft version endpoints
- Depends on: Core library, NestJS framework
- Used by: Generator and other tools as data source for mod/version resolution
## Data Flow
- **Immutable request caching**: In-memory Map in `serverFetch()` caches API responses per URL
- **Temporary file management**: `prepareArchiver()` creates isolated temp directories with cleanup on process exit
- **Template state**: Template class scans and caches file list in memory during prepare phase
- **Logger state**: Logger instances track context prefix for formatted output
## Key Abstractions
- Purpose: Abstracts ZIP file creation with recursive directory/file appending
- Examples: `libs/core/src/core/archiver.ts`
- Pattern: Builder pattern with chainable methods; wraps archiver npm package
- Usage: Generator loads file/directory into archiver, then calls `archive()` to finalize ZIP
- Purpose: Centralized prefix-based logging with depth control for objects
- Examples: `libs/core/src/utils/logger/logger.ts`
- Pattern: Singleton-style class instantiated with prefix context
- Usage: All modules create Logger("ModuleName") and call `info()`, `warn()`, `error()`
- Purpose: Encapsulates EJS template rendering and Git initialization
- Examples: `libs/generator/src/utils/template.ts`
- Pattern: Orchestrator that manages template lifecycle (prepare → generate)
- Usage: Generator loads template by name, calls `prepare()` then `generate(options)`
- Purpose: Orchestrates Vite compiler configuration and build/watch lifecycle
- Examples: `libs/plugin/src/core/vite.ts`
- Pattern: Facade over Vite API; handles entry point discovery and plugin composition
- Usage: Program passes build args to Vite, which executes build or watch mode
- Purpose: Decorates spawning of child processes with logging
- Examples: `libs/generator/src/utils/command/command-executor.ts`
- Pattern: Executes shell commands and pipes stdout; decorated with @LogActions
- Usage: GeneratorExtension extends this to run git commands
## Entry Points
- Location: `libs/generator/src/main.ts`
- Triggers: User runs `yarn kubejs:generator generate [options]`
- Responsibilities: Argument parsing, questionary prompts, delegation to generate() function
- Location: `libs/plugin/src/cli.ts`
- Triggers: User runs `kubejs build [--root] [--watch]`
- Responsibilities: Argument parsing, Program instantiation, execution delegation
- Location: `apps/cf-server/src/main.ts`
- Triggers: NestJS application startup
- Responsibilities: NestFactory creates app, binds to PORT from env
- Location: `apps/cf-server/src/app.module.ts`
- Triggers: During application initialization
- Responsibilities: Minimal setup; logs request paths via middleware
## Error Handling
- CLI commands wrap in try-catch, log error, exit with code 1
- Generator template rendering throws on missing variables
- Archiver emits "error" event and rejects promise on failure
- Fetch operations throw on HTTP error status (5xx, 4xx)
- Logger @LogActions decorator logs method calls and catch errors
## Cross-Cutting Concerns
- All modules use Logger class instantiated with module name prefix
- Output to console.log/warn/error with formatted template "[ModuleName] message"
- CLI argument validation via yargs options (type, choices)
- Template options validated through questionary prompts with defaults
- Type safety via TypeScript interfaces (TemplateGenerateOptions, TemplateConfig, Args)
- CurseForge API key passed via env.CURSEFORGE_API_KEY header
- cf-server wraps public API calls with internal cache
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
