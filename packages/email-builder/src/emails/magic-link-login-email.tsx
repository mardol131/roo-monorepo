import {
  Body,
  CodeBlock,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import {
  button,
  container,
  footer,
  h1,
  linkStyle,
  main,
  text,
} from "../components/styles";
import { Footer } from "../components/footer";
import { colors } from "../components/colors";

export type MagicLinkLoginEmailProps = {
  link: string;
};

export const MagicLinkLoginEmail = ({ link }: MagicLinkLoginEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Přihlašovací email</Preview>
      <Container style={container}>
        <Heading style={h1}>OSVČ365: Odkaz pro přihlášení</Heading>

        <Text style={{ ...text, marginBottom: "14px" }}>
          Níže naleznete tlačítko s odkazem pro přihlášení do správy
          předplatného. Tento odkaz je platný následujících 15 minut.
        </Text>

        <Container style={{ padding: "0px", margin: "40px 0px" }}>
          <Link href={link} style={{ ...button }}>
            Přihlásit se
          </Link>
        </Container>

        <Footer />
      </Container>
    </Body>
  </Html>
);

MagicLinkLoginEmail.PreviewProps = {
  link: "https://example.com/magic-link",
} as MagicLinkLoginEmailProps;

export default MagicLinkLoginEmail;
