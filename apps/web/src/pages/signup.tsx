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
  useMantineTheme,
} from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
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
  amp: "hybrid",
};

type LoginPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const LoginPage: NextPage<LoginPageProps> = ({ csrf }) => {
  const theme = useMantineTheme();
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
          <Dropzone
            onDrop={async (files) => {
              const formData = new FormData();
              formData.append("avatar", files[0]);
              const res = await fetch("/api/auth/register", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              console.log(data);
            }}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={10 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 220, pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  size={50}
                  stroke={1.5}
                  color={
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === "dark" ? 4 : 6
                    ]
                  }
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={50}
                  stroke={1.5}
                  color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
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
