import superjson from "superjson";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
// import { loggerLink } from "@trpc/client/links/loggerLink";
import { createTRPCClient, CreateTRPCClientOptions } from "@trpc/client";

import type { AppRouter } from "../server/router";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const getWSUrl = () => {
  // if (process.env.WS_URL) return process.env.WS_URL; // SSR should use vercel url
  return process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"; // dev SSR should use localhost
};

function getEndingLink() {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    });
  }
  const client = createWSClient({
    url: getWSUrl(),
  });
  return wsLink<AppRouter>({
    client,
  });
}

export const trpcConfig: CreateTRPCClientOptions<AppRouter> = {
  links: [
    // loggerLink({
    //   enabled: (opts) =>
    //     (process.env.NODE_ENV === "development" &&
    //       typeof window !== "undefined") ||
    //     (opts.direction === "down" && opts.result instanceof Error),
    // }),
    getEndingLink(),
  ],
  transformer: superjson,
};

export const client = createTRPCClient<AppRouter>(trpcConfig);
