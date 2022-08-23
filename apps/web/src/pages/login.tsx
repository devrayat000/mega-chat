import {
  Container,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Text,
  Anchor,
  Group,
  Checkbox,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextLink } from "@mantine/next";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";

import { clientLoginSchema } from "~/services/validators/login";

type LoginPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const LoginPage: NextPage<LoginPageProps> = ({ csrf }) => {
  const { getInputProps, onSubmit } = useForm({
    initialValues: {
      email: "",
      password: "",
      csrfToken: csrf,
    },
    validate: zodResolver(clientLoginSchema),
  });

  const login = onSubmit(async (data) => {
    await signIn("credentials", { redirect: true }, data as any);
  });

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor
          component={NextLink}
          href="/signup"
          size="sm"
          onClick={(event) => event.preventDefault()}
        >
          Create account
        </Anchor>
      </Text>

      <Paper
        component="form"
        action="/api/auth/signin/credentials"
        method="POST"
        onSubmit={login}
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="lg"
      >
        <input
          type="hidden"
          name="csrfToken"
          value={csrf}
          {...getInputProps("csrfToken", { withError: false })}
        />
        <TextInput
          type="email"
          name="email"
          label="Email"
          placeholder="john@doe.com"
          required
          variant="filled"
          radius="lg"
          {...getInputProps("email", { withError: true })}
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Your Password"
          required
          mt="sm"
          variant="filled"
          radius="lg"
          {...getInputProps("password", { withError: true })}
        />
        <Group position="apart" mt="md">
          <Checkbox label="Remember me" />
          <Anchor component={NextLink} href="/forgot-password" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" type="submit">
          Log in
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      csrf: await getCsrfToken(ctx),
    },
  };
};
