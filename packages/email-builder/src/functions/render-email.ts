import { render } from "@react-email/components";
import { ReactNode } from "react";
import AlertNotificationEmail, {
  AlertNotificationEmailProps,
} from "../emails/alert-notification-email";
import MonthlyNotificationEmail, {
  MonthlyNotificationEmailProps,
} from "../emails/monthly-notification-email";
import ConfirmationEmail, {
  ConfirmationEmailProps,
} from "../emails/confirmation-email";
import MagicLinkLoginEmail, {
  MagicLinkLoginEmailProps,
} from "../emails/magic-link-login-email";
import CreatePasswordEmail, {
  CreatePasswordEmailProps,
} from "../emails/create-password-email";

export async function renderEmailTemplate(
  component: ReactNode,
): Promise<string> {
  try {
    const html = await render(component, {
      pretty: true,
    });
    return html;
  } catch (error) {
    console.error("Failed to render email template:", error);
    throw new Error(`Failed to render email template: ${error}`);
  }
}

export async function renderAlertNotificationEmail(
  props: AlertNotificationEmailProps,
): Promise<string> {
  // Dynamic import to avoid issues in server context

  const component = AlertNotificationEmail(props);
  return renderEmailTemplate(component);
}

export async function renderMonthlyNotificationEmail(
  props: MonthlyNotificationEmailProps,
): Promise<string> {
  const component = MonthlyNotificationEmail(props);
  return renderEmailTemplate(component);
}

export async function renderConfirmationEmail(
  props: ConfirmationEmailProps,
): Promise<string> {
  const component = ConfirmationEmail(props);
  return renderEmailTemplate(component);
}

export async function renderMagicLinkLoginEmail(
  props: MagicLinkLoginEmailProps,
): Promise<string> {
  const component = MagicLinkLoginEmail(props);
  return renderEmailTemplate(component);
}

export async function renderCreatePasswordEmail(
  props: CreatePasswordEmailProps,
): Promise<string> {
  const component = CreatePasswordEmail(props);
  return renderEmailTemplate(component);
}
