import { ModLoaderType } from "./mod-loader-type";

export interface TemplateGenerateOptions {
  /**
   * The name of the project.
   */
  name: string;

  /**
   * The version of the project.
   */
  version?: string;

  /**
   * The description of the project.
   */
  description?: string;

  /**
   * The author of the project.
   */
  author?: string;

  /**
   * The temporary destination of the project.
   */
  tmpDestination: string;

  /**
   * The Minecraft version of the project.
   */
  mcVersion: string;

  /**
   * Minecraft Forge or Fabric.
   */
  modLoaderType?: ModLoaderType;

  /**
   * The template to use.
   */
  template: string;
}
