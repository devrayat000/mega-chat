import { Container, Title, Paper } from "@mantine/core";
import { type NextPage } from "next";

const LoginPage: NextPage = () => {
  return (
    <Container>
      <Title order={1} align="center">
        Welcome Back
      </Title>

      <Paper component="form" withBorder></Paper>
    </Container>
  );
};

export default LoginPage;

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
