import { defineRouting } from "next-intl/routing";
import { getPathname, Link } from "./navigation";
import { ComponentProps } from "react";

export const routing = defineRouting({
  locales: ["cs"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
  pathnames: {
    "/homepage": { cs: "/" },
    "/login-required": { cs: "/prihlaseni" },
    "/catalog": { cs: "/katalog" },
    "/catalog/[type]": { cs: "/katalog/[type]" },
    "/listing/[listingId]": { cs: "/inzerat/[listingId]" },
    "/listing/[listingId]/inquiry": { cs: "/inzerat/[listingId]/poptavka" },

    // authorization
    "/login": { cs: "/prihlaseni" },
    "/register": { cs: "/registrace" },
    "/register-company": { cs: "/registrace-firemniho-uctu" },
    "/password-reset": { cs: "/obnoveni-hesla" },

    // user profile
    "/user-profile": { cs: "/ucet" },
    "/user-profile/events/new": { cs: "/ucet/moje-udalosti/nova-udalost" },
    "/user-profile/events": { cs: "/ucet/moje-udalosti" },
    "/user-profile/events/[eventId]": {
      cs: "/ucet/moje-udalosti/[eventId]",
    },
    "/user-profile/events/[eventId]/[inquiryId]": {
      cs: "/ucet/moje-udalosti/[eventId]/[inquiryId]",
    },
    "/user-profile/inquiries": { cs: "/ucet/poptavky" },
    "/user-profile/messages": { cs: "/ucet/zpravy" },
    "/user-profile/favourites": { cs: "/ucet/oblibene" },
    "/user-profile/profile-settings": { cs: "/ucet/nastaveni" },

    // company profile
    "/company-profile": { cs: "/firemni-ucet" },
    "/company-profile/companies": { cs: "/firemni-ucet/firmy" },
    "/company-profile/companies/new": {
      cs: "/firemni-ucet/firmy/nova-firma",
    },
    "/company-profile/profile-settings": { cs: "/firemni-ucet/nastaveni" },

    // company detail
    //// legal, company data
    "/company-profile/companies/[companyId]": {
      cs: "/firemni-ucet/firmy/[companyId]",
    },
    "/company-profile/companies/[companyId]/edit": {
      cs: "/firemni-ucet/firmy/[companyId]/upravit",
    },

    // company listing profile
    //// service that company offers - gastro|place|entertainment
    //// can be more than one
    "/company-profile/companies/[companyId]/listings": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby",
    },
    "/company-profile/companies/[companyId]/listings/new": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/nova-sluzba",
    },

    // company listing detail
    //// listings are shown in catalog as separate cards
    //// each listing has its own page
    "/company-profile/companies/[companyId]/listings/[listingId]": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/edit": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/upravit",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/spaces": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/prostory",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/spaces/[spaceId]":
      {
        cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/prostory/[spaceId]",
      },
    "/company-profile/companies/[companyId]/listings/[listingId]/spaces/new": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/prostory/novy-prostor",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/calendar": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/kalendar",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/messages": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/zpravy",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/inquiries": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/poptavky",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]":
      {
        cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/poptavky/[inquiryId]",
      },

    // company listings variant
    //// variant are premade versions of listings
    //// all are shown under listing page
    "/company-profile/companies/[companyId]/listings/[listingId]/variants": {
      cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/varianty",
    },
    "/company-profile/companies/[companyId]/listings/[listingId]/variants/new":
      {
        cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/varianty/nova-varianta",
      },
    "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]":
      {
        cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/varianty/[variantId]",
      },
    "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/edit":
      {
        cs: "/firemni-ucet/firmy/[companyId]/sluzby/[listingId]/varianty/[variantId]/upravit",
      },
  },
});

export type Routes = {
  [K in keyof typeof routing.pathnames]: K extends `${string}[${string}`
    ? never
    : K;
}[keyof typeof routing.pathnames];
