---
paths:
  - "**/*.schema.ts"
---

# Zod

- A `*.schema.ts` file may keep a schema together with its directly inferred `z.infer` type and meaningful derived variants from that schema.
- Schema files must not contain unrelated functions, classes, enums, constants, or trivial duplicate aliases.
- This is an explicit exception to one-file-one-entity because the schema and its inferred type represent the same contract.
