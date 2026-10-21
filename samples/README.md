# Samples

One sample instance per KubeJS + ProbeJS combination. Each sample pins its mods in `instance.json`;
the `mods/*.jar` files are gitignored, so fetch them by the CurseForge file ids listed there.

## Combinations

ProbeJS only ever shipped for the Minecraft versions below, so these are the variants that need a
sample. KubeJS alone also exists for 1.12.2 to 1.16.5, 1.20.4 and 26.1.2, but there is no ProbeJS
to dump from, so they are not listed. Counts are CurseForge files (a Forge and a Fabric build of one
release count twice). Snapshot of the CurseForge listing taken 2026-10-21.

| MC     | Loaders                      | ProbeJS files (first -> last)                    | KubeJS series      | Sample        |
| ------ | ---------------------------- | ------------------------------------------------ | ------------------ | ------------- |
| 1.18.1 | Forge                        | 12: 1.1.0-build.13 (2022-03-02) -> 2.3.0-build.60 | 1801.4.x           | `sample-1.18.1` |
| 1.18.2 | Forge, Fabric, Quilt         | 38: 2.4.5-build.63 (2022-04-04) -> 4.0.0-fix4    | 1802.5.x           | `sample-1.18.2` (jars are empty placeholders) |
| 1.19   | Forge, Fabric, Quilt         | 2: 3.0.5 (2022-06-16)                            | 1900.5.5           | todo          |
| 1.19.2 | Forge, Fabric, Quilt         | 36: 4.1.0 (2022-11-08) -> 5.3.4                  | 1902.6.x           | todo          |
| 1.20.1 | Forge, Fabric, Quilt, NeoForge | 14: 5.5.0 (2023-09-13) -> 6.0.1                  | 2001.6.x           | todo          |
| 1.21   | NeoForge                     | 10: 7.0.0 (2024-06-27) -> 7.5.0                  | 2100.7.x, 2101.7.x | todo          |
| 1.21.1 | NeoForge                     | 10: 7.3.0 (2024-08-22) -> 8.0.3                  | 2101.7.x           | todo          |

ProbeJS 8.0.x is a rewrite for 1.21.1 (its own description says the old typing structure was
dropped), so expect a different layout there. Modrinth also lists a 1.20.1 build 7.0.0 (alpha) that
CurseForge does not.

## sample-1.18.1 (the first combination)

Forge 39.1.0 on Java 17, ProbeJS 1.1.0-build.13 with KubeJS 1801.4.3-build.307, plus the two mods
KubeJS marks as mandatory: Rhino 1801.1.8-build.102 and Architectury 3.7.26.

What `/probejs dump` produced on a headless Forge 1.18.1 server (run with these exact jars):

- `kubejs/.vscode/probe.code-snippets`
- `kubejs/{startup,server,client}_scripts/dumps.js`, a script with `// priority: 1000` that declares
  `const tags = {...}`. The `client_scripts` one only works if that folder already exists; ProbeJS
  does not create it, and on a fresh dedicated server the dump aborts with `NoSuchFileException`.
- `kubejs/exported/` from KubeJS's own export.
- No `.d.ts` files. Typing generation then fails with
  `ClassNotFoundException: net.minecraft.client.RecipeBookCategories`, because it reflects over
  client-only classes. It can only complete on a real client.

From the bytecode (not yet confirmed at runtime), that typing step writes
`kubejs/kubetypings/{index,globals,events,constants,java}.d.ts` and a `kubejs/jsconfig.json` with
`"lib": ["ES5", "ES2015"]` and `"typeRoots": ["kubetypings"]`.

### What the plugin does with this today

`libs/plugin/src/core/vite.ts` assumes one layout for every version:

- `prepare()` (line 153) looks for `<root>/.probe` and warns to run `/probejs dump` when it is absent.
  For this variant it is always absent, so the warning never clears.
- `writeTypings()` (line 266) writes `node_modules/.kubejs/types/{client,server,startup}.globals.d.ts`
  that point at `.probe/<module>/probe-types/{packages,global}/index.d.ts`. Those paths do not exist
  for ProbeJS 1.1.0, so the generated reference files point at nothing.
- The build target is fixed at `es2018` (line 241). The ProbeJS typings for this variant declare
  ES5/ES2015 only, so check what Rhino 1801.1.8 actually runs before trusting that output.

### How the app should handle this variant

1. Read the variant from the instance (`instance.json`, or the jar names in `mods/`) instead of
   assuming one layout.
2. For this variant, point the generated globals at `kubejs/kubetypings/index.d.ts`, and make the
   `prepare()` check look for that directory instead of `.probe`.
3. Keep the dump step as `/probejs dump`, run on a client, with `kubejs/client_scripts/` created
   first.
4. Treat `dumps.js` as generated: leave it alone in the script folders (the build already uses
   `emptyOutDir: false`) and avoid a top-level `tags` in user code until we confirm whether it clashes.

Items 2 and 4 are not implemented yet; they wait on a real client dump to confirm the layout.
