// src/server/router/index.ts
import { createRouter } from "./router";
import superjson from "superjson";
import { ZodError } from "zod";

// import { protectedExampleRouter } from "./protected-example-router";
import { exampleRouter } from "./example";
import { authRouter } from "./auth-router";

export const appRouter = createRouter()
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  })
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("example.", exampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export { createContext } from "./context";
