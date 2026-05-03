"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
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
import { useRouter } from "@/app/i18n/navigation";
import { useListing } from "@/app/react-query/listings/hooks";
import { useCreateVariant } from "@/app/react-query/variants/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloud } from "@roo/common";
import {
  Banknote,
  Calendar,
  CalendarRange,
  ChefHat,
  Clock,
  Image,
  ListChecks,
  Package,
  Tag,
  UserCheck,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ── Color scheme ───────────────────────────────────────────────────────────────

const COLOR = { text: "text-variant", surface: "bg-variant-surface" };

// ── TOC ────────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basic: { id: "section-basic", title: "Základní informace", icon: "Package" },
  price: { id: "section-price", title: "Cena", icon: "Banknote" },
  images: { id: "section-images", title: "Obrázky", icon: "Image" },
  eventTypes: { id: "section-event-types", title: "Typy akcí", icon: "Tag" },
  availability: {
    id: "section-availability",
    title: "Dostupnost",
    icon: "Calendar",
  },
  capacity: {
    id: "section-capacity",
    title: "Kapacita a objednávky",
    icon: "Users",
  },
  cuisine: { id: "section-cuisine", title: "Kuchyně a styl", icon: "ChefHat" },
  extras: { id: "section-extras", title: "Doplňky", icon: "Package" },
  personnel: {
    id: "section-personnel",
    title: "Personál a požadavky",
    icon: "UserCheck",
  },
  includes: {
    id: "section-includes",
    title: "Zahrnuto / Nezahrnuto",
    icon: "ListChecks",
  },
};

const FORM_GROUPS: readonly TocGroup[] = [
  { label: "Základní", sections: [S.basic, S.price, S.images, S.eventTypes] },
  { label: "Konfigurace", sections: [S.availability, S.capacity, S.includes] },
  { label: "Nabídka", sections: [S.cuisine, S.extras, S.personnel] },
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
  capacity: z.object({
    max: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    min: optionalPositiveInt,
  }),
  pricePerPerson: optionalPositiveNumber,
  minimumOrderCount: optionalPositiveInt,
  cuisines: z.array(itemSchema).default([]),
  dishTypes: z.array(itemSchema).default([]),
  dietaryOptions: z.array(itemSchema).default([]),
  foodServiceStyle: z.array(itemSchema).default([]),
  kidsMenu: z.boolean().default(false),
  alcoholIncluded: z.boolean().default(false),
  personnel: z.array(itemSchema).default([]),
  necessities: z.array(itemSchema).default([]),
});

type GastroFormInputs = z.infer<typeof schema>;

// ── Resolver ───────────────────────────────────────────────────────────────────

type ResolverResult = {
  values: Partial<GastroFormInputs>;
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
    const v = values as GastroFormInputs;
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
  onCancel: () => void;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function NewVariantFormGastro({ onCancel }: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const router = useRouter();
  const { data: listing } = useListing(listingId);
  const gastroDetail = listing?.details.find((d) => d.blockType === "gastro");

  const toItem = <T extends { id: string; name: string }>(v: string | T) =>
    typeof v === "string" ? { id: v, name: "" } : { id: v.id, name: v.name };

  const listingEventTypes = (listing?.eventTypes ?? []).map(toItem);
  const listingCuisines = (
    gastroDetail?.blockType === "gastro" ? (gastroDetail.cuisines ?? []) : []
  ).map(toItem);
  const listingDishTypes = (
    gastroDetail?.blockType === "gastro" ? (gastroDetail.dishTypes ?? []) : []
  ).map(toItem);
  const listingFoodServiceStyles = (
    gastroDetail?.blockType === "gastro"
      ? (gastroDetail.foodServiceStyles ?? [])
      : []
  ).map(toItem);
  const listingDietaryOptions = (
    gastroDetail?.blockType === "gastro"
      ? (gastroDetail.dietaryOptions ?? [])
      : []
  ).map(toItem);
  const listingPersonnel = (
    gastroDetail?.blockType === "gastro" ? (gastroDetail.personnel ?? []) : []
  ).map(toItem);
  const listingNecessities = (
    gastroDetail?.blockType === "gastro" ? (gastroDetail.necessities ?? []) : []
  ).map(toItem);

  const { mutate: createVariant } = useCreateVariant({
    onSuccess: (variant) => {
      router.push({
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/edit",
        params: { companyId, listingId, variantId: variant.id },
      });
    },
  });

  const {
    control,
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    formState: { errors },
  } = useForm<GastroFormInputs>({
    resolver: makeResolver() as unknown as Resolver<GastroFormInputs>,
    defaultValues: {
      type: "allYear",
      availability: "allDay",
      selectedHours: [],
      price: { seasonalPrices: [] },
      eventTypes: [],
      includes: [],
      excludes: [],
      cuisines: [],
      dishTypes: [],
      dietaryOptions: [],
      foodServiceStyle: [],
      personnel: [],
      necessities: [],
      kidsMenu: false,
      alcoholIncluded: false,
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

  const handleSubmit = (data: GastroFormInputs) => {
    createVariant({
      listing: listingId,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description ?? null,
      type: data.type,
      availability: data.availability,
      selectedHours: data.selectedHours,
      price: data.price,
      images: {
        mainImage: data.images.mainImage,
        gallery: (data.images.gallery ?? []).map((image) => ({ image })),
      },
      eventTypes: data.eventTypes.map((et) => et.id),
      includes: data.includes,
      excludes: data.excludes,
      details: [
        {
          blockType: "gastro",
          capacity: data.capacity,
          pricePerPerson: data.pricePerPerson,
          minimumOrderCount: data.minimumOrderCount,
          cuisines: data.cuisines.map((c) => c.id),
          dishTypes: data.dishTypes.map((d) => d.id),
          dietaryOptions: data.dietaryOptions.map((d) => d.id),
          foodServiceStyle: data.foodServiceStyle.map((f) => f.id),
          kidsMenu: data.kidsMenu,
          alcoholIncluded: data.alcoholIncluded,
          personnel: data.personnel.map((p) => p.id),
          necessities: data.necessities.map((n) => n.id),
        },
      ],
    });
  };

  return (
    <form onSubmit={rhfHandleSubmit(handleSubmit)} className="flex gap-6">
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
              placeholder: "Raut pro 50 osob",
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
                placeholder: "9900",
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

        {/* Kapacita a objednávky */}
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
              label="Maximální kapacita (osob)"
              inputProps={{
                ...register("capacity.max"),
                type: "number",
                min: 1,
                placeholder: "200",
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
                placeholder: "10",
              }}
              error={errors.capacity?.min?.message}
            />
            <Input
              label="Cena na osobu (Kč)"
              inputProps={{
                ...register("pricePerPerson"),
                type: "number",
                min: 0,
                placeholder: "350",
              }}
              error={errors.pricePerPerson?.message}
            />
            <Input
              label="Minimální počet objednávek"
              inputProps={{
                ...register("minimumOrderCount"),
                type: "number",
                min: 1,
                placeholder: "5",
              }}
              error={errors.minimumOrderCount?.message}
            />
          </div>
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
                  placeholder: "např. Obsluha, Nádobí...",
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
                  placeholder: "např. Alkohol, Doprava...",
                }}
              />
            )}
          />
        </FormSection>

        {/* Kuchyně a styl */}
        <FormSection
          id={S.cuisine.id}
          icon={S.cuisine.icon}
          title={S.cuisine.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="cuisines"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Kuchyně"
                items={listingCuisines}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="dishTypes"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Typy pokrmů"
                items={listingDishTypes}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="foodServiceStyle"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Styl servisu"
                items={listingFoodServiceStyles}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="dietaryOptions"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Dietní možnosti"
                items={listingDietaryOptions}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
        </FormSection>

        {/* Doplňky */}
        <FormSection
          id={S.extras.id}
          icon={S.extras.icon}
          title={S.extras.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <Controller
            control={control}
            name="alcoholIncluded"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Alkohol v nabídce"
                checkColor={COLOR.text}
              />
            )}
          />
          <Controller
            control={control}
            name="kidsMenu"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Dětské menu"
                checkColor={COLOR.text}
              />
            )}
          />
        </FormSection>

        {/* Personál a požadavky */}
        <FormSection
          id={S.personnel.id}
          icon={S.personnel.icon}
          title={S.personnel.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
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
          <Controller
            control={control}
            name="necessities"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Provozní požadavky"
                items={listingNecessities}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor={COLOR.text}
              />
            )}
          />
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
            text="Vytvořit variantu"
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
        buttonText="Vytvořit variantu"
      />
    </form>
  );
}
