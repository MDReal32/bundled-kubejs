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
nx run-many -t vite:build
```

Build a single package:
```bash
nx run @kubejs/plugin:vite:build
```

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

| Method | Path                             | Description                            |
|--------|----------------------------------|----------------------------------------|
| `GET`  | `/api/health`                    | Liveness check                         |
| `GET`  | `/api/curseforge/mods/search`    | Search mods                            |
| `GET`  | `/api/curseforge/mods/:id`       | Get mod by ID                          |
| `GET`  | `/api/curseforge/mods/:id/files` | Get mod files                          |
| `POST` | `/api/curseforge/mods/resolve`   | Resolve mod IDs into metadata + files  |
| `POST` | `/api/curseforge/manifest`       | Generate a CurseForge `manifest.json`  |
| `GET`  | `/api/minecraft/modloaders`      | Get modloaders for a Minecraft version |

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

`samples/sample-1.18.2` — example modpack project using `@kubejs/plugin`.

## CI

GitHub Actions publishes each lib to npm automatically when its `package.json` version is bumped on `master`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

If you have any idea, or you want to contribute to this project please open an issue or pull request. I will be happy to see your ideas and contributions.

## Contact

You can contact with me via [Discord](https://discordapp.com/users/673855981473628201) or [LinkedIn](https://www.linkedin.com/in/mdrealiyev).
