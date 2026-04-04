# Codebase Concerns

**Analysis Date:** 2026-04-04

## Tech Debt

**Hardcoded Delays in Build Pipeline:**
- Issue: `programmaticallyPause()` uses a hardcoded 1000ms delay as a workaround for file system timing issues
- Files: `libs/plugin/src/utils/programmatically-pause.ts`
- Impact: Slows down build and watch mode unnecessarily. The actual root cause is not addressed.
- Fix approach: Investigate why the pause is needed (likely file system watchers or Vite builder initialization). Implement proper event-based synchronization instead of arbitrary delays.

**Duplicate Server Fetch Cache:**
- Issue: Cache implementation exists in two places with identical logic
- Files: `libs/core/src/api/server-fetch.ts` (client-side), `apps/cf-server/src/api.ts` (server-side)
- Impact: Code duplication makes maintenance harder. Both use unbounded in-memory caches that never expire.
- Fix approach: Extract shared cache logic to a utility. Consider implementing cache invalidation strategy with TTL for large API response datasets.

**Incomplete Package Command:**
- Issue: The `package` command in CLI is fully commented out but referenced in documentation
- Files: `libs/plugin/src/cli.ts` (lines 30-47), `libs/plugin/src/core/program.ts` (lines 34-111)
- Impact: Feature promised in README cannot be used. Dead code increases maintenance burden.
- Fix approach: Either complete the implementation or remove all references from codebase and documentation.

**Deprecated Module Pattern in cf-server:**
- Issue: `AppModule` implements `NestMiddleware` but is not registered as middleware
- Files: `apps/cf-server/src/app.module.ts`
- Impact: Confusing implementation. Middleware is never actually used. App has no routing or endpoints despite README documenting API endpoints.
- Fix approach: Remove NestMiddleware implementation. Create proper controller structure or clarify the cf-server's actual role.

**Overly Broad Type Definitions:**
- Issue: Heavy use of `any` types throughout CurseForge type definitions
- Files: `libs/core/src/types/curseforge/cf-minecraft-instance.ts` (20+ uses of `any`), `libs/core/src/types/curseforge/cf-mod.ts`
- Impact: Type safety completely lost for large portions of the API response handling. Bugs in these areas will not be caught at compile time.
- Fix approach: Map actual CurseForge API response schemas and create proper TypeScript types. Start with most commonly used fields in `cf-minecraft-instance.ts`.

**Global Cache Without Bounds:**
- Issue: Maps in `serverFetch` and `cfFetch` grow unbounded indefinitely
- Files: `libs/core/src/api/server-fetch.ts` (line 5), `apps/cf-server/src/api.ts` (line 7)
- Impact: Memory leak in long-running processes. Stale cache may serve outdated mod information in generator/packager.
- Fix approach: Implement cache size limits (LRU) or TTL-based expiration. Consider using a proper caching library.

**Manual Type Casting in ModResolver:**
- Issue: Unsafe type coercion using `as unknown as` pattern
- Files: `libs/core/src/utils/minecraft/get-latest-modloader-for-version.ts` (line 4)
- Impact: Bypasses type system entirely. If CurseForge API changes enum representation, code breaks silently.
- Fix approach: Create proper enum parsing function with validation and error handling.

**Synchronous File I/O in Archiver:**
- Issue: `readFileSync()` blocks entire process when archiving directories
- Files: `libs/core/src/core/archiver.ts` (line 26)
- Impact: Large file archives can freeze the application. No progress indication for users.
- Fix approach: Convert to async file reading. Implement streaming for large directories. Add progress callback.

## Known Bugs

**Entry Point Graph Refresh in Watch Mode:**
- Symptoms: Files are cleaned and rebuilt, but builder is recreated with potential race conditions
- Files: `libs/plugin/src/core/vite.ts` (lines 87-108)
- Trigger: Adding or removing entry point files (src/client, src/server, src/startup directories) during watch mode
- Workaround: Restart watch mode to pick up new entry points
- Root cause: Overlapping async operations between `rm()` and `createBuilderFor()` without proper synchronization beyond the debounce

**Missing Environment Variable in cf-server:**
- Symptoms: No routing configured. README lists 7 API endpoints but none are implemented
- Files: `apps/cf-server/src/main.ts`, `apps/cf-server/src/app.module.ts`
- Trigger: Accessing any endpoint documented in README
- Workaround: None. Server appears to be a skeleton/WIP
- Root cause: Implementation never completed after initial scaffolding

## Security Considerations

**Hardcoded API Endpoint in Multiple Locations:**
- Risk: CurseForge API URL is hardcoded using `new URL(join("v1", url), "https://api.curseforge.com/")`
- Files: `libs/core/src/api/server-fetch.ts` (line 10), `apps/cf-server/src/api.ts` (line 12)
- Current mitigation: HTTPS enforced by hardcoded protocol
- Recommendations: Consider making API endpoint configurable via environment variable. Add URL validation to prevent redirects.

**API Key Exposure Risk in Generated Files:**
- Risk: cf-server proxies requests to protect API key, but no authentication is implemented on the proxy itself
- Files: `apps/cf-server/src/main.ts`, `apps/cf-server/src/env.ts`, `apps/cf-server/src/api.ts`
- Current mitigation: Key only stored in server environment, not in generated artifacts
- Recommendations: Implement authentication layer (API key, OAuth, JWT) on cf-server. Add rate limiting. Add request logging/auditing.

**Insecure File Operations:**
- Risk: No path validation when creating archives or writing files
- Files: `libs/core/src/core/archiver.ts` (lines 24-47), `libs/core/src/utils/prepare-archiver.ts`
- Current mitigation: None
- Recommendations: Validate file paths to prevent directory traversal attacks. Sanitize file names. Add whitelist for allowed directories.

**No Input Validation in Generator:**
- Risk: Project names and versions are passed directly to file system operations without validation
- Files: `libs/generator/src/core/generate.ts`, `libs/generator/src/utils/questionary.ts` (line 35 only validates semver format)
- Current mitigation: Only semver validation on version field
- Recommendations: Validate project name against file system constraints. Implement whitelist for allowed characters.

## Performance Bottlenecks

**Sequential Mod Resolution:**
- Problem: Queue-based mod resolution processes files one-at-a-time despite having 10 concurrent workers
- Files: `libs/core/src/utils/queue.ts` (line 17), `libs/core/src/utils/curseforge/resolve-mods.ts` (line 19)
- Cause: `queue()` function creates 10 promises that all call `next()` sequentially, effectively processing items serially
- Improvement path: Use proper worker pool library (piscina, node-worker-threads) or implement actual concurrent processing with Promise.all on batches

**Unbounded Recursion in Archive Directory Traversal:**
- Problem: `directory()` method in Archiver recursively processes entire directory trees without limiting depth
- Files: `libs/core/src/core/archiver.ts` (lines 32-48)
- Cause: No depth limit, no concurrent processing, synchronous file reads
- Improvement path: Add depth limit configuration. Implement streaming/chunk-based processing for large directory trees.

**Hardcoded Environment Option Compilation:**
- Problem: Every Vite environment gets compiled separately with full redundant SWC transformations
- Files: `libs/plugin/src/core/vite.ts` (lines 197-264)
- Cause: Each environment builds independently despite shared code dependencies
- Improvement path: Implement shared chunk extraction. Pre-compile common dependencies. Consider using Vite's dynamic imports for code splitting.

**Expensive Regex in File Processing:**
- Problem: `/[^\w_$]/g` regex is called repeatedly for environment name sanitization
- Files: `libs/plugin/src/core/vite.ts` (lines 213, 250)
- Cause: Same transformation done multiple times for same env name
- Improvement path: Cache sanitized environment names in a Map

## Fragile Areas

**Vite Configuration Compilation:**
- Files: `libs/plugin/src/core/vite.ts` (lines 162-195)
- Why fragile: Manually compiling TypeScript config to JS with date-based filenames. Uses `import()` with dynamic filenames. Complex temp file cleanup.
- Safe modification: Extract config resolution to separate utility with better error handling. Use `require()` or proper ESM loader instead of manual Vite build.
- Test coverage: Gaps - no tests for config resolution. Config with syntax errors will fail at runtime with unclear error messages.

**File System Watcher Event Handling:**
- Files: `libs/plugin/src/core/vite.ts` (lines 80-110)
- Why fragile: Multiple overlapping file system events can trigger concurrent builder refreshes. Debounce covers this but relies on timing. No guard against concurrent modifications.
- Safe modification: Implement state machine or queue for builder refresh operations. Use proper event locking.
- Test coverage: Gaps - no tests for concurrent file modifications or rapid add/remove cycles.

**CurseForge API Response Parsing:**
- Files: `libs/core/src/utils/curseforge/resolve-mods.ts` (lines 28-30)
- Why fragile: Assumes `releaseType === 1` means latest version. No fallback if no release found. Type casting on line 30 with `!` operator.
- Safe modification: Add explicit type guards. Handle missing latest version gracefully with logging.
- Test coverage: Gaps - no tests for different mod structures or missing release types.

## Scaling Limits

**In-Memory Cache for API Responses:**
- Current capacity: Unbounded growth
- Limit: Hits memory limits when generator processes 100+ mod packs in sequence
- Scaling path: Implement disk-based cache (SQLite) or implement TTL/LRU eviction. Consider Redis for distributed cf-server scenarios.

**Concurrent File Operations During Packaging:**
- Current capacity: Single-threaded archiving
- Limit: Large modpacks (500+ mods) take excessive time to archive due to synchronous file reads
- Scaling path: Implement streaming archive creation. Use worker threads for concurrent file compression.

**Watch Mode Builder Refresh Time:**
- Current capacity: Rebuilds entire entry graph on any structural change
- Limit: Projects with 50+ entry points become slow to refresh
- Scaling path: Implement incremental entry point detection. Only rebuild affected environments.

## Dependencies at Risk

**Electron in @kubejs/core:**
- Risk: Electron is listed as production dependency but never imported or used
- Files: `libs/core/package.json` (line 29)
- Impact: Adds 150MB+ to bundle size. Unused dependency increases attack surface.
- Migration plan: Remove from dependencies. If save-dialog functionality needs Electron, make it optional or create platform-specific export.

**Outdated @swc/core Version:**
- Risk: Using version 1.13.5 from Oct 2024. Updates available.
- Files: `libs/plugin/package.json` (line 48)
- Impact: Missing bug fixes and performance improvements. Compatibility issues with newer Node versions.
- Migration plan: Update to latest compatible version. Test build output for regressions.

**Package Manager Mismatch:**
- Risk: Root uses `yarn@4.10.3` but generator uses `yarn@4.0.2`
- Files: `package.json` (line 38), `libs/generator/package.json` (line 49)
- Impact: Lock file inconsistencies. Dependency version conflicts possible.
- Migration plan: Standardize all packages to use same Yarn version. Use workspaces correctly.

## Test Coverage Gaps

**No Test Suite at All:**
- What's not tested: All application logic including build, packaging, generation
- Files: No test files found in codebase. See `/libs`, `/apps` - only `.e2e-spec.ts` in cf-server but unconnected
- Risk: Breaking changes introduced silently. Regression testing requires manual verification.
- Priority: High - essential before 1.0 release

**Critical Path Untested:**
- What's not tested: Vite plugin compilation, file system watching, entry point detection
- Files: `libs/plugin/src/core/vite.ts`, `libs/plugin/src/plugins/swc.plugin.ts`
- Risk: Watch mode failures only discovered by users
- Priority: High

**Archive/Generation Untested:**
- What's not tested: ZIP creation, manifest generation, mod list HTML
- Files: `libs/core/src/core/archiver.ts`, `libs/core/src/utils/curseforge/generate-manifest.ts`
- Risk: Corrupted output archives only found after generation completes
- Priority: High

**API Integration Untested:**
- What's not tested: CurseForge API responses, caching behavior, error handling
- Files: `libs/core/src/api/server-fetch.ts`, `apps/cf-server/src/api.ts`
- Risk: API changes break application silently
- Priority: Medium

---

*Concerns audit: 2026-04-04*
