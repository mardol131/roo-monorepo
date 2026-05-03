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
import { useCuisines } from "@/app/react-query/filters/cuisines/hooks";
import { useDietaryOptions } from "@/app/react-query/filters/dietary-options/hooks";
import { useDishTypes } from "@/app/react-query/filters/dish-types/hooks";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";
import { useFoodServiceStyles } from "@/app/react-query/filters/food-service-styles/hooks";
import { usePersonnel } from "@/app/react-query/filters/personnel/hooks";
import { useListing, useUpdateListing } from "@/app/react-query/listings/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { useNecessities } from "@/app/react-query/specific/necessities/hooks";
import { useRules } from "@/app/react-query/specific/rules/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Listing, uploadFileToCloud } from "@roo/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ── TOC groups ────────────────────────────────────────────────────────────────

// ── TOC ───────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basic: { id: "section-basic", title: "Základní informace", icon: "Building2" },
  price: { id: "section-price", title: "Cena", icon: "Banknote" },
  images: { id: "section-images", title: "Obrázky", icon: "Image", subTitle: "Podporované formáty: jpg, png, webp" },
  location: { id: "section-location", title: "Místo působení", icon: "MapPin" },
  capacity: { id: "section-capacity", title: "Kapacita a objednávky", icon: "Users" },
  cuisines: { id: "section-cuisines", title: "Kuchyně", icon: "ChefHat" },
  offer: { id: "section-offer", title: "Nabídka", icon: "Utensils" },
  extras: { id: "section-extras", title: "Doplňky", icon: "Star" },
  eventTypes: { id: "section-event-types", title: "Typy akcí", icon: "Calendar" },
  personnel: { id: "section-personnel", title: "Personál", icon: "UserCheck" },
  necessities: { id: "section-necessities", title: "Nezbytnosti", icon: "Package" },
  rules: { id: "section-rules", title: "Pravidla", icon: "ScrollText" },
  employees: { id: "section-employees", title: "Zaměstnanci", icon: "Users" },
  faq: { id: "section-faq", title: "FAQ", icon: "CircleHelp" },
  references: { id: "section-references", title: "Reference", icon: "BookOpen" },
};

export const GASTRO_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.price, S.images],
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
    sections: [S.eventTypes, S.personnel, S.necessities],
  },
  {
    label: "Prezentace",
    sections: [S.rules, S.employees, S.faq, S.references],
  },
];

// ── Schema ────────────────────────────────────────────────────────────────────

const itemSchema = z.object({ id: z.string(), name: z.string() });

const schema = z.object({
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  eventTypes: z.array(itemSchema).min(1, "Vyberte alespoň jeden typ akce"),
  images: z.object({
    coverImage: z.string().min(1, "Titulní obrázek je povinný"),
    logo: z.string().optional(),
    gallery: z.array(z.string()).default([]),
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
  minimumCapacity: z.coerce.number().nullable().optional(),
  cuisines: z.array(itemSchema).default([]),
  dishTypes: z.array(itemSchema).default([]),
  dietaryOptions: z.array(itemSchema).default([]),
  foodServiceStyles: z.array(itemSchema).default([]),
  personnel: z.array(itemSchema).default([]),
  necessities: z.array(itemSchema).default([]),
  kidsMenu: z.boolean().default(false),
  hasAlcoholLicense: z.boolean().default(false),
  foodAndDrinkRules: z.array(itemSchema).default([]),
  rules: z.array(itemSchema).default([]),
  employees: z
    .array(
      z.object({
        name: z.string().min(1, "Jméno je povinné"),
        role: z.string().min(1, "Role je povinná"),
        description: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .default([]),
  faq: z
    .array(
      z.object({
        active: z.boolean().default(true),
        question: z.string().min(1, "Otázka je povinná"),
        answer: z.string().min(1, "Odpověď je povinná"),
        groupedBy: z
          .enum(["general", "booking", "cancellation", "payment", "other"])
          .default("general"),
      }),
    )
    .default([]),
  references: z
    .array(
      z.object({
        image: z.string().optional(),
        eventName: z.string().min(1, "Název akce je povinný"),
        description: z.string().optional(),
        clientName: z.string().optional(),
        eventType: z.string().optional(),
      }),
    )
    .default([]),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type GastroFormInputs = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  onCancel: () => void;
  onFormChange?: (values: GastroFormInputs) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditGastroListingForm({
  onCancel,
  onFormChange,
}: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const { data: listing } = useListing(listingId);
  const { mutate } = useUpdateListing(listingId, companyId);
  const router = useRouter();

  function onSubmit(data: GastroFormInputs) {
    const existingDetail = listing?.details.find(
      (d): d is Extract<Listing["details"][number], { blockType: "gastro" }> =>
        d.blockType === "gastro",
    );
    mutate(
      {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        eventTypes: data.eventTypes.map((i) => i.id),
        images: {
          ...data.images,
          gallery: data.images.gallery.map((url) => ({ url })),
        },
        price: data.price,
        rules: data.rules.map((i) => i.id),
        employees: data.employees,
        faq: data.faq,
        references: data.references,
        details: [
          {
            ...existingDetail,
            blockType: "gastro",
            location: {
              region: data.location.regions.map((i) => i.id),
              district: data.location.districts.map((i) => i.id),
              city: data.location.cities.map((i) => i.id),
              address: data.location.address,
            },
            capacity: data.capacity,
            minimumCapacity: data.minimumCapacity,
            cuisines: data.cuisines.map((i) => i.id),
            dishTypes: data.dishTypes.map((i) => i.id),
            dietaryOptions: data.dietaryOptions.map((i) => i.id),
            foodServiceStyles: data.foodServiceStyles.map((i) => i.id),
            kidsMenu: data.kidsMenu,
            hasAlcoholLicense: data.hasAlcoholLicense,
            foodAndDrinkRules: data.foodAndDrinkRules.map((i) => i.id),
            personnel: data.personnel.map((i) => i.id),
            necessities: data.necessities.map((i) => i.id),
          },
        ],
      },
      {
        onSuccess: () => router.back(),
      },
    );
  }

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
      foodAndDrinkRules: [],
      rules: [],
      employees: [],
      faq: [],
      references: [],
    },
  });

  const { data: eventTypes, isLoading: eventTypesLoading } = useEventTypes({
    limit: 15,
  });
  const { data: personnel, isLoading: personnelLoading } = usePersonnel({
    limit: 15,
  });
  const { data: rules, isLoading: rulesLoading } = useRules({ limit: 15 });
  const { data: dishTypes, isLoading: dishTypesLoading } = useDishTypes({
    limit: 15,
  });
  const { data: foodAndServiceStyles, isLoading: foodAndServiceStylesLoading } =
    useFoodServiceStyles({ limit: 15 });
  const { data: cuisines, isLoading: cuisinesLoading } = useCuisines({
    limit: 15,
  });
  const { data: dietaryOptions, isLoading: dietaryOptionsLoading } =
    useDietaryOptions({ limit: 15 });
  const { data: necessities, isLoading: necessitiesLoading } = useNecessities({
    limit: 15,
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as GastroFormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  useEffect(() => {
    if (!listing) return;
    const d = listing.details.find((d) => d.blockType === "gastro");
    if (!d) return;

    const id = <T extends string | { id: string }>(v: T) =>
      typeof v === "string" ? v : v.id;

    const toItem = <T extends { id: string; name: string }>(
      v: string | T,
    ): { id: string; name: string } =>
      typeof v === "string" ? { id: v, name: "" } : { id: v.id, name: v.name };

    reset({
      name: listing.name,
      shortDescription: listing.shortDescription ?? undefined,
      description: listing.description ?? undefined,
      eventTypes: listing.eventTypes?.map(toItem) ?? [],
      images: {
        coverImage: listing.images.coverImage,
        logo: listing.images.logo ?? undefined,
        gallery:
          listing.images.gallery?.map((g) => g.url ?? "").filter(Boolean) ?? [],
      },
      price: { startsAt: listing.price.startsAt },
      location: {
        regions: d.location?.region?.map(toItem) ?? [],
        districts: d.location?.district?.map(toItem) ?? [],
        cities: d.location?.city?.map(toItem) ?? [],
        address: d.location?.address ?? undefined,
      },
      capacity: d.capacity,
      minimumCapacity: d.minimumCapacity ?? undefined,
      cuisines: d.cuisines?.map(toItem) ?? [],
      dishTypes: d.dishTypes?.map(toItem) ?? [],
      dietaryOptions: d.dietaryOptions?.map(toItem) ?? [],
      foodServiceStyles: d.foodServiceStyles?.map(toItem) ?? [],
      personnel: d.personnel?.map(toItem) ?? [],
      necessities: d.necessities?.map(toItem) ?? [],
      kidsMenu: d.kidsMenu ?? false,
      hasAlcoholLicense: d.hasAlcoholLicense ?? false,
      foodAndDrinkRules: d.foodAndDrinkRules?.map(toItem) ?? [],
      rules: listing.rules?.map(toItem) ?? [],
      employees:
        listing.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image ? id(e.image as string | { id: string }) : undefined,
        })) ?? [],
      faq:
        listing.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.groupedBy ?? "general",
        })) ?? [],
      references:
        listing.references?.map((r) => ({
          image: r.image ? id(r.image as string | { id: string }) : undefined,
          eventName: r.eventName ?? undefined,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType
            ? id(r.eventType as string | { id: string })
            : undefined,
        })) ?? [],
    });
  }, [listing, reset]);

  const employeesFieldArray = useFieldArray({ control, name: "employees" });
  const faqFieldArray = useFieldArray({ control, name: "faq" });
  const referencesFieldArray = useFieldArray({ control, name: "references" });

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
      <div className="flex flex-col w-full gap-4">
        {/* ── 1. Základní informace ─────────────────────────────────────────────── */}
        <FormSection
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          subtitle={S.basic.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Novák Catering",
            }}
            error={errors.name?.message}
          />
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
        </FormSection>

        {/* ── 2. Cena ───────────────────────────────────────────────────────────── */}
        <FormSection
          id={S.price.id}
          icon={S.price.icon}
          title={S.price.title}
          subtitle={S.price.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
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

        {/* ── 5. Kapacita a objednávky ──────────────────────────────────────────── */}
        <FormSection
          id={S.capacity.id}
          icon={S.capacity.icon}
          title={S.capacity.title}
          subtitle={S.capacity.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Min. kapacita (osob)"
              inputProps={{
                ...register("minimumCapacity"),
                type: "number",
                min: 1,
                placeholder: "10",
              }}
              error={errors.minimumCapacity?.message}
            />
            <Input
              label="Max. kapacita (osob)"
              inputProps={{
                ...register("capacity"),
                type: "number",
                min: 1,
                placeholder: "200",
              }}
              error={errors.capacity?.message}
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
                items={cuisines?.docs ?? []}
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
                items={dishTypes?.docs ?? []}
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
                items={dietaryOptions?.docs ?? []}
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
                items={foodAndServiceStyles?.docs ?? []}
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

        {/* ── 8. Typy akcí ─────────────────────────────────────────────────────── */}
        <FormSection
          id={S.eventTypes.id}
          icon={S.eventTypes.icon}
          title={S.eventTypes.title}
          subtitle={S.eventTypes.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                items={eventTypes?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 9. Personál ───────────────────────────────────────────────────────── */}
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
                items={personnel?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

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
                items={necessities?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 11. Pravidla ──────────────────────────────────────────────────────── */}
        <FormSection
          id={S.rules.id}
          icon={S.rules.icon}
          title={S.rules.title}
          subtitle={S.rules.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="rules"
            render={({ field }) => (
              <CheckboxGroup
                items={rules?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 12. Zaměstnanci ───────────────────────────────────────────────────── */}
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
                image: "",
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
                        onChange={(filename) => field.onChange(filename ?? "")}
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

        {/* ── 13. FAQ ───────────────────────────────────────────────────────────── */}
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

        {/* ── 14. Reference ─────────────────────────────────────────────────────── */}
        <FormSection
          id={S.references.id}
          icon={S.references.icon}
          title={S.references.title}
          subtitle={S.references.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <RepeaterField
            label="Reference"
            fields={referencesFieldArray.fields}
            onAppend={() =>
              referencesFieldArray.append({
                image: "",
                eventName: "",
                description: "",
                clientName: "",
                eventType: "",
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
                      ref={field.ref}
                      label="Typ akce"
                      placeholder="Vyberte typ akce..."
                      options={
                        eventTypes?.docs.map((et) => ({
                          id: et.id,
                          name: et.name,
                        })) ?? []
                      }
                      value={{
                        id: field.value ?? "",
                        name:
                          eventTypes?.docs.find((et) => et.id === field.value)
                            ?.name ?? "",
                      }}
                      onSelect={(option) => field.onChange(option.id)}
                    />
                  )}
                />
              </div>
            )}
          />
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
            text="Uložit úpravy"
            version="listingFull"
            htmlType="submit"
          />
        </div>
      </div>
      <FormToc
        textColor="text-listing"
        dotColor="text-listing"
        surfaceColor="bg-listing-surface"
        groups={GASTRO_FORM_GROUPS}
        sticky={true}
        buttonVersion="listingFull"
        buttonText="Uložení"
      />
    </form>
  );
}
