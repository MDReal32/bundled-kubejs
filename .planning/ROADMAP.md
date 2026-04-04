# Roadmap: bundled_kubejs_dev Mod

**Milestone:** Kotlin NeoForge mod scaffold
**Granularity:** Standard
**Coverage:** 16/16 v1 requirements mapped

---

## Phases

- [ ] **Phase 1: Gradle Build Configuration** - A valid Gradle project that compiles Kotlin with NeoForge toolchain
- [ ] **Phase 2: Mod Structure and Entry Point** - A complete, loadable mod scaffold with correct package layout and placeholder files

---

## Phase Details

### Phase 1: Gradle Build Configuration
**Goal**: A valid Gradle project exists that compiles Kotlin against the NeoForge toolchain and produces a buildable artifact
**Depends on**: Nothing
**Requirements**: BUILD-01, BUILD-02, BUILD-03, BUILD-04, BUILD-05
**Success Criteria** (what must be TRUE):
  1. Running `./gradlew build` completes without errors
  2. `build.gradle.kts`, `settings.gradle.kts`, and `gradle.properties` are present and syntactically valid
  3. Kotlin JVM plugin and NeoForge Kotlin dependency are declared and resolve correctly during sync
  4. NeoForge, Minecraft, and Kotlin versions are pinned in `gradle.properties` (no floating versions)
**Plans:** 2 plans

Plans:
- [ ] 01-01-PLAN.md -- Create Gradle project structure with wrapper, build script, settings, and properties
- [ ] 01-02-PLAN.md -- Install Java 21, verify build compiles successfully

### Phase 2: Mod Structure and Entry Point
**Goal**: The Gradle project contains a complete NeoForge mod scaffold -- correct metadata, entry point class, package hierarchy, and placeholder classes -- that loads cleanly in a NeoForge dev environment
**Depends on**: Phase 1
**Requirements**: MOD-01, MOD-02, MOD-03, MOD-04, STRUCT-01, STRUCT-02, STRUCT-03, STRUCT-04, FILE-01, FILE-02, FILE-03
**Success Criteria** (what must be TRUE):
  1. NeoForge dev environment starts and the mod appears in the mod list with ID `bundled_kubejs_dev` and no load errors or warnings
  2. `BundledKubejsDevMod.kt` exists with `@Mod("bundled_kubejs_dev")` annotation as the sole entry point and contains no logic beyond the annotation
  3. Source tree under `src/main/java/dev/bundledkubejs/` contains `core/`, `service/`, and `command/` subpackages each with their respective placeholder class (`GameSessionLocator.kt`, `DevBridgeService.kt`, `DevCommandRegistrar.kt`) -- all empty, no logic
  4. `META-INF/neoforge.mods.toml` and `pack.mcmeta` are present and valid
**Plans**: TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Gradle Build Configuration | 0/2 | Planning complete | - |
| 2. Mod Structure and Entry Point | 0/0 | Not started | - |

---

*Roadmap created: 2026-04-04*
*Last updated: 2026-04-04 after Phase 1 planning*
