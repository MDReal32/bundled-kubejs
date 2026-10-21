---
paths:
  - "**/database/**/*.ts"
  - "**/drizzle/**/*.ts"
  - "**/*.table.ts"
---

# Drizzle

- A Drizzle table file owns one persistence entity.
- The table and its directly inferred `$inferSelect` / `$inferInsert` types stay in the same file; treat them as one persistence entity.
- Do not create separate files only for directly inferred select/insert aliases.
- Separate enum definitions, relation definitions, or reusable column builders only when they have their own meaningful responsibility.
