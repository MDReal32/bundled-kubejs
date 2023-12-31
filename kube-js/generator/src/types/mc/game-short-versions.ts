import { ModLoaderType } from "../mod-loader-type";

export interface GameShortVersions {
  name: string;
  gameVersion: string;
  latest: boolean;
  recommended: boolean;
  dateModified: string;
  type: ModLoaderType;
}
