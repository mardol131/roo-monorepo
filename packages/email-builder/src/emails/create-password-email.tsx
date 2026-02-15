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

export type CreatePasswordEmailProps = {
  link: string;
};

export const CreatePasswordEmail = ({ link }: CreatePasswordEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Nastavení nového hesla</Preview>
      <Container style={container}>
        <Heading style={h1}>OSVČ365: Nastavení nového hesla</Heading>

        <Text style={{ ...text, marginBottom: "14px" }}>
          Tlačítkem níže se přesunete zpět na náš web, kde si můžete nastavit
          nové heslo pro svůj účet OSVČ365.
        </Text>

        <Container style={{ padding: "0px", margin: "40px 0px" }}>
          <Link href={link} style={{ ...button }}>
            Nastavit nové heslo
          </Link>
        </Container>

        <Footer />
      </Container>
    </Body>
  </Html>
);

CreatePasswordEmail.PreviewProps = {
  link: "https://example.com/create-password",
} as CreatePasswordEmailProps;

export default CreatePasswordEmail;
