# Coding Conventions

**Analysis Date:** 2026-04-04

## Naming Patterns

**Files:**
- TypeScript source files: `camelCase` with `.ts` extension
  - Example: `server-fetch.ts`, `archiver.ts`, `cli.ts`
- Class files: `camelCase` matching class name
  - Example: `logger.ts` for `Logger` class, `archiver.ts` for `Archiver` class
- Type/interface files: `camelCase` with type-specific names
  - Example: `game-short-versions.ts` for `GameShortVersions` interface
- Index files: `index.ts` used as barrel exports in each directory

**Functions:**
- Regular functions: `camelCase`
  - Example: `serverFetch`, `resolveMods`, `generateManifest`, `generate`
- Async functions: `camelCase` with no prefix, await-able based on usage
  - Example: `async resolveMods(...)`, `async generate(...)`
- Factory/builder functions: `camelCase` prefixed with verb
  - Example: `createBuilderFor`, `prepareArchiver`

**Variables:**
- Local variables: `camelCase`
  - Example: `logger`, `cachedResponse`, `currentEntries`
- Constants: `camelCase` (not UPPER_CASE, which is not used)
  - Example: `swcConfigDefaults`, `entries`
- Private class members: `camelCase` prefixed with `__` (double underscore)
  - Example: `__archive`, `__output` in `Archiver` class
- Private properties: `camelCase` prefixed with `__`
  - Example: `__archive: archiver.Archiver`, `__output: WriteStream`

**Types/Interfaces:**
- PascalCase for types and interfaces
  - Example: `GameShortVersions`, `CfFetchResponse`, `Logger`, `Archiver`
- Generic types: PascalCase with `T` prefix for generics
  - Example: `TResponse`, `TArgs`
- Union/literal types: descriptive PascalCase or lowercase literals
  - Example: `ModLoaderType` enum

**Classes:**
- PascalCase
  - Example: `Logger`, `Archiver`, `Vite`, `Program`, `ModResolver`
- Private methods: `camelCase` with no prefix convention, marked as `private`
  - Example: `private updateMessages(...)`, `private prepareFor(...)`
- Getter methods: `camelCase` using TypeScript `get` keyword
  - Example: `get root()`, `get isWindows()`

## Code Style

**Formatting:**
- Tool: Prettier 3.6.2
- Print width: 100 characters
- Tab width: 2 spaces
- Quotes: Double quotes (not single)
- Semicolons: Required (`semi: true`)
- Trailing commas: None (`trailingComma: "none"`)
- Bracket spacing: Enabled (`bracketSpacing: true`)
- Arrow function parentheses: Avoid when possible (`arrowParens: "avoid"`)

**Configuration file:** `.prettierrc` in project root

**Linting:**
- No ESLint configuration detected in codebase
- TypeScript strict mode enabled with custom rules in `tsconfig.base.json`:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noFallthroughCasesInSwitch: true`
  - `strict: true` (enables most strict checks)
  - `strictNullChecks: false` (relaxed for null checks)
  - `noImplicitAny: false` (relaxed for implicit any)

## Import Organization

**Order (enforced by prettier-plugin-sort-imports):**
1. Node built-in modules: `^node:(.*)$`
   - Example: `import { join } from "node:path"`
2. Third-party packages: `^([^.@]*)$`
   - Example: `import archiver from "archiver"`
3. Scoped packages: `^@(.*)/(.*)$`
   - Example: `import { Logger } from "@kubejs/core"`
4. Relative imports (non-CSS): `^[./](.*)(?<!\\.css)$`
   - Example: `import { Archiver } from "../core/archiver"`
5. CSS imports: `\\.css$`
   - Example: `import "./styles.css"`

**Path Aliases (defined in tsconfig.base.json):**
- `@kubejs/core`: Points to `libs/core/src/main.ts`
- `@kubejs/core/dialog`: Points to `libs/core/src/dialog.ts`
- `@kubejs/generator`: Points to `libs/generator/src/main.ts`
- `@kubejs/plugin`: Points to `libs/plugin/src/main.ts`
- Use aliases for cross-package imports, relative imports for same-package

**Import statements always:**
- Separate import groups with blank lines
- Alphabetically sort specifiers within each import line
- Use `type` keyword for type-only imports: `import type { Type } from "module"`

## Error Handling

**Patterns:**
- Try-catch blocks used in async functions
  - Example in `libs/plugin/src/cli.ts`:
    ```typescript
    try {
      const program = new Program(_.omit(argv, ["_", "$0"]));
      await program.execute();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    ```
- Promise `.then()/.catch()` chains for rejected promises
  - Example in `libs/core/src/api/server-fetch.ts`:
    ```typescript
    return fetch(constructedUrl, { method: "GET" })
      .then(res => {
        if (!res.ok)
          throw new Error(`Failed to fetch ${constructedUrl} with status ${res.status}`, {
            cause: res
          });
        return res.json();
      })
      .then((data: CfFetchResponse<TResponse>) => {
        cache.set(url, data);
        return data;
      });
    ```
- Custom Error objects with cause information passed as second parameter
- Console errors logged and process exit with code 1 on critical failures
- Logger class used for structured logging with prefixes

## Logging

**Framework:** Custom `Logger` class in `libs/core/src/utils/logger/logger.ts`

**Implementation:**
- Constructor takes `prefix` (string) and optional `options` with `objectDepth`
- Methods: `info()`, `warn()`, `error()`
- All messages prefixed with `[prefix]` in output
- Objects inspected with configurable depth (default: 2)
- Undefined values converted to "undefined" string

**Patterns:**
- Use `Logger` for component initialization: `private readonly logger = new Logger("ComponentName")`
- Always log at operation start: `this.logger.info("Starting operation...")`
- Log results/completion: `this.logger.info("Completed with result")`
- Log warnings for expected issues: `this.logger.warn("We got a warning:", err)`
- Log errors before throwing/exiting: `this.logger.error("Error message:", err)`

**Examples:**
- `libs/core/src/core/archiver.ts`: Logs file additions, archive process, finalization
- `libs/plugin/src/core/vite.ts`: Logs build status, watch state, entry graph changes
- `libs/generator/src/main.ts`: Logs generation progress via logger instance

## Comments

**When to Comment:**
- Comments are minimal throughout codebase
- Focus is on self-documenting code through clear naming
- Comments used only for non-obvious logic or temporary workarounds
- Commented-out code blocks observed in `libs/plugin/src/cli.ts` for future features

**JSDoc/TSDoc:**
- Not consistently used across codebase
- TypeScript types serve as primary documentation
- Type definitions and interfaces provide inline documentation

## Function Design

**Size:** Functions are concise, typically 10-60 lines

**Parameters:**
- Use parameter objects for multiple related parameters
  - Example: `generate(args: TemplateGenerateOptions, templates: Templates)`
- Generic parameters used for flexible type handling
  - Example: `serverFetch<TResponse>(url: string): Promise<CfFetchResponse<TResponse>>`

**Return Values:**
- Explicit return types always specified on function signatures
- Async functions return `Promise<T>`
- Methods often return `this` for fluent/builder patterns
  - Example in `libs/core/src/core/archiver.ts`:
    ```typescript
    file(path: string, name: string) {
      // ...
      return this;
    }
    ```

## Module Design

**Exports:**
- Barrel exports (index files) used to aggregate module exports
- Example `libs/core/src/main.ts`:
  ```typescript
  export * from "./api";
  export * from "./core";
  export * from "./types";
  export * from "./utils";
  ```
- Selective exports for specific submodules
  - Example `libs/core/package.json`: `"./dialog": "./build/dialog.js"`
  - Example `libs/plugin/package.json`: exports both default and TypeScript config

**Barrel Files:**
- Used extensively for clean public APIs
- Each subdirectory has `index.ts` for re-exports
- Reduces import path complexity for consumers
- Example: `libs/core/src/api/index.ts`, `libs/core/src/utils/index.ts`

**Library Organization:**
- Monorepo using workspaces: `apps/*`, `libs/*`, `samples/*`
- Each library/app is independent with own `package.json` and `tsconfig.json`
- Libraries extend base `tsconfig.base.json` for consistent TypeScript config

---

*Convention analysis: 2026-04-04*
