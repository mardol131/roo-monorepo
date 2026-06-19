"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import Text from "@/app/components/ui/atoms/text";
import { useListingDetail } from "@/app/react-query/listings/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import {
  type SelectedAddon,
  type SelectedSpace,
  useOrderStore,
} from "@/app/store/order-store";
import {
  getIdFromRelationshipField,
  type Listing,
  type ListingEntertainmentDetail,
  type ListingGastroDetail,
  type ListingVenueDetail,
  type Space,
} from "@roo/common";
import { Check, Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import ServiceTimeSection from "../../service-time-section";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { useParams } from "next/navigation";
import z from "zod";

export const customRequestFormSchema = z.object({
  note: z.string().min(10, "Popis musí mít alespoň 10 znaků"),
  requirements: z.array(z.object({ text: z.string() })),
});

export type CustomRequestFormData = z.infer<typeof customRequestFormSchema>;

type PricingUnit = "per_day" | "per_person" | "per_hour" | "lump_sum";

const PRICING_UNIT_LABELS: Record<PricingUnit, string> = {
  per_day: "/ den",
  per_person: "/ os.",
  per_hour: "/ hod.",
  lump_sum: "/ událost",
};

type FlatAddon = SelectedAddon & { defaultQuantity: number };

function extractAddons(
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail,
): FlatAddon[] {
  const result: FlatAddon[] = [];
  const opts = detail.options as Record<string, unknown[] | null | undefined>;

  const ENTITY_KEYS: Record<string, string> = {
    activities: "activity",
    technologies: "technology",
    personnel: "personnel",
    amenities: "amenity",
    services: "service",
    cuisines: "cuisine",
    foodPreparationStyles: "foodPreparationStyle",
  };

  for (const [key, entityKey] of Object.entries(ENTITY_KEYS)) {
    const items = opts[key];
    if (!items) continue;
    for (const item of items) {
      const entry = item as Record<string, unknown>;
      const entity = entry[entityKey] as
        | { id: string; name: string }
        | string
        | undefined;
      if (!entity || typeof entity === "string") continue;
      result.push({
        optionId: entity.id,
        name: entity.name,
        pricingUnit: entry.pricingUnit as PricingUnit,
        unitPrice: entry.unitPrice as number,
        quantity: entry.quantity as number,
        defaultQuantity: entry.quantity as number,
      });
    }
  }

  return result;
}

function extractCateringAddons(detail: ListingVenueDetail): FlatAddon[] {
  const result: FlatAddon[] = [];
  for (const item of detail.catering?.cuisines ?? []) {
    const entity = typeof item.cuisine === "string" ? null : item.cuisine;
    if (!entity) continue;
    result.push({
      optionId: entity.id,
      name: entity.name,
      pricingUnit: item.pricingUnit as PricingUnit,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      defaultQuantity: item.quantity,
    });
  }
  for (const item of detail.catering?.foodPreparationStyles ?? []) {
    const entity =
      typeof item.foodPreparationStyle === "string"
        ? null
        : item.foodPreparationStyle;
    if (!entity) continue;
    result.push({
      optionId: entity.id,
      name: entity.name,
      pricingUnit: item.pricingUnit as PricingUnit,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      defaultQuantity: item.quantity,
    });
  }
  return result;
}

function getDetailCollection(listing: Listing) {
  return listing.type === "entertainment"
    ? ("listing-entertainment-details" as const)
    : listing.type === "gastro"
      ? ("listing-gastro-details" as const)
      : ("listing-venue-details" as const);
}

// ── Addon card ────────────────────────────────────────────────────────────────

function AddonCard({ addon }: { addon: FlatAddon }) {
  const { selectedAddons, toggleAddon, setAddonQuantity } = useOrderStore();
  const selected = selectedAddons.find((a) => a.optionId === addon.optionId);
  const isSelected = !!selected;
  const currentQty = selected?.quantity ?? addon.defaultQuantity;
  const hasQuantity = addon.defaultQuantity > 1;

  return (
    <div
      className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-success bg-success-surface"
          : "border-zinc-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() =>
          toggleAddon({ ...addon, quantity: addon.defaultQuantity })
        }
        className="flex items-center gap-3 flex-1 text-left"
      >
        <div
          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
            isSelected ? "bg-success" : "border-2 border-zinc-300"
          }`}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </div>
        <Text variant="label" color={isSelected ? "textDark" : "textDark"}>
          {addon.name}
        </Text>
      </button>

      <div className="flex items-center gap-3 shrink-0">
        {isSelected && hasQuantity && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setAddonQuantity(addon.optionId, Math.max(1, currentQty - 1))
              }
              className="w-6 h-6 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <Text variant="label" color="textDark" className="w-6 text-center">
              {currentQty}
            </Text>
            <button
              type="button"
              onClick={() => setAddonQuantity(addon.optionId, currentQty + 1)}
              className="w-6 h-6 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
        <Text variant="caption" color="secondary">
          {addon.unitPrice.toLocaleString("cs-CZ")} Kč{" "}
          {PRICING_UNIT_LABELS[addon.pricingUnit]}
        </Text>
      </div>
    </div>
  );
}

// ── Space card ────────────────────────────────────────────────────────────────

function SpaceCard({ space }: { space: Space }) {
  const { selectedSpaces, toggleSpace } = useOrderStore();
  const isSelected = selectedSpaces.some((s) => s.spaceId === space.id);

  const spaceAddon: SelectedSpace = {
    spaceId: space.id,
    name: space.name,
    price: space.price.base,
    pricingUnit: space.price.pricingUnit,
  };

  return (
    <button
      type="button"
      onClick={() => toggleSpace(spaceAddon)}
      className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-all ${
        isSelected
          ? "border-primary bg-primary-surface"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
            isSelected ? "bg-primary" : "border-2 border-zinc-300"
          }`}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </div>
        <div>
          <Text variant="label" color={isSelected ? "primary" : "textDark"}>
            {space.name}
          </Text>
          {space.capacity && (
            <Text variant="caption" color="secondary">
              Kapacita: {space.capacity} osob
            </Text>
          )}
        </div>
      </div>
      <Text variant="caption" color="secondary" className="shrink-0">
        {space.price.base.toLocaleString("cs-CZ")} Kč{" "}
        {PRICING_UNIT_LABELS[space.price.pricingUnit]}
      </Text>
    </button>
  );
}

// ── Number stepper ────────────────────────────────────────────────────────────

function NumberStepper({
  value,
  onChange,
  min = 0,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Text variant="label" color="textDark">
        {label}
      </Text>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border-2 border-zinc-200 flex items-center justify-center hover:border-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <Text
          variant="label-lg"
          color="textDark"
          className="w-8 text-center font-semibold"
        >
          {value}
        </Text>
        <button
          type="button"
          onClick={() =>
            onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)
          }
          disabled={max !== undefined && value >= max}
          className="w-8 h-8 rounded-full border-2 border-zinc-200 flex items-center justify-center hover:border-zinc-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  listing: Listing;
  control: Control<CustomRequestFormData>;
  register: UseFormRegister<CustomRequestFormData>;
  errors: FieldErrors<CustomRequestFormData>;
  eventStart?: string;
  eventEnd?: string;
  isOneTime: boolean;
}

export default function OrderStepFillCustomRequest({
  listing,
  control,
  register,
  errors,
  eventStart,
  eventEnd,
  isOneTime,
}: Props) {
  const params = useParams<{ listingId: string }>();
  const {
    setCustomRequest,
    selectedSpaces,
    accommodation,
    breakfast,
    parking,
    setAccommodation,
    setBreakfast,
    setParking,
  } = useOrderStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });
  const values = useWatch({ control });

  useEffect(() => {
    const note = values.note?.trim() ?? "";
    if (!note) {
      setCustomRequest(undefined);
      return;
    }
    setCustomRequest({
      note,
      requirements: (values.requirements ?? []).filter(
        (r): r is { text: string } => !!r.text?.trim(),
      ),
    });
  }, [values, setCustomRequest]);

  const collection = getDetailCollection(listing);
  const detailId = getIdFromRelationshipField(listing.detail.value);
  const { data: detail } = useListingDetail(collection, detailId);

  const { data: spacesData } = useSpacesByListing(
    listing.type === "venue" ? params.listingId : "",
  );
  const spaces = (spacesData?.docs ?? []).filter((s) => s.status === "active");

  const availableAddons: FlatAddon[] = detail ? extractAddons(detail) : [];

  const venueDetail = detail?.type === "venue" ? detail : undefined;
  const showSpaces = detail?.type === "venue" && spaces.length > 0;
  const showAccommodation = !!venueDetail?.accomodation?.hasAccommodation;
  const showBreakfast =
    !!venueDetail?.breakfast?.price &&
    venueDetail.breakfast.price > 0 &&
    !venueDetail.breakfast.breakfastIsIncludedInPrice;
  const showParking =
    !!venueDetail?.parking?.hasParking &&
    !venueDetail.parking.parkingIsIncludedInPrice &&
    !!venueDetail.parking.parkingPrice;
  const cateringAddons: FlatAddon[] = venueDetail
    ? extractCateringAddons(venueDetail)
    : [];
  const showCatering =
    !!venueDetail?.catering?.hasCatering &&
    !venueDetail.catering.cateringIsIncludedInPrice &&
    cateringAddons.length > 0;

  void selectedSpaces;

  return (
    <div className="flex flex-col gap-4">
      {/* Čas a délka */}
      <ServiceTimeSection eventStart={eventStart} eventEnd={eventEnd} isOneTime={isOneTime} />

      {/* Prostory (venue only) */}
      {showSpaces && (
        <FormSection
          icon="Building2"
          title="Prostory"
          subtitle="Vyberte prostory, které chcete využít"
        >
          <div className="flex flex-col gap-2">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </FormSection>
      )}

      {/* Ubytování (venue only) */}
      {showAccommodation && (
        <FormSection
          icon="Bed"
          title="Ubytování"
          subtitle={`Kapacita: ${venueDetail?.accomodation?.accommodationCapacity ?? "?"} míst`}
        >
          <div className="flex flex-col gap-4">
            <NumberStepper
              label="Počet hostů na ubytování"
              value={accommodation?.guests ?? 0}
              onChange={(v) => setAccommodation(v > 0 ? { guests: v } : null)}
              max={
                venueDetail?.accomodation?.accommodationCapacity ?? undefined
              }
            />
          </div>
        </FormSection>
      )}

      {/* Snídaně (venue only) */}
      {showBreakfast && (
        <FormSection
          icon="Coffee"
          title="Snídaně"
          subtitle={`${venueDetail?.breakfast.price?.toLocaleString("cs-CZ")} Kč / os. / den`}
        >
          <NumberStepper
            label="Počet snídaní"
            value={breakfast?.guests ?? 0}
            onChange={(v) => setBreakfast(v > 0 ? { guests: v } : null)}
          />
        </FormSection>
      )}

      {/* Parkování (venue only) */}
      {showParking && (
        <FormSection
          icon="Car"
          title="Parkování"
          subtitle={`${venueDetail?.parking.parkingPrice?.toLocaleString("cs-CZ")} Kč / místo / den${venueDetail?.parking.parkingCapacity ? ` · max. ${venueDetail.parking.parkingCapacity} míst` : ""}`}
        >
          <NumberStepper
            label="Počet parkovacích míst"
            value={parking?.spots ?? 0}
            onChange={(v) => setParking(v > 0 ? { spots: v } : null)}
            max={venueDetail?.parking.parkingCapacity ?? undefined}
          />
        </FormSection>
      )}

      {/* Catering (venue only) */}
      {showCatering && (
        <FormSection
          icon="UtensilsCrossed"
          title="Catering"
          subtitle={
            venueDetail?.catering?.price
              ? `Základní cena: ${venueDetail.catering.price.toLocaleString("cs-CZ")} Kč${venueDetail.catering.pricingUnit === "per_person" ? " / os." : venueDetail.catering.pricingUnit === "per_hour" ? " / hod." : " / akci"}`
              : "Vyberte typ kuchyně a způsob přípravy"
          }
        >
          <div className="flex flex-col gap-2">
            {cateringAddons.map((addon) => (
              <AddonCard key={addon.optionId} addon={addon} />
            ))}
          </div>
        </FormSection>
      )}

      {/* Doplňkové služby */}
      {availableAddons.length > 0 && (
        <FormSection
          icon="ShoppingCart"
          title="Doplňkové služby"
          subtitle="Vyberte doplňkové služby, které chcete zahrnout do poptávky"
        >
          <div className="flex flex-col gap-2">
            {availableAddons.map((addon) => (
              <AddonCard key={addon.optionId} addon={addon} />
            ))}
          </div>
        </FormSection>
      )}

      {/* Popis poptávky */}
      <FormSection
        icon="FileText"
        title="Popis poptávky"
        subtitle="Popište, co potřebujete, a dodavatel vám připraví nabídku na míru"
        error={!!errors.note?.message}
      >
        <Textarea
          label="Popis poptávky"
          inputProps={{
            ...register("note"),
            rows: 5,
            placeholder:
              "Popište vaši akci, požadavky na prostory, catering, program...",
          }}
          error={errors.note?.message}
        />
      </FormSection>

      {/* Další požadavky */}
      <FormSection
        icon="ListChecks"
        title="Další požadavky"
        subtitle="Volitelné — konkrétní požadavky, které chcete upřesnit"
        headerRightComponent={
          <Button
            text="Přidat požadavek"
            iconLeft="Plus"
            version="outlined"
            size="xs"
            onClick={() => append({ text: "" })}
          />
        }
      >
        {fields.length === 0 ? null : (
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`requirements.${index}.text`}
                    render={({ field: f }) => (
                      <Input
                        inputProps={{
                          ...f,
                          placeholder: `Požadavek ${index + 1}`,
                        }}
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  );
}
