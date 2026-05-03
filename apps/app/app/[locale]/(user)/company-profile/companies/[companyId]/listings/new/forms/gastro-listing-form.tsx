"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateListingPayload } from "@/app/react-query/listings/fetch";
import { useCreateListing } from "@/app/react-query/listings/hooks";
import { uploadFileToCloud } from "@roo/common";
import { useParams } from "next/navigation";
import {
  Banknote,
  Building2,
  ClipboardList,
  Image,
  MapPin,
  Package,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "@/app/i18n/navigation";
import { useCuisines } from "@/app/react-query/filters/cuisines/hooks";
import { useDishTypes } from "@/app/react-query/filters/dish-types/hooks";
import { useDietaryOptions } from "@/app/react-query/filters/dietary-options/hooks";
import { useFoodServiceStyles } from "@/app/react-query/filters/food-service-styles/hooks";
import { useNecessities } from "@/app/react-query/specific/necessities/hooks";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";

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
    regions: z.array(itemSchema).min(1, "Vyberte alespoň jeden kraj"),
    districts: z.array(itemSchema).default([]),
    cities: z.array(itemSchema).default([]),
    address: z.string().optional(),
  }),
  capacity: z.coerce
    .number({ message: "Zadejte číslo" })
    .positive("Kapacita musí být kladná")
    .int("Zadejte celé číslo"),
  minimumCapacity: optionalPositiveNumber,
  cuisines: z.array(itemSchema).default([]),
  dishTypes: z.array(itemSchema).default([]),
  dietaryOptions: z.array(itemSchema).default([]),
  foodServiceStyles: z.array(itemSchema).default([]),
  hasAlcoholLicense: z.boolean().default(false),
  kidsMenu: z.boolean().default(false),
  necessities: z.array(itemSchema).default([]),
  eventTypes: z.array(itemSchema).default([]),
});

type Inputs = z.infer<typeof schema>;

// ── TOC ────────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basics: {
    id: "section-basic",
    title: "Základní informace",
    icon: "Building2",
  },
  price: { id: "section-price", title: "Cena", icon: "Banknote" },
  images: { id: "section-images", title: "Obrázky", icon: "Image" },
  location: {
    id: "section-location",
    title: "Místo působení",
    icon: "MapPin",
  },
  capacity: {
    id: "section-capacity",
    title: "Kapacita",
    icon: "Users",
  },
  cuisine: {
    id: "section-cuisine",
    title: "Kuchyně a styl",
    icon: "UtensilsCrossed",
  },
  extras: {
    id: "section-extras",
    title: "Doplňky",
    icon: "Package",
  },
  requirements: {
    id: "section-requirements",
    title: "Provozní požadavky",
    icon: "ClipboardList",
  },
  eventTypes: {
    id: "section-event-types",
    title: "Typy akcí",
    icon: "Banknote",
  },
};

const FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basics, S.price, S.images],
  },
  { label: "Místo působení", sections: [S.location] },
  {
    label: "Nabídka",
    sections: [S.capacity, S.cuisine, S.extras, S.requirements],
  },
];

const COLOR_SCHEME = { text: "text-listing", surface: "bg-listing-surface" };
const BUTTON_COLOR: ButtonProps["version"] = "listingFull";

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  onCancel: () => void;
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function GastroListingForm({ onCancel }: Props) {
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
      location: { regions: [], districts: [], cities: [] },
      images: { gallery: [] },
      cuisines: [],
      dishTypes: [],
      dietaryOptions: [],
      foodServiceStyles: [],
      necessities: [],
      hasAlcoholLicense: false,
      kidsMenu: false,
    },
  });
  const { data: cuisines } = useCuisines({
    limit: 15,
  });
  const { data: dishTypes } = useDishTypes({
    limit: 15,
  });
  const { data: dietaryOptions } = useDietaryOptions({
    limit: 15,
  });
  const { data: foodServiceStyles } = useFoodServiceStyles({
    limit: 15,
  });

  const { data: necessities } = useNecessities({
    limit: 15,
  });
  const { data: eventTypes } = useEventTypes({
    limit: 15,
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
            region: data.location.regions.map((i) => i.id),
            district: data.location.districts.map((i) => i.id),
            city: data.location.cities.map((i) => i.id),
          },
          capacity: data.capacity,
          minimumCapacity: data.minimumCapacity,
          cuisines: data.cuisines.map((i) => i.id),
          dishTypes: data.dishTypes.map((i) => i.id),
          dietaryOptions: data.dietaryOptions.map((i) => i.id),
          foodServiceStyles: data.foodServiceStyles.map((i) => i.id),
          hasAlcoholLicense: data.hasAlcoholLicense,
          kidsMenu: data.kidsMenu,
          necessities: data.necessities.map((i) => i.id),
          blockType: "gastro",
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

  const regionsValue = watch("location.regions");
  const districtsValue = watch("location.districts");
  const citiesValue = watch("location.cities");

  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const { data: regionsData } = useRegions(undefined, 20);

  const { data: districtsData } = useDistricts(
    regionsValue?.length || districtSearch
      ? {
          ...(regionsValue?.length
            ? { region: { in: regionsValue.map((i) => i.id) } }
            : {}),
          ...(districtSearch ? { name: { contains: districtSearch } } : {}),
        }
      : undefined,
  );

  const { data: citiesData } = useCities({
    query:
      districtsValue?.length || citySearch
        ? {
            ...(districtsValue?.length
              ? { district: { in: districtsValue.map((i) => i.id) } }
              : {}),
            ...(citySearch ? { name: { contains: citySearch } } : {}),
          }
        : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
        {/* ── Základní informace ──────────────────────────────────────────────── */}
        <FormSection
          id={S.basics.id}
          icon={S.basics.icon}
          title={S.basics.title}
          subtitle={S.basics.subTitle}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.name}
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Catering Praha s.r.o.",
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

        {/* ── Místo působení ──────────────────────────────────────────────────── */}
        <FormSection
          id={S.location.id}
          icon={S.location.icon}
          title={S.location.title}
          subtitle={S.location.subTitle}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
          error={!!errors.location?.regions}
        >
          <Controller
            control={control}
            name="location.regions"
            render={({ field }) => (
              <CheckboxGroup
                label="Kraj"
                items={regionsData?.docs ?? []}
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
                items={districtsData?.docs ?? []}
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
                searchable
                onSearchChange={setDistrictSearch}
                closed={!regionsValue?.length}
                closedMessage="Nejprve vyplňte předchozí pole"
              />
            )}
          />
          <Controller
            control={control}
            name="location.cities"
            render={({ field }) => (
              <CheckboxGroup
                label="Město"
                items={citiesData?.docs ?? []}
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
                searchable
                onSearchChange={setCitySearch}
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

        {/* ── Typy eventů ──────────────────────────────────────────────────── */}
        <FormSection
          id={S.eventTypes.id}
          icon={S.eventTypes.icon}
          title={S.eventTypes.title}
          subtitle={S.eventTypes.subTitle}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                searchable
                label="Typy eventů"
                items={eventTypes?.docs ?? []}
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
            )}
          />
        </FormSection>

        {/* ── Kuchyně a styl ──────────────────────────────────────────────────── */}
        <FormSection
          id={S.cuisine.id}
          icon={S.cuisine.icon}
          title={S.cuisine.title}
          subtitle={S.cuisine.subTitle}
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
                items={cuisines?.docs ?? []}
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
                items={dishTypes?.docs ?? []}
                searchable
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
            )}
          />
          <Controller
            control={control}
            name="foodServiceStyles"
            render={({ field }) => (
              <CheckboxGroup
                label="Styl servisu"
                items={foodServiceStyles?.docs ?? []}
                searchable
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
            )}
          />
          <Controller
            control={control}
            name="dietaryOptions"
            render={({ field }) => (
              <CheckboxGroup
                label="Dietní možnosti"
                items={dietaryOptions?.docs ?? []}
                searchable
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
            )}
          />
        </FormSection>

        {/* ── Doplňky ─────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.extras.id}
          icon={S.extras.icon}
          title={S.extras.title}
          subtitle={S.extras.subTitle}
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

        {/* ── Provozní požadavky ──────────────────────────────────────────────── */}
        <FormSection
          id={S.requirements.id}
          icon={S.requirements.icon}
          title={S.requirements.title}
          subtitle={S.requirements.subTitle}
          surfaceColor={COLOR_SCHEME.surface}
          color={COLOR_SCHEME.text}
        >
          <Controller
            control={control}
            name="necessities"
            render={({ field }) => (
              <CheckboxGroup
                label="Provozní požadavky"
                items={necessities?.docs ?? []}
                searchable
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
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
