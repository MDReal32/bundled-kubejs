# bundled-kubejs + bundled_kubejs_dev Mod

## What This Is

A TypeScript monorepo (bundled-kubejs) providing tooling for KubeJS Minecraft modpacks — including a Vite-based build plugin, a project generator, and a CurseForge API proxy. The project is now expanding to include **`bundled_kubejs_dev`**: a companion Kotlin NeoForge mod that serves as an in-game dev bridge scaffold, providing a clean foundation for future game-side integration with the existing toolchain.

## Core Value

The TypeScript toolchain reliably builds and packages KubeJS projects; the Kotlin mod provides the in-game counterpart to that toolchain — starting from a correct, empty scaffold.

## Requirements

### Validated

- ✓ Vite-based build plugin for KubeJS scripts (`@kubejs/plugin`) — existing
- ✓ CLI project generator with EJS templates (`@kubejs/generator`) — existing
- ✓ CurseForge API proxy server (`apps/cf-server`) — existing
- ✓ Core utilities: Archiver, Logger, CurseForge API client (`@kubejs/core`) — existing
- ✓ Nx monorepo with Yarn 4 workspaces — existing

### Active

- [ ] Kotlin NeoForge mod scaffold (`bundled_kubejs_dev`) with correct Gradle/NeoForge project setup
- [ ] Kotlin configured in Gradle with proper NeoForge Kotlin for Forge dependency
- [ ] Clean package structure under `dev.bundledkubejs` with `core/`, `service/`, `command/` subpackages
- [ ] Minimal entry point class `BundledKubejsDevMod.kt` with `@Mod("bundled_kubejs_dev")` annotation
- [ ] Empty placeholder classes: `DevBridgeService`, `GameSessionLocator`, `DevCommandRegistrar`
- [ ] Valid `mods.toml` / `neoforge.mods.toml` metadata file
- [ ] Runnable mod (loads without errors in NeoForge dev environment)

### Out of Scope

- HTTP/networking implementation — no feature logic in this phase
- Command registration implementation — placeholder only, logic added later
- Service/bridge implementation — scaffold only
- Event handlers — none until needed
- Logging systems — no custom setup beyond what NeoForge provides
- Integration with TypeScript toolchain — future milestone
- KubeJS API interaction — future milestone

## Context

The existing codebase is a mature TypeScript/Node.js monorepo. The new Kotlin mod is a **separate Gradle project** that will live alongside it (not inside the Nx monorepo). NeoForge mod projects use Gradle, not Node/Yarn. The Kotlin mod targets NeoForge (not Forge), uses MDK-based project structure, and requires `kotlin-for-forge` or NeoForge's official Kotlin support.

The mod ID `bundled_kubejs_dev` signals this is a development/companion mod — it's the in-game side of the bundled-kubejs ecosystem, not meant for end users directly.

## Constraints

- **Platform**: NeoForge only (not Fabric, not legacy Forge) — user specified
- **Language**: Kotlin only — no Java source files (except possibly generated stubs)
- **No logic**: All implementation files are placeholders — no functional code
- **Gradle**: Build system must be Gradle with Kotlin DSL (`build.gradle.kts`)
- **Scaffold purity**: Do not add any features that weren't explicitly requested

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Kotlin NeoForge mod as separate Gradle project | NeoForge mods use Gradle, incompatible with Nx/Yarn monorepo | — Pending |
| Package root `dev.bundledkubejs` | Clean namespace based on mod identity | — Pending |
| `kotlin-for-forge` / NeoForge Kotlin support | Required to run Kotlin classes in NeoForge mod loader | — Pending |
| Placeholder-only files | User explicitly wants scaffold only, zero logic | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-04 after initialization*
