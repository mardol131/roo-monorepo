import { defineRouting } from "next-intl/routing";
import { getPathname, Link } from "./navigation";
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

    // authorization
    "/login": { cs: "/prihlaseni" },
    "/register": { cs: "/registrace" },
    "/password-reset": { cs: "/obnoveni-hesla" },

    // user profile
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
    "/user-profile/profile-settings": { cs: "/ucet/nastaveni" },

    // company profile
    "/company-profile": { cs: "/dodavatel" },
    "/company-profile/companies": { cs: "/dodavatel/spolecnosti" },
    "/company-profile/companies/new-company": {
      cs: "/dodavatel/spolecnosti/nova-spolecnost",
    },

    // company detail
    "/company-profile/companies/[id]": { cs: "/dodavatel/spolecnosti/[id]" },
    "/company-profile/companies/[id]/edit": {
      cs: "/dodavatel/spolecnosti/[id]/upravit",
    },

    // company services profile
    "/company-profile/companies/[id]/services": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby",
    },
    "/company-profile/companies/[id]/services/new-service": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/nova-sluzba",
    },

    // company service detail
    "/company-profile/companies/[id]/services/[serviceId]": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]",
    },
    "/company-profile/companies/[id]/services/[serviceId]/edit": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/upravit",
    },
    "/company-profile/companies/[id]/services/[serviceId]/calendar": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/kalendar",
    },
    "/company-profile/companies/[id]/services/[serviceId]/inquiries": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/poptavky",
    },
    "/company-profile/companies/[id]/services/[serviceId]/inquiries/[inquiryId]":
      {
        cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/poptavky/[inquiryId]",
      },

    // company service offers
    "/company-profile/companies/[id]/services/[serviceId]/offers": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/nabidky",
    },
    "/company-profile/companies/[id]/services/[serviceId]/offers/new-offer": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/nabidky/nova-nabidka",
    },
    "/company-profile/companies/[id]/services/[serviceId]/offers/[offerId]": {
      cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/nabidky/[offerId]",
    },
    "/company-profile/companies/[id]/services/[serviceId]/offers/[offerId]/edit":
      {
        cs: "/dodavatel/spolecnosti/[id]/sluzby/[serviceId]/nabidky/[offerId]/upravit",
      },
  },
});

export type Routes = {
  [K in keyof typeof routing.pathnames]: K extends `${string}[${string}`
    ? never
    : K;
}[keyof typeof routing.pathnames];
