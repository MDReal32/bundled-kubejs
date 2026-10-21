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
| 1.18.2 | Forge, Fabric, Quilt         | 38: 2.4.5-build.63 (2022-04-04) -> 4.0.0-fix4    | 1802.5.x           | `sample-1.18.2` |
| 1.19   | Forge, Fabric, Quilt         | 2: 3.0.5 (2022-06-16)                            | 1900.5.5           | `sample-1.19` |
| 1.19.2 | Forge, Fabric, Quilt         | 36: 4.1.0 (2022-11-08) -> 5.3.4                  | 1902.6.x           | `sample-1.19.2` |
| 1.20.1 | Forge, Fabric, Quilt, NeoForge | 14: 5.5.0 (2023-09-13) -> 6.0.1                  | 2001.6.x           | `sample-1.20.1` |
| 1.21   | NeoForge                     | 10: 7.0.0 (2024-06-27) -> 7.5.0                  | 2100.7.x, 2101.7.x | `sample-1.21` |
| 1.21.1 | NeoForge                     | 10: 7.3.0 (2024-08-22) -> 8.0.3                  | 2101.7.x           | `sample-1.21.1` |

ProbeJS 8.0.x is a rewrite for 1.21.1 (its own description says the old typing structure was
dropped), so expect a different layout there. Modrinth also lists a 1.20.1 build 7.0.0 (alpha) that
CurseForge does not.

## Where the pins come from

The generator is the source of truth. `instance.json` of every sample after 1.18.1 lists exactly the
files in the `manifest.json` that `yarn generate:<mc>:<loader>` writes to `generated/` (for example
`yarn generate:1.20.1:forge`), plus each jar's size, SHA-1 and the dependency ranges from its own
`mods.toml`. The jars were downloaded from CurseForge and checked against the size and SHA-1 it lists.
When a pin looks wrong, fix the generator and regenerate rather than editing `instance.json` by hand.

`sample-1.18.1` predates this and pins the oldest ProbeJS (1.1.0-build.13, the one the dump below was
run with) instead of what the generator resolves today (ProbeJS 2.3.0-build.60, KubeJS
1801.4.3-build.310, Rhino 1801.1.9-build.135, Architectury 3.9.66).

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

## sample-1.18.2

Forge 40.3.0 on Java 17, ProbeJS 4.0.0-fix4 with KubeJS 1802.5.5-build.569, Rhino 1802.2.1-build.255
and Architectury 4.12.94 (the newest 1.18.2 build, which is what the generator resolves; an earlier
revision of this sample pinned 4.11.93). `instance.json` pins each jar by CurseForge file id, size and
SHA-1, and the four jars were checked against it after download.

Verified: `yarn nx build @kubejs/sample-1.18.2` compiles client, server and startup scripts. Not done
yet: a `/probejs dump` run, so the layout ProbeJS 4.0.0-fix4 writes (and whether the plugin's
`.probe` assumption holds for it) is still unconfirmed, and the "run `/probejs dump`" warning stays
until it exists.

## sample-1.19

Forge 41.1.0 on Java 17, ProbeJS 3.0.5 with KubeJS 1900.5.5-build.27, Rhino 1802.2.1-build.255 and
Architectury 5.14.84. Rhino has no 1900-series build; its newest file is tagged for both 1.18.2 and
1.19, and KubeJS 1900.5.5 only asks for Rhino 1802.1.13 or newer. ProbeJS 3.0.5 is a beta and is the
only ProbeJS file for 1.19, and every KubeJS 1.19 file is a beta too.

Verified: the jars match `instance.json`, `yarn nx build @kubejs/sample-1.19` compiles, and the
generator's manifest for `-m 1.19 -t forge` resolves to the same four CurseForge file ids and Forge
41.1.0. Not done: a `/probejs dump`, so the typing layout is unconfirmed here as well.

## sample-1.19.2

Forge 43.5.0 on Java 17, ProbeJS 5.3.4 with KubeJS 1902.6.2-build.73, Rhino 1902.2.3-build.284 and
Architectury 6.6.92. Every file is a release. Verified: the jars match `instance.json`, every
`requires` range in it is satisfied by the other pins, and `yarn nx build @kubejs/sample-1.19.2`
compiles. Not done: a `/probejs dump`.

## sample-1.20.1

Forge 47.4.10 on Java 17, ProbeJS 6.0.1 with KubeJS 2001.6.5-build.26, Rhino 2001.2.3-build.10 and
Architectury 9.2.14. Same checks as 1.19.2, same open item: no `/probejs dump` yet. ProbeJS 6.0.1 is
about 2.4 MB, several times the size of the 1.18 to 1.19.2 builds.

## sample-1.21

NeoForge 21.0.167 on Java 21, ProbeJS 7.2.1 with KubeJS 2100.7.0-build.119 and Rhino
2100.2.5-build.46. CurseForge has no NeoForge recommended flag, so the newest 21.0.x is used. Every
2100-series KubeJS file is a beta, so this sample is a beta stack.

CurseForge also tags the 2101-series KubeJS and ProbeJS 7.3 to 7.5 for 1.21, but those builds are
made for 1.21.1: KubeJS 2101.7.2 declares `neoforge [21.1.199,)`, which NeoForge 21.0.x can never
satisfy. The generator used to pick them anyway. It now prefers a file whose tags carry no other
version of the same minor line, and falls back to the shared files when no such file exists.

## sample-1.21.1

NeoForge 21.1.264 on Java 21, ProbeJS 8.0.3 with KubeJS 2101.7.2-build.377, Rhino 2101.2.7-build.85
and Better Advanced Tooltips 2101.1.0-build.5. There is no Architectury here. CurseForge lists
Better Advanced Tooltips as a required dependency of KubeJS 2101.7.2-build.377, while that jar's own
`neoforge.mods.toml` marks it `optional` and client-only. The generator follows CurseForge, so the
sample carries it too; it is 37 KB and does nothing on a server.

Same checks as 1.19.2, same open item: no `/probejs dump` yet, and ProbeJS 8.0.x writes a different
layout than the older lines.
