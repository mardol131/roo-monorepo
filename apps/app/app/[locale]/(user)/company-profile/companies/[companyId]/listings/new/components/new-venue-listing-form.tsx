"use client";

import Button from "@/app/components/ui/atoms/button";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import { MOCK_CITIES } from "@/app/_mock/mock";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Building2,
  DoorOpen,
  Image,
  Landmark,
  MapPin,
  Maximize2,
  TreePine,
} from "lucide-react";
import InputLabel from "@/app/components/ui/atoms/input-label";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { uploadFileToCloud } from "@roo/common";
import AreaSpacesFields from "./area-spaces-fields";
import BuildingSpacesFields from "./building-spaces-fields";
import RoomSpacesFields from "./room-spaces-fields";
import Text from "@/app/components/ui/atoms/text";

// ── Sections config (exported for TOC) ────────────────────────────────────────

export const VENUE_FORM_SECTIONS = [
  { id: "section-basic", title: "Základní informace", icon: Building2 },
  { id: "section-price", title: "Cena", icon: Banknote },
  { id: "section-images", title: "Obrázky", icon: Image },
  { id: "section-location", title: "Lokalita", icon: MapPin },
  { id: "section-capacity", title: "Kapacita a prostor", icon: Maximize2 },
  { id: "section-spaces", title: "Prostory", icon: DoorOpen },
] as const;

// ── Helpers ─────────────────────────────────────────────────────────────────────

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Musí být kladné číslo").optional(),
);

// ── Sub-schemas ────────────────────────────────────────────────────────────────

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
    name: z.string().min(1, "Název je povinný"),
    images: z.object({
      coverImage: z
        .string({ message: "Titulní obrázek je povinný" })
        .min(1, "Titulní obrázek je povinný"),
      logo: z.string().optional(),
      gallery: z
        .array(z.string(), { message: "Přidejte alespoň čtyři obrázky" })
        .min(4, "Přidejte alespoň čtyři obrázky"),
    }),
    price: z.object({
      startsAt: z.coerce
        .number({ message: "Zadejte číslo" })
        .positive("Cena musí být kladná"),
    }),
    location: z.object({
      address: z
        .string({ message: "Adresa je povinná" })
        .min(1, "Adresa je povinná"),
      city: z
        .string({ message: "Město je povinné" })
        .min(1, "Město je povinné"),
      postalCode: z
        .string({ message: "PSČ je povinné" })
        .min(1, "PSČ je povinné"),
    }),
    capacity: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    area: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Plocha musí být kladná"),

    spaceType: z.enum(["area", "building", "room"], {
      message: "Vyberte typ prostoru",
    }),

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
  })
  .superRefine((data, ctx) => {
    if (data.spaceType === "area") {
      if (!data.areaName || data.areaName.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Název areálu je povinný",
          path: ["areaName"],
        });
      }
      if (data.hasBuildings) {
        data.buildings?.forEach((building, bi) => {
          if (!building.name || building.name.trim().length === 0) {
            ctx.addIssue({
              code: "custom",
              message: "Název budovy je povinný",
              path: ["buildings", bi, "name"],
            });
          }
          if (building.hasRooms) {
            building.rooms?.forEach((room, ri) => {
              if (!room.name || room.name.trim().length === 0) {
                ctx.addIssue({
                  code: "custom",
                  message: "Název místnosti je povinný",
                  path: ["buildings", bi, "rooms", ri, "name"],
                });
              }
            });
          }
        });
      }
    } else if (data.spaceType === "building") {
      if (!data.buildingName || data.buildingName.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Název budovy je povinný",
          path: ["buildingName"],
        });
      }
      if (data.buildingHasRooms) {
        data.buildingRooms?.forEach((room, ri) => {
          if (!room.name || room.name.trim().length === 0) {
            ctx.addIssue({
              code: "custom",
              message: "Název místnosti je povinný",
              path: ["buildingRooms", ri, "name"],
            });
          }
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
      data.rooms?.forEach((room, ri) => {
        if (!room.name || room.name.trim().length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Název místnosti je povinný",
            path: ["rooms", ri, "name"],
          });
        }
      });
    }
  });

// ── Types ──────────────────────────────────────────────────────────────────────

export type FormInputs = z.infer<typeof schema>;

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  onSubmit: (data: FormInputs) => void;
  onCancel: () => void;
  onFormChange?: (values: FormInputs) => void;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function NewVenueListingForm({
  onSubmit,
  onCancel,
  onFormChange,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema) as unknown as Resolver<FormInputs>,
    defaultValues: {
      images: { gallery: [] },
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as FormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  const spaceTypeValue = watch("spaceType");

  console.log({
    errors,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* ── 1. Základní informace ─────────────────────────────────────────────── */}
      <FormSection
        id="section-basic"
        icon={Building2}
        title="Základní informace"
        surfaceColor="bg-listing-surface"
        color="text-listing"
      >
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Kongresové centrum Praha",
            }}
            error={errors.name?.message}
          />
        </div>
      </FormSection>

      {/* ── 2. Cena ───────────────────────────────────────────────────────────── */}
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

      {/* ── 3. Obrázky ────────────────────────────────────────────────────────── */}
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
              onChange={(filename) => field.onChange(filename ?? "")}
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
              onChange={(filename) => field.onChange(filename ?? "")}
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

      {/* ── 4. Lokalita ───────────────────────────────────────────────────────── */}
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
                options={MOCK_CITIES.map((c) => ({
                  id: c.id,
                  label: c.name,
                }))}
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
                onSelect={(option) => field.onChange(option.id)}
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
      </FormSection>

      {/* ── 5. Kapacita a prostor ─────────────────────────────────────────────── */}
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

      {/* ── 6. Prostory ───────────────────────────────────────────────────────── */}
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
                      icon: TreePine,
                    },
                    {
                      value: "building",
                      label: "Budova",
                      description: "Nabízíme budovu s více místnostmi",
                      icon: Landmark,
                    },
                    {
                      value: "room",
                      label: "Místnosti",
                      description: "Nabízíme jednotlivé místnosti",
                      icon: DoorOpen,
                    },
                  ] as const
                ).map((option) => {
                  const isSelected = field.value === option.value;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors cursor-pointer ${
                        isSelected
                          ? "border-listing bg-listing-surface"
                          : "border-zinc-400 hover:border-listing"
                      }`}
                    >
                      <Icon
                        size={28}
                        className={
                          isSelected ? "text-listing" : "text-muted-foreground"
                        }
                      />
                      <Text variant="label1">{option.label}</Text>
                      <Text variant="label2" color="light">
                        {option.description}
                      </Text>
                    </button>
                  );
                })}
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

      {/* ── Submit ────────────────────────────────────────────────────────────── */}
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
