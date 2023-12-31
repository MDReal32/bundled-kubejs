export interface Module {
  name: string;
  fingerprint: number;
}

export interface Dependency {
  modId: number;
  relationType: number;
}

export interface SortableGameVersion {
  gameVersionName: string;
  gameVersionPadded: string;
  gameVersion: string;
  gameVersionReleaseDate: string;
  gameVersionTypeId: number;
}

export interface Hash {
  value: string;
  algo: number;
}
