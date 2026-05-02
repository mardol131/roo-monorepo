"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCities } from "@/app/react-query/cities/hooks";
import { CreateListingPayload } from "@/app/react-query/listings/fetch";
import { useCreateListing } from "@/app/react-query/listings/hooks";
import { uploadFileToCloud } from "@roo/common";
import {
  Banknote,
  Building2,
  DoorOpen,
  Image,
  MapPin,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Control, Controller, Resolver, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { z } from "zod";
import AreaSpacesFields from "../components/area-spaces-fields";
import BuildingSpacesFields from "../components/building-spaces-fields";
import IconCard from "../components/icon-card";
import RoomSpacesFields from "../components/room-spaces-fields";
import { useRouter } from "@/app/i18n/navigation";

// ── Schema ─────────────────────────────────────────────────────────────────────

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Musí být kladné číslo").optional(),
);

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

const schema = z
  .object({
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
    }),
    capacity: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    area: optionalPositiveNumber,
    spaceType: z.enum(["area", "building", "room"] as const, {
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
    if (data.spaceType === "area" && !data.areaName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Název areálu je povinný",
        path: ["areaName"],
      });
    }
    if (data.spaceType === "area" && data.hasBuildings) {
      data.buildings?.forEach((b, bi) => {
        if (!b.name?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Název budovy je povinný",
            path: ["buildings", bi, "name"],
          });
        }
      });
    }
    if (data.spaceType === "building" && !data.buildingName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Název budovy je povinný",
        path: ["buildingName"],
      });
    }
  });

export type VenueFormInputs = z.infer<typeof schema>;
type Inputs = VenueFormInputs;

// ── TOC ────────────────────────────────────────────────────────────────────────

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

const FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
  },
  {
    label: "Místo a prostor",
    sections: [SECTION_LOCATION, SECTION_CAPACITY, SECTION_SPACES],
  },
];

const COLOR_SCHEME = { text: "text-listing", surface: "bg-listing-surface" };
const BUTTON_COLOR: ButtonProps["version"] = "listingFull";

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  onCancel: () => void;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function VenueListingForm({ onCancel }: Props) {
  const { companyId } = useParams<{ companyId: string }>();
  const { mutate } = useCreateListing();
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema) as Resolver<Inputs>,
    defaultValues: {
      images: { gallery: [] },
      rooms: [],
      buildings: [],
      buildingRooms: [],
      hasBuildings: false,
      buildingHasRooms: false,
    },
  });

  function onSubmit(data: Inputs) {
    const payload: CreateListingPayload = {
      company: companyId,
      name: data.name,
      images: {
        coverImage: data.images.coverImage,
        logo: data.images.logo,
        gallery: data.images.gallery.map((url) => ({ url })),
      },
      price: { startsAt: data.price.startsAt },
      details: [
        {
          location: {
            address: data.location.address,
            city: data.location.city,
          },
          spacesType: data.spaceType,
          capacity: data.capacity,
          area: data.area ?? 0,
          blockType: "venue",
        },
      ],
    };
    mutate(payload, {
      onSuccess: () => {
        router.push({
          pathname: "/company-profile/companies/[companyId]/listings",
          params: { companyId },
        });
      },
    });
  }

  const spaceTypeValue = watch("spaceType");

  const [venueCitySearch, setVenueCitySearch] = useState("");
  const { data: venueCitiesData } = useCities({
    query: venueCitySearch
      ? { name: { contains: venueCitySearch } }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
        {/* ── Základní informace ──────────────────────────────────────────────── */}
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
              placeholder: "Kongresové centrum Praha",
            }}
            error={errors.name?.message}
          />
        </FormSection>

        {/* ── Cena ────────────────────────────────────────────────────────────── */}
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

        {/* ── Obrázky ─────────────────────────────────────────────────────────── */}
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

        {/* ── Lokalita ────────────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_LOCATION.id}
          icon={SECTION_LOCATION.icon}
          title={SECTION_LOCATION.title}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!(errors.location?.address || errors.location?.city)}
        >
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
                onSearchQueryChange={setVenueCitySearch}
                options={venueCitiesData?.docs ?? []}
                type="dropdown"
                value={
                  field.value
                    ? {
                        id: field.value,
                        name:
                          venueCitiesData?.docs.find(
                            (c) => c.id === field.value,
                          )?.name ?? "",
                      }
                    : undefined
                }
                onSelect={(o) => field.onChange(o.id)}
                onClear={() => field.onChange("")}
                error={errors.location?.city?.message}
              />
            )}
          />
        </FormSection>

        {/* ── Kapacita ────────────────────────────────────────────────────────── */}
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

        {/* ── Prostory ────────────────────────────────────────────────────────── */}
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
              control={control as Control<VenueFormInputs>}
              register={register}
              errors={errors}
              watch={watch}
            />
          )}
          {spaceTypeValue === "building" && (
            <BuildingSpacesFields
              control={control as Control<VenueFormInputs>}
              register={register}
              errors={errors}
              watch={watch}
            />
          )}
          {spaceTypeValue === "room" && (
            <RoomSpacesFields
              control={control as Control<VenueFormInputs>}
              register={register}
              errors={errors}
            />
          )}
        </FormSection>

        {/* ── Submit ──────────────────────────────────────────────────────────── */}
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
        groups={FORM_GROUPS}
        sticky
        buttonVersion="listingFull"
        buttonText="Uložení"
      />
    </form>
  );
}
