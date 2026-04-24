"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import {
  MOCK_CITIES,
  MOCK_CUISINES,
  MOCK_DIETARY_OPTIONS,
  MOCK_DISH_TYPES,
  MOCK_DISTRICTS,
  MOCK_ENTERTAINMENT_TYPES,
  MOCK_FOOD_SERVICE_STYLES,
  MOCK_NECESSITIES,
  MOCK_REGIONS,
} from "@/app/_mock/mock";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloud } from "@roo/common";
import {
  Banknote,
  Building2,
  ClipboardList,
  Clock,
  DoorOpen,
  Image,
  MapPin,
  Music,
  Package,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AreaSpacesFields from "./area-spaces-fields";
import BuildingSpacesFields from "./building-spaces-fields";
import IconCard from "./icon-card";
import RoomSpacesFields from "./room-spaces-fields";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ListingType = "venue" | "gastro" | "entertainment";

// ── TOC groups per listing type ────────────────────────────────────────────────

const SECTION_BASIC = {
  id: "section-basic",
  title: "Základní informace",
  icon: Building2,
};
const SECTION_PRICE = { id: "section-price", title: "Cena", icon: Banknote };
const SECTION_IMAGES = { id: "section-images", title: "Obrázky", icon: Image };
const SECTION_LOCATION = {
  id: "section-location",
  title: "Lokalita",
  icon: MapPin,
};
const SECTION_LOCATION_GASTRO_ENTERTAINMENT = {
  id: "section-location",
  title: "Místo působení",
  icon: MapPin,
};
const SECTION_CAPACITY = {
  id: "section-capacity",
  title: "Kapacita",
  icon: Users,
};
const SECTION_SPACES = {
  id: "section-spaces",
  title: "Prostory",
  icon: DoorOpen,
};
const SECTION_CUISINE = {
  id: "section-cuisine",
  title: "Kuchyně a styl",
  icon: UtensilsCrossed,
};
const SECTION_ENT_TYPES = {
  id: "section-ent-types",
  title: "Typ programu",
  icon: Music,
};
const SECTION_LOGISTICS = {
  id: "section-logistics",
  title: "Logistika",
  icon: Clock,
};
const SECTION_EXTRAS = {
  id: "section-extras",
  title: "Doplňky",
  icon: Package,
};
const SECTION_REQUIREMENTS = {
  id: "section-requirements",
  title: "Provozní požadavky",
  icon: ClipboardList,
};

const COLOR_SCHEME = {
  text: "text-listing",
  surface: "bg-listing-surface",
  fullBg: "bg-listing",
};

const BUTTON_COLOR: ButtonProps["version"] = "listingFull";

export const FORM_GROUPS: Record<ListingType, readonly TocGroup[]> = {
  venue: [
    {
      label: "Základní",
      sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
    },
    {
      label: "Místo a prostor",
      sections: [SECTION_LOCATION, SECTION_CAPACITY, SECTION_SPACES],
    },
  ],
  gastro: [
    {
      label: "Základní",
      sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
    },
    {
      label: "Místo působení",
      sections: [SECTION_LOCATION_GASTRO_ENTERTAINMENT],
    },
    {
      label: "Nabídka",
      sections: [
        SECTION_CAPACITY,
        SECTION_CUISINE,
        SECTION_EXTRAS,
        SECTION_REQUIREMENTS,
      ],
    },
  ],
  entertainment: [
    {
      label: "Základní",
      sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
    },
    {
      label: "Místo působení",
      sections: [SECTION_LOCATION_GASTRO_ENTERTAINMENT],
    },
    {
      label: "Program",
      sections: [
        SECTION_CAPACITY,
        SECTION_ENT_TYPES,
        SECTION_REQUIREMENTS,
        SECTION_LOGISTICS,
      ],
    },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Musí být kladné číslo").optional(),
);

// ── Sub-schemas (venue spaces) ─────────────────────────────────────────────────

const roomSchema = z.object({
  name: z.string().min(1, "Název místnosti je povinný"),
  description: z.string().optional(),
  capacity: optionalPositiveNumber,
  area: optionalPositiveNumber,
});

const buildingSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  capacity: optionalPositiveNumber,
  area: optionalPositiveNumber,
  hasRooms: z.boolean().default(false),
  rooms: z.array(roomSchema).default([]),
});

// ── Schema ─────────────────────────────────────────────────────────────────────

const baseSchema = z.object({
  // ── Shared ──────────────────────────────────────────────────────────
  name: z.string().min(1, "Název je povinný"),
  images: z.object({
    coverImage: z.string().min(1, "Titulní obrázek je povinný"),
    logo: z.string().optional(),
    gallery: z.array(z.string()).min(4, "Přidejte alespoň čtyři obrázky"),
  }),
  price: z.object({
    startsAt: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Cena musí být kladná"),
  }),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(), // venue: single required city
    districts: z.array(z.string()).default([]), // gastro/entertainment
    regions: z.array(z.string()).default([]), // gastro/entertainment
    cities: z.array(z.string()).default([]), // gastro/entertainment
  }),
  capacity: z.coerce
    .number({ message: "Zadejte číslo" })
    .positive("Kapacita musí být kladná")
    .int("Zadejte celé číslo"),
  minimumCapacity: optionalPositiveNumber,

  // ── Venue-specific ───────────────────────────────────────────────────
  area: optionalPositiveNumber,
  spaceType: z.enum(["area", "building", "room"]).optional(),
  areaName: z.string().optional(),
  areaDescription: z.string().optional(),
  areaCapacity: optionalPositiveNumber,
  areaArea: optionalPositiveNumber,
  hasBuildings: z.boolean().default(false),
  buildings: z.array(buildingSchema).default([]),
  buildingName: z.string().optional(),
  buildingDescription: z.string().optional(),
  buildingCapacity: optionalPositiveNumber,
  buildingArea: optionalPositiveNumber,
  buildingHasRooms: z.boolean().default(false),
  buildingRooms: z.array(roomSchema).default([]),
  rooms: z.array(roomSchema).default([]),

  // ── Gastro-specific ──────────────────────────────────────────────────
  cuisines: z.array(z.string()).default([]),
  dishTypes: z.array(z.string()).default([]),
  dietaryOptions: z.array(z.string()).default([]),
  foodServiceStyles: z.array(z.string()).default([]),
  hasAlcoholLicense: z.boolean().default(false),
  kidsMenu: z.boolean().default(false),
  necessities: z.array(z.string()).default([]),

  // ── Entertainment-specific ───────────────────────────────────────────
  entertainmentTypes: z.array(z.string()).default([]),
  audience: z.array(z.enum(["adults", "kids", "seniors"])).default([]),
  setupTime: optionalPositiveNumber,
  tearDownTime: optionalPositiveNumber,
});

export type FormInputs = z.infer<typeof baseSchema>;

// ── Resolver ───────────────────────────────────────────────────────────────────

type ResolverResult = {
  values: Partial<FormInputs>;
  errors: Record<string, unknown>;
};
type ResolverFn = (
  values: unknown,
  ctx: unknown,
  opts: unknown,
) => Promise<ResolverResult>;

function makeResolver(listingType: ListingType): ResolverFn {
  const zResolver = zodResolver(baseSchema) as unknown as ResolverFn;

  return async (values, ctx, opts) => {
    const result = await zResolver(values, ctx, opts);
    const v = values as FormInputs;

    const locErrors = (result.errors.location as Record<string, unknown>) ?? {};

    if (listingType === "venue") {
      if (!v.location?.address?.trim()) {
        result.errors = {
          ...result.errors,
          location: {
            ...locErrors,
            address: { type: "required", message: "Adresa je povinná" },
          },
        };
      }
      if (!v.location?.city) {
        result.errors = {
          ...result.errors,
          location: {
            ...((result.errors.location as Record<string, unknown>) ?? {}),
            city: { type: "required", message: "Město je povinné" },
          },
        };
      }
    } else {
      if (!v.location?.regions?.length) {
        result.errors = {
          ...result.errors,
          location: {
            ...locErrors,
            regions: {
              type: "required",
              message: "Vyberte alespoň jeden kraj",
            },
          },
        };
      }
    }

    if (listingType !== "venue") return result;

    if (!v.spaceType) {
      result.errors = {
        ...result.errors,
        spaceType: { type: "required", message: "Vyberte typ prostoru" },
      };
    }

    if (v.spaceType === "area") {
      if (!v.areaName?.trim()) {
        result.errors = {
          ...result.errors,
          areaName: { type: "required", message: "Název areálu je povinný" },
        };
      }
      if (v.hasBuildings) {
        const prev = (result.errors.buildings as Record<string, unknown>) ?? {};
        const buildingsErrors: Record<string, unknown> = { ...prev };
        v.buildings?.forEach((b, bi) => {
          if (!b.name?.trim()) {
            buildingsErrors[bi] = {
              ...((buildingsErrors[bi] as Record<string, unknown>) ?? {}),
              name: { type: "required", message: "Název budovy je povinný" },
            };
          }
        });
        result.errors = { ...result.errors, buildings: buildingsErrors };
      }
    } else if (v.spaceType === "building") {
      if (!v.buildingName?.trim()) {
        result.errors = {
          ...result.errors,
          buildingName: {
            type: "required",
            message: "Název budovy je povinný",
          },
        };
      }
    }

    return result;
  };
}

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  type: ListingType;
  onSubmit: (data: FormInputs) => void;
  onCancel: () => void;
  onFormChange?: (values: FormInputs) => void;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function NewListingForm({
  type,
  onSubmit,
  onCancel,
  onFormChange,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: makeResolver(type) as unknown as Resolver<FormInputs>,
    defaultValues: {
      location: { districts: [], regions: [], cities: [] },
      images: { gallery: [] },
      rooms: [{ name: "", description: "", capacity: undefined, area: undefined }],
      cuisines: [],
      dishTypes: [],
      dietaryOptions: [],
      foodServiceStyles: [],
      entertainmentTypes: [],
      audience: [],
      necessities: [],
      hasAlcoholLicense: false,
      kidsMenu: false,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as FormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  const spaceTypeValue = watch("spaceType");
  const regionsValue = watch("location.regions");
  const districtsValue = watch("location.districts");
  const citiesValue = watch("location.cities");

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
          error={!!errors.name}
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder:
                type === "venue"
                  ? "Kongresové centrum Praha"
                  : type === "gastro"
                    ? "Catering Praha s.r.o."
                    : "Živá kapela Groove",
            }}
            error={errors.name?.message}
          />
        </FormSection>

        {/* ── 2. Cena ───────────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_PRICE.id}
          icon={SECTION_PRICE.icon}
          title={SECTION_PRICE.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.price?.startsAt}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cena od (Kč)"
              inputProps={{
                ...register("price.startsAt"),
                type: "number",
                min: 0,
                placeholder: "9900",
              }}
              error={errors.price?.startsAt?.message}
            />
          </div>
        </FormSection>

        {/* ── 3. Obrázky ────────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_IMAGES.id}
          icon={SECTION_IMAGES.icon}
          title={SECTION_IMAGES.title}
          subtitle="Podporované formáty: jpg, png, webp"
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!(errors.images?.coverImage || errors.images?.gallery)}
        >
          <Controller
            control={control}
            name="images.coverImage"
            render={({ field }) => (
              <ImageInput
                label="Titulní obrázek"
                value={field.value}
                onChange={(f) => field.onChange(f ?? "")}
                onUpload={uploadFileToCloud}
                error={errors.images?.coverImage?.message}
                isRequired
              />
            )}
          />
          <Controller
            control={control}
            name="images.logo"
            render={({ field }) => (
              <ImageInput
                label="Logo"
                value={field.value}
                onChange={(f) => field.onChange(f ?? "")}
                onUpload={uploadFileToCloud}
                error={errors.images?.logo?.message}
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

        {/* ── 4. Lokalita ───────────────────────────────────────────────────── */}
        <FormSection
          id={
            type === "venue"
              ? SECTION_LOCATION.id
              : SECTION_LOCATION_GASTRO_ENTERTAINMENT.id
          }
          icon={
            type === "venue"
              ? SECTION_LOCATION.icon
              : SECTION_LOCATION_GASTRO_ENTERTAINMENT.icon
          }
          title={
            type === "venue"
              ? SECTION_LOCATION.title
              : SECTION_LOCATION_GASTRO_ENTERTAINMENT.title
          }
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!(errors.location?.regions || errors.location?.city)}
        >
          {/* Venue: adresa + město (oboje povinné) */}
          {type === "venue" && (
            <>
              <Input
                label="Adresa *"
                inputProps={{
                  ...register("location.address"),
                  placeholder: "Václavské náměstí 1",
                }}
                error={errors.location?.address?.message}
              />
              <Controller
                control={control}
                name="location.city"
                render={({ field }) => (
                  <SearchInput
                    label="Město *"
                    placeholder="Vyberte město..."
                    options={MOCK_CITIES.map((c) => ({
                      id: c.id,
                      label: c.name,
                    }))}
                    type="dropdown"
                    value={
                      field.value
                        ? {
                            id: field.value,
                            label:
                              MOCK_CITIES.find((c) => c.id === field.value)
                                ?.name ?? "",
                          }
                        : undefined
                    }
                    onSelect={(o) => field.onChange(o.id)}
                    onClear={() => field.onChange("")}
                    error={errors.location?.city?.message}
                  />
                )}
              />
            </>
          )}

          {/* Gastro / Entertainment: kraj → část → město → adresa */}
          {type !== "venue" && (
            <>
              <Controller
                control={control}
                name="location.regions"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Kraj"
                    items={MOCK_REGIONS}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                  />
                )}
              />
              <Controller
                control={control}
                name="location.districts"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Okres"
                    items={MOCK_DISTRICTS}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                    closed={!regionsValue?.length}
                    closedMessage="Nejprve vyplňte předchozí pole
"
                  />
                )}
              />
              <Controller
                control={control}
                name="location.cities"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Město"
                    items={MOCK_CITIES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                    closed={!districtsValue?.length}
                    closedMessage="Nejprve vyplňte předchozí pole"
                  />
                )}
              />
              <Input
                label="Adresa"
                subLabel={
                  !citiesValue?.length
                    ? "Nejprve vyplňte předchozí pole"
                    : undefined
                }
                inputProps={{
                  ...register("location.address"),
                  placeholder: "Václavské náměstí 1",
                }}
                disabled={!citiesValue?.length}
                error={errors.location?.address?.message}
              />
            </>
          )}
        </FormSection>

        {/* ── Venue: Kapacita a prostor ──────────────────────────────────────── */}
        {type === "venue" && (
          <>
            <FormSection
              id={SECTION_CAPACITY.id}
              icon={SECTION_CAPACITY.icon}
              title={SECTION_CAPACITY.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
              error={!!errors.capacity}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Kapacita (osob)"
                  inputProps={{
                    ...register("capacity"),
                    type: "number",
                    min: 1,
                    placeholder: "300",
                  }}
                  error={errors.capacity?.message}
                />
                <Input
                  label="Plocha (m²)"
                  inputProps={{
                    ...register("area"),
                    type: "number",
                    min: 1,
                    placeholder: "800",
                  }}
                  error={errors.area?.message}
                />
              </div>
            </FormSection>

            <FormSection
              id={SECTION_SPACES.id}
              icon={SECTION_SPACES.icon}
              title={SECTION_SPACES.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
              error={
                !!(
                  errors.spaceType ||
                  errors.areaName ||
                  errors.buildings ||
                  errors.buildingName ||
                  errors.rooms?.[0]?.name
                )
              }
            >
              <Controller
                control={control}
                name="spaceType"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <InputLabel label="Co nabízíte?" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(
                        [
                          {
                            value: "area",
                            label: "Areál",
                            description:
                              "Nabízíme celý areál s více budovami a prostory",
                            icon: "TreePine",
                          },
                          {
                            value: "building",
                            label: "Budova",
                            description: "Nabízíme budovu s více místnostmi",
                            icon: "Landmark",
                          },
                          {
                            value: "room",
                            label: "Místnosti",
                            description: "Nabízíme jednotlivé místnosti",
                            icon: "DoorOpen",
                          },
                        ] as const
                      ).map((option) => (
                        <IconCard
                          key={option.value}
                          label={option.label}
                          description={option.description}
                          icon={option.icon}
                          selected={field.value === option.value}
                          onClick={() => field.onChange(option.value)}
                        />
                      ))}
                    </div>
                    {errors.spaceType?.message && (
                      <ErrorText error={errors.spaceType.message} />
                    )}
                  </div>
                )}
              />
              {spaceTypeValue === "area" && (
                <AreaSpacesFields
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                />
              )}
              {spaceTypeValue === "building" && (
                <BuildingSpacesFields
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                />
              )}
              {spaceTypeValue === "room" && (
                <RoomSpacesFields
                  control={control}
                  register={register}
                  errors={errors}
                />
              )}
            </FormSection>
          </>
        )}

        {/* ── Gastro: Kapacita + Kuchyně ────────────────────────────────────── */}
        {type === "gastro" && (
          <>
            <FormSection
              id={SECTION_CAPACITY.id}
              icon={SECTION_CAPACITY.icon}
              title={SECTION_CAPACITY.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
              error={!!errors.capacity}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Maximální kapacita (osob)"
                  inputProps={{
                    ...register("capacity"),
                    type: "number",
                    min: 1,
                    placeholder: "200",
                  }}
                  error={errors.capacity?.message}
                />
                <Input
                  label="Minimální kapacita (osob)"
                  inputProps={{
                    ...register("minimumCapacity"),
                    type: "number",
                    min: 1,
                    placeholder: "10",
                  }}
                  error={errors.minimumCapacity?.message}
                />
              </div>
            </FormSection>

            <FormSection
              id={SECTION_CUISINE.id}
              icon={SECTION_CUISINE.icon}
              title={SECTION_CUISINE.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
            >
              <Controller
                control={control}
                name="cuisines"
                render={({ field }) => (
                  <CheckboxGroup
                    searchable
                    label="Kuchyně"
                    items={MOCK_CUISINES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                  />
                )}
              />
              <Controller
                control={control}
                name="dishTypes"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Typy pokrmů"
                    items={MOCK_DISH_TYPES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                  />
                )}
              />
              <Controller
                control={control}
                name="foodServiceStyles"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Styl servisu"
                    items={MOCK_FOOD_SERVICE_STYLES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                  />
                )}
              />
              <Controller
                control={control}
                name="dietaryOptions"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Dietní možnosti"
                    items={MOCK_DIETARY_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                  />
                )}
              />
            </FormSection>

            <FormSection
              id={SECTION_EXTRAS.id}
              icon={SECTION_EXTRAS.icon}
              title={SECTION_EXTRAS.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
            >
              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name="hasAlcoholLicense"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      label="Alkoholová licence"
                      checkColor={COLOR_SCHEME.text}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="kidsMenu"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      label="Dětské menu"
                      checkColor={COLOR_SCHEME.text}
                    />
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              id={SECTION_REQUIREMENTS.id}
              icon={SECTION_REQUIREMENTS.icon}
              title={SECTION_REQUIREMENTS.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
            >
              <Controller
                control={control}
                name="necessities"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Provozní požadavky"
                    items={MOCK_NECESSITIES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                    searchable
                  />
                )}
              />
            </FormSection>
          </>
        )}

        {/* ── Entertainment: Kapacita + Typy + Logistika ────────────────────── */}
        {type === "entertainment" && (
          <>
            <FormSection
              id={SECTION_CAPACITY.id}
              icon={SECTION_CAPACITY.icon}
              title={SECTION_CAPACITY.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
              error={!!errors.capacity}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Maximální počet diváků"
                  inputProps={{
                    ...register("capacity"),
                    type: "number",
                    min: 1,
                    placeholder: "500",
                  }}
                  error={errors.capacity?.message}
                />
                <Input
                  label="Minimální počet diváků"
                  inputProps={{
                    ...register("minimumCapacity"),
                    type: "number",
                    min: 1,
                    placeholder: "20",
                  }}
                  error={errors.minimumCapacity?.message}
                />
              </div>
            </FormSection>

            <FormSection
              id={SECTION_ENT_TYPES.id}
              icon={SECTION_ENT_TYPES.icon}
              title={SECTION_ENT_TYPES.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
            >
              <Controller
                control={control}
                name="entertainmentTypes"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Co nabízíte?"
                    items={MOCK_ENTERTAINMENT_TYPES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                  />
                )}
              />
              <div className="flex flex-col gap-2">
                <InputLabel label="Cílové publikum" />
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "adults", label: "Dospělí" },
                      { value: "kids", label: "Děti" },
                      { value: "seniors", label: "Senioři" },
                    ] as const
                  ).map(({ value, label }) => (
                    <Controller
                      key={value}
                      control={control}
                      name="audience"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value.includes(value)}
                          onChange={(checked) =>
                            field.onChange(
                              checked
                                ? [...field.value, value]
                                : field.value.filter((v) => v !== value),
                            )
                          }
                          label={label}
                          checkColor={COLOR_SCHEME.text}
                        />
                      )}
                    />
                  ))}
                </div>
              </div>
            </FormSection>

            <FormSection
              id={SECTION_REQUIREMENTS.id}
              icon={SECTION_REQUIREMENTS.icon}
              title={SECTION_REQUIREMENTS.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
            >
              <Controller
                control={control}
                name="necessities"
                render={({ field }) => (
                  <CheckboxGroup
                    label="Provozní požadavky"
                    items={MOCK_NECESSITIES}
                    value={field.value}
                    onChange={field.onChange}
                    checkColor={COLOR_SCHEME.text}
                  />
                )}
              />
            </FormSection>

            <FormSection
              id={SECTION_LOGISTICS.id}
              icon={SECTION_LOGISTICS.icon}
              title={SECTION_LOGISTICS.title}
              surfaceColor={COLOR_SCHEME.surface}
              color={COLOR_SCHEME.text}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Čas přípravy (minuty)"
                  inputProps={{
                    ...register("setupTime"),
                    type: "number",
                    min: 0,
                    placeholder: "60",
                  }}
                  error={errors.setupTime?.message}
                />
                <Input
                  label="Čas úklidu (minuty)"
                  inputProps={{
                    ...register("tearDownTime"),
                    type: "number",
                    min: 0,
                    placeholder: "30",
                  }}
                  error={errors.tearDownTime?.message}
                />
              </div>
            </FormSection>
          </>
        )}

        {/* ── Submit ────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            onClick={onCancel}
            version="plain"
          />
          <Button
            text="Vytvořit listing"
            version={BUTTON_COLOR}
            htmlType="submit"
          />
        </div>
      </div>
      <FormToc
        textColor="text-listing"
        dotColor="text-listing"
        surfaceColor="bg-listing-surface"
        groups={FORM_GROUPS[type]}
        sticky={true}
        buttonVersion="listingFull"
        buttonText="Uložení"
      />
    </form>
  );
}
