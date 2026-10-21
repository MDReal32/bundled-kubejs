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
- Inspect what the generator resolves for a version: `yarn generate:<minecraft version>:<loader>` writes the zip to `generated/` (gitignored). The samples' `instance.json` pins come from that zip's `manifest.json`, so fix mismatches in the generator, not in the sample.
- `yarn nx build @kubejs/core` can return a stale cached build after a source edit; the generator imports the built copy of core, so add `--skip-nx-cache` when you just changed `libs/core/src`.

## Gotchas

- `@kubejs/core` talks to cf-server through a typed [nestbridge](https://github.com/MDReal32/nestbridge) client generated from the controllers in `apps/cf-server/src`. The hosted URL `defaultApiUrl` (`libs/core/src/api/const.ts`, plain HTTP until port 443 is open) is baked in at build time; `API_URL` overrides it at runtime. cf-server needs `CURSEFORGE_API_KEY` (see README).
- The client types live in `libs/core/.nestbridge` (gitignored), written by the cached Nx `codegen` target, which `typecheck` and `build` depend on. After changing a cf-server controller or DTO, run `yarn nx codegen @kubejs/core`. The `@cf-server/*` alias in `tsconfig.base.json` points at that output.
- `@kubejs/core` must not export `cfServerClient` or any cf-server type: the generated declarations reference the real controllers, which would leak NestJS into the published `.d.ts`. Expose a typed helper such as `getModGameVersions` instead.
- Yarn is pinned to 4.18.0 (`.yarn/releases`) because nestbridge depends on `typescript@7`, which Yarn 4.10.3 cannot install.
- The npm publish workflow (`workflow_dispatch` only) skips versions that already exist. Bump `version` in the package's `package.json` to ship a change; removing or renaming a public export of `@kubejs/core` needs a major bump, because published `@kubejs/generator` and `@kubejs/plugin` depend on `^1`.
- npm publishing uses trusted publishing (OIDC) through Yarn's `yarn npm publish`: the job needs `id-token: write`, no `npmAuthToken` may be configured (it would override OIDC), and the step sets the registry to `registry.npmjs.org` so the token exchange and the publish go to npm directly instead of Yarn's default `registry.yarnpkg.com`. There is no `NPM_TOKEN`.
- cf-server deploys through `.github/workflows/deploy-cf-server.yml` to `/opt/kubejs` on the Lightsail host. The service name `cf-server` and the `latest` tag are fixed by the server's own `compose.yml`, which is not in the repo. The image build runs `nest build` directly, so the typecheck and Biome gates run in the workflow's `verify` job, not in Docker.
- Biome's `useImportType` is off on purpose: `emitDecoratorMetadata` is on and NestJS DI needs the runtime import.
- `.gitattributes` pins LF line endings; Biome fails on CRLF.
- Cross-package imports use the aliases in `tsconfig.base.json` (`@kubejs/core` → `libs/core/src/main.ts`). Same-package imports are relative.
- Private fields use a `__` prefix (`private readonly __archive`); `logger` fields are unprefixed.
- Log through `Logger` from `@kubejs/core` (Nest's `Logger` in cf-server), never raw `console.log`.

## Code style

Binding rules live in `.claude/rules/`. Rules for a language or framework load only when matching files are in play. Code that predates them is migrated only when you touch it.
