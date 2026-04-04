# Requirements: bundled_kubejs_dev Mod

**Defined:** 2026-04-04
**Core Value:** A correct, empty Kotlin NeoForge mod scaffold that loads cleanly and is ready for future implementation

## v1 Requirements

### Build Configuration

- [ ] **BUILD-01**: Project has valid `build.gradle.kts` using Kotlin DSL
- [ ] **BUILD-02**: Project has valid `settings.gradle.kts` with correct project name
- [ ] **BUILD-03**: Project has `gradle.properties` with NeoForge, Minecraft, and Kotlin versions pinned
- [ ] **BUILD-04**: Kotlin language support configured in Gradle (kotlin-jvm plugin + kotlin-for-forge or NeoForge Kotlin support)
- [ ] **BUILD-05**: Project builds without errors (`./gradlew build`)

### Mod Identity & Entry Point

- [ ] **MOD-01**: Valid `src/main/resources/META-INF/neoforge.mods.toml` with mod ID `bundled_kubejs_dev`
- [ ] **MOD-02**: `BundledKubejsDevMod.kt` with `@Mod("bundled_kubejs_dev")` annotation as the sole entry point
- [ ] **MOD-03**: Mod loads in NeoForge dev environment without errors or warnings
- [ ] **MOD-04**: `pack.mcmeta` present in resources for resource pack compatibility

### Package Structure

- [ ] **STRUCT-01**: Source root at `src/main/java/dev/bundledkubejs/`
- [ ] **STRUCT-02**: Subpackage directory `core/` exists under root package
- [ ] **STRUCT-03**: Subpackage directory `service/` exists under root package
- [ ] **STRUCT-04**: Subpackage directory `command/` exists under root package

### Placeholder Files

- [ ] **FILE-01**: `DevBridgeService.kt` in `service/` — empty class, no logic
- [ ] **FILE-02**: `GameSessionLocator.kt` in `core/` — empty class, no logic
- [ ] **FILE-03**: `DevCommandRegistrar.kt` in `command/` — empty class, no logic

## v2 Requirements

### Dev Bridge Integration

- **BRIDGE-01**: `DevBridgeService` connects to bundled-kubejs TypeScript toolchain
- **BRIDGE-02**: `GameSessionLocator` resolves active Minecraft game session data
- **BRIDGE-03**: `DevCommandRegistrar` registers in-game dev commands

### Event System

- **EVT-01**: NeoForge event listener hooks for game lifecycle events
- **EVT-02**: Integration with KubeJS script reload events

## Out of Scope

| Feature | Reason |
|---------|--------|
| HTTP/networking | No logic in scaffold phase |
| Command implementation | Placeholder only; logic added in later milestone |
| Service implementation | Scaffold only |
| Event handlers | None until feature milestone |
| Logging systems | No custom setup beyond NeoForge defaults |
| KubeJS API interaction | Future milestone |
| Publishing to Modrinth/CF | Not a distribution mod |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUILD-01 | Phase 1 | Pending |
| BUILD-02 | Phase 1 | Pending |
| BUILD-03 | Phase 1 | Pending |
| BUILD-04 | Phase 1 | Pending |
| BUILD-05 | Phase 1 | Pending |
| MOD-01 | Phase 2 | Pending |
| MOD-02 | Phase 2 | Pending |
| MOD-03 | Phase 2 | Pending |
| MOD-04 | Phase 2 | Pending |
| STRUCT-01 | Phase 2 | Pending |
| STRUCT-02 | Phase 2 | Pending |
| STRUCT-03 | Phase 2 | Pending |
| STRUCT-04 | Phase 2 | Pending |
| FILE-01 | Phase 2 | Pending |
| FILE-02 | Phase 2 | Pending |
| FILE-03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-04*
*Last updated: 2026-04-04 after initial definition*
