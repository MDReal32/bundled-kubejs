# Technology Stack

**Analysis Date:** 2026-04-04

## Languages

**Primary:**
- TypeScript 5.9.3 - Used throughout monorepo for all source code in `libs/core`, `libs/plugin`, `libs/generator`, and `apps/cf-server`

**Secondary:**
- JavaScript - Build configuration files and CLI entry points
- HTML - Generated modlist output (EJS templates)

## Runtime

**Environment:**
- Node.js 20 (specified in GitHub Actions workflow)
- ES2018+ target for builds (`libs/plugin/vite.config.ts`)
- ESNext module format throughout

**Package Manager:**
- Yarn 4.10.3 (monorepo package manager)
- Lockfile: Present (`.yarnrc.yml` configured with node-modules linker)

## Frameworks

**Core:**
- NestJS 10.0.0 - HTTP server framework in `apps/cf-server` for CurseForge API proxy
- Electron 38.2.1 - Desktop application framework for file dialogs in `libs/core`

**Build/Dev:**
- Vite 7.0.0 / 7.1.9 - Module bundler for all library builds (`libs/core/vite.config.ts`, `libs/plugin/vite.config.ts`, `libs/generator/vite.config.ts`)
- vite-node 3.2.4 - Programmatic Vite API for CLI tools
- Nx 21.6.3 - Monorepo task runner with caching support
- @nx/vite 21.6.3 - NX plugin for Vite integration
- @nx/web 21.6.3 - NX plugin for web projects

**Testing:**
- Vitest 3.0.0 - Unit test runner
- @vitest/ui 3.0.0 - Test UI dashboard

**Compilation:**
- SWC 1.13.5 (@swc/core, @swc/cli) - TypeScript/JavaScript transpiler used in Vite pipelines via plugin (`libs/plugin/src/plugins/swc.plugin.ts`)
- Babel 7.28.x (@babel/core, @babel/preset-env) - JavaScript transpilation in `libs/plugin`
- @rollup/plugin-babel 6.0.4 - Babel integration for Rollup

## Key Dependencies

**Critical:**
- archiver 7.0.1 - ZIP archive creation for CurseForge packages in `libs/core/src/core/archiver.ts`
- Zod 4.1.12 - Runtime schema validation for environment variables in `apps/cf-server/src/env.ts` and `libs/generator`
- @t3-oss/env-core 0.13.8 - Environment variable parsing with Zod in `libs/core/src/env.ts` and `apps/cf-server`

**CLI & Utilities:**
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

**Development:**
- Prettier 3.6.2 - Code formatter
- @trivago/prettier-plugin-sort-imports 5.2.2 - Import sorting plugin
- prettier-plugin-packagejson 2.5.19 - Package.json formatting
- TSConfig Paths 4.2.0 - TypeScript path alias resolution
- vite-tsconfig-paths 5.1.4 - Vite integration for TS path aliases
- vite-plugin-dts 4.5.4 - Type definition generation from TypeScript
- Express types 5.0.0 - Type definitions for Express
- reflect-metadata 0.2.0 - Decorator metadata reflection (NestJS dependency)

**Runtime Dependencies:**
- RxJS 7.8.1 - Reactive programming library (NestJS dependency)
- @nestjs/platform-express 10.0.0 - HTTP adapter for NestJS

## Configuration

**Environment:**
- NestJS app reads from `apps/cf-server/src/env.ts`:
  - `CURSEFORGE_API_KEY` - API key for CurseForge API calls (required)
  - `PORT` - Server port (default: 3000)
  - `API_URL` - Core library API URL requirement

**Build Configuration:**
- `tsconfig.base.json` - Shared TypeScript config with path aliases:
  - `@kubejs/core` → `./libs/core/src/main.ts`
  - `@kubejs/core/dialog` → `./libs/core/src/dialog.ts`
  - `@kubejs/generator` → `./libs/generator/src/main.ts`
  - `@kubejs/plugin` → `./libs/plugin/src/main.ts`
- Individual library `tsconfig.json` files extend base config
- `.prettierrc` - Prettier configuration with import sorting and 100-char print width
- `nx.json` - NX monorepo configuration with build caching
- `.yarnrc.yml` - Yarn configuration with custom plugin for environment variable loading
- Individual `vite.config.ts` files in `libs/core`, `libs/plugin`, `libs/generator`

**CLI Entry Points:**
- `libs/plugin/bin/cli.js` - KubeJS plugin build tool CLI
- `libs/generator/bin/generator.js` - KubeJS project generator CLI

## Platform Requirements

**Development:**
- Node.js 20+
- Yarn 4.10.3
- Unix-like shell for scripts (Bash/Zsh)
- Minecraft Forge/NeoForge project structure for plugin usage
- ProbeJS mod for type generation

**Production:**
- Node.js 20+ for cf-server application
- Electron runtime for file dialog functionality
- Access to CurseForge API (https://api.curseforge.com/)
- Minecraft modding ecosystem (Forge/NeoForge 1.18.2, 1.21.1+)

**Publishing:**
- NPM registry for package distribution
- GitHub Actions for CI/CD automation

---

*Stack analysis: 2026-04-04*
