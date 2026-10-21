# bundled-kubejs

A long time ago when first time I met `KubeJS` mod I was so excited about it. I first looked to mod but couldn't use it cause time and knowledge. But now when I improved my self as JavaScript developer I decided to make a modpack with `KubeJS` mod. But regular usage of `KubeJS` mod is not enough for me. For that I decided to use `vite` as `bundler` for `KubeJS` scripts. It's small and scratch project. Please give a feedback if you have any idea.

Monorepo for writing [KubeJS](https://kubejs.com/) modpack scripts in TypeScript with a modern Vite-based workflow.

## Packages

| Package          | Name                | Description                                                                    |
|------------------|---------------------|--------------------------------------------------------------------------------|
| `libs/core`      | `@kubejs/core`      | Shared types, CurseForge API client, manifest generation, archiving utilities  |
| `libs/plugin`    | `@kubejs/plugin`    | Vite plugin + `kubejs` CLI that compiles TypeScript into KubeJS script folders |
| `libs/generator` | `@kubejs/generator` | Interactive CLI to scaffold new modpack projects from templates                |
| `apps/cf-server` | `@kubejs/cf-server` | Internal NestJS server that proxies CurseForge API calls with a secure token   |

## Stack

- **TypeScript** — all source code
- **Vite** — bundling for libs and end-user modpack scripts
- **NestJS** — cf-server backend
- **Nx** — monorepo task orchestration and build caching
- **Yarn 4** — workspace management
- **Zod** — runtime validation

## Setup

```bash
yarn
```

## Building

Build all packages:
```bash
yarn nx run-many -t build
```

Build a single package:
```bash
yarn nx build @kubejs/plugin
```

`build` first builds the package's dependencies, then runs its `typecheck` and `check` (Biome) targets, so a type error or lint error fails the build.

## cf-server

The server proxies CurseForge API requests so the token never reaches CLI tools, generated files, or the browser.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `CURSEFORGE_API_KEY` | ✅ | CurseForge API token |
| `PORT` | — | Port to listen on (default: `3000`) |
| `NODE_ENV` | — | `development` / `production` / `test` (default: `development`) |

Create a `.env` file inside `apps/cf-server`:
```env
CURSEFORGE_API_KEY=your-token-here
```

### Running

```bash
cd apps/cf-server
yarn start:dev   # watch mode
yarn start:prod  # production
```

### Endpoints

The server exposes exactly these routes, each a fixed controller method that forwards one CurseForge
`v1` call with the token added; responses are cached in memory. Every other path returns `404`,
invalid input returns `400`, and upstream errors keep their status code.

| Route | Query | Forwards to |
|---|---|---|
| `GET /v1/mods/:modId` | | `mods/:modId` |
| `GET /v1/mods/:modId/files` | `gameVersion`, `modLoaderType` (0 to 6) | `mods/:modId/files` |
| `GET /v1/minecraft/modloader` | `version`, `includeAll` (`true`/`false`) | `minecraft/modloader` |

Every query parameter is required, and parameters not listed are dropped before the upstream call.

### Using it from the generator

`@kubejs/core` calls the server through a typed [nestbridge](https://github.com/MDReal32/nestbridge) client generated from the controllers above, with `http://kubejs.mdreal.org` as the built-in base URL. Set `API_URL` to use another server, such as a local one:

```bash
API_URL=http://localhost:3000 yarn kubejs:generator generate
```

### Deployment

cf-server runs on a single AWS Lightsail host as a Docker Compose stack in `/opt/kubejs`: the `cf-server` container behind Nginx Proxy Manager, which terminates TLS. The compose file and `.env` live only on the server.

A push to `master` that touches `apps/cf-server` (or its build inputs) runs [deploy-cf-server.yml](.github/workflows/deploy-cf-server.yml):

1. `yarn nx build @kubejs/cf-server` runs the typecheck and Biome gates.
2. The image is built from [apps/cf-server/Dockerfile](apps/cf-server/Dockerfile) and pushed to `ghcr.io/mdreal32/bundled-kubejs/cf-server`, tagged with the commit SHA and `latest`.
3. The server pulls the SHA, retags it `latest`, recreates only the `cf-server` service and waits for its healthcheck. Nginx Proxy Manager is never restarted.

The workflow reads these repository settings:

| Name | Kind | Value |
|---|---|---|
| `SERVER_HOST` | variable | Host or IP of the server |
| `SERVER_USER` | variable | SSH user (`ubuntu`) |
| `SERVER_SSH_KEY` | secret | Private key authorized on the server |
| `CURSEFORGE_API_KEY` | secret | CurseForge Core API key, written to `/opt/kubejs/.env` on every deploy |

Create the Core API key at [console.curseforge.com](https://console.curseforge.com/) under API keys; it starts with `$2a$10$`. The deploy refuses to run when `/opt/kubejs/.env` ends up without a non-empty `CURSEFORGE_API_KEY`. The server pulls from GHCR on its own, so the package must be public or the server must have run `docker login ghcr.io` once. The Nginx Proxy Manager admin UI listens on `127.0.0.1:81` only, reach it with `ssh -L 8181:127.0.0.1:81 <host>` and point a proxy host at `kubejs-cf-server:3000`.

## Generator

Scaffold a new modpack project interactively:
```bash
yarn kubejs:generator
```

Or with flags:
```bash
yarn generate:1.21.1:neoforge
```

## Samples

`samples/sample-<minecraft version>` — example modpack projects using `@kubejs/plugin`, one per KubeJS + ProbeJS combination (1.18.1 to 1.21.1). Each pins the files `yarn generate:<minecraft version>:<loader>` resolves, so use those scripts to inspect what the generator picks. See [samples/README.md](samples/README.md).

## CI

Run the [Publish to NPM](.github/workflows/publish-to-npm.yml) workflow manually to publish the libs. It publishes every lib in `libs/` whose `package.json` version is not on npm yet, with provenance, and holds no npm token: it authenticates through npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC).

Each of `@kubejs/core`, `@kubejs/plugin` and `@kubejs/generator` must list this repository and the workflow file `publish-to-npm.yml` as its trusted publisher under the package's Settings on npmjs.com.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

If you have any idea, or you want to contribute to this project please open an issue or pull request. I will be happy to see your ideas and contributions.

## Contact

You can contact with me via [Discord](https://discordapp.com/users/673855981473628201) or [LinkedIn](https://www.linkedin.com/in/mdrealiyev).
