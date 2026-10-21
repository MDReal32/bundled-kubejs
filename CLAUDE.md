# bundled-kubejs

Yarn 4 + Nx monorepo of tooling for writing KubeJS modpack scripts in TypeScript.

| Path | Package | Role |
|---|---|---|
| `libs/core` | `@kubejs/core` | CurseForge client, archiver, `Logger`, shared types |
| `libs/plugin` | `@kubejs/plugin` | Vite plugin and `kubejs` CLI that compile TypeScript into KubeJS script folders |
| `libs/generator` | `@kubejs/generator` | CLI that scaffolds a modpack project from `templates/` |
| `apps/cf-server` | `@kubejs/cf-server` | NestJS proxy that holds the CurseForge API key |
| `samples/*` | | One example instance per KubeJS × ProbeJS combination, see `samples/README.md` |

## Commands

Run tasks through Nx (`yarn nx ...`), not the underlying tool.

- Build a package: `yarn nx build @kubejs/<core|plugin|generator|cf-server>`. Every `build` first runs `^build`, `typecheck` and `check`, so a type or lint error blocks it.
- Format, lint and import order: `yarn check` for the whole repo, `yarn nx check @kubejs/<pkg>` for one package (`yarn check:fix` applies safe fixes). Biome owns formatting; see `biome.json`.
- Generator from source: `API_URL=http://localhost:3000 yarn kubejs:generator generate`

## Gotchas

- `@kubejs/core` sends every CurseForge request to `API_URL`, a running cf-server. There is no default URL yet, so the generator errors without it. cf-server needs `CURSEFORGE_API_KEY` (see README).
- The npm publish workflow skips versions that already exist. Bump `version` in the package's `package.json` to ship a change.
- cf-server deploys through `.github/workflows/deploy-cf-server.yml` to `/opt/kubejs` on the Lightsail host. The service name `cf-server` and the `latest` tag are fixed by the server's own `compose.yml`, which is not in the repo. The image build runs `nest build` directly, so the typecheck and Biome gates run in the workflow's `verify` job, not in Docker.
- Biome's `useImportType` is off on purpose: `emitDecoratorMetadata` is on and NestJS DI needs the runtime import.
- `.gitattributes` pins LF line endings; Biome fails on CRLF.
- Cross-package imports use the aliases in `tsconfig.base.json` (`@kubejs/core` → `libs/core/src/main.ts`). Same-package imports are relative.
- Private fields use a `__` prefix (`private readonly __archive`); `logger` fields are unprefixed.
- Log through `Logger` from `@kubejs/core` (Nest's `Logger` in cf-server), never raw `console.log`.

## Code style

Binding rules live in `.claude/rules/`. Rules for a language or framework load only when matching files are in play. Code that predates them is migrated only when you touch it.
