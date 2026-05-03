import {
  CompletionGroup,
  CompletionWidget,
} from "@/app/[locale]/(user)/components/completion-widget";
import { IntlLink } from "@/app/i18n/navigation";
import { Listing } from "@roo/common";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

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

function getCompletionGroups(
  listing: Listing,
  companyId: string,
  listingId: string,
  spacesCount?: number,
): CompletionGroup[] {
  const detail = listing.details[0];
  const blockType = detail?.blockType;
  const h = (section: string) => editHref(companyId, listingId, section);
  const t = useTranslations();

  if (blockType === "venue") {
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
            filled: !!listing.eventTypes?.length,
            editHref: h("section-event-types"),
          },
          {
            label: "Typy prostor",
            filled: !!detail.placeTypes?.length,
            editHref: h("section-place-types"),
          },
          {
            label: "Prostory",
            filled: spacesCount != null && spacesCount > 0,
            editHref: {
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
              params: { companyId, listingId },
            },
          },
          {
            label: "FAQ",
            filled: !!listing.faq?.length,
            editHref: h("section-faq"),
          },
        ],
      },
      {
        label: "Fotografie",
        weight: 3,
        fields: [
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
        ],
      },
      {
        label: "Nabídka a vybavení",
        weight: 2,
        fields: [
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
            label: "Technologie",
            filled: !!listing.technologies?.length,
            editHref: h("section-technology"),
          },
        ],
      },
      {
        label: "Logistika",
        weight: 2,
        fields: [
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
          {
            label: "Pravidla",
            filled: !!listing.rules?.length,
            editHref: h("section-rules"),
          },
        ],
      },
      {
        label: "Prezentace",
        weight: 1,
        fields: [
          {
            label: "Zaměstnanci",
            filled: !!listing.employees?.length,
            editHref: h("section-employees"),
          },

          {
            label: "Reference",
            filled: !!listing.references?.length,
            editHref: h("section-references"),
          },
        ],
      },
    ];
  }

  if (blockType === "gastro") {
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
            filled: !!listing.eventTypes?.length,
            editHref: h("section-event-types"),
          },
          {
            label: "Lokalita",
            filled: !!detail.location?.region?.length,
            editHref: h("section-location"),
          },
        ],
      },
      {
        label: "Fotografie",
        weight: 2,
        fields: [
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
        ],
      },
      {
        label: "Nabídka",
        weight: 3,
        fields: [
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
        ],
      },
      {
        label: "Podmínky",
        weight: 2,
        fields: [
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
        ],
      },
      {
        label: "Prezentace",
        weight: 1,
        fields: [
          {
            label: "Zaměstnanci",
            filled: !!listing.employees?.length,
            editHref: h("section-employees"),
          },
          {
            label: "FAQ",
            filled: !!listing.faq?.length,
            editHref: h("section-faq"),
          },
          {
            label: "Reference",
            filled: !!listing.references?.length,
            editHref: h("section-references"),
          },
        ],
      },
    ];
  }

  if (blockType === "entertainment") {
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
            filled: !!listing.eventTypes?.length,
            editHref: h("section-event-types"),
          },
          {
            label: "Lokalita",
            filled: !!detail.location?.region?.length,
            editHref: h("section-location"),
          },
        ],
      },
      {
        label: "Fotografie",
        weight: 2,
        fields: [
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
        ],
      },
      {
        label: "Vystoupení",
        weight: 3,
        fields: [
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
        ],
      },
      {
        label: "Prezentace",
        weight: 1,
        fields: [
          {
            label: "Zaměstnanci",
            filled: !!listing.employees?.length,
            editHref: h("section-employees"),
          },
          {
            label: "FAQ",
            filled: !!listing.faq?.length,
            editHref: h("section-faq"),
          },
          {
            label: "Reference",
            filled: !!listing.references?.length,
            editHref: h("section-references"),
          },
        ],
      },
    ];
  }

  // fallback — flat group
  return [
    {
      label: "Profil",
      weight: 1,
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
        {
          label: "FAQ",
          filled: !!listing.faq?.length,
          editHref: h("section-faq"),
        },
        {
          label: "Reference",
          filled: !!listing.references?.length,
          editHref: h("section-references"),
        },
      ],
    },
  ];
}

type Props = {
  listing: Listing;
  companyId: string;
  listingId: string;
  spacesCount: number;
};

export function ListingCompletion({
  listing,
  companyId,
  listingId,
  spacesCount,
}: Props) {
  const groups = getCompletionGroups(
    listing,
    companyId,
    listingId,
    spacesCount,
  );
  return <CompletionWidget groups={groups} title="Dokončení služby" />;
}
