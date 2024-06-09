export const entries = ["client", "server", "startup"] as const;
export type Entry = (typeof entries)[number];
