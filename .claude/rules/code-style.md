# Code Style

## Core Principles

- Prefer clarity to compactness and maintainable code over clever code.
- Prefer explicit structure, ownership, and predictable behavior.
- Preserve existing behavior unless the task explicitly changes it.
- Keep changes scoped. Clean related duplication and obsolete code in the touched area, but avoid unrelated repository-wide rewrites.
- Do not preserve bad local patterns only because they already exist; move touched code toward the best proven local pattern.
- Before using a library, framework, runtime, generator, or tool, verify the installed version first, then check official docs/types/source for that version, then search the repository for existing usage.
- Never code against guessed library behavior or stale memory when the repository can be checked.
- Prefer non-deprecated APIs when the installed version marks an API deprecated.
- Optimize for reviewability, not for fewer files.

## Structure & Ownership

- One file should have one clear responsibility.
- Prefer one file = one entity. If a second meaningful entity is needed, move it into its own file unless a documented technology-specific exception applies.
- One function = one purpose. One class/service = one responsibility.
- Prefer standalone functions for pure logic. Do not create classes only to group helper functions.
- Extracted named helper functions follow the same one-file-one-entity rule. When logic is pulled out of a main function into its own named helper, move that helper into its own file and import it; do not define the extracted helper alongside the main function it supports.
- Organize source code as a tree by the strongest ownership axis: domain, feature, runtime, layer, responsibility, provider, adapter, integration, module, protocol, transport, or platform.
- Keep source roots minimal and intentional. New features should extend the tree instead of polluting the root.
- Shared code must be promoted deliberately behind an explicit stable boundary. Do not reach into another module/package/app's internals.
- Avoid circular dependencies and hidden cross-module coupling.
- Do not create dumping-ground files or folders.
- Use descriptive domain-specific names. Avoid vague names such as `helper`, `utils`, `manager`, `processor`, `common`, `misc`, or `doStuff` when a precise name is available.
- Refactor the touched scope when a file becomes multi-purpose, a function becomes too large, responsibilities become mixed, unsafe casts appear, duplicated mapping appears, or unstable cross-module imports grow.

## Functions, Control Flow & Side Effects

- Avoid god classes, god services, deeply nested condition trees, nested ternaries, giant inline ternaries, giant one-line objects, and giant one-line conditions.
- Avoid premature abstractions, generic engines, reflection-heavy meta-programming, and magic auto-registration unless repeated concrete need proves they are justified.
- Prefer guard clauses when they improve readability. Guard clauses must use braces.
- Object literals with more than three properties should be multiline.
- Do not hide expensive I/O, network calls, storage operations, native bridge calls, or other significant side effects behind getters or seemingly pure helpers.

## Errors, Logging & Comments

- Never swallow errors silently. Never use an empty `catch {}`.
- Handle errors at the boundary where meaningful recovery, translation, logging, or presentation can occur.
- Fail explicitly instead of silently falling back.
- Logs should be structured and meaningful. Do not use `console.log` in application code.
- Default to no comments. Prefer clearer naming or extraction over explanatory inline comments.
- Never use inline `//` comments for narration or explanation. If an explanation must live in code, use rare JSDoc above the declaration for a hidden constraint, verified external-system quirk, or non-obvious invariant.
