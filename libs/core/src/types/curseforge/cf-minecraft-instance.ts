import type { File, Minecraft } from ".";

export interface CfMinecraftInstance {
  baseModLoader: BaseModLoader;
  isUnlocked: boolean;
  javaArgsOverride?: any;
  lastPlayed: string;
  playedCount: number;
  manifest: Manifest;
  fileDate: string;
  installedModpack?: any;
  projectID: number;
  fileID: number;
  customAuthor?: any;
  modpackOverrides: string[];
  isMemoryOverride: boolean;
  allocatedMemory: number;
  profileImagePath?: any;
  isVanilla: boolean;
  guid: string;
  gameTypeID: number;
  installPath: string;
  name: string;
  cachedScans: any[];
  isValid: boolean;
  lastPreviousMatchUpdate: string;
  lastRefreshAttempt: string;
  isEnabled: boolean;
  gameVersion: string;
  gameVersionFlavor?: any;
  gameVersionTypeId?: any;
  preferenceAlternateFile: boolean;
  preferenceAutoInstallUpdates: boolean;
  preferenceQuickDeleteLibraries: boolean;
  preferenceDeleteSavedVariables: boolean;
  preferenceReleaseType: number;
  preferenceModdingFolderPath?: any;
  syncProfile: SyncProfile;
  installDate: string;
  installedAddons: InstalledAddon[];
  installedGamePrerequisites: any[];
  wasNameManuallyChanged: boolean;
  wasGameVersionTypeIdManuallyChanged: boolean;
}

interface InstalledAddon {
  instanceID: string;
  modSource: number;
  addonID: number;
  gameID: number;
  categoryClassID: number;
  gameInstanceID: string;
  name: string;
  modFolderPath?: any;
  fileNameOnDisk: string;
  authors: Author[];
  primaryAuthor: string;
  primaryCategoryId: number;
  packageType: number;
  webSiteURL: string;
  thumbnailUrl: string;
  tags: any[];
  installedFile: InstalledFile;
  dateInstalled: string;
  dateUpdated: string;
  status: number;
  installSource: number;
  preferenceReleaseType?: any;
  preferenceAutoInstallUpdates?: any;
  preferenceAlternateFile: boolean;
  preferenceIsIgnored: boolean;
  isModified: boolean;
  isWorkingCopy: boolean;
  isFuzzyMatch: boolean;
  manifestName?: any;
  installedTargets: any[];
  latestFile: InstalledFile;
}

interface InstalledFile {
  id: number;
  fileName: string;
  fileDate: string;
  fileLength: number;
  releaseType: number;
  fileStatus: number;
  downloadUrl: string;
  isAlternate: boolean;
  alternateFileId: number;
  dependencies: Dependency[];
  isAvailable: boolean;
  modules: Module[];
  packageFingerprint: number;
  gameVersion: string[];
  sortableGameVersion: SortableGameVersion[];
  hasInstallScript: boolean;
  isCompatibleWithClient: boolean;
  isEarlyAccessContent: boolean;
  restrictProjectFileAccess: number;
  projectStatus: number;
  projectId: number;
  fileNameOnDisk: string;
  hashes: Hash[];
}

interface Hash {
  type: number;
  value: string;
}

interface SortableGameVersion {
  gameVersion: string;
  gameVersionName: string;
  gameVersionTypeId: number;
}

interface Module {
  foldername: string;
  fingerprint: number;
  invalidFingerprint: boolean;
}

interface Dependency {
  addonId: number;
  type: number;
}

interface Author {
  Id: number;
  Name: string;
}

interface SyncProfile {
  PreferenceEnabled: boolean;
  PreferenceAutoSync: boolean;
  PreferenceAutoDelete: boolean;
  PreferenceBackupSavedVariables: boolean;
  GameInstanceGuid: string;
  SyncProfileID: number;
  SavedVariablesProfile?: any;
  LastSyncDate: string;
}

interface Manifest {
  minecraft: Minecraft;
  manifestType: string;
  manifestVersion: number;
  name: string;
  version: string;
  author: string;
  description?: any;
  projectID?: any;
  files: File[];
  overrides: string;
}

interface BaseModLoader {
  forgeVersion: string;
  name: string;
  type: number;
  downloadUrl: string;
  filename: string;
  installMethod: number;
  latest: boolean;
  recommended: boolean;
  versionJson: string;
  librariesInstallLocation: string;
  minecraftVersion: string;
  installProfileJson: string;
}
