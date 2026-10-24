export type McLine = "1.18" | "1.19" | "1.20" | "1.21";

export type McBuildTarget = "es2018";

export interface McVariant {
  line: McLine | "default";
  probeDirectory: string;
  buildTarget: McBuildTarget;
}
