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

const toItem = <T extends { id: string; name: string }>(v: string | T) =>
  typeof v === "string" ? { id: v, name: "" } : { id: v.id, name: v.name };

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
    audience: (d.audience ?? []) as EntertainmentFormInputs["audience"],
    performanceDuration: d.performanceDuration ?? undefined,
    numberOfSets: d.numberOfSets ?? undefined,
    breakDuration: d.breakDuration ?? undefined,
    setupAndTeardownIncluded: d.setupAndTeardown?.included ?? false,
    setupTime: d.setupAndTeardown?.setupTime ?? undefined,
    teardownTime: d.setupAndTeardown?.teardownTime ?? undefined,
    personnel: (d.personnel ?? []).map(toItem),
    necessities: (d.necessities ?? []).map(toItem),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function page() {
  const { variantId, listingId } = useParams<{ variantId: string; listingId: string }>();
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
          listingId={listingId}
          defaultValues={venueDefaults(variant)}
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
      {blockType === "gastro" && variant && (
        <EditVariantFormGastro
          listingId={listingId}
          defaultValues={gastroDefaults(variant)}
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
      {blockType === "entertainment" && variant && (
        <EditVariantFormEntertainment
          listingId={listingId}
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
