"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { useListing } from "@/app/react-query/listings/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloud } from "@roo/common";
import {
  Banknote,
  Building2,
  Calendar,
  CalendarRange,
  Clock,
  Image,
  ListChecks,
  Tag,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ── TOC sections ───────────────────────────────────────────────────────────────

const SECTION_BASIC = {
  id: "section-basic",
  title: "Základní informace",
  icon: Building2,
};
const SECTION_PRICE = { id: "section-price", title: "Cena", icon: Banknote };
const SECTION_IMAGES = { id: "section-images", title: "Obrázky", icon: Image };
const SECTION_EVENT_TYPES = {
  id: "section-event-types",
  title: "Typy akcí",
  icon: Tag,
};
const SECTION_AVAILABILITY = {
  id: "section-availability",
  title: "Dostupnost",
  icon: Calendar,
};
const SECTION_CAPACITY = {
  id: "section-capacity",
  title: "Kapacita",
  icon: Users,
};
const SECTION_INCLUDES = {
  id: "section-includes",
  title: "Zahrnuto / Nezahrnuto",
  icon: ListChecks,
};

export const VARIANT_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [
      SECTION_BASIC,
      SECTION_PRICE,
      SECTION_IMAGES,
      SECTION_EVENT_TYPES,
    ],
  },
  {
    label: "Konfigurace",
    sections: [SECTION_AVAILABILITY, SECTION_CAPACITY, SECTION_INCLUDES],
  },
];

const COLOR_SCHEME = {
  text: "text-variant",
  surface: "bg-variant-surface",
};

const BUTTON_COLOR: ButtonProps["version"] = "variantFull";

// ── Schema ─────────────────────────────────────────────────────────────────────

const optionalPositiveInt = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce
    .number()
    .positive("Musí být kladné číslo")
    .int("Zadejte celé číslo")
    .optional(),
);

const schema = z.object({
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
  eventTypes: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  capacity: z.object({
    max: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    min: optionalPositiveInt,
  }),
  includes: z.array(z.object({ item: z.string() })).default([]),
  excludes: z.array(z.object({ item: z.string() })).default([]),
});

export type VariantFormInputs = z.infer<typeof schema>;

// ── Resolver ───────────────────────────────────────────────────────────────────

type ResolverResult = {
  values: Partial<VariantFormInputs>;
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
    const v = values as VariantFormInputs;

    if (v.availability === "selectedHours" && !v.selectedHours?.length) {
      result.errors = {
        ...result.errors,
        selectedHours: {
          root: {
            type: "required",
            message: "Přidejte alespoň jeden časový slot",
          },
        },
      };
    }

    return result;
  };
}

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  onSubmit: (data: VariantFormInputs) => void;
  onCancel: () => void;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function NewVariantForm({ onSubmit, onCancel }: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: listing } = useListing(listingId);
  const listingType = listing?.details[0].blockType;

  const toItem = <T extends { id: string; name: string }>(v: string | T) =>
    typeof v === "string" ? { id: v, name: "" } : { id: v.id, name: v.name };
  const listingEventTypes = (listing?.eventTypes ?? []).map(toItem);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VariantFormInputs>({
    resolver: makeResolver() as unknown as Resolver<VariantFormInputs>,
    defaultValues: {
      type: "allYear",
      availability: "allDay",
      selectedHours: [],
      price: { seasonalPrices: [] },
      eventTypes: [],
      includes: [],
      excludes: [],
    },
  });

  const availabilityValue = watch("availability");

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
        {/* ── 1. Základní informace ──────────────────────────────────────────── */}
        <FormSection
          id={SECTION_BASIC.id}
          icon={SECTION_BASIC.icon}
          title={SECTION_BASIC.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.name || !!errors.shortDescription}
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder:
                listingType === "venue"
                  ? "Základní balíček"
                  : listingType === "gastro"
                    ? "Raut pro 50 osob"
                    : "Standardní vystoupení",
            }}
            error={errors.name?.message}
            isRequired
          />
          <div className="relative">
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
          </div>
          <Textarea
            label="Detailní popis"
            inputProps={{
              ...register("description"),
              placeholder: "Podrobný popis varianty, co zákazník dostane...",
              rows: 4,
            }}
            error={errors.description?.message}
          />
        </FormSection>

        {/* ── 2. Cena ───────────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_PRICE.id}
          icon={SECTION_PRICE.icon}
          title={SECTION_PRICE.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
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
                      placeholder: "18000",
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
                    error={
                      errors.price?.seasonalPrices?.[index]?.description
                        ?.message
                    }
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

        {/* ── 3. Obrázek ────────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_IMAGES.id}
          icon={SECTION_IMAGES.icon}
          title={SECTION_IMAGES.title}
          subtitle="Podporované formáty: jpg, png, webp"
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
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
                value={field.value}
                onChange={field.onChange}
                onUpload={uploadFileToCloud}
                maxImages={20}
                error={
                  errors.images?.gallery?.root?.message ??
                  errors.images?.gallery?.message
                }
              />
            )}
          />
        </FormSection>

        {/* ── 4. Typy akcí ──────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_EVENT_TYPES.id}
          icon={SECTION_EVENT_TYPES.icon}
          title={SECTION_EVENT_TYPES.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                label="Pro jaké typy akcí je varianta vhodná?"
                items={listingEventTypes}
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
            )}
          />
        </FormSection>

        {/* ── 5. Dostupnost ─────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_AVAILABILITY.id}
          icon={SECTION_AVAILABILITY.icon}
          title={SECTION_AVAILABILITY.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!(errors.type || errors.availability || errors.selectedHours)}
        >
          {/* Typ sezónnosti */}
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
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                        field.value === option.value
                          ? "border-variant bg-variant-surface"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
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

          {/* Typ dostupnosti v rámci dne */}
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
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                        field.value === option.value
                          ? "border-variant bg-variant-surface"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
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
              error={
                (errors.selectedHours as { root?: { message?: string } })?.root
                  ?.message
              }
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

        {/* ── 6. Kapacita ───────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_CAPACITY.id}
          icon={SECTION_CAPACITY.icon}
          title={SECTION_CAPACITY.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.capacity?.max}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={
                listingType === "venue"
                  ? "Kapacita (osob)"
                  : "Maximální kapacita (osob)"
              }
              inputProps={{
                ...register("capacity.max"),
                type: "number",
                min: 1,
                placeholder: listingType === "venue" ? "300" : "200",
              }}
              error={errors.capacity?.max?.message}
              isRequired
            />
            {listingType !== "venue" && (
              <Input
                label="Minimální kapacita (osob)"
                inputProps={{
                  ...register("capacity.min"),
                  type: "number",
                  min: 1,
                  placeholder: "10",
                }}
                error={errors.capacity?.min?.message}
              />
            )}
          </div>
        </FormSection>

        {/* ── 7. Zahrnuto / Nezahrnuto ──────────────────────────────────────── */}
        <FormSection
          id={SECTION_INCLUDES.id}
          icon={SECTION_INCLUDES.icon}
          title={SECTION_INCLUDES.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
        >
          <RepeaterField
            label="Co je zahrnuto"
            fields={includesFields}
            onAppend={() => appendInclude({ item: "" })}
            onRemove={removeInclude}
            addButtonLabel="Přidat položku"
            renderItem={(_, index) => (
              <Input
                label="Položka"
                inputProps={{
                  ...register(`includes.${index}.item`),
                  placeholder: "např. Ozvučení, Obsluha...",
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
            renderItem={(_, index) => (
              <Input
                label="Položka"
                inputProps={{
                  ...register(`excludes.${index}.item`),
                  placeholder: "např. Catering, Parkování...",
                }}
              />
            )}
          />
        </FormSection>

        {/* ── Submit ────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            onClick={onCancel}
            version="plain"
          />
          <Button
            text="Vytvořit variantu"
            version={BUTTON_COLOR}
            htmlType="submit"
          />
        </div>
      </div>
      <FormToc
        textColor="text-variant"
        dotColor="text-variant"
        surfaceColor="bg-variant-surface"
        groups={VARIANT_FORM_GROUPS}
        sticky={true}
        buttonVersion="variantFull"
        buttonText="Uložení"
      />
    </form>
  );
}
