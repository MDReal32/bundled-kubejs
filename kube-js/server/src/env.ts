import z from "zod";

const envSchema = z.object({
  CURSEFORGE_API_KEY: z.string(),
  SERVER_PORT: z.string()
});

export const env = envSchema.parse(process.env);
