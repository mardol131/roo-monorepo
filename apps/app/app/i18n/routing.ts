import { defineRouting } from "next-intl/routing";
import { Link } from "./navigation";
import { ComponentProps } from "react";

export const routing = defineRouting({
  locales: ["cs"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
  pathnames: {
    "/homepage": { cs: "/" },
    "/catalog": { cs: "/katalog" },
    "/catalog/[type]": { cs: "/katalog/[type]" },
    "/listing/[id]": { cs: "/inzerat/[id]" },
    "/listing/[id]/booking": { cs: "/inzerat/[id]/poptavka" },

    "/login": { cs: "/prihlaseni" },
    "/register": { cs: "/registrace" },

    "/user-profile": { cs: "/ucet" },
    "/user-profile/new-event": { cs: "/ucet/nova-udalost" },
    "/user-profile/my-events": { cs: "/ucet/moje-udalosti" },
    "/user-profile/my-events/[id]": { cs: "/ucet/moje-udalosti/[id]" },
    "/user-profile/my-events/[id]/[contractorId]": {
      cs: "/ucet/moje-udalosti/[id]/[contractorId]",
    },
    "/user-profile/inquiries": { cs: "/ucet/poptavky" },
    "/user-profile/messages": { cs: "/ucet/zpravy" },
    "/user-profile/favorites": { cs: "/ucet/oblibene" },
    "/user-profile/settings": { cs: "/ucet/nastaveni" },
  },
});

export type Routes = {
  [K in keyof typeof routing.pathnames]: K extends `${string}[${string}`
    ? never
    : K;
}[keyof typeof routing.pathnames];

export type IntlLink = ComponentProps<typeof Link>["href"];
