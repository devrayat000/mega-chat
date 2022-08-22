import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { compareHash, hashPassword } from "../../services/bcrypt";
import { createRouter } from "./context";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(32),
  image: z.string().url().nullish(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;

export const authRouter = createRouter()
  .mutation("register", {
    input: registerSchema,
    async resolve({ input, ctx }) {
      const { hash, salt } = await hashPassword(input.password);
      return ctx.prisma.user.create({
        data: Object.assign(input, { hash, salt }),
      });
    },
  })
  .mutation("login", {
    input: loginSchema,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
        select: { id: true, hash: true, email: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found with these credentials",
        });
      }
      if (!(await compareHash(input.password, user.hash!))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Password did not match!",
        });
      }
      return user;
    },
  })
  .middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .mutation("delete", {
    async resolve({ ctx }) {
      return ctx.prisma.user.delete({
        where: { id: (ctx.session?.user as any)?.id },
      });
    },
  });
