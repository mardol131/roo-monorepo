import { Text } from "@react-email/components";
import { text } from "./styles";
import { format } from "date-fns";
import { colors } from "./colors";

export type ObligationProps = {
  notification: {
    text: string;
    link?: string | null;
    date?: string | null;
  };
};

export const Obligation = ({ notification }: ObligationProps) => {
  return (
    <>
      <li>
        <Text style={{ ...text }}>
          {notification.text} -{" "}
          {notification.link ? (
            <>
              <a
                style={{ fontWeight: 600, color: colors.secondary }}
                href={notification.link}
              >
                Více informací
              </a>{" "}
            </>
          ) : null}
          <br
            style={{
              ...text,
              fontWeight: 700,
            }}
          />
          {notification.date ? (
            <span style={{ fontWeight: 600, color: colors.text }}>
              Do {format(new Date(notification.date), "d. M. yyyy")}
            </span>
          ) : null}
        </Text>
      </li>
    </>
  );
};
