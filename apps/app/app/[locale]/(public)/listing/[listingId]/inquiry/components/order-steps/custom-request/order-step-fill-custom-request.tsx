"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import Text from "@/app/components/ui/atoms/text";
import SelectableOptionCard from "@/app/components/ui/molecules/selectable-option-card";
import { useListingDetail } from "@/app/react-query/listings/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { type SelectedAddon, useOrderStore } from "@/app/store/order-store";
import {
  getIdFromRelationshipField,
  type Listing,
  type ListingEntertainmentDetail,
  type ListingGastroDetail,
  type ListingVenueDetail,
} from "@roo/common";
import { Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import ServiceTimeSection from "../../service-time-section";
import SpaceTreeList from "./space-tree-card";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { useParams } from "next/navigation";
import type { CustomRequestFormData } from "./custom-request-form-schema";

export {
  customRequestFormSchema,
  type CustomRequestFormData,
} from "./custom-request-form-schema";

type PricingUnit = "per_day" | "per_person" | "per_hour" | "lump_sum";

const PRICING_UNIT_LABELS: Record<PricingUnit, string> = {
  per_day: "/ den",
  per_person: "/ os.",
  per_hour: "/ hod.",
  lump_sum: "/ událost",
};

type AddonGroupKey = keyof typeof ADDON_GROUP_LABELS;

type FlatAddon = SelectedAddon & {
  defaultQuantity: number;
  group: AddonGroupKey;
};

const ADDON_GROUP_LABELS = {
  activities: "Aktivity",
  technologies: "Technika",
  personnel: "Personál",
  amenities: "Vybavení",
  services: "Služby",
  cuisines: "Kuchyně",
  foodPreparationStyles: "Styl přípravy jídla",
} as const;

const ENTITY_KEYS: Record<AddonGroupKey, string> = {
  activities: "activity",
  technologies: "technology",
  personnel: "personnel",
  amenities: "amenity",
  services: "service",
  cuisines: "cuisine",
  foodPreparationStyles: "foodPreparationStyle",
};

function extractAddons(
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail,
): FlatAddon[] {
  const result: FlatAddon[] = [];
  const opts = detail.options as Record<string, unknown[] | null | undefined>;

  for (const [key, entityKey] of Object.entries(ENTITY_KEYS) as [
    AddonGroupKey,
    string,
  ][]) {
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
        group: key,
      });
    }
  }

  return result;
}

function groupAddonsByType(addons: FlatAddon[]): [AddonGroupKey, FlatAddon[]][] {
  const groups = new Map<AddonGroupKey, FlatAddon[]>();
  for (const addon of addons) {
    const list = groups.get(addon.group);
    if (list) {
      list.push(addon);
    } else {
      groups.set(addon.group, [addon]);
    }
  }
  return Array.from(groups.entries());
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
    <SelectableOptionCard
      isActive={isSelected}
      onClick={() => toggleAddon({ ...addon, quantity: addon.defaultQuantity })}
      price={
        <>
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
              <Text
                variant="label"
                color="textDark"
                className="w-6 text-center"
              >
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
        </>
      }
    >
      <Text variant="label" color="textDark">
        {addon.name}
      </Text>
    </SelectableOptionCard>
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
  setValue: UseFormSetValue<CustomRequestFormData>;
  errors: FieldErrors<CustomRequestFormData>;
  eventStart?: string;
  eventEnd?: string;
  isOneTime: boolean;
}

export default function OrderStepFillCustomRequest({
  listing,
  control,
  register,
  setValue,
  errors,
  eventStart,
  eventEnd,
  isOneTime,
}: Props) {
  const params = useParams<{ listingId: string }>();
  const {
    setCustomRequest,
    selectedSpaces,
    selectedAddons,
    toggleAddon,
    accommodation,
    breakfast,
    parking,
    wantsCatering,
    setAccommodation,
    setBreakfast,
    setParking,
    setWantsCatering,
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

  const cateringAvailable = !!venueDetail?.catering?.hasCatering;
  function handleWantsCateringChange(next: boolean) {
    setWantsCatering(next);
  }

  void selectedSpaces;

  return (
    <div className="flex flex-col gap-4">
      {/* Čas a délka */}
      <ServiceTimeSection
        eventStart={eventStart}
        eventEnd={eventEnd}
        isOneTime={isOneTime}
        control={control}
        setValue={setValue}
        errors={errors}
      />

      {/* Prostory (venue only) */}
      {showSpaces && (
        <FormSection
          icon="Building2"
          title="Prostory"
          subtitle="Vyberte prostory, které chcete využít"
        >
          <SpaceTreeList spaces={spaces} />
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
      {cateringAvailable && (
        <FormSection
          icon="UtensilsCrossed"
          title="Catering"
          subtitle="Catering je volitelný doplněk"
        >
          <div className="flex flex-col gap-3">
            <SelectableOptionCard
              isActive={wantsCatering}
              onClick={() => handleWantsCateringChange(!wantsCatering)}
              price={
                venueDetail?.catering?.price ? (
                  <Text variant="caption" color="secondary">
                    {venueDetail.catering.price.toLocaleString("cs-CZ")} Kč
                    {venueDetail.catering.pricingUnit === "per_person"
                      ? " / os."
                      : venueDetail.catering.pricingUnit === "per_hour"
                        ? " / hod."
                        : " / akci"}
                  </Text>
                ) : null
              }
            >
              <Text variant="label" color="textDark">
                Chci využít catering
              </Text>
            </SelectableOptionCard>
            {wantsCatering && venueDetail?.catering?.description && (
              <Text variant="caption" color="secondary">
                {venueDetail?.catering?.description}
              </Text>
            )}
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
          <div className="flex flex-col gap-4">
            {groupAddonsByType(availableAddons).map(([group, addons]) => (
              <div key={group} className="flex flex-col gap-2">
                <Text variant="label" color="textDark" className="font-semibold">
                  {ADDON_GROUP_LABELS[group]}
                </Text>
                {addons.map((addon) => (
                  <AddonCard key={addon.optionId} addon={addon} />
                ))}
              </div>
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
        <Button
          text="Přidat požadavek"
          iconLeft="Plus"
          version="plain"
          size="xs"
          onClick={() => append({ text: "" })}
          className="self-start"
        />
      </FormSection>
    </div>
  );
}
