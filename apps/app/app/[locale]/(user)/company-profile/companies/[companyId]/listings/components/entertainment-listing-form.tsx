"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
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
import { useRules } from "@/app/react-query/specific/rules/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { getIdFromRelationshipField, undefinedToNull } from "@roo/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { commonEditListingFieldsSchema } from "./common-schema";
import { toItem, toIds } from "./utils";
import { getOptionalPositiveNumber } from "@/app/validation/schema/utils";

// ── TOC ───────────────────────────────────────────────────────────────────────

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
  capacity: { id: "section-capacity", title: "Kapacita", icon: "Users" },
  entertainmentTypes: {
    id: "section-entertainment-types",
    title: "Typy zábavy",
    icon: "Trophy",
  },
  audience: { id: "section-audience", title: "Publikum", icon: "UserCheck" },
  logistics: { id: "section-logistics", title: "Logistika", icon: "Clock" },
  eventTypes: {
    id: "section-event-types",
    title: "Typy akcí",
    icon: "Calendar",
  },
  personnel: { id: "section-personnel", title: "Personál", icon: "UserCheck" },
  necessities: {
    id: "section-necessities",
    title: "Provozní požadavky",
    icon: "Package",
  },
  rules: { id: "section-rules", title: "Pravidla", icon: "ScrollText" },
  employees: { id: "section-employees", title: "Zaměstnanci", icon: "Users" },
  faq: { id: "section-faq", title: "FAQ", icon: "CircleHelp" },
  references: {
    id: "section-references",
    title: "Reference",
    icon: "BookOpen",
  },
};

const CREATE_TOC_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.price, S.images, S.eventTypes],
  },
  {
    label: "Místo působení",
    sections: [S.location],
  },
  {
    label: "Vystoupení",
    sections: [S.capacity, S.entertainmentTypes, S.audience, S.logistics, S.necessities],
  },
];

export const EDIT_TOC_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.price, S.images, S.eventTypes],
  },
  {
    label: "Místo působení",
    sections: [S.location],
  },
  {
    label: "Vystoupení",
    sections: [S.capacity, S.entertainmentTypes, S.audience, S.logistics],
  },
  {
    label: "Program a vybavení",
    sections: [S.personnel, S.necessities],
  },
  {
    label: "Prezentace",
    sections: [S.rules, S.employees, S.faq, S.references],
  },
];

// keep old export name for external consumers
export const TOC_GROUPS = EDIT_TOC_GROUPS;

// ── Schema ────────────────────────────────────────────────────────────────────

const itemSchema = z.object({ id: z.string(), name: z.string() });

const schema = z.object({
  ...commonEditListingFieldsSchema,
  location: z.object({
    regions: z
      .array(itemSchema, "Vyberte alespoň jeden kraj")
      .min(1, "Vyberte alespoň jeden kraj"),
    districts: z.array(itemSchema).default([]),
    cities: z.array(itemSchema).default([]),
    address: z.string().optional(),
  }),
  entertainmentTypes: z.array(itemSchema).default([]),
  audience: z.array(z.enum(["adults", "kids", "seniors"])).default([]),
  setupAndTearDownRules: z.object({
    setupTime: getOptionalPositiveNumber("Doba přípravy musí být kladná"),
    tearDownTime: getOptionalPositiveNumber("Doba úklidu musí být kladná"),
  }),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type EntertainmentFormInputs = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  type: "create" | "edit";
  onCancel: () => void;
  onFormChange?: (values: EntertainmentFormInputs) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function EntertainmentListingForm({
  type,
  onCancel,
  onFormChange,
}: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();

  const { data: listing } = useListing(type === "edit" ? listingId : undefined);
  const { data: entertainmentDetail } = useListingDetail(
    "listing-entertainment-details",
    type === "edit" && listing
      ? getIdFromRelationshipField(listing.detail.value)
      : undefined,
  );
  const { data: filters } = useFilterOptions();
  const { data: rules } = useRules();

  const { mutate: updateListing } = useUpdateListing(companyId);
  const { mutate: updateDetail } = useUpdateListingDetail(
    "listing-entertainment-details",
  );
  const { mutateAsync: createListing } = useCreateListing();
  const { mutateAsync: createListingDetail } = useCreateListingDetail(
    "listing-entertainment-details",
  );

  const router = useRouter();

  async function onSubmitCreate(data: EntertainmentFormInputs) {
    try {
      const { doc: detail } = await createListingDetail({
        audience: data.audience,
        setupAndTearDownRules: {
          setupTime: data.setupAndTearDownRules.setupTime,
          tearDownTime: data.setupAndTearDownRules.tearDownTime,
        },
      });

      await createListing({
        type: "entertainment",
        company: companyId,
        name: data.name,
        guests: data.guests,
        images: {
          coverImage: data.images.coverImage,
          logo: data.images.logo,
          gallery: data.images.gallery,
        },
        price: { startsAt: data.price.startsAt },
        properties: {
          eventTypes: toIds(data.eventTypes),
          entertainmentTypes: toIds(data.entertainmentTypes),
          necessities: toIds(data.necessities),
        },
        location: {
          type: "regions" as const,
          regions: toIds(data.location.regions),
          districts: toIds(data.location.districts),
          cities: toIds(data.location.cities),
          address: data.location.address,
        },
        detail: {
          relationTo: "listing-entertainment-details",
          value: detail.id,
        },
      });

      router.push({
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      });
    } catch {
      alert("Nepodařilo se vytvořit inzerát, zkuste to prosím později.");
    }
  }

  function onSubmitEdit(data: EntertainmentFormInputs) {
    if (!entertainmentDetail) return;

    updateDetail(
      {
        id: entertainmentDetail.id,
        data: {
          audience: data.audience,
          setupAndTearDownRules: data.setupAndTearDownRules,
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
          updateListing(
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
                  entertainmentTypes: toIds(data.entertainmentTypes),
                  personnel: toIds(data.personnel),
                  necessities: toIds(data.necessities),
                  entertainmentRules: toIds(data.entertainmentRules),
                },
              }),
            },
            { onSuccess: () => router.back() },
          ),
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
      eventTypes: [],
      location: { regions: [], districts: [], cities: [] },
      entertainmentTypes: [],
      audience: [] as ("adults" | "kids" | "seniors")[],
      personnel: [],
      necessities: [],
      entertainmentRules: [],
      setupAndTearDownRules: {},
      employees: [],
      faq: [],
      references: [],
      guests: { ztp: false, pets: false },
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as EntertainmentFormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  useEffect(() => {
    if (type !== "edit") return;
    if (!listing || !entertainmentDetail) return;

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
      entertainmentTypes:
        listing.properties.entertainmentTypes?.map(toItem) ?? [],
      audience: (entertainmentDetail.audience ?? []) as (
        | "adults"
        | "kids"
        | "seniors"
      )[],
      setupAndTearDownRules: {
        setupTime:
          entertainmentDetail.setupAndTearDownRules?.setupTime ?? undefined,
        tearDownTime:
          entertainmentDetail.setupAndTearDownRules?.tearDownTime ?? undefined,
      },
      personnel: listing.properties.personnel?.map(toItem) ?? [],
      necessities: listing.properties.necessities?.map(toItem) ?? [],
      entertainmentRules:
        listing.properties.entertainmentRules?.map(toItem) ?? [],
      employees:
        entertainmentDetail.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image,
        })) ?? [],
      faq:
        entertainmentDetail.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.group ?? "general",
        })) ?? [],
      references:
        entertainmentDetail.references?.map((r) => ({
          image: r.image,
          eventName: r.eventName ?? undefined,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType ? toItem(r.eventType) : undefined,
        })) ?? [],
    });
  }, [type, listing, entertainmentDetail, reset]);

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

  const audienceLabels: Record<"adults" | "kids" | "seniors", string> = {
    adults: "Dospělí",
    kids: "Děti",
    seniors: "Senioři",
  };

  const tocGroups = type === "create" ? CREATE_TOC_GROUPS : EDIT_TOC_GROUPS;
  const onSubmit = type === "create" ? onSubmitCreate : onSubmitEdit;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
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
              placeholder: "DJ Studio Praha",
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
                  placeholder: "Profesionální DJ na vaši akci.",
                }}
                error={errors.shortDescription?.message}
              />
              <Textarea
                label="Popis"
                inputProps={{
                  ...register("description"),
                  rows: 4,
                  placeholder: "Detailní popis vystoupení...",
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
                placeholder: "7900",
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
                containerRef={field.ref}
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
                containerRef={field.ref}
                label="Galerie"
                value={field.value}
                onChange={field.onChange}
                onUpload={uploadFileToCloud}
                maxImages={20}
                isRequired
                error={errors.images?.gallery?.message}
              />
            )}
          />
        </FormSection>

        {/* ── 9. Typy akcí ─────────────────────────────────────────────────────── */}
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

        {/* ── 4. Místo působení ────────────────────────────────────────────────── */}
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
                value={field.value ?? []}
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

        {/* ── 5. Kapacita ───────────────────────────────────────────────────────── */}
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
                placeholder: "500",
              }}
              error={errors.guests?.max?.message}
            />
            <Input
              label="Min. počet hostů (osob)"
              inputProps={{
                ...register("guests.min"),
                type: "number",
                min: 1,
                placeholder: "50",
              }}
              error={errors.guests?.min?.message}
            />
          </div>
          <div className="flex gap-6">
            <Controller
              control={control}
              name="guests.ztp"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Přístupné pro ZTP"
                  checkColor="text-listing"
                />
              )}
            />
          </div>
        </FormSection>

        {/* ── 6. Typy zábavy ────────────────────────────────────────────────────── */}
        <FormSection
          id={S.entertainmentTypes.id}
          icon={S.entertainmentTypes.icon}
          title={S.entertainmentTypes.title}
          subtitle={S.entertainmentTypes.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="entertainmentTypes"
            render={({ field }) => (
              <CheckboxGroup
                items={filters?.entertainmentTypes ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 7. Publikum ───────────────────────────────────────────────────────── */}
        <FormSection
          id={S.audience.id}
          icon={S.audience.icon}
          title={S.audience.title}
          subtitle={S.audience.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <div className="flex gap-6">
            {(["adults", "kids", "seniors"] as const).map((a) => (
              <Controller
                key={a}
                control={control}
                name="audience"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value?.includes(a) ?? false}
                    onChange={(checked) =>
                      field.onChange(
                        checked
                          ? [...(field.value ?? []), a]
                          : (field.value ?? []).filter((v) => v !== a),
                      )
                    }
                    label={audienceLabels[a]}
                    checkColor="text-listing"
                  />
                )}
              />
            ))}
          </div>
        </FormSection>

        {/* ── 8. Logistika ──────────────────────────────────────────────────────── */}
        <FormSection
          id={S.logistics.id}
          icon={S.logistics.icon}
          title={S.logistics.title}
          subtitle={S.logistics.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Čas přípravy (min)"
              inputProps={{
                ...register("setupAndTearDownRules.setupTime"),
                type: "number",
                min: 0,
                placeholder: "60",
              }}
              error={errors.setupAndTearDownRules?.setupTime?.message}
            />
            <Input
              label="Čas úklidu (min)"
              inputProps={{
                ...register("setupAndTearDownRules.tearDownTime"),
                type: "number",
                min: 0,
                placeholder: "45",
              }}
              error={errors.setupAndTearDownRules?.tearDownTime?.message}
            />
          </div>
        </FormSection>

        {/* ── 10. Personál (edit only) ──────────────────────────────────────────── */}
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

        {/* ── 11. Provozní požadavky ────────────────────────────────────────────── */}
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

        {/* ── 12. Pravidla (edit only) ──────────────────────────────────────────── */}
        {type === "edit" && (
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
              name="entertainmentRules"
              render={({ field }) => (
                <CheckboxGroup
                  items={
                    filters?.rules.filter(
                      (item) => item.type === "entertainment",
                    ) ?? []
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

        {/* ── 13. Zaměstnanci (edit only) ───────────────────────────────────────── */}
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

        {/* ── 14. FAQ (edit only) ───────────────────────────────────────────────── */}
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
                      placeholder: "Jak dlouho trvá příprava?",
                    }}
                    error={errors.faq?.[index]?.question?.message}
                  />
                  <Textarea
                    label="Odpověď"
                    inputProps={{
                      ...register(`faq.${index}.answer`),
                      rows: 3,
                      placeholder: "Příprava trvá přibližně...",
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

        {/* ── 15. Reference (edit only) ─────────────────────────────────────────── */}
        {type === "edit" && (
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
