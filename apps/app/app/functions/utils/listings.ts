import { CompletionFullResult } from "@/app/[locale]/(user)/components/completion-widget";
import {
  Company,
  CompanyMemberRoles,
  getIdFromRelationshipField,
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
} from "@roo/common";

/**
 * Role, které lze předat do hasListingRights.
 * 'owner' je pozice nad member rolemi — má vždy plný přístup.
 */
export type ListingRoleCheck = CompanyMemberRoles | "owner";

/**
 * Vrací true, pokud userId odpovídá některé z allowedRoles v kontextu dané firmy.
 *
 * Použití:
 *   hasListingRights(company, userId, ["owner", "admin", "manager"])  → může tvořit / mazat
 *   hasListingRights(company, userId, ["owner", "admin", "manager", "editor"])  → může editovat
 *   hasListingRights(company, userId, ["owner", "admin"])  → může editovat firmu samotnou
 *   hasListingRights(company, userId, ["editor"])  → je to konkrétně editor (schovej tlačítko)
 */
export function hasListingRights({
  allowedRoles,
  company,
  userId,
}: {
  allowedRoles: ListingRoleCheck[];
  company?: Company;
  userId?: string;
}): boolean {
  if (!userId || !company) return false;

  if (allowedRoles.includes("owner")) {
    const ownerId = getIdFromRelationshipField(company.owner);
    if (ownerId === userId) return true;
  }

  const memberRoles = allowedRoles.filter(
    (r): r is CompanyMemberRoles => r !== "owner",
  );

  if (!memberRoles.length) return false;

  return (
    company.members?.some((member) => {
      const memberId = getIdFromRelationshipField(member.user);
      return (
        memberId === userId &&
        memberRoles.includes(member.role as CompanyMemberRoles)
      );
    }) ?? false
  );
}

type CompletionField = { label: string; filled: boolean; relevant?: boolean };
type CompletionGroup = {
  label: string;
  weight: number;
  fields: CompletionField[];
};

function getVenueGroups(
  listing: Listing,
  detail: ListingVenueDetail,
  spacesCount?: number,
  variantsCount?: number,
): CompletionGroup[] {
  return [
    {
      label: "Základní informace",
      weight: 4,
      fields: [
        { label: "Krátký popis", filled: !!listing.shortDescription },
        { label: "Popis", filled: !!listing.description },
        { label: "Lokalita", filled: !!listing.location.address },
        {
          label: "Prostory",
          filled: spacesCount != null && spacesCount > 0,
        },
        {
          label: "Varianty",
          filled: variantsCount != null && variantsCount > 0,
        },
      ],
    },
    {
      label: "Fotografie",
      weight: 3,
      fields: [
        { label: "Logo", filled: !!listing.images.logo?.filename },
        { label: "Galerie", filled: !!listing.images.gallery?.length },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        { label: "Reference", filled: !!detail.references?.length },
        { label: "FAQ", filled: !!detail.faq?.length },
        { label: "Zaměstnanci", filled: !!detail.employees?.length },
        { label: "Vlastní sekce", filled: !!detail.customSections?.length },
      ],
    },
  ];
}

function getGastroGroups(
  listing: Listing,
  detail: ListingGastroDetail,
  variantsCount?: number,
): CompletionGroup[] {
  return [
    {
      label: "Základní informace",
      weight: 4,
      fields: [
        { label: "Krátký popis", filled: !!listing.shortDescription },
        { label: "Popis", filled: !!listing.description },
        { label: "Typ stravování", filled: !!listing.subType },
        {
          label: "Varianty",
          filled: variantsCount != null && variantsCount > 0,
        },
      ],
    },
    {
      label: "Fotografie",
      weight: 2,
      fields: [
        { label: "Logo", filled: !!listing.images.logo?.filename },
        { label: "Galerie", filled: !!listing.images.gallery?.length },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        { label: "Reference", filled: !!detail.references?.length },
        { label: "FAQ", filled: !!detail.faq?.length },
        { label: "Zaměstnanci", filled: !!detail.employees?.length },
        { label: "Vlastní sekce", filled: !!detail.customSections?.length },
      ],
    },
  ];
}

function getEntertainmentGroups(
  listing: Listing,
  detail: ListingEntertainmentDetail,
  variantsCount?: number,
): CompletionGroup[] {
  return [
    {
      label: "Základní informace",
      weight: 4,
      fields: [
        { label: "Krátký popis", filled: !!listing.shortDescription },
        { label: "Popis", filled: !!listing.description },
        { label: "Typ zábavy", filled: !!listing.subType },
        {
          label: "Varianty",
          filled: variantsCount != null && variantsCount > 0,
        },
      ],
    },
    {
      label: "Fotografie",
      weight: 2,
      fields: [
        { label: "Logo", filled: !!listing.images.logo?.filename },
        { label: "Galerie", filled: !!listing.images.gallery?.length },
      ],
    },
    {
      label: "Vystoupení",
      weight: 3,
      fields: [
        { label: "Kapacita", filled: listing.guests?.max != null },
        { label: "Cílová skupina", filled: !!detail.audience?.length },
        {
          label: "Logistika",
          filled: detail.setupAndTearDown?.setupTime != null,
        },
      ],
    },
    {
      label: "Prezentace",
      weight: 3,
      fields: [
        { label: "Reference", filled: !!detail.references?.length },
        { label: "FAQ", filled: !!detail.faq?.length },
        { label: "Zaměstnanci", filled: !!detail.employees?.length },
        { label: "Vlastní sekce", filled: !!detail.customSections?.length },
      ],
    },
  ];
}

function computeFromGroups(groups: CompletionGroup[]): CompletionFullResult {
  const relevant = groups.map((g) => ({
    ...g,
    fields: g.fields.filter((f) => f.relevant !== false),
  }));

  const totalWeight = relevant.reduce((s, g) => s + g.weight, 0);
  const percentage = Math.round(
    relevant.reduce((sum, g) => {
      const filled = g.fields.filter((f) => f.filled).length;
      if (g.fields.length === 0) return sum;
      return sum + (filled / g.fields.length) * (g.weight / totalWeight) * 100;
    }, 0),
  );

  const fieldsToComplete = relevant
    .flatMap((g) => g.fields)
    .filter((f) => !f.filled)
    .map(({ label }) => ({ label }));

  return { percentage, fieldsToComplete };
}

export function getListingCompletion(listing: Listing): number {
  const value = listing.detail?.value;
  const detail = typeof value === "string" ? null : (value ?? null);

  let groups: CompletionGroup[];
  if (listing.type === "venue" && detail?.type === "venue") {
    groups = getVenueGroups(listing, detail);
  } else if (listing.type === "gastro" && detail?.type === "gastro") {
    groups = getGastroGroups(listing, detail);
  } else if (
    listing.type === "entertainment" &&
    detail?.type === "entertainment"
  ) {
    groups = getEntertainmentGroups(listing, detail);
  } else {
    return 0;
  }

  return computeFromGroups(groups).percentage;
}

export function getFullListingCompletion(
  listing: Listing,
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail,
  spacesCount?: number,
  variantsCount?: number,
): CompletionFullResult {
  let groups: CompletionGroup[];
  if (detail.type === "venue") {
    groups = getVenueGroups(listing, detail, spacesCount, variantsCount);
  } else if (detail.type === "gastro") {
    groups = getGastroGroups(listing, detail, variantsCount);
  } else {
    groups = getEntertainmentGroups(listing, detail, variantsCount);
  }

  return computeFromGroups(groups);
}
