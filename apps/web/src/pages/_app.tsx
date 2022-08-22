// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import { SessionProvider } from "next-auth/react";
import { globalStyles } from "twin.macro";

import { globalCss } from "stitches.config";
import { trpcConfig } from "~/utils/trpc-client.config";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  globalCss(globalStyles as Record<any, any>)();
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config() {
    return trpcConfig;
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
