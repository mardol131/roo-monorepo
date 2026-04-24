"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import { useVariant } from "@/app/react-query/variants/hooks";
import { Variant } from "@roo/common";
import { useParams } from "next/navigation";
import EditVariantFormEntertainment, {
  EntertainmentFormInputs,
} from "./components/edit-variant-form-entertainment";
import EditVariantFormGastro, {
  GastroFormInputs,
} from "./components/edit-variant-form-gastro";
import EditVariantFormVenue, {
  VenueFormInputs,
} from "./components/edit-variant-form-venue";

// ── Helpers ───────────────────────────────────────────────────────────────────

const id = (item: string | { id: string }) =>
  typeof item === "string" ? item : item.id;

function commonDefaults(v: Variant) {
  return {
    name: v.name,
    shortDescription: v.shortDescription,
    description: v.description ?? undefined,
    type: v.type,
    availability: v.availability,
    selectedHours: (v.selectedHours ?? []).map(({ from, to }) => ({ from, to })),
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
      mainImage: v.images.mainImage,
      gallery: (v.images.gallery ?? [])
        .map(({ image }) => image ?? "")
        .filter(Boolean),
    },
    eventTypes: (v.eventTypes ?? []).map(id),
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
    includedSpaces: (d.includedSpaces ?? []).map(id),
    amenities: (d.amenities ?? []).map(id),
    technology: (d.technology ?? []).map(id),
    services: (d.services ?? []).map(id),
    activities: (d.activities ?? []).map(id),
    personnel: (d.personnel ?? []).map(id),
    hasParking: !!d.parking,
    parkingIncluded: d.parking?.included ?? false,
    parkingSpots: d.parking?.spots ?? undefined,
    hasAccommodation: !!d.accommodation,
    accommodationIncluded: d.accommodation?.included ?? false,
    accommodationCapacity: d.accommodation?.capacity ?? undefined,
    hasBreakfast: !!d.breakfast,
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
    cuisines: (d.cuisines ?? []).map(id),
    dishTypes: (d.dishTypes ?? []).map(id),
    dietaryOptions: (d.dietaryOptions ?? []).map(id),
    foodServiceStyle: (d.foodServiceStyle ?? []).map(id),
    kidsMenu: d.kidsMenu ?? false,
    alcoholIncluded: d.alcoholIncluded ?? false,
    personnel: (d.personnel ?? []).map(id),
    necessities: (d.necessities ?? []).map(id),
  };
}

function entertainmentDefaults(v: Variant): Partial<EntertainmentFormInputs> {
  const d = v.details[0];
  if (d.blockType !== "entertainment") return {};
  return {
    ...commonDefaults(v),
    capacity: { max: d.capacity.max, min: d.capacity.min ?? undefined },
    audience: (d.audience ?? []) as EntertainmentFormInputs["audience"],
    performanceDuration: d.performanceDuration ?? undefined,
    numberOfSets: d.numberOfSets ?? undefined,
    breakDuration: d.breakDuration ?? undefined,
    setupAndTeardownIncluded: d.setupAndTeardown?.included ?? false,
    setupTime: d.setupAndTeardown?.setupTime ?? undefined,
    teardownTime: d.setupAndTeardown?.teardownTime ?? undefined,
    personnel: (d.personnel ?? []).map(id),
    necessities: (d.necessities ?? []).map(id),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function page() {
  const { variantId } = useParams<{ variantId: string }>();
  const { data: variant } = useVariant(variantId);
  const router = useRouter();

  const blockType = variant?.details[0]?.blockType;

  return (
    <main className="w-full">
      <PageHeading
        heading="Upravit variantu"
        description="Zde můžete upravit základní informace o vaší variantě, jako jsou popis, cena nebo dostupnost."
      />

      {blockType === "venue" && variant && (
        <EditVariantFormVenue
          defaultValues={venueDefaults(variant)}
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
      {blockType === "gastro" && variant && (
        <EditVariantFormGastro
          defaultValues={gastroDefaults(variant)}
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
      {blockType === "entertainment" && variant && (
        <EditVariantFormEntertainment
          defaultValues={entertainmentDefaults(variant)}
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
    </main>
  );
}
