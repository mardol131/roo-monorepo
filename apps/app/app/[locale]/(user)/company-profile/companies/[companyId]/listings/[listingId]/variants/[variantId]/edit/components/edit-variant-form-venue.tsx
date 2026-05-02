"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import Button from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { useListing } from "@/app/react-query/listings/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloud } from "@roo/common";
import {
  Banknote,
  BedDouble,
  Building2,
  Calendar,
  CalendarRange,
  Car,
  Clock,
  Coffee,
  Image,
  ListChecks,
  Tag,
  Users,
  Wifi,
} from "lucide-react";
import type { Resolver } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ── Color scheme ───────────────────────────────────────────────────────────────

const COLOR = { text: "text-variant", surface: "bg-variant-surface" };

// ── TOC ────────────────────────────────────────────────────────────────────────

const S = {
  basic: { id: "section-basic", title: "Základní informace", icon: Building2 },
  price: { id: "section-price", title: "Cena", icon: Banknote },
  images: { id: "section-images", title: "Obrázky", icon: Image },
  eventTypes: { id: "section-event-types", title: "Typy akcí", icon: Tag },
  availability: {
    id: "section-availability",
    title: "Dostupnost",
    icon: Calendar,
  },
  capacity: { id: "section-capacity", title: "Kapacita", icon: Users },
  equipment: {
    id: "section-equipment",
    title: "Vybavení a personál",
    icon: Wifi,
  },
  parking: { id: "section-parking", title: "Parkování", icon: Car },
  accommodation: {
    id: "section-accommodation",
    title: "Ubytování",
    icon: BedDouble,
  },
  breakfast: { id: "section-breakfast", title: "Snídaně", icon: Coffee },
  includes: {
    id: "section-includes",
    title: "Zahrnuto / Nezahrnuto",
    icon: ListChecks,
  },
};

const FORM_GROUPS: readonly TocGroup[] = [
  { label: "Základní", sections: [S.basic, S.price, S.images, S.eventTypes] },
  { label: "Konfigurace", sections: [S.availability, S.capacity, S.includes] },
  {
    label: "Prostor",
    sections: [S.equipment, S.parking, S.accommodation, S.breakfast],
  },
];

// ── Item schema ────────────────────────────────────────────────────────────────

const itemSchema = z.object({ id: z.string(), name: z.string() });

// ── Schema ─────────────────────────────────────────────────────────────────────

const optionalPositiveInt = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce
    .number()
    .positive("Musí být kladné číslo")
    .int("Zadejte celé číslo")
    .optional(),
);

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Musí být kladné číslo").optional(),
);

const schema = z.object({
  // ── Variant top-level ──
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z
    .string()
    .min(1, "Krátký popis je povinný")
    .max(50, "Max. 50 znaků"),
  description: z.string().optional(),
  type: z.enum(["allYear", "seasonal"]),
  availability: z.enum(["allDay", "selectedHours"]),
  selectedHours: z
    .array(
      z.object({
        from: z.string().min(1, "Čas od je povinný"),
        to: z.string().min(1, "Čas do je povinný"),
      }),
    )
    .default([]),
  price: z.object({
    generalPrice: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Cena musí být kladná"),
    seasonalPrices: z
      .array(
        z.object({
          price: z.coerce
            .number({ message: "Zadejte číslo" })
            .positive("Cena musí být kladná"),
          description: z.string().optional(),
          from: z.string().min(1, "Datum od je povinné"),
          to: z.string().min(1, "Datum do je povinné"),
        }),
      )
      .default([]),
  }),
  images: z.object({
    mainImage: z.string().min(1, "Obrázek je povinný"),
    gallery: z.array(z.string()).default([]),
  }),
  eventTypes: z.array(itemSchema).default([]),
  includes: z.array(z.object({ item: z.string() })).default([]),
  excludes: z.array(z.object({ item: z.string() })).default([]),
  // ── Venue detail ──
  capacity: z.object({
    max: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    min: optionalPositiveInt,
  }),
  canBeBookedAsWhole: z.boolean().default(false),
  includedSpaces: z.array(itemSchema).default([]),
  amenities: z.array(itemSchema).default([]),
  technology: z.array(itemSchema).default([]),
  services: z.array(itemSchema).default([]),
  activities: z.array(itemSchema).default([]),
  personnel: z.array(itemSchema).default([]),
  // parking (maps to Variant detail: parking: { included, spots })
  hasParking: z.boolean().default(false),
  parkingIncluded: z.boolean().default(false),
  parkingSpots: optionalPositiveInt,
  // accommodation (maps to Variant detail: accommodation: { included, capacity })
  hasAccommodation: z.boolean().default(false),
  accommodationIncluded: z.boolean().default(false),
  accommodationCapacity: optionalPositiveInt,
  // breakfast (maps to Variant detail: breakfast: { included, price, loweredPrice })
  hasBreakfast: z.boolean().default(false),
  breakfastIncluded: z.boolean().default(false),
  breakfastPrice: optionalPositiveNumber,
  breakfastLoweredPrice: optionalPositiveNumber,
});

export type VenueFormInputs = z.infer<typeof schema>;

// ── Resolver ───────────────────────────────────────────────────────────────────

type ResolverResult = {
  values: Partial<VenueFormInputs>;
  errors: Record<string, unknown>;
};
type ResolverFn = (
  values: unknown,
  ctx: unknown,
  opts: unknown,
) => Promise<ResolverResult>;

function makeResolver(): ResolverFn {
  const zResolver = zodResolver(schema) as unknown as ResolverFn;
  return async (values, ctx, opts) => {
    const result = await zResolver(values, ctx, opts);
    const v = values as VenueFormInputs;
    if (v.availability === "selectedHours" && !v.selectedHours?.length) {
      result.errors = {
        ...result.errors,
        selectedHours: {
          root: { type: "required", message: "Přidejte alespoň jeden časový slot" },
        },
      };
    }
    return result;
  };
}

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  listingId: string;
  onSubmit: (data: VenueFormInputs) => void;
  onCancel: () => void;
  defaultValues?: Partial<VenueFormInputs>;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function EditVariantFormVenue({
  listingId,
  onSubmit,
  onCancel,
  defaultValues,
}: Props) {
  const { data: listing } = useListing(listingId);
  const { data: spaces } = useSpacesByListing(listingId);
  const venueDetail = listing?.details.find((d) => d.blockType === "venue");

  const toItem = <T extends { id: string; name: string }>(v: string | T) =>
    typeof v === "string" ? { id: v, name: "" } : { id: v.id, name: v.name };

  const listingEventTypes = (listing?.eventTypes ?? []).map(toItem);
  const listingSpaces = (spaces ?? []).map((s) => ({ id: s.id, name: s.name ?? "" }));
  const listingAmenities = (venueDetail?.blockType === "venue" ? (venueDetail.amenities ?? []) : []).map(toItem);
  const listingTechnologies = (venueDetail?.blockType === "venue" ? (venueDetail.technology ?? []) : []).map(toItem);
  const listingServices = (venueDetail?.blockType === "venue" ? (venueDetail.services ?? []) : []).map(toItem);
  const listingActivities = (venueDetail?.blockType === "venue" ? (venueDetail.activities ?? []) : []).map(toItem);
  const listingPersonnel = (venueDetail?.blockType === "venue" ? (venueDetail.personnel ?? []) : []).map(toItem);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VenueFormInputs>({
    resolver: makeResolver() as unknown as Resolver<VenueFormInputs>,
    defaultValues: {
      type: "allYear",
      availability: "allDay",
      selectedHours: [],
      price: { seasonalPrices: [] },
      eventTypes: [],
      includes: [],
      excludes: [],
      includedSpaces: [],
      amenities: [],
      technology: [],
      services: [],
      activities: [],
      personnel: [],
      canBeBookedAsWhole: false,
      hasParking: false,
      parkingIncluded: false,
      hasAccommodation: false,
      accommodationIncluded: false,
      hasBreakfast: false,
      breakfastIncluded: false,
      ...defaultValues,
    },
  });

  const availabilityValue = watch("availability");
  const hasParking = watch("hasParking");
  const hasAccommodation = watch("hasAccommodation");
  const hasBreakfast = watch("hasBreakfast");

  const {
    fields: seasonalPricesFields,
    append: appendSeasonalPrice,
    remove: removeSeasonalPrice,
  } = useFieldArray({ control, name: "price.seasonalPrices" });
  const {
    fields: selectedHoursFields,
    append: appendSelectedHour,
    remove: removeSelectedHour,
  } = useFieldArray({ control, name: "selectedHours" });
  const {
    fields: includesFields,
    append: appendInclude,
    remove: removeInclude,
  } = useFieldArray({ control, name: "includes" });
  const {
    fields: excludesFields,
    append: appendExclude,
    remove: removeExclude,
  } = useFieldArray({ control, name: "excludes" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
        {/* Základní informace */}
        <FormSection
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!errors.name || !!errors.shortDescription}
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Základní balíček",
            }}
            error={errors.name?.message}
            isRequired
          />
          <Input
            label="Krátký popis"
            inputProps={{
              ...register("shortDescription"),
              placeholder: "Stručný popis varianty (max. 50 znaků)",
              maxLength: 50,
            }}
            error={errors.shortDescription?.message}
            isRequired
          />
          <Textarea
            label="Detailní popis"
            inputProps={{
              ...register("description"),
              placeholder: "Podrobný popis varianty...",
              rows: 4,
            }}
            error={errors.description?.message}
          />
        </FormSection>

        {/* Cena */}
        <FormSection
          id={S.price.id}
          icon={S.price.icon}
          title={S.price.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!errors.price?.generalPrice}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Základní cena (Kč)"
              inputProps={{
                ...register("price.generalPrice"),
                type: "number",
                min: 0,
                placeholder: "15000",
              }}
              error={errors.price?.generalPrice?.message}
              isRequired
            />
          </div>
          <RepeaterField
            label="Sezónní ceny"
            fields={seasonalPricesFields}
            onAppend={() =>
              appendSeasonalPrice({
                price: 0,
                description: "",
                from: "",
                to: "",
              })
            }
            onRemove={removeSeasonalPrice}
            addButtonLabel="Přidat sezónní cenu"
            renderItem={(_, index) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Cena (Kč)"
                    inputProps={{
                      ...register(`price.seasonalPrices.${index}.price`),
                      type: "number",
                      min: 0,
                    }}
                    error={
                      errors.price?.seasonalPrices?.[index]?.price?.message
                    }
                    isRequired
                  />
                  <Input
                    label="Popis"
                    inputProps={{
                      ...register(`price.seasonalPrices.${index}.description`),
                      placeholder: "např. Letní sezóna",
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Od"
                    inputProps={{
                      ...register(`price.seasonalPrices.${index}.from`),
                      type: "date",
                    }}
                    error={errors.price?.seasonalPrices?.[index]?.from?.message}
                    isRequired
                  />
                  <Input
                    label="Do"
                    inputProps={{
                      ...register(`price.seasonalPrices.${index}.to`),
                      type: "date",
                    }}
                    error={errors.price?.seasonalPrices?.[index]?.to?.message}
                    isRequired
                  />
                </div>
              </>
            )}
          />
        </FormSection>

        {/* Obrázky */}
        <FormSection
          id={S.images.id}
          icon={S.images.icon}
          title={S.images.title}
          subtitle="Podporované formáty: jpg, png, webp"
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!errors.images?.mainImage}
        >
          <Controller
            control={control}
            name="images.mainImage"
            render={({ field }) => (
              <ImageInput
                label="Titulní obrázek"
                value={field.value}
                onChange={(f) => field.onChange(f ?? "")}
                onUpload={uploadFileToCloud}
                error={errors.images?.mainImage?.message}
                isRequired
              />
            )}
          />
          <Controller
            control={control}
            name="images.gallery"
            render={({ field }) => (
              <GalleryInput
                label="Galerie"
                value={field.value ?? []}
                onChange={field.onChange}
                onUpload={uploadFileToCloud}
                maxImages={20}
              />
            )}
          />
        </FormSection>

        {/* Typy akcí */}
        <FormSection
          id={S.eventTypes.id}
          icon={S.eventTypes.icon}
          title={S.eventTypes.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                label="Pro jaké typy akcí je varianta vhodná?"
                items={listingEventTypes}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
        </FormSection>

        {/* Dostupnost */}
        <FormSection
          id={S.availability.id}
          icon={S.availability.icon}
          title={S.availability.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!(errors.type || errors.availability || errors.selectedHours)}
        >
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <InputLabel label="Sezónnost" isRequired />
                <div className="flex flex-col sm:flex-row gap-3">
                  {(
                    [
                      {
                        value: "allYear",
                        label: "Celoroční",
                        description: "Varianta je dostupná po celý rok",
                      },
                      {
                        value: "seasonal",
                        label: "Sezónní",
                        description:
                          "Varianta je dostupná pouze v určitém období",
                      },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-left transition-colors ${field.value === option.value ? "border-variant bg-variant-surface" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarRange className="w-4 h-4 text-variant shrink-0" />
                        <span className="text-sm font-medium text-zinc-900">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.type?.message && (
                  <ErrorText error={errors.type.message} />
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <InputLabel label="Dostupnost v rámci dne" isRequired />
                <div className="flex flex-col sm:flex-row gap-3">
                  {(
                    [
                      {
                        value: "allDay",
                        label: "Celý den",
                        description: "Varianta je dostupná po celý den",
                      },
                      {
                        value: "selectedHours",
                        label: "Vybrané hodiny",
                        description:
                          "Varianta je dostupná ve vybraném časovém rozsahu",
                      },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-left transition-colors ${field.value === option.value ? "border-variant bg-variant-surface" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-variant shrink-0" />
                        <span className="text-sm font-medium text-zinc-900">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.availability?.message && (
                  <ErrorText error={errors.availability.message} />
                )}
              </div>
            )}
          />
          {availabilityValue === "selectedHours" && (
            <RepeaterField
              label="Časové sloty"
              fields={selectedHoursFields}
              onAppend={() => appendSelectedHour({ from: "", to: "" })}
              onRemove={removeSelectedHour}
              addButtonLabel="Přidat časový slot"
              error={(errors.selectedHours as { root?: { message?: string } })?.root?.message}
              renderItem={(_, index) => (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Čas od"
                    inputProps={{
                      ...register(`selectedHours.${index}.from`),
                      type: "time",
                    }}
                    error={errors.selectedHours?.[index]?.from?.message}
                    isRequired
                  />
                  <Input
                    label="Čas do"
                    inputProps={{
                      ...register(`selectedHours.${index}.to`),
                      type: "time",
                    }}
                    error={errors.selectedHours?.[index]?.to?.message}
                    isRequired
                  />
                </div>
              )}
            />
          )}
        </FormSection>

        {/* Kapacita */}
        <FormSection
          id={S.capacity.id}
          icon={S.capacity.icon}
          title={S.capacity.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!errors.capacity?.max}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kapacita (osob)"
              inputProps={{
                ...register("capacity.max"),
                type: "number",
                min: 1,
                placeholder: "300",
              }}
              error={errors.capacity?.max?.message}
              isRequired
            />
            <Input
              label="Minimální kapacita (osob)"
              inputProps={{
                ...register("capacity.min"),
                type: "number",
                min: 1,
                placeholder: "50",
              }}
              error={errors.capacity?.min?.message}
            />
          </div>
          <Controller
            control={control}
            name="canBeBookedAsWhole"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Lze rezervovat jako celek"
                checkColor={COLOR.text}
              />
            )}
          />
        </FormSection>

        {/* Zahrnuto / Nezahrnuto */}
        <FormSection
          id={S.includes.id}
          icon={S.includes.icon}
          title={S.includes.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <RepeaterField
            label="Co je zahrnuto"
            fields={includesFields}
            onAppend={() => appendInclude({ item: "" })}
            onRemove={removeInclude}
            addButtonLabel="Přidat položku"
            renderItem={(_, i) => (
              <Input
                label="Položka"
                inputProps={{
                  ...register(`includes.${i}.item`),
                  placeholder: "např. Technika, Obsluha...",
                }}
              />
            )}
          />
          <RepeaterField
            label="Co není zahrnuto"
            fields={excludesFields}
            onAppend={() => appendExclude({ item: "" })}
            onRemove={removeExclude}
            addButtonLabel="Přidat položku"
            renderItem={(_, i) => (
              <Input
                label="Položka"
                inputProps={{
                  ...register(`excludes.${i}.item`),
                  placeholder: "např. Catering, Parkování...",
                }}
              />
            )}
          />
        </FormSection>

        {/* Vybavení a personál */}
        <FormSection
          id={S.equipment.id}
          icon={S.equipment.icon}
          title={S.equipment.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="includedSpaces"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Zahrnuté prostory"
                items={listingSpaces}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Vybavení"
                items={listingAmenities}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="technology"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Technika"
                items={listingTechnologies}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Služby"
                items={listingServices}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="activities"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Aktivity"
                items={listingActivities}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="personnel"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Personál"
                items={listingPersonnel}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
        </FormSection>

        {/* Parkování */}
        <FormSection
          id={S.parking.id}
          icon={S.parking.icon}
          title={S.parking.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="hasParking"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Dostupné parkování"
                checkColor={COLOR.text}
              />
            )}
          />
          {hasParking && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Počet parkovacích míst"
                  inputProps={{
                    ...register("parkingSpots"),
                    type: "number",
                    min: 1,
                    placeholder: "50",
                  }}
                  error={errors.parkingSpots?.message}
                />
              </div>
              <Controller
                control={control}
                name="parkingIncluded"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Parkování v ceně"
                    checkColor={COLOR.text}
                  />
                )}
              />
            </div>
          )}
        </FormSection>

        {/* Ubytování */}
        <FormSection
          id={S.accommodation.id}
          icon={S.accommodation.icon}
          title={S.accommodation.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="hasAccommodation"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Dostupné ubytování"
                checkColor={COLOR.text}
              />
            )}
          />
          {hasAccommodation && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Kapacita ubytování (lůžek)"
                  inputProps={{
                    ...register("accommodationCapacity"),
                    type: "number",
                    min: 1,
                    placeholder: "20",
                  }}
                  error={errors.accommodationCapacity?.message}
                />
              </div>
              <Controller
                control={control}
                name="accommodationIncluded"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Ubytování v ceně"
                    checkColor={COLOR.text}
                  />
                )}
              />
            </div>
          )}
        </FormSection>

        {/* Snídaně */}
        <FormSection
          id={S.breakfast.id}
          icon={S.breakfast.icon}
          title={S.breakfast.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="hasBreakfast"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Snídaně k dispozici"
                checkColor={COLOR.text}
              />
            )}
          />
          {hasBreakfast && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cena snídaně (Kč/osoba)"
                  inputProps={{
                    ...register("breakfastPrice"),
                    type: "number",
                    min: 0,
                    placeholder: "250",
                  }}
                  error={errors.breakfastPrice?.message}
                />
                <Input
                  label="Zvýhodněná cena (Kč/osoba)"
                  inputProps={{
                    ...register("breakfastLoweredPrice"),
                    type: "number",
                    min: 0,
                    placeholder: "150",
                  }}
                  error={errors.breakfastLoweredPrice?.message}
                />
              </div>
              <Controller
                control={control}
                name="breakfastIncluded"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Snídaně v ceně"
                    checkColor={COLOR.text}
                  />
                )}
              />
            </div>
          )}
        </FormSection>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            onClick={onCancel}
            version="plain"
          />
          <Button
            text="Uložit variantu"
            version="variantFull"
            htmlType="submit"
          />
        </div>
      </div>
      <FormToc
        textColor={COLOR.text}
        dotColor={COLOR.text}
        surfaceColor={COLOR.surface}
        groups={FORM_GROUPS}
        sticky
        buttonVersion="variantFull"
        buttonText="Uložit variantu"
      />
    </form>
  );
}
