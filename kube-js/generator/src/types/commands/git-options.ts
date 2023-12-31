import { BaseOptions } from "./base-options";

export interface GitOptions extends BaseOptions {
  gitRepo?: string;
  username?: string;
  email?: string;
}
