---
phase: 1
slug: gradle-build-configuration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-04
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Gradle build system (no unit test framework — scaffold phase) |
| **Config file** | `build.gradle.kts` |
| **Quick run command** | `./gradlew tasks --all` |
| **Full suite command** | `./gradlew build` |
| **Estimated runtime** | ~60-180 seconds (first run downloads dependencies) |

---

## Sampling Rate

- **After every task commit:** Run `./gradlew tasks --all` (verifies Gradle can parse config)
- **After every plan wave:** Run `./gradlew build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | BUILD-01 | build | `test -f build.gradle.kts` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | BUILD-02 | build | `test -f settings.gradle.kts` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | BUILD-03 | build | `test -f gradle.properties` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 1 | BUILD-04 | build | `./gradlew tasks --all` | ❌ W0 | ⬜ pending |
| 1-01-05 | 01 | 2 | BUILD-05 | build | `./gradlew build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Gradle wrapper files (`gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.jar`, `gradle/wrapper/gradle-wrapper.properties`) — required before any `./gradlew` commands can run
- [ ] Java 21 installed on the host machine — required for NeoForge 1.21.x (blocking prerequisite)

*Wave 0 must complete before any build tasks are attempted.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Kotlin JVM plugin and KFF dependency resolve during Gradle sync | BUILD-04 | Requires IDE or `./gradlew dependencies` output inspection | Run `./gradlew dependencies --configuration compileClasspath` and confirm `kotlinforforge-neoforge` appears |
| No floating versions in gradle.properties | BUILD-03 | Static file inspection | Open `gradle.properties` and verify all version values are pinned (no `+`, `latest.release`, or SNAPSHOT suffixes) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 180s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
