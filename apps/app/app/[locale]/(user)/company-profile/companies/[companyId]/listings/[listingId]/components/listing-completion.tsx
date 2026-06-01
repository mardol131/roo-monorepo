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
  const spacesHref: IntlLink = {
    pathname:
      "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
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
          filled: !!listing.filters.eventTypes?.length,
          editHref: h("section-event-types"),
        },
        {
          label: "Lokalita",
          filled: !!listing.location.address,
          editHref: h("section-location"),
        },
        {
          label: "Prostory",
          filled: spacesCount != null && spacesCount > 0,
          relevant: spacesCount == null || spacesCount > 0,
          editHref: spacesHref,
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
      label: "Kapacita a prostor",
      weight: 2,
      fields: [
        {
          label: "Typ místa",
          filled: !!listing.filters.placeTypes?.length,
          editHref: h("section-place-types"),
        },
      ],
    },
    {
      label: "Nabídka",
      weight: 2,
      fields: [
        {
          label: "Aktivity",
          filled: !!listing.options.activities?.length,
          editHref: h("section-activities"),
        },
        {
          label: "Služby",
          filled: !!listing.options.services?.length,
          editHref: h("section-services"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        {
          label: "FAQ",
          filled: !!detail.faq?.length,
          editHref: h("section-faq"),
        },
        {
          label: "Zaměstnanci",
          filled: !!detail.employees?.length,
          editHref: h("section-employees"),
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
          label: "Typ stravování",
          filled: !!listing.subType,
          editHref: h("section-basic"),
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
      label: "Nabídka",
      weight: 3,
      fields: [
        {
          label: "Kuchyně",
          filled: !!listing.options.cuisines?.length,
          editHref: h("section-cuisines"),
        },
        {
          label: "Typy jídel",
          filled: !!listing.options.dishTypes?.length,
          editHref: h("section-offer"),
        },
        {
          label: "Diety",
          filled: !!listing.filters.dietaryOptions?.length,
          editHref: h("section-offer"),
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
          label: "FAQ",
          filled: !!detail.faq?.length,
          editHref: h("section-faq"),
        },
        {
          label: "Zaměstnanci",
          filled: !!detail.employees?.length,
          editHref: h("section-employees"),
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
          label: "Typ zábavy",
          filled: !!listing.subType,
          editHref: h("section-basic"),
        },
        {
          label: "Typy akcí",
          filled: !!listing.filters.eventTypes?.length,
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
      label: "Vystoupení",
      weight: 3,
      fields: [
        {
          label: "Kapacita",
          filled: listing.guests?.max != null,
          editHref: h("section-capacity"),
        },
        {
          label: "Cílová skupina",
          filled: !!detail.audience?.length,
          editHref: h("section-audience"),
        },
        {
          label: "Logistika",
          filled: detail.setupAndTearDownRules?.setupTime != null,
          editHref: h("section-logistics"),
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        {
          label: "FAQ",
          filled: !!detail.faq?.length,
          editHref: h("section-faq"),
        },
        {
          label: "Zaměstnanci",
          filled: !!detail.employees?.length,
          editHref: h("section-employees"),
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
    groups = getVenueGroups(
      listing,
      detail,
      companyId,
      listingId,
      spacesCount,
      variantsCount,
    );
  } else if (listing.type === "gastro" && detail.type === "gastro") {
    groups = getGastroGroups(
      listing,
      detail,
      companyId,
      listingId,
      variantsCount,
    );
  } else if (
    listing.type === "entertainment" &&
    detail.type === "entertainment"
  ) {
    groups = getEntertainmentGroups(
      listing,
      detail,
      companyId,
      listingId,
      variantsCount,
    );
  }

  if (!groups) {
    return null;
  }

  return <CompletionWidget groups={groups} title="Dokončení služby" />;
}
