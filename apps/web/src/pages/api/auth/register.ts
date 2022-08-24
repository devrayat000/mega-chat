import { Writable } from "node:stream";
import { writeFile } from "node:fs/promises";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable, { type Options } from "formidable";

import { clientRegisterSchema } from "~/services/validators/register";
import { client } from "~/utils/trpc-client.config";

const formidableConfig: Options = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 2,
  allowEmptyFiles: true,
  multiples: false,
  uploadDir: "public/upload/",
  filter: ({ mimetype }) => Boolean(mimetype && mimetype.includes("image")),
};

// promisify formidable
function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const chunks: never[] = [];
  const { files, fields } = await formidablePromise(req, {
    ...formidableConfig,
    // consume this, otherwise formidable tries to save the file to disk
    fileWriteStreamHandler: () => fileConsumer(chunks),
  });
  const input = clientRegisterSchema.parse(fields);

  // do something with the files
  const contents = Buffer.from(chunks); // or I think it is .concat(chunks)
  const { filepath, newFilename } = files["avatar"] as formidable.File;
  await writeFile(filepath, contents);

  const user = await client.mutation(
    "auth.register",
    Object.assign(input, { image: "/uploads/" + newFilename })
  );

  const resp = await fetch("/api/auth/signin/credentials", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      csrfToken: input.csrfToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  await resp.json();
  res.status(201).redirect("/");
}

// and don't forget
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
