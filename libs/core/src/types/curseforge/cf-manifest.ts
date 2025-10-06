export interface CfManifest {
  minecraft: Pick<Minecraft, "version" | "modLoaders">;
  manifestType: string;
  manifestVersion: number;
  name: string;
  author: string;
  files: File[];
  overrides: string;
}

export interface File {
  projectID: number;
  fileID: number;
  required: boolean;
}

export interface Minecraft {
  version: string;
  additionalJavaArgs?: any;
  modLoaders: ModLoader[];
  libraries?: any;
}

export interface ModLoader {
  id: string;
  primary: boolean;
}
