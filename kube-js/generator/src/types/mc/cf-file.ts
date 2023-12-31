import { Dependency, Hash, Module, SortableGameVersion } from "./cf";

export interface CfFile {
  id: number;
  gameId: number;
  modId: number;
  isAvailable: boolean;
  displayName: string;
  fileName: string;
  releaseType: number;
  fileStatus: number;
  hashes: Hash[];
  fileDate: string;
  fileLength: number;
  downloadCount: number;
  downloadUrl: string;
  gameVersions: string[];
  sortableGameVersions: SortableGameVersion[];
  dependencies: Dependency[];
  alternateFileId: number;
  isServerPack: boolean;
  fileFingerprint: number;
  modules: Module[];
}
