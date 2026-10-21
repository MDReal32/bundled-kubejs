---
paths:
  - "apps/cf-server/**"
---

# NestJS

## Module Boundaries

- One module represents one domain or one coherent domain slice.
- Preferred dependency direction is `controller -> service`.
- A service may depend on its own module's repositories, handlers, approved provider abstractions, and explicitly exported services from other modules.
- Do not call another module's repository, DTO, handler, module-local utility, or module-local type directly.
- If something becomes genuinely shared across modules, promote it deliberately to a stable shared boundary rather than deep-importing it.
- Keep provider-specific implementation details out of controllers and application orchestration when a dedicated provider/adapter boundary exists.

## Responsibilities

- Controllers stay thin.
- Services own application orchestration and use-case coordination.
- Repositories own persistence.
- `<module>.module.ts` owns Nest wiring only: imports, providers, controllers, and exports. It must not contain business logic, mapping logic, helpers, or domain orchestration.
- `<module>.controller.ts` owns route decorators, guards/decorators/pipes, request extraction, service calls, and returning service results. It must not contain business logic, persistence, provider logic, or large mapping logic.
- `<module>.service.ts` owns application orchestration and use-case coordination. It must not contain HTTP parsing concerns, raw persistence logic when a repository exists, vendor-specific provider implementation details, or hidden cross-module repository access.
- `<module>.repository.ts` owns DB reads/writes, persistence filtering, query construction, and transaction interaction. It must not contain business orchestration, controller concerns, DTO validation, or provider calls.
- Use handlers when a use-case becomes meaningful enough to split from a service, may be triggered from multiple entrypoints, or deserves isolated tests. Do not create handlers for trivial pass-through logic.

## Structure

- Default module structure may include `<module>.module.ts`, `<module>.controller.ts`, `<module>.service.ts`, `<module>.repository.ts`, and only-needed folders such as `database/`, `dto/`, `handlers/`, `types/`, and `utils/`.
- Do not create empty structural ceremony.
- Avoid vague module folders such as `common`, `shared`, `helpers`, `models`, `interfaces`, `entities`, `contracts`, `misc`, or `lib` as dumping grounds.
- Module-local `types/` contains types owned only by that module. Module-local `utils/` contains utilities owned only by that module.

## Validation & Contracts

- All external input must be validated at the edge.
- Prefer Zod with `nestjs-zod` and `createZodDto` for DTO validation.
- DTO classes extend `createZodDto(schema)`.
- Do not define schemas inline inside DTO files; keep schemas in dedicated schema files and expose shared schemas through an explicit shared contract boundary when needed across apps/packages.
- Do not accept boundary payloads as anonymous inline object types when a named DTO or named type should define the contract.
- Event names should be stable, dot-separated, and centralized rather than invented ad hoc across files.
