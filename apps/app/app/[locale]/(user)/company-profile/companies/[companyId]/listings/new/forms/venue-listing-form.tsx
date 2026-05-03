"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
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
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { z } from "zod";
import IconCard from "../components/icon-card";
import { useRouter } from "@/app/i18n/navigation";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";

// ── Schema ─────────────────────────────────────────────────────────────────────

const itemSchema = z.object({ id: z.string(), name: z.string() });

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Musí být kladné číslo").optional(),
);

const schema = z.object({
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
  eventTypes: z.array(itemSchema).min(1, "Vyberte alespoň jeden typ akce"),
});

export type VenueFormInputs = z.infer<typeof schema>;
type Inputs = VenueFormInputs;

// ── TOC ────────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basic: {
    id: "section-basic",
    title: "Základní informace",
    icon: "Building2",
  },
  price: { id: "section-price", title: "Cena", icon: "Banknote" },
  images: { id: "section-images", title: "Obrázky", icon: "Image" },
  eventTypes: {
    id: "section-event-types",
    title: "Typy akcí",
    icon: "Tag",
  },
  location: {
    id: "section-location",
    title: "Lokalita",
    icon: "MapPin",
  },
  capacity: {
    id: "section-capacity",
    title: "Kapacita",
    icon: "Users",
  },
  spaces: {
    id: "section-spaces",
    title: "Prostory",
    icon: "DoorOpen",
  },
};

const FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.price, S.images],
  },
  {
    label: "Typy akcí",
    sections: [S.eventTypes],
  },
  {
    label: "Místo a prostor",
    sections: [S.location, S.capacity, S.spaces],
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
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema) as Resolver<Inputs>,
    defaultValues: {
      images: { gallery: [] },
      eventTypes: [],
    },
  });

  const [eventTypeSearch, setEventTypeSearch] = useState("");

  const { data: eventTypesData } = useEventTypes({
    limit: 10,
    query: eventTypeSearch
      ? { name: { contains: eventTypeSearch } }
      : undefined,
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
      eventTypes: data.eventTypes.map((i) => i.id),
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
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          subtitle={S.basic.subTitle}
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
          id={S.price.id}
          icon={S.price.icon}
          title={S.price.title}
          subtitle={S.price.subTitle}
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
          id={S.images.id}
          icon={S.images.icon}
          title={S.images.title}
          subtitle={S.images.subTitle}
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
        {/* ── Typy akcí ───────────────────────────────────────────────────────── */}
        <FormSection
          id={S.eventTypes.id}
          icon={S.eventTypes.icon}
          title={S.eventTypes.title}
          subtitle={S.eventTypes.subTitle}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.eventTypes}
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <>
                <CheckboxGroup
                  items={eventTypesData?.docs ?? []}
                  value={field.value}
                  onChange={field.onChange}
                  searchable
                  checkColor="text-listing"
                  onSearchChange={(data) => {
                    setEventTypeSearch(data);
                  }}
                />
                {(errors.eventTypes?.message ??
                  errors.eventTypes?.root?.message) && (
                  <ErrorText
                    error={
                      errors.eventTypes?.message ??
                      errors.eventTypes?.root?.message ??
                      ""
                    }
                  />
                )}
              </>
            )}
          />
        </FormSection>

        {/* ── Lokalita ────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.location.id}
          icon={S.location.icon}
          title={S.location.title}
          subtitle={S.location.subTitle}
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
          id={S.capacity.id}
          icon={S.capacity.icon}
          title={S.capacity.title}
          subtitle={S.capacity.subTitle}
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
          id={S.spaces.id}
          icon={S.spaces.icon}
          title={S.spaces.title}
          subtitle={S.spaces.subTitle}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.spaceType}
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
