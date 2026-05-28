import {
  CompletionGroup,
  CompletionWidget,
} from "@/app/[locale]/(user)/components/completion-widget";
import { IntlLink } from "@/app/i18n/navigation";
import {
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
} from "@roo/common";

const EDIT_PATH =
  "/company-profile/companies/[companyId]/listings/[listingId]/edit" as const;

function editHref(
  companyId: string,
  listingId: string,
  section: string,
): IntlLink {
  return {
    pathname: EDIT_PATH,
    params: { companyId, listingId },
    query: { section },
  };
}

function isLocationFilled(location: Listing["location"]): boolean {
  return !!(
    location.regions?.length ||
    location.cities?.length ||
    location.address
  );
}

function getVenueGroups(
  listing: Listing,
  detail: ListingVenueDetail,
  companyId: string,
  listingId: string,
  spacesCount?: number,
  variantsCount?: number,
): CompletionGroup[] {
  const h = (section: string) => editHref(companyId, listingId, section);
  const variantsHref: IntlLink = {
    pathname:
      "/company-profile/companies/[companyId]/listings/[listingId]/variants",
    params: { companyId, listingId },
  };

  return [
    {
      label: "Základní informace",
      weight: 4,
      fields: [
        {
          label: "Krátký popis",
          filled: !!listing.shortDescription,
          editHref: h("section-basic"),
        },
        {
          label: "Popis",
          filled: !!listing.description,
          editHref: h("section-basic"),
        },
        {
          label: "Typy akcí",
          filled: !!listing.properties.eventTypes?.length,
          editHref: h("section-event-types"),
        },
        {
          label: "Typy prostor",
          filled: !!listing.properties.placeTypes?.length,
          editHref: h("section-place-types"),
        },
        {
          label: "Prostory",
          filled: spacesCount != null && spacesCount > 0,
          relevant: spacesCount == null || spacesCount > 0,
          editHref: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
            params: { companyId, listingId },
          },
        },
        {
          label: "Varianty",
          filled: variantsCount != null && variantsCount > 0,
          relevant: variantsCount == null || variantsCount > 0,
          editHref: variantsHref,
        },
      ],
    },
    {
      label: "Fotografie",
      weight: 3,
      fields: [
        {
          label: "Logo",
          filled: !!listing.images.logo?.filename,
          editHref: h("section-images"),
        },
        {
          label: "Galerie",
          filled: !!listing.images.gallery?.length,
          editHref: h("section-images"),
        },
      ],
    },
    {
      label: "Podmínky",
      weight: 2,
      fields: [
        {
          label: "Parkování",
          filled: detail.parking?.hasParking != null,
          editHref: h("section-parking"),
        },
        {
          label: "Pravidla",
          filled: !!listing.properties.venueRules?.length,
          editHref: h("section-rules"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        {
          label: "Zaměstnanci",
          filled: !!detail.employees?.length,
          editHref: h("section-employees"),
        },
        {
          label: "FAQ",
          filled: !!detail.faq?.length,
          editHref: h("section-faq"),
        },
      ],
    },
    {
      label: "Aktivity a vybavení",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Aktivity",
          filled: !!listing.properties.activities?.length,
          editHref: h("section-activities"),
        },
        {
          label: "Služby",
          filled: !!listing.properties.services?.length,
          editHref: h("section-services"),
        },
        {
          label: "Vybavení",
          filled: !!listing.properties.amenities?.length,
          editHref: h("section-amenities"),
        },
        {
          label: "Technologie",
          filled: !!listing.properties.technologies?.length,
          editHref: h("section-technology"),
        },
      ],
    },
    {
      label: "Logistika",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Přístup a zásobování",
          filled: !!detail.access?.vehicleTypes?.length,
          editHref: h("section-access"),
        },
        {
          label: "Sklad",
          filled: !!detail.storage?.length,
          editHref: h("section-storage"),
          relevant:
            !!detail.storage?.length || detail.canBeBookedAsWhole === true,
        },
        {
          label: "Snídaně",
          filled: detail.breakfast?.included != null,
          editHref: h("section-breakfast"),
          relevant: detail.hasAccommodation === true,
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Personál",
          filled: !!listing.properties.personnel?.length,
          editHref: h("section-personnel"),
        },

        {
          label: "Reference",
          filled: !!detail.references?.length,
          editHref: h("section-references"),
        },
      ],
    },
  ];
}

function getGastroGroups(
  listing: Listing,
  detail: ListingGastroDetail,
  companyId: string,
  listingId: string,
  variantsCount?: number,
): CompletionGroup[] {
  const h = (section: string) => editHref(companyId, listingId, section);
  const variantsHref: IntlLink = {
    pathname:
      "/company-profile/companies/[companyId]/listings/[listingId]/variants",
    params: { companyId, listingId },
  };

  return [
    {
      label: "Základní informace",
      weight: 4,
      fields: [
        {
          label: "Krátký popis",
          filled: !!listing.shortDescription,
          editHref: h("section-basic"),
        },
        {
          label: "Popis",
          filled: !!listing.description,
          editHref: h("section-basic"),
        },
        {
          label: "Typy akcí",
          filled: !!listing.properties.eventTypes?.length,
          editHref: h("section-event-types"),
        },
        {
          label: "Lokalita",
          filled: isLocationFilled(listing.location),
          editHref: h("section-location"),
        },
        {
          label: "Varianty",
          filled: variantsCount != null && variantsCount > 0,
          relevant: variantsCount == null || variantsCount > 0,
          editHref: variantsHref,
        },
      ],
    },
    {
      label: "Fotografie",
      weight: 2,
      fields: [
        {
          label: "Galerie",
          filled: !!listing.images.gallery?.length,
          editHref: h("section-images"),
        },
      ],
    },
    {
      label: "Nabídka",
      weight: 3,
      fields: [
        {
          label: "Kuchyně",
          filled: !!listing.properties.cuisines?.length,
          editHref: h("section-cuisines"),
        },
        {
          label: "Alkohol",
          filled: detail.hasAlcoholLicense != null,
          editHref: h("section-extras"),
        },
        {
          label: "Dětské menu",
          filled: detail.kidsMenu != null,
          editHref: h("section-extras"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        {
          label: "Zaměstnanci",
          filled: !!detail.employees?.length,
          editHref: h("section-employees"),
        },
        {
          label: "FAQ",
          filled: !!detail.faq?.length,
          editHref: h("section-faq"),
        },
      ],
    },
    {
      label: "Detaily nabídky",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Typy jídel",
          filled: !!listing.properties.dishTypes?.length,
          editHref: h("section-offer"),
        },
        {
          label: "Diety",
          filled: !!listing.properties.dietaryOptions?.length,
          editHref: h("section-offer"),
        },
        {
          label: "Styl podávání",
          filled: !!listing.properties.foodServiceStyles?.length,
          editHref: h("section-offer"),
        },
      ],
    },
    {
      label: "Podmínky",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Personál",
          filled: !!listing.properties.personnel?.length,
          editHref: h("section-personnel"),
        },
        {
          label: "Potřeby",
          filled: !!listing.properties.necessities?.length,
          editHref: h("section-necessities"),
        },
        {
          label: "Pravidla pro jídlo a pití",
          filled: !!listing.properties.gastroRules?.length,
          editHref: h("section-food-and-drink-rules"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Logo",
          filled: !!listing.images.logo?.filename,
          editHref: h("section-images"),
        },
        {
          label: "Reference",
          filled: !!detail.references?.length,
          editHref: h("section-references"),
        },
      ],
    },
  ];
}

function getEntertainmentGroups(
  listing: Listing,
  detail: ListingEntertainmentDetail,
  companyId: string,
  listingId: string,
  variantsCount?: number,
): CompletionGroup[] {
  const h = (section: string) => editHref(companyId, listingId, section);
  const variantsHref: IntlLink = {
    pathname:
      "/company-profile/companies/[companyId]/listings/[listingId]/variants",
    params: { companyId, listingId },
  };

  return [
    {
      label: "Základní informace",
      weight: 4,
      fields: [
        {
          label: "Krátký popis",
          filled: !!listing.shortDescription,
          editHref: h("section-basic"),
        },
        {
          label: "Popis",
          filled: !!listing.description,
          editHref: h("section-basic"),
        },
        {
          label: "Typy akcí",
          filled: !!listing.properties.eventTypes?.length,
          editHref: h("section-event-types"),
        },
        {
          label: "Lokalita",
          filled: isLocationFilled(listing.location),
          editHref: h("section-location"),
        },
        {
          label: "Varianty",
          filled: variantsCount != null && variantsCount > 0,
          relevant: variantsCount == null || variantsCount > 0,
          editHref: variantsHref,
        },
      ],
    },
    {
      label: "Fotografie",
      weight: 2,
      fields: [
        {
          label: "Galerie",
          filled: !!listing.images.gallery?.length,
          editHref: h("section-images"),
        },
      ],
    },
    {
      label: "Vystoupení",
      weight: 3,
      fields: [
        {
          label: "Typy zábavy",
          filled: !!listing.properties.entertainmentTypes?.length,
          editHref: h("section-entertainment-types"),
        },
        {
          label: "Cílová skupina",
          filled: !!detail.audience?.length,
          editHref: h("section-audience"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        {
          label: "Zaměstnanci",
          filled: !!detail.employees?.length,
          editHref: h("section-employees"),
        },
        {
          label: "FAQ",
          filled: !!detail.faq?.length,
          editHref: h("section-faq"),
        },
      ],
    },
    {
      label: "Logistika a podmínky",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Logistika",
          filled: detail.setupAndTearDownRules?.setupTime != null,
          editHref: h("section-logistics"),
        },
        {
          label: "Personál",
          filled: !!listing.properties.personnel?.length,
          editHref: h("section-personnel"),
        },
        {
          label: "Potřeby",
          filled: !!listing.properties.necessities?.length,
          editHref: h("section-necessities"),
        },
        {
          label: "Pravidla",
          filled: !!listing.properties.entertainmentRules?.length,
          editHref: h("section-rules"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 0,
      bonus: true,
      fields: [
        {
          label: "Logo",
          filled: !!listing.images.logo?.filename,
          editHref: h("section-images"),
        },
        {
          label: "Reference",
          filled: !!detail.references?.length,
          editHref: h("section-references"),
        },
      ],
    },
  ];
}

type Props = {
  listing: Listing;
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail;
  companyId: string;
  listingId: string;
  spacesCount?: number;
  variantsCount?: number;
};

export function ListingCompletion({
  listing,
  detail,
  companyId,
  listingId,
  spacesCount,
  variantsCount,
}: Props) {
  let groups: CompletionGroup[] | null = null;

  if (listing.type === "venue" && detail.type === "venue") {
    groups = getVenueGroups(listing, detail, companyId, listingId, spacesCount, variantsCount);
  } else if (listing.type === "gastro" && detail.type === "gastro") {
    groups = getGastroGroups(listing, detail, companyId, listingId, variantsCount);
  } else if (
    listing.type === "entertainment" &&
    detail.type === "entertainment"
  ) {
    groups = getEntertainmentGroups(listing, detail, companyId, listingId, variantsCount);
  }

  if (!groups) {
    return null;
  }

  return <CompletionWidget groups={groups} title="Dokončení služby" />;
}
