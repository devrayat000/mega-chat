import * as trpc from "@trpc/server";
import type { AppContext } from "./context";

export const createRouter = () => trpc.router<AppContext>();
