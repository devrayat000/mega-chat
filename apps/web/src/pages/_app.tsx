// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";

import type { AppRouter } from "../server/router";
import { trpcConfig } from "~/utils/trpc-client.config";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables={process.env.NODE_ENV === "production"}
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
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
  ssr: true,
})(MyApp);
