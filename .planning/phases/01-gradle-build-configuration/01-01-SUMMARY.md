---
phase: 01-gradle-build-configuration
plan: 01
subsystem: infra
tags: [gradle, kotlin-dsl, neoforge, moddevgradle, kotlinforforge, gradle-wrapper]

# Dependency graph
requires: []
provides:
  - Standalone Gradle project directory bundled_kubejs_dev/ with full build configuration
  - Gradle wrapper (gradlew, gradlew.bat, gradle-wrapper.jar) configured for Gradle 8.10.2
  - build.gradle.kts with ModDevGradle 2.0.141 + kotlin("jvm") 2.0.21 plugins
  - settings.gradle.kts with NeoForge Maven and foojay toolchain resolver
  - gradle.properties with all versions pinned (NeoForge 21.1.222, MC 1.21.1, KFF 5.7.0)
  - Source directory skeleton: src/main/kotlin/, src/main/java/, src/main/resources/META-INF/
affects:
  - 01-02 (mod identity files: mods.toml uses property tokens from gradle.properties)
  - phase-02 (Kotlin source files go into src/main/kotlin/dev/bundledkubejs/)

# Tech tracking
tech-stack:
  added:
    - net.neoforged.moddev 2.0.141 (ModDevGradle Gradle plugin)
    - kotlin("jvm") 2.0.21 (Kotlin JVM compiler plugin)
    - thedarkcolour:kotlinforforge-neoforge 5.7.0 (runtime Kotlin language adapter for NeoForge FML)
    - org.gradle.toolchains.foojay-resolver-convention 1.0.0 (JDK auto-provisioning)
    - Gradle Wrapper 8.10.2
  patterns:
    - All versions centralized in gradle.properties, referenced via project.property() in build.gradle.kts
    - NeoForge brought in via neoForge { version = ... } block, NOT as an implementation dependency
    - Standalone Gradle project alongside Nx/Yarn monorepo (not nested inside)

key-files:
  created:
    - bundled_kubejs_dev/build.gradle.kts
    - bundled_kubejs_dev/settings.gradle.kts
    - bundled_kubejs_dev/gradle.properties
    - bundled_kubejs_dev/gradlew
    - bundled_kubejs_dev/gradlew.bat
    - bundled_kubejs_dev/gradle/wrapper/gradle-wrapper.jar
    - bundled_kubejs_dev/gradle/wrapper/gradle-wrapper.properties
    - bundled_kubejs_dev/.gitignore
  modified: []

key-decisions:
  - "ModDevGradle 2.0.141 (net.neoforged.moddev) chosen over NeoGradle 7.x — lighter, recommended for new NeoForge 1.21.1+ mods"
  - "kotlinforforge-neoforge 5.7.0 pinned — confirmed compatible with NeoForge 21.1.222 on Minecraft 1.21.1"
  - "kotlin 2.0.21 chosen to align with KFF 5.7.0 build target, avoiding stdlib version conflicts"
  - "gradle-wrapper.jar committed with .gitignore override — required for wrapper bootstrap without system Gradle install"
  - "src/main/kotlin/ directory created alongside src/main/java/ — kotlin/ is the correct source root for Kotlin NeoForge mods"

patterns-established:
  - "Pattern: gradle.properties as single source of truth for all version values"
  - "Pattern: neoForge { version = project.property(...) } — ModDevGradle DSL, not dependency declaration"
  - "Pattern: ProcessResources task expands neoforge.mods.toml template variables from gradle.properties"

requirements-completed: [BUILD-01, BUILD-02, BUILD-03, BUILD-04]

# Metrics
duration: 4min
completed: 2026-04-04
---

# Phase 01 Plan 01: Gradle Build Configuration Summary

**Standalone Gradle project for bundled_kubejs_dev NeoForge mod with ModDevGradle 2.0.141, Kotlin JVM 2.0.21, and kotlinforforge-neoforge 5.7.0 — all versions pinned, wrapper configured for Gradle 8.10.2**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-04T16:20:37Z
- **Completed:** 2026-04-04T16:24:09Z
- **Tasks:** 2
- **Files modified:** 8 created

## Accomplishments

- Created complete Gradle wrapper: gradlew, gradlew.bat, gradle-wrapper.jar, gradle-wrapper.properties (targeting Gradle 8.10.2)
- Wrote build.gradle.kts with ModDevGradle 2.0.141 + Kotlin JVM 2.0.21 plugins, neoForge block, and kotlinforforge-neoforge 5.7.0 dependency
- Wrote settings.gradle.kts with NeoForge Maven repository in pluginManagement and foojay toolchain auto-provisioning
- Wrote gradle.properties pinning all versions: NeoForge 21.1.222, Minecraft 1.21.1, KFF 5.7.0 — no floating specifiers
- Established source directory skeleton for Phase 2: src/main/kotlin/ and src/main/resources/META-INF/

## Task Commits

1. **Task 1: Create Gradle wrapper and project directory** - `69a1b6f` (chore)
2. **Task 2: Write build.gradle.kts, settings.gradle.kts, and gradle.properties** - `0cdc473` (feat)

**Plan metadata:** _(final docs commit, see state updates)_

## Files Created/Modified

- `bundled_kubejs_dev/build.gradle.kts` - Kotlin DSL build script: ModDevGradle + Kotlin JVM plugins, neoForge block, KFF dependency, ProcessResources template expansion
- `bundled_kubejs_dev/settings.gradle.kts` - Plugin management with NeoForge Maven, foojay resolver, project name
- `bundled_kubejs_dev/gradle.properties` - All version pins for NeoForge, Minecraft, KFF, and mod metadata
- `bundled_kubejs_dev/gradlew` - Unix Gradle wrapper launcher
- `bundled_kubejs_dev/gradlew.bat` - Windows Gradle wrapper launcher
- `bundled_kubejs_dev/gradle/wrapper/gradle-wrapper.jar` - Wrapper bootstrap JAR (from NeoForge MDK)
- `bundled_kubejs_dev/gradle/wrapper/gradle-wrapper.properties` - Gradle 8.10.2 distribution URL
- `bundled_kubejs_dev/.gitignore` - Allows gradle-wrapper.jar, excludes .gradle/ and build/

## Decisions Made

- Used ModDevGradle 2.0.141 (`net.neoforged.moddev`) instead of NeoGradle 7.x — lighter API and officially recommended for new 1.21.1+ projects
- Pinned kotlinforforge-neoforge to 5.7.0 — lowest confirmed-stable version for NeoForge 21.1.222 on Minecraft 1.21.1
- Used Kotlin JVM plugin 2.0.21 to align with KFF 5.7.0 build target (avoids stdlib version conflicts with KFF-bundled stdlib)
- Committed gradle-wrapper.jar via a `.gitignore` override in bundled_kubejs_dev/ — necessary because the root .gitignore has `*.jar` exclusion

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added bundled_kubejs_dev/.gitignore with gradle-wrapper.jar exception**
- **Found during:** Task 1 (staging files for commit)
- **Issue:** Root .gitignore has `*.jar` glob; git refused to stage gradle-wrapper.jar without force-add
- **Fix:** Created bundled_kubejs_dev/.gitignore with `!gradle/wrapper/gradle-wrapper.jar` exception plus standard Gradle output exclusions (.gradle/, build/, run/)
- **Files modified:** bundled_kubejs_dev/.gitignore (new file)
- **Verification:** git add succeeded without -f flag after .gitignore was staged
- **Committed in:** 69a1b6f (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added src/main/kotlin/dev/bundledkubejs/ in addition to src/main/java/**
- **Found during:** Task 1 (directory creation)
- **Issue:** The pre-existing bundled_kubejs_dev/ had src/main/kotlin/ structure. Plan says src/main/java/ "for Kotlin sources" — a naming inconsistency. Kotlin NeoForge projects use src/main/kotlin/ as the source root.
- **Fix:** Created both src/main/java/dev/bundledkubejs/ (as plan specified) and retained src/main/kotlin/dev/bundledkubejs/ (correct Kotlin source root for Phase 2)
- **Files modified:** Both directories tracked via .gitkeep files
- **Verification:** Both directories exist and are committed
- **Committed in:** 69a1b6f (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 2 — missing critical correctness items)
**Impact on plan:** Both auto-fixes essential. .gitignore exception is required for wrapper to work. kotlin/ directory is the correct source root for Kotlin mods — Phase 2 will place Kotlin source files there.

## Issues Encountered

- gradle-wrapper.jar from NeoForge MDK is 43KB, not ">50KB" as stated in plan acceptance criteria. The jar is valid (confirmed as ZIP archive containing class files). The plan's size estimate was approximate; official MDK file size is authoritative.

## User Setup Required

None — no external service configuration required. However, `./gradlew build` cannot run until Java 21 JDK is installed (documented in RESEARCH.md Pitfall 3 / BUILD-05 environment blocker). This is an environment prerequisite for Phase 1 Plan 02 validation.

## Next Phase Readiness

- Gradle project structure is complete and ready for Plan 02 (mod identity files: neoforge.mods.toml, pack.mcmeta)
- build.gradle.kts ProcessResources task is pre-wired to expand template variables from gradle.properties into META-INF/neoforge.mods.toml
- src/main/kotlin/dev/bundledkubejs/ is the correct source root for Phase 2 Kotlin mod entry point

---
*Phase: 01-gradle-build-configuration*
*Completed: 2026-04-04*
