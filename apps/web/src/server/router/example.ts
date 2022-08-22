import {Subscription} from '@trpc/server'
import { z } from "zod";
import { createRouter } from "./context";

const greetSchema = z.object({
  name: z.string(),
  text: z.string(),
})

type Greeting = z.infer<typeof greetSchema>

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  })
  .mutation('greet', {
    input: greetSchema,
    resolve({ctx,input}) {
      ctx.ee.emit('greeting', input)
      return input;
    }
  }).subscription('onGreet', {
    resolve({ctx}) {
      return new Subscription<Greeting>(emit => {
        function onGreet(greeting: Greeting) {
          emit.data(greeting)
        }
        ctx.ee.on('greeting', onGreet)
        return () => {
          ctx.ee.off('greeting', onGreet)
        }
      })
    }
  });
