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
import { Obligation } from "../components/obligation";
import { Footer } from "../components/footer";
import { AccessButton } from "../components/accessButton";
import { colors } from "../components/colors";

export type Notification = {
  text: string;
  mobileText: string;
  link?: string | null;
  description: string;
  date?: string | null;
};

export type CustomMessage = {
  heading: string;
  notifications: Notification[];
  order?: number | null;
};

export type MonthlyNotificationEmailProps = {
  messages: CustomMessage[];
  dateLabel: string;
  accessLink: string;
  accountEmail: string;
};

export default function MonthlyNotificationEmail({
  messages,
  dateLabel,
  accessLink,
  accountEmail,
}: MonthlyNotificationEmailProps) {
  if (messages.length === 0) {
    return (
      <Html>
        <Head />
        <Body style={main}>
          <Preview>Měsíční přehled změn</Preview>
          <Container style={container}>
            <Heading style={h1}>
              OSVČ365: Měsíční přehled změn na {dateLabel}
            </Heading>

            <Text style={{ ...text, marginBottom: "14px" }}>
              Tento měsíc nejsou žádné nové změny k zobrazení.
            </Text>

            <AccessButton href={accessLink} />

            <Footer />
          </Container>
        </Body>
      </Html>
    );
  }

  const orderedMessages = messages.sort((a, b) => {
    const orderA = a.order || 0;
    const orderB = b.order || 0;

    // Položky s order: 1 jsou vždy první
    if (orderA === 1 && orderB !== 1) return -1;
    if (orderB === 1 && orderA !== 1) return 1;
    return (b.notifications.length || 0) - (a.notifications.length || 0);
  });

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Měsíční přehled změn</Preview>
        <Container style={container}>
          <Heading style={h1}>
            OSVČ365: Měsíční přehled změn na {dateLabel}
          </Heading>

          <Text style={{ ...text, marginBottom: "14px" }}>
            Níže Vám posíláme přehled změn pro následující měsíc.
          </Text>

          {orderedMessages.map((message, index) => (
            <Container style={{ margin: "20px 0px" }} key={index}>
              <Heading
                style={{ ...h1, fontSize: "18px", marginBottom: "12px" }}
              >
                {message.heading}
              </Heading>
              <ul style={{ marginTop: "12px", marginBottom: "24px" }}>
                {message.notifications.length > 0 ? (
                  message.notifications.map((notification, idx) => (
                    <Obligation key={idx} notification={notification} />
                  ))
                ) : (
                  <Obligation
                    key={0}
                    notification={{
                      text: "V této kategorii nejsou žádné nové změny.",
                    }}
                  />
                )}
              </ul>
            </Container>
          ))}
          <AccessButton href={accessLink} />
          <Container style={{ margin: "30px 0px" }}>
            <Heading style={{ ...h1, fontSize: "18px", marginBottom: "12px" }}>
              Předplatné
            </Heading>
            <Text style={{ ...text, marginBottom: "14px" }}>
              Toto předplatné vedeme pod zákaznickým účtem s emailovou adresou:
            </Text>
            <Link
              style={{ ...text, fontWeight: 600, color: colors.secondary }}
              href={`mailto:${accountEmail}`}
            >
              {accountEmail}
            </Link>

            <Text style={{ ...text, marginBottom: "14px" }}>
              Pokud si přejete toto předplatné změnit nebo přenastavit, můžete
              to provést na stránce{" "}
              <Link
                href={`${process.env.WEBSITE_URL}/administrace/sprava-predplatneho?email=${accountEmail}`}
                style={{ ...text, fontWeight: 600, color: colors.secondary }}
              >
                nastavení předplatného
              </Link>
              . Pokud už k této adrese nemáte přístup, kontaktujte nás prosím na
              email{" "}
              <Link
                href="mailto:info@osvc365.cz"
                style={{ ...text, fontWeight: 600, color: colors.primary }}
              >
                info@osvc365.cz
              </Link>
              .
            </Text>
          </Container>

          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

MonthlyNotificationEmail.PreviewProps = {
  accountEmail: "test-email@gamil.com",
  messages: [
    {
      heading: "Přehled změn v legislativě",
      notifications: [
        {
          text: "Nové sazby DPH pro rok 2024",
          mobileText: "Nové sazby DPH pro rok 2024",
          link: "https://osvc365.cz/dph-2024",
          description:
            "Seznamte se s novými sazbami DPH, které vstupují v platnost od 1. ledna 2024.",
          date: "2024-01-15",
        },
        {
          text: "Změny v odpočtech nákladů pro OSVČ",
          mobileText: "Změny v odpočtech nákladů pro OSVČ",
          link: "https://osvc365.cz/odpocty-nakladu-2024",
          description:
            "Nová pravidla pro odpočty nákladů, která mohou ovlivnit vaše daňové přiznání.",
          date: "2024-01-10",
        },
      ],
      order: 2,
    },
    {
      heading: "Obecné informace",
      notifications: [
        {
          text: "Integrace s účetním softwarem XYZ",
          mobileText: "Integrace s účetním softwarem XYZ",
          link: "https://osvc365.cz/ucetni-software-xyz",
          description:
            "Nyní můžete synchronizovat svá data přímo s populárním účetním softwarem XYZ.",
          date: "2024-01-20",
        },
        {
          text: "Vylepšené reporty a analýzy",
          mobileText: "Vylepšené reporty a analýzy",
          link: "https://osvc365.cz/vylepsene-reporty",
          description:
            "Nové možnosti reportování vám pomohou lépe sledovat vaše podnikání.",
          date: "2024-01-18",
        },
      ],
      order: 1,
    },
  ],
  dateLabel: "Březen 2025",
  accessLink: "https://osvc365.cz/prihlaseni",
} as MonthlyNotificationEmailProps;
