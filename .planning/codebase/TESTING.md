# Testing Patterns

**Analysis Date:** 2026-04-04

## Test Framework

**Runner:**
- NestJS Testing Module (for cf-server app)
- Version: @nestjs/testing 10.0.0
- Config: No separate test configuration file detected
- Tests are minimal: only one test file found (`apps/cf-server/test/app.e2e-spec.ts`)

**Assertion Library:**
- Supertest for HTTP assertions (via NestJS testing utilities)
- Direct `.expect()` assertions for response validation
- Native Node.js assertion capability available but not used

**Run Commands:**
```bash
# Tests are not configured in root package.json
# NestJS cf-server has test setup in package.json but no test script
# E2E tests use supertest and NestJS TestingModule
```

**Note:** Test infrastructure is minimal. Most libraries (`@kubejs/core`, `@kubejs/plugin`, `@kubejs/generator`) have no test files or test configuration. Only the cf-server app contains test files.

## Test File Organization

**Location:**
- E2E tests co-located with source in `test/` directory at app root
  - Example: `apps/cf-server/test/app.e2e-spec.ts`
- No unit tests or integration tests found in other packages

**Naming:**
- File naming: `[feature].e2e-spec.ts` for E2E tests
  - Example: `app.e2e-spec.ts` for application-level E2E tests

**Structure:**
```
apps/cf-server/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   └── ...
├── test/
│   └── app.e2e-spec.ts
└── package.json
```

## Test Structure

**Suite Organization:**
```typescript
// From apps/cf-server/test/app.e2e-spec.ts
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
```

**Patterns:**
- `describe()` blocks for test suites
- `beforeEach()` hook for test setup (module initialization, app creation)
- `it()` blocks for individual test cases
- Async setup using NestJS `Test.createTestingModule()`
- Return promises from async tests (no explicit done callback)

## Mocking

**Framework:** NestJS Testing Module provides mocking capabilities

**Patterns:**
- Module-based mocking: Tests import real modules and create test instances
- No dedicated mocking library observed (no jest, vitest, sinon detected)
- Test module configured with dependencies via `imports: [AppModule]`

**What to Mock:**
- Database connections and external APIs (recommended but not implemented yet)
- HTTP requests to external services (would use supertest for isolation)

**What NOT to Mock:**
- Core application logic should be tested with real implementations
- Database operations (if used) should use test databases
- Route handlers should be tested with actual middleware

## Fixtures and Factories

**Test Data:**
- No dedicated fixture files or factories found in test directory
- Hard-coded expected values in test assertions
  - Example: `.expect(200).expect('Hello World!')`

**Location:**
- Test data exists inline within test files
- No shared fixtures directory detected

**Recommendation:**
- Fixtures should be created in `apps/cf-server/test/fixtures/` if needed
- Use factory pattern for test data generation: `createTestApp()`, `createTestUser()`, etc.

## Coverage

**Requirements:** No coverage requirements enforced

**View Coverage:**
```bash
# No coverage command configured
# vitest is available in root devDependencies but not used for this project
# To add coverage: `vitest run --coverage`
```

**Current State:**
- NestJS cf-server has minimal test coverage (1 test)
- Core libraries have no test coverage
- No coverage thresholds set
- No coverage reporting configured

## Test Types

**Unit Tests:**
- Not used in this codebase
- Would test individual functions/classes in isolation
- Recommended location: `libs/[package]/src/__tests__/` or `libs/[package]/src/[module].test.ts`

**Integration Tests:**
- Not used in this codebase
- Would test interactions between modules/services
- Could be co-located in `test/` directories

**E2E Tests:**
- Framework: NestJS Testing Module + Supertest
- Current implementation: `apps/cf-server/test/app.e2e-spec.ts`
- Approach: Bootstrap real NestApplication, test HTTP endpoints
- Pattern: Use `request(app.getHttpServer())` for HTTP assertions

## Common Patterns

**Async Testing:**
```typescript
// Pattern from apps/cf-server/test/app.e2e-spec.ts
it('/ (GET)', () => {
  return request(app.getHttpServer())
    .get('/')
    .expect(200)
    .expect('Hello World!');
});
```
- Async operations return promises
- Test runners automatically wait for promise resolution
- No explicit `async/await` in test body when returning promises directly

**Module Setup:**
```typescript
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});
```
- NestJS Testing Module used for dependency injection
- Real modules imported for integration testing
- Application initialized before each test
- No teardown/afterEach currently implemented (could be added for cleanup)

**Error Testing:**
- Not currently implemented
- Would follow pattern: `.expect(statusCode).expect((res) => { /* assertions */ })`
- Example not found in codebase; should be added for error handling validation

## Testing Infrastructure Missing

**Available but Unused:**
- Vitest 3.0.0 installed in root devDependencies
- @vitest/ui 3.0.0 available for visual test running
- Jest available via NestJS CLI

**Recommendations:**
- Add unit tests using Vitest for library packages
- Configure Vitest in `libs/core/vitest.config.ts`, `libs/plugin/vitest.config.ts`, etc.
- Add integration tests for complex operations (mod resolution, archiving, etc.)
- Add test coverage reports with `@vitest/coverage`
- Create test fixtures for mod data, Minecraft versions, etc.

## Adding Tests

**For Library Packages:**
1. Create `libs/[package]/__tests__/` directory
2. Create `[module].test.ts` files alongside or in test directory
3. Use Vitest as test runner (already available)
4. Example structure:
   ```
   libs/core/
   ├── src/
   │   ├── api/
   │   │   └── server-fetch.ts
   │   └── core/
   │       └── archiver.ts
   └── __tests__/
       ├── api.test.ts
       └── archiver.test.ts
   ```

**For Apps:**
1. Continue using NestJS Testing Module
2. Create test files in `apps/[app]/test/`
3. Organize by feature: `apps/cf-server/test/routes/`, `apps/cf-server/test/services/`
4. Example:
   ```
   apps/cf-server/
   ├── src/
   ├── test/
   │   ├── app.e2e-spec.ts
   │   ├── routes/
   │   └── services/
   └── package.json
   ```

---

*Testing analysis: 2026-04-04*
