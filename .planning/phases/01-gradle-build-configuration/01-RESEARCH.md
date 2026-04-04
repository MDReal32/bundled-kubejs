# Phase 1: Gradle Build Configuration - Research

**Researched:** 2026-04-04
**Domain:** NeoForge Mod Gradle Build System (Kotlin DSL + KotlinForForge)
**Confidence:** HIGH (core stack), MEDIUM (specific version pinning for KFF 5.x on 1.21.1)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BUILD-01 | Project has valid `build.gradle.kts` using Kotlin DSL | Confirmed: NeoGradle plugin supports `.kts` files; complete template reconstructed from Brownield/neoforge-kotlin |
| BUILD-02 | Project has valid `settings.gradle.kts` with correct project name | Confirmed: minimal settings file structure verified from official MDK |
| BUILD-03 | Project has `gradle.properties` with NeoForge, Minecraft, and Kotlin versions pinned | Confirmed: all version values sourced from official NeoForgeMDKs/MDK-1.21.1-ModDevGradle |
| BUILD-04 | Kotlin language support configured (kotlin-jvm plugin + kotlin-for-forge) | Confirmed: `kotlin("jvm")` plugin + `thedarkcolour:kotlinforforge-neoforge` dependency |
| BUILD-05 | Project builds without errors (`./gradlew build`) | Dependent on Java 21 being installed — flagged as environment blocker |
</phase_requirements>

---

## Summary

This phase creates a standalone Gradle project for a Kotlin NeoForge mod targeting Minecraft 1.21.1. The project must use Kotlin DSL (`build.gradle.kts`), apply the NeoForge Gradle plugin to pull in the NeoForge toolchain, and declare `thedarkcolour:kotlinforforge-neoforge` as a dependency so Kotlin classes are recognized by the NeoForge mod loader.

The standard approach in 2024–2026 is to use either the NeoGradle plugin (`net.neoforged.gradle.userdev`) or the newer ModDevGradle plugin (`net.neoforged.moddev`). ModDevGradle 2.x is the officially recommended path for new mods (simpler buildscripts, no multi-version support needed). The NeoGradle plugin is the older alternative that has been confirmed to work with Kotlin DSL via real community examples.

For Kotlin mod support at runtime, `thedarkcolour:kotlinforforge-neoforge` 5.x is the standard library for NeoForge 1.21.1. The mod loader is changed from `javafml` to `kotlinforforge` in `neoforge.mods.toml`.

**Primary recommendation:** Use ModDevGradle 2.0.141 with `net.neoforged.moddev` plugin, Kotlin JVM plugin `2.0.21`, and `kotlinforforge-neoforge:5.7.0` (latest confirmed stable for 1.21.1 at time of research).

---

## Project Constraints (from CLAUDE.md)

No explicit `## Decisions` / `## Claude's Discretion` / `## Deferred Ideas` CONTEXT.md was found for this phase. Project constraints come from CLAUDE.md and PROJECT.md:

- **Platform**: NeoForge only (not Fabric, not legacy Forge)
- **Language**: Kotlin only — no Java source files (except possibly generated stubs)
- **No logic**: All implementation files are placeholders — no functional code
- **Gradle**: Build system must be Gradle with Kotlin DSL (`build.gradle.kts`)
- **Scaffold purity**: Do not add any features that weren't explicitly requested
- **Mod project location**: Separate Gradle project, NOT inside the Nx/Yarn monorepo structure. Lives alongside it under `/c/Projects/bundled-kubejs/` (e.g., as `bundled_kubejs_dev/` subdirectory at the repo root)

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `net.neoforged.moddev` (ModDevGradle) | `2.0.141` | Gradle plugin that sets up NeoForge toolchain, run configs, and deobfuscation | Official NeoForge build plugin; 2.x is recommended over NeoGradle for new projects |
| `org.jetbrains.kotlin.jvm` | `2.0.21` | Compiles Kotlin source to JVM bytecode | Required to compile any Kotlin source; bundled in Kotlin plugin |
| `thedarkcolour:kotlinforforge-neoforge` | `5.7.0` | Runtime language adapter: registers Kotlin class/object mod entries in NeoForge's FML | Required for NeoForge to load a `@Mod`-annotated Kotlin object/class |
| Java 21 JDK | `21` (LTS) | JVM runtime for building and running Minecraft 1.21.1 | Mojang ships Java 21 to users from 1.20.5 onward; official NeoForge MDK enforces this |
| Gradle Wrapper | `8.x` (via `gradlew`) | Downloads and runs correct Gradle version | Industry standard; eliminates environment Gradle version mismatches |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `org.gradle.toolchains.foojay-resolver-convention` | `1.0.0` | Enables Gradle toolchain auto-download for JDK | Used in `settings.gradle.kts`; allows Gradle to provision a JDK if one is not available |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `net.neoforged.moddev` (ModDevGradle) | `net.neoforged.gradle.userdev` (NeoGradle 7.x) | NeoGradle is older, more verbose, and in maintenance mode. ModDevGradle 2.x is the current recommendation. Either works for a simple single-mod project |
| `kotlinforforge-neoforge:5.7.0` | `kotlinforforge-neoforge:5.11.0` | 5.11.0 targets 1.21.5; 5.7.0 is the lowest version confirmed stable for 1.21.1. Any 5.x >= 5.5.0 should work with 1.21.1 |

**Installation (via Gradle Wrapper — no manual install):**
```bash
# Generate wrapper (run once, from the mod project directory)
gradle wrapper --gradle-version 8.10.2
# OR copy wrapper files from the official MDK
```

**Version verification commands:**
```bash
# Check NeoForge version from official MDK gradle.properties
# neo_version=21.1.222 (verified 2026-04-04 from neoforgemdks/MDK-1.21.1-ModDevGradle)

# Check ModDevGradle latest
# plugins.gradle.org/plugin/net.neoforged.moddev → 2.0.141 (verified 2026-04-04)
```

---

## Architecture Patterns

### Recommended Project Structure

The standalone Gradle project lives as a subdirectory under the monorepo root. It is NOT listed in `settings.gradle.kts` of the Yarn/Nx project — it is entirely separate.

```
bundled-kubejs/                      # repo root (existing TypeScript monorepo)
├── bundled_kubejs_dev/              # NEW: standalone Gradle project
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   ├── gradle.properties
│   ├── gradlew                      # Gradle wrapper (Unix)
│   ├── gradlew.bat                  # Gradle wrapper (Windows)
│   ├── gradle/
│   │   └── wrapper/
│   │       ├── gradle-wrapper.jar
│   │       └── gradle-wrapper.properties
│   └── src/
│       └── main/
│           ├── kotlin/              # Kotlin source root
│           │   └── dev/bundledkubejs/
│           └── resources/
│               └── META-INF/
│                   └── neoforge.mods.toml
├── libs/                            # existing TypeScript libs
├── apps/                            # existing TypeScript apps
└── ...
```

### Pattern 1: ModDevGradle Plugin with Kotlin DSL

**What:** Apply `net.neoforged.moddev` in `build.gradle.kts`. Configure the `neoForge` block with the NeoForge version. Add `kotlin("jvm")` plugin. Add `kotlinforforge-neoforge` dependency. Set Java toolchain to 21.

**When to use:** All new NeoForge 1.21.1+ mods that do not need multi-version support in the same project.

**Example — `settings.gradle.kts`:**
```kotlin
// Source: Official NeoForgeMDKs/MDK-1.21.1-ModDevGradle settings.gradle (Kotlin DSL equivalent)
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenLocal()
        maven(url = "https://maven.neoforged.net/releases")
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "bundled_kubejs_dev"
```

**Example — `build.gradle.kts` (complete working template):**
```kotlin
// Source: Synthesized from neoforgemdks/MDK-1.21.1-ModDevGradle build.gradle
//         + Brownield/neoforge-kotlin build.gradle.kts (Kotlin DSL pattern)
//         + thedarkcolour/KotlinForForge 5.x README
import java.util.Properties

plugins {
    id("java-library")
    id("maven-publish")
    id("net.neoforged.moddev") version "2.0.141"
    id("idea")
    kotlin("jvm") version "2.0.21"
}

val modId: String by project
val modVersion: String by project
val modGroupId: String by project

project.version = modVersion
project.group = modGroupId

base {
    archivesName.set(modId)
}

// Minecraft 1.21.1 requires Java 21
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

neoForge {
    version = project.property("neoVersion") as String

    runs {
        create("client") {
            client()
        }
        create("server") {
            server()
            programArgument("--nogui")
        }
    }

    mods {
        create(modId) {
            sourceSet(sourceSets.main.get())
        }
    }
}

repositories {
    maven {
        name = "Kotlin for Forge"
        url = uri("https://thedarkcolour.github.io/KotlinForForge/")
    }
}

dependencies {
    implementation("thedarkcolour:kotlinforforge-neoforge:${project.property("kffVersion")}")
}

tasks.withType<ProcessResources>().configureEach {
    val props = mapOf(
        "minecraft_version" to project.property("minecraftVersion"),
        "mod_id" to modId,
        "mod_version" to modVersion,
        "neo_version_range" to project.property("neoVersionRange"),
        "loader_version_range" to project.property("loaderVersionRange"),
        "kff_version_range" to project.property("kffVersionRange")
    )
    inputs.properties(props)
    filesMatching("META-INF/neoforge.mods.toml") {
        expand(props)
    }
}

tasks.withType<JavaCompile>().configureEach {
    options.encoding = "UTF-8"
}

idea {
    module {
        isDownloadSources = true
        isDownloadJavadoc = true
    }
}
```

**Example — `gradle.properties`:**
```properties
# Gradle performance
org.gradle.jvmargs=-Xmx1G
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configuration-cache=true

# Minecraft / NeoForge versions
minecraftVersion=1.21.1
minecraftVersionRange=[1.21.1]
neoVersion=21.1.222
neoVersionRange=[21.1,)
loaderVersionRange=[1,)

# Kotlin for Forge
kffVersion=5.7.0
kffVersionRange=[5.7,)

# Mod metadata
modId=bundled_kubejs_dev
modName=Bundled KubeJS Dev
modVersion=1.0.0
modGroupId=dev.bundledkubejs
modLicense=All Rights Reserved
```

### Pattern 2: Gradle Wrapper (Mandatory for CI and reproducibility)

**What:** `gradlew` / `gradlew.bat` scripts bundled with the project ensure any machine uses the same Gradle version.

**When to use:** Always — do not rely on a globally-installed `gradle`.

**How to generate:**
```bash
# From the mod project directory, with Gradle installed:
gradle wrapper --gradle-version 8.10.2 --distribution-type bin

# OR: Copy gradlew, gradlew.bat, and gradle/wrapper/ from official MDK download
```

The Gradle wrapper is downloaded from `https://services.gradle.org/distributions/`. The `gradle-wrapper.properties` file specifies the Gradle version to use.

### Pattern 3: KotlinForForge `mods.toml` Loader Declaration

**What:** When using `kotlinforforge-neoforge`, the mod loader in `neoforge.mods.toml` must be changed from `javafml` to `kotlinforforge`. Failing to do this means the mod will not load.

**When to use:** Whenever `kotlinforforge-neoforge` is a dependency.

This belongs in Phase 2 (mod files), but is included here as a prerequisite awareness item.

```toml
# Source: thedarkcolour/KotlinForForge 5.x README
modLoader = "kotlinforforge"
loaderVersion = "[5.7,)"
```

### Anti-Patterns to Avoid

- **Using `build.gradle` (Groovy DSL) instead of `build.gradle.kts`:** Violates BUILD-01 requirement and project constraints.
- **Placing the Gradle project inside the Nx workspace as a subproject:** NeoForge Gradle and Nx are fundamentally incompatible; the mod project must be a fully separate Gradle build at its own directory.
- **Declaring `kotlinforforge-neoforge` without changing `modLoader` in mods.toml:** The mod will crash on load because the FML language loader won't be found. (NOTE: This pitfall is resolved in Phase 2; BUILD-05 just requires the Gradle build to succeed without mod identity files.)
- **Omitting `kotlin("jvm")` plugin:** Without this plugin, Kotlin source files will not compile even if `kotlinforforge-neoforge` is on the classpath.
- **Using NeoGradle 7.x plugin (`net.neoforged.gradle.userdev`) without a `runs {}` block inside a `minecraft {}` block:** NeoGradle has a different configuration DSL than ModDevGradle; do not mix syntax between the two.
- **Declaring `implementation("net.neoforged:neoforge:...")` when using ModDevGradle:** With ModDevGradle, NeoForge is brought in via `neoForge { version = "..." }`, not as a dependency. Adding it again as a dependency causes duplicate class issues.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Kotlin language adapter for NeoForge FML | Custom `LanguageProvider` to load Kotlin classes | `thedarkcolour:kotlinforforge-neoforge` | NeoForge FML requires a registered `IModLanguageProvider` + `IModLanguageLoader`; kotlinforforge handles all reflective loading, coroutines class inclusion, and object singleton support |
| Gradle plugin for NeoForge dependency resolution | Custom `resolutionStrategy` + manual deobfuscation | `net.neoforged.moddev` or `net.neoforged.gradle.userdev` | NeoForge bytecode requires runtime deobfuscation (MCP/Parchment mappings); this is non-trivial and changes per NeoForge version |
| JDK toolchain discovery | System `JAVA_HOME` environment variable hacks | `org.gradle.toolchains.foojay-resolver-convention` in settings + Gradle toolchain API | Foojay resolver auto-downloads the exact JDK version needed; avoids "wrong Java version" build failures |

**Key insight:** The NeoForge modding ecosystem has highly specialized Gradle infrastructure. The deobfuscation, classpath setup, and language loading layers are all handled by the published plugins/libraries. Any custom reimplementation would need to track NeoForge internal API changes on every version bump.

---

## Common Pitfalls

### Pitfall 1: KotlinForForge version mismatch with NeoForge version

**What goes wrong:** `kotlinforforge-neoforge:5.x` requires a minimum NeoForge version. Using an older NeoForge with a newer KFF (or vice versa) can produce `AbstractMethodError` or class cast failures at mod load time.

**Why it happens:** KFF 5.x introduced support for 1.21 in 5.3.0. Each KFF minor version may depend on internal NeoForge APIs. KFF 5.1.x requires NeoForge `20.6.62-beta` or newer (from 5.x README).

**How to avoid:** Use `neo_version=21.1.222` with `kff_version=5.7.0`. These are confirmed compatible at research time. The `loaderVersion` range in `mods.toml` should be set to `[5.7,)`.

**Warning signs:** FML crash with `Could not find or load main class` or `ClassNotFoundException: thedarkcolour.kotlinforforge...` during `./gradlew runClient`.

### Pitfall 2: Missing Gradle Wrapper files

**What goes wrong:** `./gradlew build` fails with "Permission denied" or "No such file or directory" because the wrapper scripts (`gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`, `gradle-wrapper.properties`) are missing.

**Why it happens:** New Gradle projects require these files to be generated or copied. They are not auto-created by `build.gradle.kts` alone.

**How to avoid:** The plan must include a step to download the Gradle Wrapper from the official MDK or generate it with `gradle wrapper`. On Windows, `gradlew.bat` is the entry point for `./gradlew build` (via Git Bash, `gradlew.bat` or `./gradlew`).

**Warning signs:** `bash: ./gradlew: No such file or directory` or `The wrapper jar file... is missing.`

### Pitfall 3: Java 21 not installed

**What goes wrong:** `./gradlew build` fails immediately with `No matching toolchains found` or `JAVA_HOME is set to an invalid directory`.

**Why it happens:** Java 21 is NOT installed on this machine (confirmed by environment check). The Gradle Wrapper downloads Gradle itself, but does NOT provision a JDK. Foojay resolver (in settings.gradle.kts) can auto-download a JDK only if Gradle itself can run — which requires an initial Java installation.

**How to avoid:** The plan must include an explicit step to install Java 21 (e.g., via Adoptium/Temurin installer for Windows) before attempting `./gradlew build`. Alternatively, if `foojay-resolver-convention` is configured, it may auto-provision — but an initial JVM must be available to launch Gradle at all.

**Warning signs:** The `gradlew` command itself fails before any Gradle logic runs; error references `JAVA_HOME` or `No suitable JVM found`.

### Pitfall 4: NeoForge Maven not in `pluginManagement` repositories

**What goes wrong:** `Plugin [id: 'net.neoforged.moddev', version: '2.0.141'] was not found in any of the following sources`.

**Why it happens:** ModDevGradle is distributed via the NeoForge Maven (`https://maven.neoforged.net/releases`), not only the Gradle Plugin Portal.

**How to avoid:** The `settings.gradle.kts` `pluginManagement` block must include BOTH `gradlePluginPortal()` and `maven(url = "https://maven.neoforged.net/releases")`.

**Warning signs:** `Could not resolve net.neoforged.moddev:net.neoforged.moddev.gradle.plugin:2.0.141`

### Pitfall 5: Kotlin plugin version conflicts with `kotlinforforge-neoforge` bundled Kotlin stdlib

**What goes wrong:** Build failure or runtime `NoSuchMethodError` due to Kotlin stdlib version clash.

**Why it happens:** `kotlinforforge-neoforge` bundles a specific Kotlin stdlib version. If the Kotlin JVM plugin version used to compile differs significantly from what KFF bundles, binary incompatibilities can occur.

**How to avoid:** Use the Kotlin version that aligns with the KFF release. KFF 5.7.0 was built against Kotlin ~2.0.x. The 5.x README specifies `kotlin("jvm") version "2.2.20"` as the recommended plugin version. For compatibility with 5.7.0, use `2.0.21` or align with whatever the KFF 5.x changelog specifies.

**Warning signs:** `RuntimeException: Class 'kotlin.jvm.internal.Lambda' was compiled with an incompatible version of Kotlin.`

---

## Code Examples

Verified patterns from official and community sources:

### Complete `settings.gradle.kts`
```kotlin
// Source: Official NeoForgeMDKs/MDK-1.21.1-ModDevGradle settings.gradle (adapted to Kotlin DSL)
//         + Brownield/neoforge-kotlin settings.gradle.kts (verified)
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenLocal()
        maven(url = "https://maven.neoforged.net/releases")
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "bundled_kubejs_dev"
```

### KotlinForForge dependency declaration
```kotlin
// Source: thedarkcolour/KotlinForForge 5.x README.md
repositories {
    maven {
        name = "Kotlin for Forge"
        url = uri("https://thedarkcolour.github.io/KotlinForForge/")
    }
}

dependencies {
    implementation("thedarkcolour:kotlinforforge-neoforge:5.7.0")
}
```

### Java toolchain configuration for Java 21
```kotlin
// Source: NeoForgeMDKs/MDK-1.21.1-ModDevGradle build.gradle comment:
// "Mojang ships Java 21 to end users in 1.21.1, so mods should target Java 21."
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}
```

### `gradle-wrapper.properties` reference
```properties
# Source: Standard Gradle Wrapper pattern; Gradle 8.10.2 is compatible with Java 21
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ForgeGradle (legacy Forge) | ModDevGradle 2.x (`net.neoforged.moddev`) | NeoForge fork ~2023, MDG 2.x stable 2024 | Simpler build scripts; NeoForge-specific setup replaces ForgeGradle |
| NeoGradle 7.x (`net.neoforged.gradle.userdev`) | ModDevGradle 2.x | 2024 | ModDevGradle is lighter and recommended for new projects; NeoGradle still works but is more verbose |
| `kotlinforforge:4.x` (Forge only) | `kotlinforforge-neoforge:5.x` | 2024 (5.x branch) | 5.x added separate NeoForge artifact with `kotlinforforge-neoforge` group ID |
| `modLoader = "javafml"` | `modLoader = "kotlinforforge"` (for Kotlin mods) | Any KFF version | FML will not recognize Kotlin class/object as a mod entry point without this |

**Deprecated/outdated:**
- `net.minecraftforge.gradle` (ForgeGradle): Legacy Forge only, incompatible with NeoForge
- `kotlinforforge:4.x`: Targets NeoForge pre-1.21 and older Forge; use 5.x for 1.21.1

---

## Open Questions

1. **Exact KotlinForForge 5.x version for NeoForge 21.1.222**
   - What we know: KFF 5.7.0 is confirmed to support 1.21.1 (CurseForge/Modrinth metadata); 5.11.0 is the latest in the 5.x branch (as of Jan 2026) and targets 1.21.5
   - What's unclear: Whether 5.11.0 still supports NeoForge 21.1.222 (1.21.1) or if it dropped support for older 1.21.x. The changelog entry for 5.11.0 only mentions "Updated to Kotlin 2.3.0"
   - Recommendation: Use `5.7.0` initially (safest known-good for 1.21.1). If 5.11.0 build succeeds, upgrade. Check CurseForge "Supported Minecraft versions" on the 5.11.0 file page to confirm.

2. **Gradle Wrapper generation approach on Windows without Gradle installed**
   - What we know: `gradle wrapper` command requires Gradle pre-installed. The dev machine has no Gradle or Java installed.
   - What's unclear: Whether the plan should include downloading the Gradle wrapper files directly from the official MDK zip, or require installing Gradle first.
   - Recommendation: Download and copy the wrapper files from the official MDK zip (`https://github.com/neoforgemdks/MDK-1.21.1-ModDevGradle/archive/refs/heads/main.zip`). This avoids needing Gradle pre-installed.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Java 21 JDK | BUILD-05: `./gradlew build` | No | — | Must be installed (Temurin/Adoptium JDK 21 for Windows) |
| Gradle | Gradle Wrapper bootstrap | No (system-level) | — | Gradle Wrapper self-installs from `gradle-wrapper.properties` once Java is available |
| Git Bash / WSL | Running `./gradlew` on Windows | Assumed present | — | Use `gradlew.bat` instead on pure Windows cmd |
| Internet access | Downloading NeoForge toolchain, Kotlin for Forge | Assumed present | — | Cannot build without; all dependencies are downloaded by Gradle |

**Missing dependencies with no fallback:**
- **Java 21 JDK** — BUILD-05 cannot execute until Java 21 is installed. The plan MUST include a "Install Java 21" step as the first wave.

**Missing dependencies with fallback:**
- **Gradle binary** — Gradle Wrapper (`gradlew`) downloads and caches Gradle automatically once Java 21 is available. No manual Gradle installation is needed.

---

## Validation Architecture

### Test Framework

NeoForge Gradle mods do not use a conventional unit test framework like JUnit for the `./gradlew build` success check. BUILD-05 is validated by the Gradle build itself succeeding without errors. There are no source files to unit test in Phase 1 — this phase is pure build configuration.

| Property | Value |
|----------|-------|
| Framework | None (build validation only) |
| Config file | `build.gradle.kts` |
| Quick run command | `./gradlew compileKotlin` |
| Full suite command | `./gradlew build` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BUILD-01 | `build.gradle.kts` exists and is valid Kotlin DSL | smoke | `./gradlew tasks` (parses build script) | No — Wave 0 creates it |
| BUILD-02 | `settings.gradle.kts` exists with correct project name | smoke | `./gradlew properties \| grep "^name:"` | No — Wave 0 creates it |
| BUILD-03 | `gradle.properties` present and values referenced correctly | smoke | `./gradlew properties \| grep "version"` | No — Wave 0 creates it |
| BUILD-04 | Kotlin compiles (kotlin-jvm plugin active, KFF on classpath) | smoke | `./gradlew compileKotlin` | No — Wave 0 creates source files |
| BUILD-05 | `./gradlew build` exits 0 | smoke | `./gradlew build` | No — all files created in Wave 0 |

### Sampling Rate
- **Per task commit:** `./gradlew tasks` (validates build script parses)
- **Per wave merge:** `./gradlew build`
- **Phase gate:** `./gradlew build` exits 0, no compilation errors, no missing classpath errors

### Wave 0 Gaps
- [ ] `bundled_kubejs_dev/build.gradle.kts` — required before any Gradle command
- [ ] `bundled_kubejs_dev/settings.gradle.kts` — required for project name resolution
- [ ] `bundled_kubejs_dev/gradle.properties` — version pins required by build script
- [ ] `bundled_kubejs_dev/gradlew` + `gradlew.bat` — required to run `./gradlew build`
- [ ] `bundled_kubejs_dev/gradle/wrapper/gradle-wrapper.jar` + `gradle-wrapper.properties`
- [ ] Java 21 JDK installation — prerequisite for any `./gradlew` invocation

---

## Sources

### Primary (HIGH confidence)
- [NeoForgeMDKs/MDK-1.21.1-ModDevGradle](https://github.com/neoforgemdks/MDK-1.21.1-ModDevGradle) — official MDK `gradle.properties` (neo_version=21.1.222, minecraft 1.21.1, Java 21 requirement)
- [plugins.gradle.org/plugin/net.neoforged.moddev](https://plugins.gradle.org/plugin/net.neoforged.moddev) — ModDevGradle 2.0.141 confirmed latest (2026-04-04)
- [thedarkcolour/KotlinForForge 5.x README](https://github.com/thedarkcolour/KotlinForForge/blob/5.x/README.md) — Maven coordinates, repository URL, `mods.toml` settings
- [Brownield/neoforge-kotlin build.gradle.kts](https://github.com/Brownield/neoforge-kotlin/blob/main/build.gradle.kts) — complete real-world Kotlin DSL example verified

### Secondary (MEDIUM confidence)
- [NeoForge docs — Mod Files 1.21.1](https://docs.neoforged.net/docs/1.21.1/gettingstarted/modfiles/) — `neoforge.mods.toml` structure and required fields
- [neoforged/ModDevGradle README](https://github.com/neoforged/ModDevGradle/blob/main/README.md) — `neoForge {}` configuration block structure
- CurseForge/Modrinth version metadata — KFF 5.7.0 confirmed for 1.21.1 (via WebSearch cross-verification)

### Tertiary (LOW confidence)
- Kotlin version `2.0.21` for Kotlin JVM plugin — sourced from README reference to `2.2.20` as current, but 5.7.0 was built against earlier 2.0.x. Version `2.0.21` is inferred as safe for 5.7.0. Validate against KFF 5.7.0 build manifest if issues arise.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all components sourced from official MDK, plugin portal, and official KFF repository
- Architecture: HIGH — project structure follows standard NeoForge mod layout with confirmed separation from Nx monorepo
- Pitfalls: MEDIUM-HIGH — Java 21 absence confirmed by environment check; other pitfalls are known patterns from community issues
- KFF version pinning: MEDIUM — 5.7.0 confirmed compatible with 1.21.1; exact latest 5.x for 1.21.1 not verified against maven-metadata.xml

**Research date:** 2026-04-04
**Valid until:** 2026-07-04 (NeoForge versions move fast; verify neo_version and kffVersion before executing)
