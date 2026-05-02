"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
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
  Clock,
  Image,
  MapPin,
  Music,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "@/app/i18n/navigation";
import { useEntertainmentTypes } from "@/app/react-query/filters/entertainment-types/hooks";
import { useNecessities } from "@/app/react-query/specific/necessities/hooks";

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
  entertainmentTypes: z.array(itemSchema).default([]),
  audience: z.array(z.enum(["adults", "kids", "seniors"])).default([]),
  setupTime: optionalPositiveNumber,
  tearDownTime: optionalPositiveNumber,
  necessities: z.array(itemSchema).default([]),
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
const SECTION_ENT_TYPES = {
  id: "section-ent-types",
  title: "Typ programu",
  icon: Music,
};
const SECTION_REQUIREMENTS = {
  id: "section-requirements",
  title: "Provozní požadavky",
  icon: ClipboardList,
};
const SECTION_LOGISTICS = {
  id: "section-logistics",
  title: "Logistika",
  icon: Clock,
};

const FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [SECTION_BASIC, SECTION_PRICE, SECTION_IMAGES],
  },
  { label: "Místo působení", sections: [SECTION_LOCATION] },
  {
    label: "Program",
    sections: [
      SECTION_CAPACITY,
      SECTION_ENT_TYPES,
      SECTION_REQUIREMENTS,
      SECTION_LOGISTICS,
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

export default function EntertainmentListingForm({ onCancel }: Props) {
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
      entertainmentTypes: [],
      audience: [],
      necessities: [],
    },
  });

  const { data: entertainmentTypes } = useEntertainmentTypes({
    limit: 15,
  });
  const { data: necessities } = useNecessities({
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
          entertainmentTypes: data.entertainmentTypes.map((i) => i.id),
          audience: data.audience,
          setupAndTearDownRules: {
            setupTime: data.setupTime,
            tearDownTime: data.tearDownTime,
          },
          necessities: data.necessities.map((i) => i.id),
          blockType: "entertainment",
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
              placeholder: "Živá kapela Groove",
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

        {/* ── Typ programu ────────────────────────────────────────────────────── */}
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
                items={entertainmentTypes?.docs ?? []}
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
                items={necessities?.docs ?? []}
                searchable
                value={field.value}
                onChange={field.onChange}
                checkColor={COLOR_SCHEME.text}
              />
            )}
          />
        </FormSection>

        {/* ── Logistika ───────────────────────────────────────────────────────── */}
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
