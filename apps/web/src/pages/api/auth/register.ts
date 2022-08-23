import { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken } from "next-auth/react";
import { clientRegisterSchema } from "~/services/validators/register";

import { client } from "~/utils/trpc-client.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const input = clientRegisterSchema.parse(req.body);
  const user = await client.mutation("auth.register", input);

  const csrfToken = await getCsrfToken({ req });

  const resp = await fetch("/api/auth/signin/:provider", {
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
  const data = await resp.json();

  res.status(201).redirect("/");
}
