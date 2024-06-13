import { CfFile } from "./cf-file";

export interface CfMod {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  links: Links;
  summary: string;
  status: number;
  downloadCount: number;
  isFeatured: boolean;
  primaryCategoryId: number;
  categories: Category[];
  classId: number;
  authors: Author[];
  logo: Logo;
  screenshots: any[];
  mainFileId: number;
  latestFiles: CfFile[];
  latestFilesIndexes: LatestFilesIndex[];
  latestEarlyAccessFilesIndexes: any[];
  dateCreated: string;
  dateModified: string;
  dateReleased: string;
  allowModDistribution: boolean;
  gamePopularityRank: number;
  isAvailable: boolean;
  thumbsUpCount: number;
}

export interface LatestFilesIndex {
  gameVersion: string;
  fileId: number;
  filename: string;
  releaseType: number;
  gameVersionTypeId: number;
  modLoader?: number;
}

export interface Logo {
  id: number;
  modId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

export interface Author {
  id: number;
  name: string;
  url: string;
}

export interface Category {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  url: string;
  iconUrl: string;
  dateModified: string;
  isClass: boolean;
  classId: number;
  parentCategoryId: number;
}

export interface Links {
  websiteUrl: string;
  wikiUrl: string;
  issuesUrl: string;
  sourceUrl: string;
}
