import type { CfFile } from "../../types";
import { isFileDedicatedToVersion } from "./is-file-dedicated-to-version";

/**
 * CurseForge lists files newest first. Files built for exactly the requested version win over files
 * shared with other patch releases of the same minor line, then the first file of the most stable
 * release type is the latest one. Release type 1 is a release, 2 a beta and 3 an alpha.
 */
export const selectLatestFile = (files: CfFile[], mcVersion: string) => {
  const dedicatedFiles = files.filter(file => isFileDedicatedToVersion(file, mcVersion));
  const candidates = dedicatedFiles.length > 0 ? dedicatedFiles : files;
  const mostStableReleaseType = Math.min(...candidates.map(file => file.releaseType));
  return candidates.find(file => file.releaseType === mostStableReleaseType);
};
