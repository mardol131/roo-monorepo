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
    "/company-profile": { cs: "/firemni-ucet" },
    "/company-profile/companies": { cs: "/firemni-ucet/firmy" },
    "/company-profile/new-company": {
      cs: "/firemni-ucet/firmy/nova-firma",
    },
    "/company-profile/settings": { cs: "/firemni-ucet/nastaveni" },

    // company detail
    //// legal, company data
    "/company-profile/companies/[companyId]": {
      cs: "/firemni-ucet/firmy/[companyId]",
    },
    "/company-profile/companies/[companyId]/edit": {
      cs: "/firemni-ucet/firmy/[companyId]/upravit",
    },

    // company listing profile
    //// service that company offer - gastro|place|entertainment
    //// can be more than one
    "/company-profile/companies/[companyId]/listings": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky",
    },
    "/company-profile/companies/[companyId]/listings/new-listing": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky/nova-nabidka",
    },

    // company listing detail
    //// listings are shown in catalog as separate cards
    //// each listing has its own page
    "/company-profile/companies/[companyId]/listings/[listingsId]": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]",
    },
    "/company-profile/companies/[companyId]/listings/[listingsId]/edit": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/upravit",
    },
    "/company-profile/companies/[companyId]/listings/[listingsId]/calendar": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/kalendar",
    },
    "/company-profile/companies/[companyId]/listings/[listingsId]/inquiries": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/poptavky",
    },
    "/company-profile/companies/[companyId]/listings/[listingsId]/inquiries/[inquiryId]":
      {
        cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/poptavky/[inquiryId]",
      },

    // company listings variant
    //// variant are premade versions of listings
    //// all are shown under listing page
    "/company-profile/companies/[companyId]/listings/[listingsId]/variants": {
      cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/nabidky",
    },
    "/company-profile/companies/[companyId]/listings/[listingsId]/variants/new-variant":
      {
        cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/nabidky/nova-nabidka",
      },
    "/company-profile/companies/[companyId]/listings/[listingsId]/variants/[variantId]":
      {
        cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/nabidky/[variantId]",
      },
    "/company-profile/companies/[companyId]/listings/[listingsId]/variants/[variantId]/edit":
      {
        cs: "/firemni-ucet/firmy/[companyId]/nabidky/[listingsId]/nabidky/[variantId]/upravit",
      },
  },
});

export type Routes = {
  [K in keyof typeof routing.pathnames]: K extends `${string}[${string}`
    ? never
    : K;
}[keyof typeof routing.pathnames];
