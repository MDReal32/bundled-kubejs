---
paths:
  - "nx.json"
  - "**/project.json"
  - "**/package.json"
---

# Nx

- Prefer running build, lint, test, e2e, and similar workspace tasks through Nx rather than directly through the underlying tooling.
- Prefix Nx commands with the workspace package manager instead of relying on a globally installed CLI.
- For workspace navigation, project relationships, targets, and dependencies, use Nx-aware workspace tooling when available.
- Do not create a `project.json` merely to duplicate or re-declare scripts that already exist in `package.json`. Package scripts are already usable as Nx targets; run and configure the inferred target instead of copying its command into `project.json`.
- Create `project.json` only when that project genuinely needs project-specific Nx configuration or metadata that must be added beyond the inferred target, such as project-specific `outputs`, `inputs`, `dependsOn`, cache behavior, configurations, executor/options, tags, implicit dependencies, or equivalent Nx-specific settings.
- Do not add project-level configuration for behavior that is generic across the workspace. Put generic rules such as common `cache`, `inputs`, `outputs`, or `dependsOn` behavior in `nx.json` `targetDefaults`; use `project.json` only for genuine project-specific additions or overrides.
- Never use the `nx` property inside `package.json` for project configuration. When project-specific Nx configuration is required, prefer `project.json`.
- When adding Nx metadata for an existing package-script target, do not duplicate the underlying command unless Nx technically requires a replacement target definition. Preserve the package script as the executable source whenever possible.
- Every `build` target must participate in an explicit Nx task pipeline, preferably through `nx.json` `targetDefaults` when the rule applies workspace-wide.
- `build` must always depend on `^build` so buildable project dependencies are built first.
- `build` must also depend on every applicable finite same-project prerequisite or verification target that the project actually provides. This includes `typecheck`, `lint`, `test`, `format` or `format:check`, `check`, `validate`, `prebuild`, `codegen` or `generate`, schema/code generation or sync targets, and equivalent project-specific build-readiness tasks.
- Do not invent empty targets only to satisfy the build pipeline rule. Add a dependency when that target genuinely exists for the project or is intentionally introduced as a real validation/prerequisite step.
- Do not make `build` depend on long-running targets such as `serve`, `dev`, or `watch`. Build dependencies must terminate.
- When a project adds project-specific `build.dependsOn` entries, preserve inherited or inferred dependencies with the Nx spread token `"..."` instead of replacing them. A local override must never accidentally drop `^build` or other workspace-wide build gates.
- Prefer defining common build dependencies once in `nx.json` `targetDefaults`; use project-level configuration only for project-specific additions or exceptions.
- Verify unfamiliar Nx CLI flags before using them; do not guess flags.
- For scaffolding, use the appropriate Nx generator workflow rather than manually inventing project structure when a generator is intended.
- Use Nx documentation for advanced configuration, unfamiliar flags, migrations, plugin configuration, and edge cases rather than for routine syntax already known from the workspace.
