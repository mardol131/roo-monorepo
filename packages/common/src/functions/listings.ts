import {
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
} from "../types/payload-types";

type CompletionField = {
  filled: boolean;
  relevant?: boolean;
};

type CompletionGroup = {
  weight: number;
  fields: CompletionField[];
};

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
  spacesCount?: number,
): CompletionGroup[] {
  return [
    {
      weight: 4,
      fields: [
        { filled: !!listing.shortDescription },
        { filled: !!listing.description },
        { filled: !!listing.properties.eventTypes?.length },
        { filled: !!listing.properties.placeTypes?.length },
        { filled: spacesCount != null && spacesCount > 0 },
        { filled: !!detail.faq?.length },
      ],
    },
    {
      weight: 3,
      fields: [
        { filled: !!listing.images.logo?.filename },
        { filled: !!listing.images.gallery?.length },
      ],
    },
    {
      weight: 2,
      fields: [
        { filled: !!listing.properties.activities?.length },
        { filled: !!listing.properties.services?.length },
        { filled: !!listing.properties.personnel?.length },
        { filled: !!listing.properties.amenities?.length },
        { filled: !!listing.properties.technologies?.length },
      ],
    },
    {
      weight: 2,
      fields: [
        { filled: !!detail.access?.vehicleTypes?.length },
        { filled: detail.parking?.hasParking != null },
        {
          filled: !!detail.storage?.length,
          relevant:
            !!detail.storage?.length || detail.canBeBookedAsWhole === true,
        },
        {
          filled: detail.breakfast?.included != null,
          relevant: detail.hasAccommodation === true,
        },
        { filled: !!listing.properties.venueRules?.length },
      ],
    },
    {
      weight: 1,
      fields: [
        { filled: !!detail.employees?.length },
        { filled: !!detail.references?.length },
      ],
    },
  ];
}

function getGastroGroups(
  listing: Listing,
  detail: ListingGastroDetail,
): CompletionGroup[] {
  return [
    {
      weight: 4,
      fields: [
        { filled: !!listing.shortDescription },
        { filled: !!listing.description },
        { filled: !!listing.properties.eventTypes?.length },
        { filled: isLocationFilled(listing.location) },
      ],
    },
    {
      weight: 2,
      fields: [
        { filled: !!listing.images.logo?.filename },
        { filled: !!listing.images.gallery?.length },
      ],
    },
    {
      weight: 3,
      fields: [
        { filled: !!listing.properties.cuisines?.length },
        { filled: !!listing.properties.dishTypes?.length },
        { filled: !!listing.properties.dietaryOptions?.length },
        { filled: !!listing.properties.foodServiceStyles?.length },
        { filled: detail.hasAlcoholLicense != null },
        { filled: detail.kidsMenu != null },
      ],
    },
    {
      weight: 2,
      fields: [
        { filled: !!listing.properties.personnel?.length },
        { filled: !!listing.properties.necessities?.length },
        { filled: !!listing.properties.gastroRules?.length },
      ],
    },
    {
      weight: 1,
      fields: [
        { filled: !!detail.employees?.length },
        { filled: !!detail.faq?.length },
        { filled: !!detail.references?.length },
      ],
    },
  ];
}

function getEntertainmentGroups(
  listing: Listing,
  detail: ListingEntertainmentDetail,
): CompletionGroup[] {
  return [
    {
      weight: 4,
      fields: [
        { filled: !!listing.shortDescription },
        { filled: !!listing.description },
        { filled: !!listing.properties.eventTypes?.length },
        { filled: isLocationFilled(listing.location) },
      ],
    },
    {
      weight: 2,
      fields: [
        { filled: !!listing.images.logo?.filename },
        { filled: !!listing.images.gallery?.length },
      ],
    },
    {
      weight: 3,
      fields: [
        { filled: !!listing.properties.entertainmentTypes?.length },
        { filled: !!detail.audience?.length },
        { filled: detail.setupAndTearDownRules?.setupTime != null },
        { filled: !!listing.properties.personnel?.length },
        { filled: !!listing.properties.necessities?.length },
        { filled: !!listing.properties.entertainmentRules?.length },
      ],
    },
    {
      weight: 1,
      fields: [
        { filled: !!detail.employees?.length },
        { filled: !!detail.faq?.length },
        { filled: !!detail.references?.length },
      ],
    },
  ];
}

function calcCompletionPercent(groups: CompletionGroup[]): number {
  const totalWeight = groups.reduce((s, g) => s + g.weight, 0);

  const relevantGroups = groups.map((g) => ({
    ...g,
    fields: g.fields.filter((f) => f.relevant !== false),
  }));

  return Math.round(
    relevantGroups.reduce((sum, g) => {
      const filled = g.fields.filter((f) => f.filled).length;
      const total = g.fields.length;
      if (total === 0) return sum;
      return sum + (filled / total) * (g.weight / totalWeight) * 100;
    }, 0),
  );
}

export function getListingCompletionPercent(
  listing: Listing,
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail,
  spacesCount?: number,
): number {
  if (listing.type === "venue" && detail.type === "venue") {
    return calcCompletionPercent(getVenueGroups(listing, detail, spacesCount));
  }
  if (listing.type === "gastro" && detail.type === "gastro") {
    return calcCompletionPercent(getGastroGroups(listing, detail));
  }
  if (listing.type === "entertainment" && detail.type === "entertainment") {
    return calcCompletionPercent(getEntertainmentGroups(listing, detail));
  }
  return 0;
}
