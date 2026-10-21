import { getModGameVersions } from "@kubejs/core";

import { RequiredModFiles } from "../../types/mc/required-mod-files";

export const getMinecraftVersions = async () => {
  const interval = setTimeout(console.log, 10000, "Sorry for the wait, this may take a while...");

  const [kubejs, probejs] = await Promise.all(
    [RequiredModFiles.KubeJS, RequiredModFiles.ProbeJS].map(modId => getModGameVersions(modId))
  );

  clearTimeout(interval);
  return kubejs
    .filter(v => probejs.includes(v))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
};
