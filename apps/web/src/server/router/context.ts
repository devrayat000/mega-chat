// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import EventEmitter from "node:events";
import {
  unstable_getServerSession as getServerSession,
  type Session,
} from "next-auth";
import { getSession } from "next-auth/react";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import type { IncomingMessage, ServerResponse } from "node:http";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";

type CreateContextOptions = {
  session: Session | null;
};

const ee = new EventEmitter();

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    ee,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const session = await getServerSession(opts.req, opts.res, nextAuthOptions);

  return await createContextInner({
    session,
  });
};

export const createNodeContext = async (
  opts: NodeHTTPCreateContextFnOptions<IncomingMessage & any, ServerResponse>
) => {
  const session = await getSession(opts);

  return await createContextInner({
    session,
  });
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;
export type { Context as AppContext };

export const createRouter = () => trpc.router<Context>();
