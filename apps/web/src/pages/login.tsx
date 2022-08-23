import {
  Container,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Text,
  Anchor,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { type NextPage } from "next";

const LoginPage: NextPage = () => {
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

      <Paper component="form" withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          type="email"
          name="email"
          label="Email"
          placeholder="john@doe.com"
          required
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Your Password"
          required
          mt="sm"
        />
      </Paper>
    </Container>
  );
};

export default LoginPage;

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
