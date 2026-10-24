export const latestMcLine = (lines: string[]) => {
  const latest = [...lines].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
  if (!latest) {
    throw new Error("No Minecraft lines are defined.");
  }

  return latest;
};
