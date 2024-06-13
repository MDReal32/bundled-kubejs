import { ModLoaderType } from "@kubejs/core";

export interface GameShortVersions {
  name: string;
  gameVersion: string;
  latest: boolean;
  recommended: boolean;
  dateModified: string;
  type: ModLoaderType;
}
