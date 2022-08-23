import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must contain atleast 8 character(s)" })
    .max(32, { message: "Password must contain atleast 32 character(s)" }),
});

export const clientLoginSchema = loginSchema.extend({
  csrfToken: z.string().nullish(),
});

export type Login = z.infer<typeof loginSchema>;
