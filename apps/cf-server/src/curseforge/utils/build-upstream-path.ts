export const buildUpstreamPath = (
  path: string,
  query: Record<string, string | number | boolean>
) => {
  const search = new URLSearchParams(
    Object.entries(query).map(([name, value]) => [name, String(value)])
  );

  return `${path}?${search}`;
};
