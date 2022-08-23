import type { IncomingMessage, ServerResponse } from "node:http";
import EventEmitter from "node:events";
import { getSession } from "next-auth/react";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import type { Session } from "next-auth";

import { prisma } from "../db/client";

type CreateContextOptions = {
  session: Session | null;
};

const ee = new EventEmitter();

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    ee,
  };
};

export const createNodeContext = async (
  opts: NodeHTTPCreateContextFnOptions<IncomingMessage & any, ServerResponse>
) => {
  const session = await getSession(opts);

  return await createContextInner({
    session,
  });
};

export { createNodeContext as createContext };
export { type AppRouter, appRouter } from "./index";
