import { routing } from "@/app/i18n/routing";
import messages from "@/app/i18n/messages/cs.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
