export interface CfManifest {
  minecraft: Minecraft;
  manifestType: string;
  manifestVersion: number;
  name: string;
  author: string;
  files: File[];
  overrides: string;
}

interface File {
  projectID: number;
  fileID: number;
  required: boolean;
}

interface Minecraft {
  version: string;
  modLoaders: ModLoader[];
}

interface ModLoader {
  id: string;
  primary: boolean;
}
