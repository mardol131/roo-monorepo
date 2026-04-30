"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import {
  MOCK_CUISINES,
  MOCK_DIETARY_OPTIONS,
  MOCK_DISH_TYPES,
  MOCK_FOOD_SERVICE_STYLES,
  MOCK_NECESSITIES,
} from "@/app/_mock/mock";
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

// ── Schema ─────────────────────────────────────────────────────────────────────

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
    regions: z.array(z.string()).min(1, "Vyberte alespoň jeden kraj"),
    districts: z.array(z.string()).default([]),
    cities: z.array(z.string()).default([]),
    address: z.string().optional(),
  }),
  capacity: z.coerce
    .number({ message: "Zadejte číslo" })
    .positive("Kapacita musí být kladná")
    .int("Zadejte celé číslo"),
  minimumCapacity: optionalPositiveNumber,
  cuisines: z.array(z.string()).default([]),
  dishTypes: z.array(z.string()).default([]),
  dietaryOptions: z.array(z.string()).default([]),
  foodServiceStyles: z.array(z.string()).default([]),
  hasAlcoholLicense: z.boolean().default(false),
  kidsMenu: z.boolean().default(false),
  necessities: z.array(z.string()).default([]),
});

type Inputs = z.infer<typeof schema>;

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
  title: "Místo působení",
  icon: MapPin,
};
const SECTION_CAPACITY = {
  id: "section-capacity",
  title: "Kapacita",
  icon: Users,
};
const SECTION_CUISINE = {
  id: "section-cuisine",
  title: "Kuchyně a styl",
  icon: UtensilsCrossed,
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

const FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
  },
  { label: "Místo působení", sections: [SECTION_LOCATION] },
  {
    label: "Nabídka",
    sections: [
      SECTION_CAPACITY,
      SECTION_CUISINE,
      SECTION_EXTRAS,
      SECTION_REQUIREMENTS,
    ],
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
            region: data.location.regions,
            district: data.location.districts,
            city: data.location.cities,
          },
          capacity: data.capacity,
          minimumCapacity: data.minimumCapacity,
          cuisines: data.cuisines,
          dishTypes: data.dishTypes,
          dietaryOptions: data.dietaryOptions,
          foodServiceStyles: data.foodServiceStyles,
          hasAlcoholLicense: data.hasAlcoholLicense,
          kidsMenu: data.kidsMenu,
          necessities: data.necessities,
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
          ...(regionsValue?.length ? { region: { in: regionsValue } } : {}),
          ...(districtSearch ? { name: { contains: districtSearch } } : {}),
        }
      : undefined,
  );

  const { data: citiesData } = useCities({
    query:
      districtsValue?.length || citySearch
        ? {
            ...(districtsValue?.length
              ? { district: { in: districtsValue } }
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
              placeholder: "Catering Praha s.r.o.",
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

        {/* ── Místo působení ──────────────────────────────────────────────────── */}
        <FormSection
          id={SECTION_LOCATION.id}
          icon={SECTION_LOCATION.icon}
          title={SECTION_LOCATION.title}
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

        {/* ── Kuchyně a styl ──────────────────────────────────────────────────── */}
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
                items={MOCK_FOOD_SERVICE_STYLES}
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
                items={MOCK_DIETARY_OPTIONS}
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

        {/* ── Provozní požadavky ──────────────────────────────────────────────── */}
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
