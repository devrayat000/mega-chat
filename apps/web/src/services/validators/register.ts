import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(32),
  image: z.string().url().nullish(),
});

export const clientRegisterSchema = registerSchema.extend({
  csrfToken: z.string().nullish(),
});

export type Register = z.infer<typeof registerSchema>;
