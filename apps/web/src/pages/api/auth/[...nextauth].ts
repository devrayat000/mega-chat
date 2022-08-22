import NextAuth, { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { createTRPCClient } from "@trpc/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from "../../../server/db/client";
// import { env } from "../../../env/server.mjs";
// import type { AppRouter } from "../../../server/router";
// import { trpcConfig } from "../../../utils/trpc-client.config";

// const client = createTRPCClient<AppRouter>(trpcConfig);

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. "Sign in with...")
    //   name: "Credentials",
    //   // The credentials is used to generate a suitable form on the sign in page.
    //   // You can specify whatever fields you are expecting to be submitted.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   // You can pass any HTML attribute to the <input> tag through the object.
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "jsmith@mail.com",
    //     },
    //     password: { label: "Password", type: "password" },
    //   },
    //   // async authorize(credentials) {
    //   //   return await client.mutation("auth.login", {
    //   //     email: credentials!.email,
    //   //     password: credentials!.password,
    //   //   });
    //   // },
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
