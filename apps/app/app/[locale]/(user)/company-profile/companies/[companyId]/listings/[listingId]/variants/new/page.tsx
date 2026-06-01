"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import {
  useCreateVariant,
  useUpdateVariant,
} from "@/app/react-query/variants/hooks";
import { useVariant } from "@/app/react-query/variants/hooks";
import { MediaSchema, Variant } from "@roo/common";
import { useParams } from "next/navigation";
import {
  toIds,
  toItem,
} from "../../../../../../../../../components/forms/listings/utils";
import VariantFormEntertainment, {
  EntertainmentFormInputs,
} from "../components/variant-form-entertainment";
import VariantFormGastro, {
  GastroFormInputs,
} from "../components/variant-form-gastro";
import VariantFormVenue, {
  VenueFormInputs,
} from "../components/variant-form-venue";
import { useCreateListing, useListing } from "@/app/react-query/listings/hooks";
import { CreateVariantPayload } from "@/app/react-query/variants/fetch";
import Loader from "@/app/[locale]/(user)/components/loader";

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

function commonPayload(data: CommonFields) {
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
// ── Transform form → Partial<Variant> ────────────────────────────────────────

function venuePayload(
  data: VenueFormInputs,
  listingId: string,
): CreateVariantPayload {
  return {
    listing: listingId,
    ...commonPayload(data),
    details: [
      {
        blockType: "venue",
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
  data: GastroFormInputs,
  listingId: string,
): CreateVariantPayload {
  return {
    listing: listingId,
    ...commonPayload(data),
    details: [
      {
        blockType: "gastro",
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
  data: EntertainmentFormInputs,
  listingId: string,
): CreateVariantPayload {
  return {
    listing: listingId,
    ...commonPayload(data),
    details: [
      {
        blockType: "entertainment",
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
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const router = useRouter();
  const { data: listing, isFetching } = useListing(listingId);
  const { mutate: createVariant } = useCreateVariant({
    onSuccess: () =>
      router.push({
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingId]/variants",
        params: { companyId, listingId },
      }),
  });

  if (isFetching || !listing) return <Loader text="Formulář se načítá" />;

  return (
    <main className="w-full">
      <PageHeading
        heading="Upravit variantu"
        description="Zde můžete upravit základní informace o vaší variantě, jako jsou popis, cena nebo dostupnost."
      />

      {listing.type === "venue" && listing && (
        <VariantFormVenue
          listingId={listingId}
          onSubmit={(data) => createVariant(venuePayload(data, listingId))}
          onCancel={() => router.back()}
        />
      )}
      {listing.type === "gastro" && listing && (
        <VariantFormGastro
          listingId={listingId}
          onSubmit={(data) => createVariant(gastroPayload(data, listingId))}
          onCancel={() => router.back()}
        />
      )}
      {listing.type === "entertainment" && listing && (
        <VariantFormEntertainment
          listingId={listingId}
          onSubmit={(data) =>
            createVariant(entertainmentPayload(data, listingId))
          }
          onCancel={() => router.back()}
        />
      )}
    </main>
  );
}
