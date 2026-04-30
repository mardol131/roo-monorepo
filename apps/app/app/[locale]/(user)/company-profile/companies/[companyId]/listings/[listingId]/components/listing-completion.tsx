import {
  CompletionField,
  CompletionWidget,
} from "@/app/[locale]/(user)/components/completion-widget";
import { IntlLink } from "@/app/i18n/navigation";
import { Listing } from "@roo/common";

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

function getCompletionFields(
  listing: Listing,
  companyId: string,
  listingId: string,
): CompletionField[] {
  const detail = listing.details[0];
  const blockType = detail?.blockType;
  const h = (section: string) => editHref(companyId, listingId, section);

  const common: CompletionField[] = [
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
      label: "Logo",
      filled: !!listing.images.logo,
      editHref: h("section-images"),
    },
    {
      label: "Galerie",
      filled: !!listing.images.gallery?.length,
      editHref: h("section-images"),
    },
    {
      label: "Typy akcí",
      filled: !!listing.eventTypes?.length,
      editHref: h("section-event-types"),
    },
    {
      label: "Zaměstnanci",
      filled: !!listing.employees?.length,
      editHref: h("section-employees"),
    },
    { label: "FAQ", filled: !!listing.faq?.length, editHref: h("section-faq") },
    {
      label: "Reference",
      filled: !!listing.references?.length,
      editHref: h("section-references"),
    },
  ];

  if (blockType === "venue") {
    return [
      ...common,
      {
        label: "Pravidla",
        filled: !!listing.rules?.length,
        editHref: h("section-rules"),
      },
      {
        label: "Technologie",
        filled: !!listing.technologies?.length,
        editHref: h("section-technology"),
      },
      {
        label: "Typy prostor",
        filled: !!detail.placeTypes?.length,
        editHref: h("section-place-types"),
      },
      {
        label: "Aktivity",
        filled: !!detail.activities?.length,
        editHref: h("section-activities"),
      },
      {
        label: "Služby",
        filled: !!detail.services?.length,
        editHref: h("section-services"),
      },
      {
        label: "Personál",
        filled: !!detail.personnel?.length,
        editHref: h("section-personnel"),
      },
      {
        label: "Vybavení",
        filled: !!detail.amenities?.length,
        editHref: h("section-amenities"),
      },
      {
        label: "Sklad",
        filled: !!detail.storage?.length,
        editHref: h("section-storage"),
        relevant:
          !!detail.storage?.length || detail.canBeBookedAsWhole === true,
      },
      {
        label: "Přístup a zásobování",
        filled: !!detail.access?.vehicleTypes?.length,
        editHref: h("section-access"),
      },
      {
        label: "Parkování",
        filled: detail.parking?.hasParking != null,
        editHref: h("section-parking"),
      },
      {
        label: "Snídaně",
        filled: detail.breakfast?.included != null,
        editHref: h("section-breakfast"),
        relevant: detail.hasAccommodation === true,
      },
    ];
  }

  if (blockType === "gastro") {
    return [
      ...common,
      {
        label: "Lokalita",
        filled: !!detail.location?.region?.length,
        editHref: h("section-location"),
      },
      {
        label: "Kuchyně",
        filled: !!detail.cuisines?.length,
        editHref: h("section-cuisines"),
      },
      {
        label: "Typy jídel",
        filled: !!detail.dishTypes?.length,
        editHref: h("section-offer"),
      },
      {
        label: "Diety",
        filled: !!detail.dietaryOptions?.length,
        editHref: h("section-offer"),
      },
      {
        label: "Styl podávání",
        filled: !!detail.foodServiceStyles?.length,
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
      {
        label: "Personál",
        filled: !!detail.personnel?.length,
        editHref: h("section-personnel"),
      },
      {
        label: "Potřeby",
        filled: !!detail.necessities?.length,
        editHref: h("section-necessities"),
      },
      {
        label: "Pravidla",
        filled: !!detail.foodAndDrinkRules?.length,
        editHref: h("section-rules"),
      },
    ];
  }

  if (blockType === "entertainment") {
    return [
      ...common,
      {
        label: "Lokalita",
        filled: !!detail.location?.region?.length,
        editHref: h("section-location"),
      },
      {
        label: "Typy zábavy",
        filled: !!detail.entertainmentTypes?.length,
        editHref: h("section-entertainment-types"),
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
      {
        label: "Personál",
        filled: !!detail.personnel?.length,
        editHref: h("section-personnel"),
      },
      {
        label: "Potřeby",
        filled: !!detail.necessities?.length,
        editHref: h("section-necessities"),
      },
      {
        label: "Pravidla",
        filled: !!detail.rules?.length,
        editHref: h("section-rules"),
      },
    ];
  }

  return common;
}

type Props = {
  listing: Listing;
  companyId: string;
  listingId: string;
};

export function ListingCompletion({ listing, companyId, listingId }: Props) {
  const fields = getCompletionFields(listing, companyId, listingId);
  return <CompletionWidget fields={fields} title="Dokončení služby" />;
}
