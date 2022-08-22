import type { NextPage } from "next";
import Head from "next/head";
import { styled } from "stitches.config";
import tw from "twin.macro";
import { trpc } from "../utils/trpc";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

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

      <main tw="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 tw="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span tw="text-purple-300">T3</span> App
        </h1>
        <p tw="text-2xl text-gray-700">This stack uses:</p>
        <div tw="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
          <TechnologyCard
            name="NextJS!"
            description="The React framework for production"
            documentation="https://nextjs.org/"
          />
          <TechnologyCard
            name="TypeScript"
            description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale"
            documentation="https://www.typescriptlang.org/"
          />
          <TechnologyCard
            name="TailwindCSS"
            description="Rapidly build modern websites without ever leaving your HTML"
            documentation="https://tailwindcss.com/"
          />
          <TechnologyCard
            name="tRPC"
            description="End-to-end typesafe APIs made easy"
            documentation="https://trpc.io/"
          />
          <button
            type="button"
            onClick={() => {
              greeting
                .mutateAsync({ name: "rayat", text: "Hi" })
                .catch(console.log);
            }}
          >
            Greet
          </button>
        </div>
        <div tw="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
          {greeting.data ? <p>{greeting.data.text}</p> : <p>Loading..</p>}
        </div>
      </main>
    </>
  );
};

const Card = styled("article", {
  ...tw`flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105`,
});

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <Card>
      <h2 tw="text-lg text-gray-700">{name}</h2>
      <p tw="text-sm text-gray-600">{description}</p>
      <a
        tw="mt-3 text-sm underline text-purple-500 text-decoration[dotted] text-underline-offset[0.5rem]"
        href={documentation}
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>
    </Card>
  );
};

export default Home;