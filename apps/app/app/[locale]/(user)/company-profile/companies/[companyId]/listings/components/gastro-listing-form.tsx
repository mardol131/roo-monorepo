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
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { useRouter } from "@/app/i18n/navigation";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  useCreateListing,
  useCreateListingDetail,
  useListing,
  useListingDetail,
  useUpdateListing,
  useUpdateListingDetail,
} from "@/app/react-query/listings/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { getIdFromRelationshipField, undefinedToNull } from "@roo/common";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { commonEditListingFieldsSchema } from "./common-schema";
import { toItem, toIds } from "./utils";

const S: Record<string, TocSection> = {
  basic: {
    id: "section-basic",
    title: "Základní informace",
    icon: "Building2",
  },
  price: { id: "section-price", title: "Cena", icon: "Banknote" },
  images: {
    id: "section-images",
    title: "Obrázky",
    icon: "Image",
    subTitle: "Podporované formáty: jpg, png, webp",
  },
  location: { id: "section-location", title: "Místo působení", icon: "MapPin" },
  capacity: {
    id: "section-capacity",
    title: "Kapacita a objednávky",
    icon: "Users",
  },
  cuisines: { id: "section-cuisines", title: "Kuchyně", icon: "ChefHat" },
  offer: { id: "section-offer", title: "Nabídka", icon: "Utensils" },
  extras: { id: "section-extras", title: "Doplňky", icon: "Star" },
  eventTypes: {
    id: "section-event-types",
    title: "Typy akcí",
    icon: "Calendar",
  },
  personnel: { id: "section-personnel", title: "Personál", icon: "UserCheck" },
  necessities: {
    id: "section-necessities",
    title: "Nezbytnosti",
    icon: "Package",
  },
  gastroRules: {
    id: "section-gastro-rules",
    title: "Pravidla pro jídlo a pití",
    icon: "Coffee",
  },
  employees: { id: "section-employees", title: "Zaměstnanci", icon: "Users" },
  faq: { id: "section-faq", title: "FAQ", icon: "CircleHelp" },
  references: {
    id: "section-references",
    title: "Reference",
    icon: "BookOpen",
  },
};

export const GASTRO_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.price, S.images, S.eventTypes],
  },
  {
    label: "Místo působení",
    sections: [S.location],
  },
  {
    label: "Kapacita a nabídka",
    sections: [S.capacity, S.cuisines, S.offer, S.extras],
  },
  {
    label: "Program a vybavení",
    sections: [S.personnel, S.necessities, S.gastroRules],
  },
  {
    label: "Prezentace",
    sections: [S.employees, S.faq, S.references],
  },
];

const CREATE_GASTRO_GROUPS: readonly TocGroup[] = [
  { label: "Základní", sections: [S.basic, S.price, S.images, S.eventTypes] },
  { label: "Místo působení", sections: [S.location] },
  { label: "Nabídka", sections: [S.capacity, S.cuisines, S.offer, S.extras, S.necessities] },
];

const itemSchema = z.object({ id: z.string(), name: z.string() });

const schema = z.object({
  ...commonEditListingFieldsSchema,
  location: z.object({
    regions: z.array(itemSchema).min(1, "Vyberte alespoň jeden kraj"),
    districts: z.array(itemSchema).default([]),
    cities: z.array(itemSchema).default([]),
    address: z.string().optional(),
  }),

  cuisines: z.array(itemSchema).default([]),
  dishTypes: z.array(itemSchema).default([]),
  dietaryOptions: z.array(itemSchema).default([]),
  foodServiceStyles: z.array(itemSchema).default([]),

  kidsMenu: z.boolean().default(false),
  hasAlcoholLicense: z.boolean().default(false),
});

export type GastroFormInputs = z.infer<typeof schema>;

type Props = {
  type: "create" | "edit";
  onCancel: () => void;
  onFormChange?: (values: GastroFormInputs) => void;
};

export default function GastroListingForm({
  type,
  onCancel,
  onFormChange,
}: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const { data: listing } = useListing(type === "edit" ? listingId : undefined);
  const { data: gastroDetail } = useListingDetail(
    "listing-gastro-details",
    type === "edit" && listing
      ? getIdFromRelationshipField(listing.detail.value)
      : undefined,
  );
  const { data: filters } = useFilterOptions();
  const { mutate } = useUpdateListing(companyId);
  const { mutate: updateDetail } = useUpdateListingDetail(
    "listing-gastro-details",
  );
  const { mutateAsync: createListing } = useCreateListing();
  const { mutateAsync: createListingDetail } = useCreateListingDetail(
    "listing-gastro-details",
  );
  const router = useRouter();

  function onSubmitEdit(data: GastroFormInputs) {
    if (!gastroDetail) return;

    updateDetail(
      {
        id: gastroDetail.id,
        data: {
          hasAlcoholLicense: data.hasAlcoholLicense,
          kidsMenu: data.kidsMenu,
          faq: data.faq.map((f) => ({
            ...f,
            group: f.groupedBy,
            groupedBy: undefined,
          })),
          employees: data.employees,
          references: data.references.map((r) => ({
            ...r,
            eventType: r.eventType?.id ?? null,
          })),
        },
      },
      {
        onSuccess: () =>
          mutate(
            {
              id: listingId,
              data: undefinedToNull({
                guests: data.guests,
                name: data.name,
                shortDescription: data.shortDescription,
                description: data.description,
                images: data.images,
                price: data.price,
                location: {
                  type: "regions" as const,
                  regions: toIds(data.location.regions),
                  districts: toIds(data.location.districts),
                  cities: toIds(data.location.cities),
                  address: data.location.address,
                },
                properties: {
                  eventTypes: toIds(data.eventTypes),
                  cuisines: toIds(data.cuisines),
                  dishTypes: toIds(data.dishTypes),
                  dietaryOptions: toIds(data.dietaryOptions),
                  foodServiceStyles: toIds(data.foodServiceStyles),
                  personnel: toIds(data.personnel),
                  necessities: toIds(data.necessities),
                  gastroRules: toIds(data.gastroRules),
                },
              }),
            },
            { onSuccess: () => router.back() },
          ),
      },
    );
  }

  async function onSubmitCreate(data: GastroFormInputs) {
    try {
      const { doc: detail } = await createListingDetail({
        hasAlcoholLicense: data.hasAlcoholLicense,
        kidsMenu: data.kidsMenu,
      });
      await createListing({
        type: "gastro",
        company: companyId,
        name: data.name,
        guests: data.guests,
        images: {
          coverImage: data.images.coverImage,
          logo: data.images.logo,
          gallery: data.images.gallery,
        },
        price: { startsAt: data.price.startsAt },
        location: {
          type: "regions" as const,
          address: data.location.address,
          regions: toIds(data.location.regions),
          districts: toIds(data.location.districts),
          cities: toIds(data.location.cities),
        },
        properties: {
          eventTypes: toIds(data.eventTypes),
          cuisines: toIds(data.cuisines),
          dishTypes: toIds(data.dishTypes),
          dietaryOptions: toIds(data.dietaryOptions),
          foodServiceStyles: toIds(data.foodServiceStyles),
          necessities: toIds(data.necessities),
          gastroRules: toIds(data.gastroRules),
        },
        detail: { relationTo: "listing-gastro-details", value: detail.id },
      });
      router.push({
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      });
    } catch {
      alert("Nepodařilo se vytvořit inzerát, zkuste to prosím později.");
    }
  }

  const onSubmit = type === "create" ? onSubmitCreate : onSubmitEdit;

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      location: { regions: [], districts: [], cities: [] },
      eventTypes: [],
      cuisines: [],
      dishTypes: [],
      dietaryOptions: [],
      foodServiceStyles: [],
      personnel: [],
      necessities: [],
      kidsMenu: false,
      hasAlcoholLicense: false,
      gastroRules: [],
      employees: [],
      faq: [],
      references: [],
      guests: { ztp: false, pets: false },
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as GastroFormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  useEffect(() => {
    if (type !== "edit") return;
    if (!listing || !gastroDetail) return;

    reset({
      name: listing.name,
      shortDescription: listing.shortDescription ?? undefined,
      description: listing.description ?? undefined,
      eventTypes: listing.properties.eventTypes?.map(toItem) ?? [],
      images: listing.images,
      price: { startsAt: listing.price.startsAt },
      location: {
        regions: listing.location.regions?.map(toItem) ?? [],
        districts: listing.location.districts?.map(toItem) ?? [],
        cities: listing.location.cities?.map(toItem) ?? [],
        address: listing.location.address ?? undefined,
      },
      guests: {
        min: listing.guests?.min ?? undefined,
        max: listing.guests?.max ?? 0,
        ztp: listing.guests?.ztp ?? false,
        pets: listing.guests?.pets ?? false,
      },
      cuisines: listing.properties.cuisines?.map(toItem) ?? [],
      dishTypes: listing.properties.dishTypes?.map(toItem) ?? [],
      dietaryOptions: listing.properties.dietaryOptions?.map(toItem) ?? [],
      foodServiceStyles:
        listing.properties.foodServiceStyles?.map(toItem) ?? [],
      personnel: listing.properties.personnel?.map(toItem) ?? [],
      necessities: listing.properties.necessities?.map(toItem) ?? [],
      kidsMenu: gastroDetail.kidsMenu ?? false,
      hasAlcoholLicense: gastroDetail.hasAlcoholLicense ?? false,
      gastroRules: listing.properties.gastroRules?.map(toItem) ?? [],
      employees:
        gastroDetail.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image,
        })) ?? [],
      faq:
        gastroDetail.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.group ?? "general",
        })) ?? [],
      references:
        gastroDetail.references?.map((r) => ({
          image: r.image,
          eventName: r.eventName ?? undefined,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType ? toItem(r.eventType) : undefined,
        })) ?? [],
    });
  }, [type, listing, gastroDetail, reset]);

  const employeesFieldArray = useFieldArray({ control, name: "employees" });
  const faqFieldArray = useFieldArray({ control, name: "faq" });
  const referencesFieldArray = useFieldArray({ control, name: "references" });

  const regionsValue = watch("location.regions");
  const districtsValue = watch("location.districts");
  const citiesValue = watch("location.cities");

  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const { data: regionsData } = useRegions(undefined, 9000);
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

  const tocGroups =
    type === "create" ? CREATE_GASTRO_GROUPS : GASTRO_FORM_GROUPS;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex flex-col w-full gap-4">
        {/* ── 1. Základní informace ─────────────────────────────────────────────── */}
        <FormSection
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          subtitle={S.basic.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.name}
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Novák Catering",
            }}
            error={errors.name?.message}
            isRequired
          />
          {type === "edit" && (
            <>
              <Input
                label="Krátký popis"
                inputProps={{
                  ...register("shortDescription"),
                  placeholder: "Prémiový catering pro všechny typy akcí.",
                }}
                error={errors.shortDescription?.message}
              />
              <Textarea
                label="Popis"
                inputProps={{
                  ...register("description"),
                  rows: 4,
                  placeholder: "Detailní popis služby...",
                }}
                error={errors.description?.message}
              />
            </>
          )}
        </FormSection>

        {/* ── 2. Cena ───────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.price.id}
          icon={S.price.icon}
          title={S.price.title}
          subtitle={S.price.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.price?.startsAt}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cena od (Kč)"
              inputProps={{
                ...register("price.startsAt"),
                type: "number",
                min: 0,
                placeholder: "4900",
              }}
              error={errors.price?.startsAt?.message}
              isRequired
            />
          </div>
        </FormSection>

        {/* ── 3. Obrázky ────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.images.id}
          icon={S.images.icon}
          title={S.images.title}
          subtitle={S.images.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.images}
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
                containerRef={field.ref}
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
                containerRef={field.ref}
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
                isRequired
                error={errors.images?.gallery?.message}
                containerRef={field.ref}
              />
            )}
          />
        </FormSection>

        {/* ── 8. Typy akcí ─────────────────────────────────────────────────────── */}
        <FormSection
          id={S.eventTypes.id}
          icon={S.eventTypes.icon}
          title={S.eventTypes.title}
          subtitle={S.eventTypes.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.eventTypes}
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                items={filters?.eventTypes ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
                isRequired
                error={errors.eventTypes?.message}
              />
            )}
          />
        </FormSection>

        {/* ── 4. Místo působení ─────────────────────────────────────────────────── */}
        <FormSection
          id={S.location.id}
          icon={S.location.icon}
          title={S.location.title}
          subtitle={S.location.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
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
                checkColor="text-listing"
                searchable
                isRequired
                error={errors.location?.regions?.message}
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
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
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
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
                onSearchChange={setCitySearch}
                closed={!districtsValue?.length}
                closedMessage="Nejprve vyplňte předchozí pole"
              />
            )}
          />
          <Input
            label="Adresa"
            sublabel={
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

        {/* ── 5. Kapacita a objednávky ──────────────────────────────────────────── */}
        <FormSection
          id={S.capacity.id}
          icon={S.capacity.icon}
          title={S.capacity.title}
          subtitle={S.capacity.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.guests?.max || !!errors.guests?.min}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Max. počet hostů (osob)"
              isRequired
              inputProps={{
                ...register("guests.max"),
                type: "number",
                min: 1,
                placeholder: "200",
              }}
              error={errors.guests?.max?.message}
            />
            <Input
              label="Min. počet hostů (osob)"
              inputProps={{
                ...register("guests.min"),
                type: "number",
                min: 1,
                placeholder: "10",
              }}
              error={errors.guests?.min?.message}
            />
          </div>
        </FormSection>

        {/* ── 5. Kuchyně ────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.cuisines.id}
          icon={S.cuisines.icon}
          title={S.cuisines.title}
          subtitle={S.cuisines.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="cuisines"
            render={({ field }) => (
              <CheckboxGroup
                items={filters?.cuisines ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 6. Nabídka ────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.offer.id}
          icon={S.offer.icon}
          title={S.offer.title}
          subtitle={S.offer.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="dishTypes"
            render={({ field }) => (
              <CheckboxGroup
                label="Typy jídel"
                items={filters?.dishTypes ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
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
                items={filters?.dietaryOptions ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
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
                items={filters?.foodServiceStyles ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 7. Doplňky ────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.extras.id}
          icon={S.extras.icon}
          title={S.extras.title}
          subtitle={S.extras.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <div className="flex flex-col gap-3">
            <InputLabel label="Další možnosti" />
            <div className="flex gap-6">
              <Controller
                control={control}
                name="kidsMenu"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Dětské menu"
                    checkColor="text-listing"
                  />
                )}
              />
              <Controller
                control={control}
                name="hasAlcoholLicense"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Alkohol v ceně"
                    checkColor="text-listing"
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* ── 9. Personál ───────────────────────────────────────────────────────── */}
        {type === "edit" && (
          <FormSection
            id={S.personnel.id}
            icon={S.personnel.icon}
            title={S.personnel.title}
            subtitle={S.personnel.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="personnel"
              render={({ field }) => (
                <CheckboxGroup
                  items={filters?.personnel ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

        {/* ── 10. Nezbytnosti ───────────────────────────────────────────────────── */}
        <FormSection
          id={S.necessities.id}
          icon={S.necessities.icon}
          title={S.necessities.title}
          subtitle={S.necessities.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="necessities"
            render={({ field }) => (
              <CheckboxGroup
                items={filters?.necessities ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 11. Pravidla ──────────────────────────────────────────────────────── */}
        {type === "edit" && (
          <FormSection
            id={S.gastroRules.id}
            icon={S.gastroRules.icon}
            title={S.gastroRules.title}
            subtitle={S.gastroRules.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="gastroRules"
              render={({ field }) => (
                <CheckboxGroup
                  items={
                    filters?.rules.filter((item) => item.type === "gastro") ??
                    []
                  }
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

        {/* ── 12. Zaměstnanci ───────────────────────────────────────────────────── */}
        {type === "edit" && (
          <FormSection
            id={S.employees.id}
            icon={S.employees.icon}
            title={S.employees.title}
            subtitle={S.employees.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <RepeaterField
              label="Zaměstnanci"
              fields={employeesFieldArray.fields}
              onAppend={() =>
                employeesFieldArray.append({
                  name: "",
                  role: "",
                  description: "",
                  image: {},
                })
              }
              onRemove={employeesFieldArray.remove}
              addButtonLabel="Přidat zaměstnance"
              renderItem={(_item, index) => (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Controller
                      control={control}
                      name={`employees.${index}.image`}
                      render={({ field }) => (
                        <ImageInput
                          label="Fotografie"
                          value={field.value}
                          onChange={(filename) =>
                            field.onChange(filename ?? "")
                          }
                          onUpload={uploadFileToCloud}
                        />
                      )}
                    />
                    <div className="flex flex-col gap-3">
                      <Input
                        label="Jméno"
                        inputProps={{
                          ...register(`employees.${index}.name`),
                          placeholder: "Jan Novák",
                        }}
                        error={errors.employees?.[index]?.name?.message}
                      />
                      <Input
                        label="Role"
                        inputProps={{
                          ...register(`employees.${index}.role`),
                          placeholder: "DJ",
                        }}
                        error={errors.employees?.[index]?.role?.message}
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Popis"
                    inputProps={{
                      ...register(`employees.${index}.description`),
                      rows: 2,
                      placeholder: "Krátký popis zaměstnance...",
                    }}
                    error={errors.employees?.[index]?.description?.message}
                  />
                </div>
              )}
            />
          </FormSection>
        )}

        {/* ── 13. FAQ ───────────────────────────────────────────────────────────── */}
        {type === "edit" && (
          <FormSection
            id={S.faq.id}
            icon={S.faq.icon}
            title={S.faq.title}
            subtitle={S.faq.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <RepeaterField
              label="Často kladené otázky"
              fields={faqFieldArray.fields}
              onAppend={() =>
                faqFieldArray.append({
                  active: true,
                  question: "",
                  answer: "",
                  groupedBy: "general",
                })
              }
              onRemove={faqFieldArray.remove}
              addButtonLabel="Přidat otázku"
              renderItem={(_item, index) => (
                <div className="flex flex-col gap-3">
                  <Input
                    label="Otázka"
                    inputProps={{
                      ...register(`faq.${index}.question`),
                      placeholder: "Jaká je minimální objednávka?",
                    }}
                    error={errors.faq?.[index]?.question?.message}
                  />
                  <Textarea
                    label="Odpověď"
                    inputProps={{
                      ...register(`faq.${index}.answer`),
                      rows: 3,
                      placeholder: "Minimální objednávka je...",
                    }}
                    error={errors.faq?.[index]?.answer?.message}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Controller
                      control={control}
                      name={`faq.${index}.groupedBy`}
                      render={({ field }) => (
                        <SelectInput
                          label="Kategorie"
                          items={[
                            { value: "general", label: "Obecné" },
                            { value: "booking", label: "Rezervace" },
                            { value: "cancellation", label: "Storno" },
                            { value: "payment", label: "Platba" },
                            { value: "other", label: "Ostatní" },
                          ]}
                          value={field.value ?? "general"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`faq.${index}.active`}
                      render={({ field }) => (
                        <div className="flex items-end pb-2">
                          <Checkbox
                            checked={field.value ?? true}
                            onChange={field.onChange}
                            label="Aktivní"
                            checkColor="text-listing"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              )}
            />
          </FormSection>
        )}

        {/* ── 14. Reference ─────────────────────────────────────────────────────── */}
        {type === "edit" && (
          <FormSection
            id={S.references.id}
            icon={S.references.icon}
            title={S.references.title}
            subtitle={S.references.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
            error={!!errors.references}
          >
            <RepeaterField
              label="Reference"
              fields={referencesFieldArray.fields}
              onAppend={() =>
                referencesFieldArray.append({
                  image: {},
                  eventName: "",
                  description: "",
                  clientName: "",
                  eventType: undefined,
                })
              }
              onRemove={referencesFieldArray.remove}
              addButtonLabel="Přidat referenci"
              renderItem={(_item, index) => (
                <div className="flex flex-col gap-3">
                  <Controller
                    control={control}
                    name={`references.${index}.image`}
                    render={({ field }) => (
                      <ImageInput
                        label="Obrázek"
                        value={field.value}
                        onChange={(filename) => field.onChange(filename ?? "")}
                        onUpload={uploadFileToCloud}
                      />
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Název akce"
                      inputProps={{
                        ...register(`references.${index}.eventName`),
                        placeholder: "Firemní večírek ABC",
                      }}
                      error={errors.references?.[index]?.eventName?.message}
                    />
                    <Input
                      label="Jméno klienta"
                      inputProps={{
                        ...register(`references.${index}.clientName`),
                        placeholder: "Jan Novák",
                      }}
                      error={errors.references?.[index]?.clientName?.message}
                    />
                  </div>
                  <Input
                    label="Popis"
                    inputProps={{
                      ...register(`references.${index}.description`),
                      placeholder: "Krátký popis akce nebo spolupráce...",
                    }}
                    error={errors.references?.[index]?.description?.message}
                  />
                  <Controller
                    control={control}
                    name={`references.${index}.eventType`}
                    render={({ field }) => (
                      <SearchInput
                        label="Typ akce"
                        placeholder="Vyberte typ akce..."
                        options={filters?.eventTypes ?? []}
                        onSelect={field.onChange}
                        onClear={() => field.onChange(null)}
                        ref={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                        selectedOption={
                          filters?.eventTypes?.find(
                            (et) => et.id === field.value?.id,
                          ) ?? undefined
                        }
                      />
                    )}
                  />
                </div>
              )}
            />
          </FormSection>
        )}

        {/* ── Submit ────────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            onClick={onCancel}
            version="plain"
          />
          <Button
            text={type === "create" ? "Vytvořit listing" : "Uložit úpravy"}
            version="listingFull"
            htmlType="submit"
          />
        </div>
      </div>
      <FormToc
        textColor="text-listing"
        dotColor="text-listing"
        surfaceColor="bg-listing-surface"
        groups={tocGroups}
        sticky={true}
        buttonVersion="listingFull"
        buttonText="Uložení"
      />
    </form>
  );
}
