import { routing } from "@/app/i18n/routing";
import cs from "@/app/i18n/messages/cs/index";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof cs;
  }
}
