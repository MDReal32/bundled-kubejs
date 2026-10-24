import type { LibraryOptions } from "vite";

export const libraryOptions = {
  name: "KubeJS/Plugin",
  entry: { "kubejs.plugin": "src/main.ts", "kubejs.plugin.cli": "src/cli.ts" },
  formats: ["es"]
} satisfies LibraryOptions;

export const externalDependencies = ["@kubejs/core"];
