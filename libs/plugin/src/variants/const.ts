import type { McLine, McVariant } from "./mc-variant";

export const defaultMcVariant: McVariant = {
  line: "default",
  probeDirectory: ".probe",
  buildTarget: "es2018"
};

export const mcVariants: Record<McLine, McVariant> = {
  "1.18": { ...defaultMcVariant, line: "1.18" },
  "1.19": { ...defaultMcVariant, line: "1.19" },
  "1.20": { ...defaultMcVariant, line: "1.20" },
  "1.21": { ...defaultMcVariant, line: "1.21" }
};
