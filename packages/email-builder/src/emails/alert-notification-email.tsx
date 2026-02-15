import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { format } from "date-fns";
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
import { AccessButton } from "../components/accessButton";

export type AlertNotificationEmailProps = {
  date: Date;
  dayGap: number;
  heading: string;
  description?: string;
  link?: string;
  accessLink: string;
};

const AlertNotificationEmail = ({
  date,
  dayGap,
  heading,
  description,
  link,
  accessLink,
}: AlertNotificationEmailProps) => {
  let header = "";
  if (dayGap <= 0) {
    header = "Dnes je poslední den pro splnění povinnosti";
  } else {
    header = `${dayGap === 1 ? "Zbývá" : dayGap <= 4 ? "Zbývají" : "Zbývá"} ${dayGap} ${dayGap === 1 ? "den" : dayGap <= 4 ? "dny" : "dní"} pro splnění povinnosti`;
  }
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Blížící se termín</Preview>
        <Container style={container}>
          <Heading style={h1}>OSVČ365: {header}</Heading>
          <Heading style={{ ...h1, fontSize: "18px", marginBottom: "12px" }}>
            {heading}
          </Heading>
          <Text style={{ ...text, margin: "0px" }}>
            {description}
            {link ? (
              <>
                {" - "}
                <a
                  style={{ fontWeight: 600, color: colors.secondary }}
                  href={link}
                >
                  Více informací
                </a>{" "}
              </>
            ) : null}
          </Text>
          <Text style={{ ...text, margin: "0px", fontWeight: 600 }}>
            Do {format(new Date(date), "d.M.yyyy")}
          </Text>
          <AccessButton href={accessLink} />
          <Footer />
        </Container>
      </Body>
    </Html>
  );
};

AlertNotificationEmail.PreviewProps = {
  date: new Date(),
  dayGap: 2,
  heading: "Daňové přiznání",
  description: "Popis povinnosti",
  link: "https://osvc365.cz",
  accessLink: "https://osvc365.cz/mesicni-souhrn",
} satisfies AlertNotificationEmailProps;

const Email = AlertNotificationEmail;
export default Email;
