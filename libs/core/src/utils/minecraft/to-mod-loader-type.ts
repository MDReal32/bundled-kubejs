import { ModLoaderType } from "../../types";

const modLoaderTypeNames = Object.keys(ModLoaderType).filter(key => Number.isNaN(Number(key)));

/**
 * Callers hand over whatever the CLI collected, so the value can be the enum number, its digits
 * or its name in any case.
 */
export const toModLoaderType = (modLoaderType: ModLoaderType | string) => {
  const modLoaderTypeId = Number(modLoaderType);
  if (ModLoaderType[modLoaderTypeId] !== undefined) {
    return modLoaderTypeId as ModLoaderType;
  }

  const modLoaderTypeName = String(modLoaderType).toUpperCase();
  if (modLoaderTypeNames.includes(modLoaderTypeName)) {
    return ModLoaderType[modLoaderTypeName as keyof typeof ModLoaderType];
  }

  throw new Error(
    `Unknown mod loader "${modLoaderType}", expected one of ${modLoaderTypeNames.join(", ")}`
  );
};
