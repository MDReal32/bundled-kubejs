---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript

## General

- Use strict TypeScript.
- Never use `any` unless compatibility with an external library genuinely requires it. Prefer `unknown` and narrow explicitly.
- Avoid unsafe casts such as `as unknown as`.
- Use `import type` for type-only imports.
- Use named exports and named imports. Do not use default exports.
- Prefer `async`/`await` and keep asynchronous work explicit.

## Object Types

- Use `interface` for object shapes and public object contracts.
- Do not write anonymous inline object type annotations such as `value: { id: string; name: string }`, including for parameters, variables, properties, callbacks, destructured arguments, or other implementation annotations.
- If an object shape needs an explicit annotation, use an existing named interface when appropriate or create a named `interface` for that shape.
- Use `type` for unions, intersections, mapped types, conditional types, primitive aliases, tuples/function aliases, and cases that interfaces cannot express cleanly.
- Do not duplicate types or create separate DTO/domain/view-model types unless an actual boundary requires them.
- Prefer deriving related types from existing source types instead of repeating object shapes. Use TypeScript utility and indexed-access types such as `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, `Record`, `Extract`, `Exclude`, `NonNullable`, and `T[K]` when they express the relationship clearly.
- Do not use utility types mechanically when they make the contract harder to understand; create a dedicated named type when it represents a genuinely distinct boundary or domain concept.
- When a union contains multiple object variants, prefer named object shapes and combine them into a union rather than writing a large unreadable inline union.
- Use generics only when they reduce duplication and improve clarity. Do not create type puzzles.

## Functions & Return Types

- Default to `const` arrow functions for standalone functions.
- Avoid `function` declarations unless technically required or significantly clearer. Class methods stay normal methods; object methods may use method syntax; callbacks remain arrow functions.
- Do not add explicit return type annotations to TypeScript function or method implementations. Always rely on TypeScript return-type inference when the language can infer the type.
- This rule applies to standalone functions, arrow functions, class methods, async functions, React components, hooks, callbacks, service methods, controller methods, utilities, and factory functions.
- Do not preserve an explicit return type merely because it already exists in touched implementation code; remove it when TypeScript can infer the return type correctly.
- Explicit return types are allowed only when structurally required by TypeScript or by a declaration-only contract, such as overload signatures, abstract method declarations, interface/type function signatures, declaration files, or cases where inference is technically impossible or incorrect. Readability alone is not an exception.

## Modules, Files & Public Boundaries

- Do not deep-import internal implementation details from another feature or package; use its public boundary.
- Do not create barrel files that blindly re-export everything. Public exports must be deliberate.
- TypeScript module and folder names use lowercase kebab-case unless a framework-specific rule overrides it.
- A filename should reflect the entity it contains. Avoid suffix noise such as `.type.ts` or `.function.ts` when the base name already communicates the entity clearly.
- Non-trivial constant data such as lookup tables, tier or threshold definitions, configuration objects, magic-number arrays, and similar reusable domain values must not live inline beside the function or class that consumes them. Move them to the closest `const.ts` owned by that directory/domain and import them.
- Trivial scalar constants that are genuinely local implementation details may remain local; do not create a `const.ts` merely to move a single obvious value out of a file.
- A directory/domain `const.ts` must stay ownership-focused. Do not turn it into a generic cross-domain constants dumping ground.
- `src/main.ts` is an allowed entrypoint exception to one-entity-per-file and should stay limited to bootstrap, initialization, configuration loading, dependency wiring, and startup.
- Libraries expose their public surface through an explicit boundary such as `src/index.ts`; internal files still follow the normal ownership structure.
