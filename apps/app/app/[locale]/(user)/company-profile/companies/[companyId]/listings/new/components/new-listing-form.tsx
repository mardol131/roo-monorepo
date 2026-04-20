"use client";

import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import InputLabel from "@/app/components/ui/atoms/input-label";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import {
  MOCK_CITIES,
  MOCK_CUISINES,
  MOCK_DIETARY_OPTIONS,
  MOCK_DISH_TYPES,
  MOCK_ENTERTAINMENT_TYPES,
  MOCK_FOOD_SERVICE_STYLES,
  MOCK_MUNICIPALITIES,
  MOCK_NECESSITIES,
  MOCK_REGIONS,
} from "@/app/_mock/mock";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Building2,
  Clock,
  DoorOpen,
  Image,
  MapPin,
  Maximize2,
  Music,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import { uploadFileToCloud } from "@roo/common";
import AreaSpacesFields from "./area-spaces-fields";
import BuildingSpacesFields from "./building-spaces-fields";
import RoomSpacesFields from "./room-spaces-fields";
import IconCard from "./icon-card";

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
    { label: "Lokalita", sections: [SECTION_LOCATION] },
    { label: "Nabídka", sections: [SECTION_CAPACITY, SECTION_CUISINE] },
  ],
  entertainment: [
    {
      label: "Základní",
      sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
    },
    { label: "Lokalita", sections: [SECTION_LOCATION] },
    {
      label: "Program",
      sections: [SECTION_CAPACITY, SECTION_ENT_TYPES, SECTION_LOGISTICS],
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
  name: z.string().optional(),
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

const schema = z
  .object({
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
      address: z.string().min(1, "Adresa je povinná"),
      city: z.string().min(1, "Město je povinné"),
      postalCode: z.string().optional(),
      municipality: z.string().optional(),
      region: z.string().optional(),
    }),
    capacity: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    minimumCapacity: optionalPositiveNumber,

    // ── Venue-specific ───────────────────────────────────────────────────
    area: z.coerce.number().positive().optional(),
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
  })
  .superRefine((data, ctx) => {
    if (data.spaceType === "area") {
      if (!data.areaName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Název areálu je povinný",
          path: ["areaName"],
        });
      }
      if (data.hasBuildings) {
        data.buildings?.forEach((b, bi) => {
          if (!b.name?.trim()) {
            ctx.addIssue({
              code: "custom",
              message: "Název budovy je povinný",
              path: ["buildings", bi, "name"],
            });
          }
        });
      }
    } else if (data.spaceType === "building") {
      if (!data.buildingName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Název budovy je povinný",
          path: ["buildingName"],
        });
      }
    } else if (data.spaceType === "room") {
      if (!data.rooms || data.rooms.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Přidejte alespoň jednu místnost",
          path: ["rooms"],
        });
      }
    }
  });

export type FormInputs = z.infer<typeof schema>;

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
    resolver: zodResolver(schema) as unknown as Resolver<FormInputs>,
    defaultValues: {
      images: { gallery: [] },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* ── 1. Základní informace ──────────────────────────────────────────── */}
      <FormSection
        id="section-basic"
        icon={Building2}
        title="Základní informace"
        surfaceColor="bg-listing-surface"
        color="text-listing"
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
        id="section-price"
        icon={Banknote}
        title="Cena"
        surfaceColor="bg-listing-surface"
        color="text-listing"
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
        id="section-images"
        icon={Image}
        title="Obrázky"
        subtitle="Podporované formáty: jpg, png, webp"
        surfaceColor="bg-listing-surface"
        color="text-listing"
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
        id="section-location"
        icon={MapPin}
        title="Lokalita"
        surfaceColor="bg-listing-surface"
        color="text-listing"
      >
        <Input
          label="Adresa"
          inputProps={{
            ...register("location.address"),
            placeholder: "Václavské náměstí 1",
          }}
          error={errors.location?.address?.message}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="location.city"
            render={({ field }) => (
              <SearchInput
                label="Město"
                placeholder="Vyberte město..."
                options={MOCK_CITIES.map((c) => ({ id: c.id, label: c.name }))}
                value={
                  field.value
                    ? {
                        id: field.value,
                        label:
                          MOCK_CITIES.find((c) => c.id === field.value)?.name ??
                          "",
                      }
                    : undefined
                }
                onSelect={(o) => field.onChange(o.id)}
                onClear={() => field.onChange("")}
                error={errors.location?.city?.message}
              />
            )}
          />
          <Input
            label="PSČ"
            inputProps={{
              ...register("location.postalCode"),
              placeholder: "110 00",
            }}
            error={errors.location?.postalCode?.message}
          />
        </div>

        {/* Municipality + Region — only for gastro and entertainment */}
        {type !== "venue" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="location.municipality"
              render={({ field }) => (
                <SearchInput
                  label="Městská část"
                  placeholder="Vyberte část..."
                  options={MOCK_MUNICIPALITIES.map((m) => ({
                    id: m.id,
                    label: m.name,
                  }))}
                  value={
                    field.value
                      ? {
                          id: field.value,
                          label:
                            MOCK_MUNICIPALITIES.find(
                              (m) => m.id === field.value,
                            )?.name ?? "",
                        }
                      : undefined
                  }
                  onSelect={(o) => field.onChange(o.id)}
                  onClear={() => field.onChange("")}
                  error={errors.location?.municipality?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="location.region"
              render={({ field }) => (
                <SearchInput
                  label="Kraj"
                  placeholder="Vyberte kraj..."
                  options={MOCK_REGIONS.map((r) => ({
                    id: r.id,
                    label: r.name,
                  }))}
                  value={
                    field.value
                      ? {
                          id: field.value,
                          label:
                            MOCK_REGIONS.find((r) => r.id === field.value)
                              ?.name ?? "",
                        }
                      : undefined
                  }
                  onSelect={(o) => field.onChange(o.id)}
                  onClear={() => field.onChange("")}
                  error={errors.location?.region?.message}
                />
              )}
            />
          </div>
        )}
      </FormSection>

      {/* ── Venue: Kapacita a prostor ──────────────────────────────────────── */}
      {type === "venue" && (
        <>
          <FormSection
            id="section-capacity"
            icon={Maximize2}
            title="Kapacita a prostor"
            surfaceColor="bg-listing-surface"
            color="text-listing"
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
            id="section-spaces"
            icon={DoorOpen}
            title="Prostory"
            surfaceColor="bg-listing-surface"
            color="text-listing"
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
            id="section-capacity"
            icon={Users}
            title="Kapacita"
            surfaceColor="bg-listing-surface"
            color="text-listing"
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
            id="section-cuisine"
            icon={UtensilsCrossed}
            title="Kuchyně a styl"
            surfaceColor="bg-listing-surface"
            color="text-listing"
          >
            <Controller
              control={control}
              name="cuisines"
              render={({ field }) => (
                <CheckboxGroup
                  label="Kuchyně"
                  items={MOCK_CUISINES}
                  value={field.value}
                  onChange={field.onChange}
                  checkColor="text-listing"
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
                  checkColor="text-listing"
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
                  checkColor="text-listing"
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
                  checkColor="text-listing"
                />
              )}
            />
            <div className="flex flex-col gap-2">
              <InputLabel label="Doplňky" />
              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name="hasAlcoholLicense"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      label="Alkoholová licence"
                      checkColor="text-listing"
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
                      checkColor="text-listing"
                    />
                  )}
                />
              </div>
            </div>
            <Controller
              control={control}
              name="necessities"
              render={({ field }) => (
                <CheckboxGroup
                  label="Technické požadavky"
                  items={MOCK_NECESSITIES}
                  value={field.value}
                  onChange={field.onChange}
                  checkColor="text-listing"
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
            id="section-capacity"
            icon={Users}
            title="Kapacita"
            surfaceColor="bg-listing-surface"
            color="text-listing"
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
            id="section-ent-types"
            icon={Music}
            title="Typ programu"
            surfaceColor="bg-listing-surface"
            color="text-listing"
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
                  checkColor="text-listing"
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
                        checkColor="text-listing"
                      />
                    )}
                  />
                ))}
              </div>
            </div>
            <Controller
              control={control}
              name="necessities"
              render={({ field }) => (
                <CheckboxGroup
                  label="Technické požadavky"
                  items={MOCK_NECESSITIES}
                  value={field.value}
                  onChange={field.onChange}
                  checkColor="text-listing"
                />
              )}
            />
          </FormSection>

          <FormSection
            id="section-logistics"
            icon={Clock}
            title="Logistika"
            surfaceColor="bg-listing-surface"
            color="text-listing"
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
          version="listingFull"
          htmlType="submit"
        />
      </div>
    </form>
  );
}
