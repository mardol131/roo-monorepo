"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import { useUpdateVariant } from "@/app/react-query/variants/hooks";
import { useVariant } from "@/app/react-query/variants/hooks";
import { MediaSchema, Variant } from "@roo/common";
import { useParams } from "next/navigation";
import VariantFormEntertainment, {
  EntertainmentFormInputs,
} from "../../components/variant-form-entertainment";
import VariantFormGastro, {
  GastroFormInputs,
} from "../../components/variant-form-gastro";
import VariantFormVenue, {
  VenueFormInputs,
} from "../../components/variant-form-venue";
import { toIds, toItem } from "../../../../components/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

type CommonFields = {
  name: string;
  shortDescription: string;
  description?: string;
  type: "allYear" | "seasonal";
  availability: "allDay" | "selectedHours";
  selectedHours: { from: string; to: string }[];
  price: {
    generalPrice: number;
    seasonalPrices: {
      price: number;
      description?: string;
      from: string;
      to: string;
    }[];
  };
  images: { coverImage: MediaSchema; gallery: MediaSchema[] };
  eventTypes: { id: string; name: string }[];
  includes: { item: string }[];
  excludes: { item: string }[];
};

function commonPayload(_variant: Variant, data: CommonFields) {
  return {
    name: data.name,
    shortDescription: data.shortDescription,
    description: data.description ?? null,
    type: data.type,
    availability: data.availability,
    selectedHours: data.selectedHours,
    price: {
      generalPrice: data.price.generalPrice,
      seasonalPrices: data.price.seasonalPrices.map(
        ({ price, description, from, to }) => ({
          price,
          description: description ?? null,
          from,
          to,
        }),
      ),
    },
    images: data.images,
    eventTypes: toIds(data.eventTypes),
    includes: data.includes,
    excludes: data.excludes,
  };
}

function commonDefaults(v: Variant) {
  return {
    name: v.name,
    shortDescription: v.shortDescription,
    description: v.description ?? undefined,
    type: v.type,
    availability: v.availability,
    selectedHours: (v.selectedHours ?? []).map(({ from, to }) => ({
      from,
      to,
    })),
    price: {
      generalPrice: v.price.generalPrice,
      seasonalPrices: (v.price.seasonalPrices ?? []).map(
        ({ price, description, from, to }) => ({
          price,
          description: description ?? undefined,
          from,
          to,
        }),
      ),
    },
    images: {
      coverImage: v.images.coverImage,
      gallery: v.images.gallery ?? [],
    },
    eventTypes: (v.eventTypes ?? []).map(toItem),
    includes: (v.includes ?? []).map(({ item }) => ({ item: item ?? "" })),
    excludes: (v.excludes ?? []).map(({ item }) => ({ item: item ?? "" })),
  };
}

function venueDefaults(v: Variant): Partial<VenueFormInputs> {
  const d = v.details[0];
  if (d.blockType !== "venue") return {};
  return {
    ...commonDefaults(v),
    capacity: { max: d.capacity.max, min: d.capacity.min ?? undefined },
    canBeBookedAsWhole: d.canBeBookedAsWhole ?? false,
    includedSpaces: (d.includedSpaces ?? []).map(toItem),
    amenities: (d.amenities ?? []).map(toItem),
    technology: (d.technology ?? []).map(toItem),
    services: (d.services ?? []).map(toItem),
    activities: (d.activities ?? []).map(toItem),
    personnel: (d.personnel ?? []).map(toItem),
    hasParking: d.parking?.included != null || d.parking?.spots != null,
    parkingIncluded: d.parking?.included ?? false,
    parkingSpots: d.parking?.spots ?? undefined,
    hasAccommodation:
      d.accommodation?.included != null || d.accommodation?.capacity != null,
    accommodationIncluded: d.accommodation?.included ?? false,
    accommodationCapacity: d.accommodation?.capacity ?? undefined,
    hasBreakfast:
      d.breakfast?.included != null ||
      d.breakfast?.price != null ||
      d.breakfast?.loweredPrice != null,
    breakfastIncluded: d.breakfast?.included ?? false,
    breakfastPrice: d.breakfast?.price ?? undefined,
    breakfastLoweredPrice: d.breakfast?.loweredPrice ?? undefined,
  };
}

function gastroDefaults(v: Variant): Partial<GastroFormInputs> {
  const d = v.details[0];
  if (d.blockType !== "gastro") return {};
  return {
    ...commonDefaults(v),

    capacity: { max: d.capacity.max, min: d.capacity.min ?? undefined },
    pricePerPerson: d.pricePerPerson ?? undefined,
    minimumOrderCount: d.minimumOrderCount ?? undefined,
    cuisines: (d.cuisines ?? []).map(toItem),
    dishTypes: (d.dishTypes ?? []).map(toItem),
    dietaryOptions: (d.dietaryOptions ?? []).map(toItem),
    foodServiceStyle: (d.foodServiceStyle ?? []).map(toItem),
    kidsMenu: d.kidsMenu ?? false,
    alcoholIncluded: d.alcoholIncluded ?? false,
    personnel: (d.personnel ?? []).map(toItem),
    necessities: (d.necessities ?? []).map(toItem),
  };
}

function entertainmentDefaults(v: Variant): Partial<EntertainmentFormInputs> {
  const d = v.details[0];
  if (d.blockType !== "entertainment") return {};
  return {
    ...commonDefaults(v),

    capacity: { max: d.capacity.max, min: d.capacity.min ?? undefined },
    audience: d.audience ?? [],
    performanceDuration: d.performanceDuration ?? undefined,
    numberOfSets: d.numberOfSets ?? undefined,
    breakDuration: d.breakDuration ?? undefined,
    setupTime: d.setupAndTeardown?.setupTime ?? undefined,
    teardownTime: d.setupAndTeardown?.teardownTime ?? undefined,
    personnel: (d.personnel ?? []).map(toItem),
    necessities: (d.necessities ?? []).map(toItem),
  };
}

// ── Transform form → Partial<Variant> ────────────────────────────────────────

function venuePayload(
  variant: Variant,
  data: VenueFormInputs,
): Partial<Variant> {
  const d = variant.details[0];
  const detailId = d.blockType === "venue" ? d.id : undefined;
  return {
    ...commonPayload(variant, data),
    details: [
      {
        blockType: "venue",
        id: detailId ?? undefined,
        capacity: data.capacity,
        canBeBookedAsWhole: data.canBeBookedAsWhole,
        includedSpaces: toIds(data.includedSpaces ?? []),
        amenities: toIds(data.amenities ?? []),
        technology: toIds(data.technology ?? []),
        services: toIds(data.services ?? []),
        activities: toIds(data.activities ?? []),
        personnel: toIds(data.personnel ?? []),
        parking: data.hasParking
          ? { included: data.parkingIncluded, spots: data.parkingSpots ?? null }
          : {},
        accommodation: data.hasAccommodation
          ? {
              included: data.accommodationIncluded,
              capacity: data.accommodationCapacity ?? null,
            }
          : {},
        breakfast: data.hasBreakfast
          ? {
              included: data.breakfastIncluded,
              price: data.breakfastPrice ?? null,
              loweredPrice: data.breakfastLoweredPrice ?? null,
            }
          : {},
      },
    ],
  };
}

function gastroPayload(
  variant: Variant,
  data: GastroFormInputs,
): Partial<Variant> {
  const d = variant.details[0];
  const detailId = d.blockType === "gastro" ? d.id : undefined;
  return {
    ...commonPayload(variant, data),
    details: [
      {
        blockType: "gastro",
        id: detailId ?? undefined,
        capacity: data.capacity,
        pricePerPerson: data.pricePerPerson ?? null,
        minimumOrderCount: data.minimumOrderCount ?? null,
        cuisines: toIds(data.cuisines ?? []),
        dishTypes: toIds(data.dishTypes ?? []),
        dietaryOptions: toIds(data.dietaryOptions ?? []),
        foodServiceStyle: toIds(data.foodServiceStyle ?? []),
        kidsMenu: data.kidsMenu,
        alcoholIncluded: data.alcoholIncluded,
        personnel: toIds(data.personnel ?? []),
        necessities: toIds(data.necessities ?? []),
      },
    ],
  };
}

function entertainmentPayload(
  variant: Variant,
  data: EntertainmentFormInputs,
): Partial<Variant> {
  const d = variant.details[0];
  const detailId = d.blockType === "entertainment" ? d.id : undefined;
  return {
    ...commonPayload(variant, data),
    details: [
      {
        blockType: "entertainment",
        id: detailId ?? undefined,
        capacity: data.capacity,
        audience: data.audience,
        performanceDuration: data.performanceDuration ?? null,
        numberOfSets: data.numberOfSets ?? null,
        breakDuration: data.breakDuration ?? null,
        setupAndTeardown: data.setupAndTeardownIncluded
          ? {
              setupTime: data.setupTime ?? null,
              teardownTime: data.teardownTime ?? null,
            }
          : {},
        personnel: toIds(data.personnel ?? []),
        necessities: toIds(data.necessities ?? []),
      },
    ],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditVariantPage() {
  const { variantId, listingId, companyId } = useParams<{
    variantId: string;
    listingId: string;
    companyId: string;
  }>();
  const { data: variant } = useVariant(variantId);
  const router = useRouter();
  const { mutate: updateVariant } = useUpdateVariant({
    onSuccess: () =>
      router.push({
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]",
        params: { companyId, listingId, variantId },
      }),
  });

  const blockType = variant?.details[0]?.blockType;

  return (
    <main className="w-full">
      <PageHeading
        heading="Upravit variantu"
        description="Zde můžete upravit základní informace o vaší variantě, jako jsou popis, cena nebo dostupnost."
      />

      {blockType === "venue" && variant && (
        <VariantFormVenue
          listingId={listingId}
          defaultValues={venueDefaults(variant)}
          onSubmit={(data) =>
            updateVariant({ id: variantId, data: venuePayload(variant, data) })
          }
          onCancel={() => router.back()}
        />
      )}
      {blockType === "gastro" && variant && (
        <VariantFormGastro
          listingId={listingId}
          defaultValues={gastroDefaults(variant)}
          onSubmit={(data) =>
            updateVariant({ id: variantId, data: gastroPayload(variant, data) })
          }
          onCancel={() => router.back()}
        />
      )}
      {blockType === "entertainment" && variant && (
        <VariantFormEntertainment
          listingId={listingId}
          defaultValues={entertainmentDefaults(variant)}
          onSubmit={(data) =>
            updateVariant({
              id: variantId,
              data: entertainmentPayload(variant, data),
            })
          }
          onCancel={() => router.back()}
        />
      )}
    </main>
  );
}
