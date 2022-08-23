import Head from "next/head";
import type { NextPage } from "next";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const greeting = trpc.useMutation(["example.greet"]);

  trpc.useSubscription(["example.onGreet"], {
    onNext(data) {
      console.log(data);
    },
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>Hi</main>
    </>
  );
};

export default Home;
