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
  Stepper,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextLink } from "@mantine/next";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
  type NextPage,
  type PageConfig,
} from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import useStepper from "~/hooks/stepper";

import { clientRegisterSchema } from "~/services/validators/register";
import { trpc } from "~/utils/trpc";

export const config: PageConfig = {
  unstable_runtimeJS: false,
};

type LoginPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const LoginPage: NextPage<LoginPageProps> = ({ csrf }) => {
  const { step, onStepChange } = useStepper(3);
  const { getInputProps, onSubmit } = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      csrfToken: csrf,
    },
    validate: zodResolver(clientRegisterSchema),
  });
  const register = trpc.useMutation(["auth.register"], {
    async onSuccess(data, variables, context) {
      await signIn("credentials", { redirect: true }, variables as any);
    },
  });

  const signup = onSubmit(async (data) => {
    register.mutateAsync(data);
  });

  return (
    <Container size={640} my={40}>
      <Text component="noscript">
        This page might not properly without javascript
      </Text>
      <Stepper active={step} onStepClick={onStepChange} breakpoint="sm">
        <Stepper.Step label="First step" description="Create an account">
          <Container size={420}>
            <Title
              align="center"
              sx={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                fontWeight: 900,
              })}
            >
              Welcome to MC!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
              Already have an account?{" "}
              <Anchor component={NextLink} href="/login" size="sm">
                Log In
              </Anchor>
            </Text>

            <Paper
              component="form"
              action="/api/auth/register"
              method="POST"
              onSubmit={signup}
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
                name="name"
                label="Full Name"
                placeholder="John Doe"
                required
                variant="filled"
                radius="lg"
                {...getInputProps("name", { withError: true })}
              />
              <TextInput
                type="email"
                name="email"
                label="Email"
                placeholder="john@doe.com"
                required
                mt="sm"
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
                Create Account
              </Button>
            </Paper>
          </Container>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
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
