"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import {
  MOCK_ENTERTAINMENT_TYPES,
  MOCK_EVENT_TYPES,
  MOCK_NECESSITIES,
  MOCK_PERSONNEL,
  MOCK_RULES,
} from "@/app/_mock/mock";
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
import { useRouter } from "@/app/i18n/navigation";
import { useListing, useUpdateListing } from "@/app/react-query/listings/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useCities } from "@/app/react-query/cities/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Listing, uploadFileToCloud } from "@roo/common";
import {
  Banknote,
  BookOpen,
  Building2,
  Calendar,
  CircleHelp,
  Clock,
  Image,
  MapPin,
  Package,
  ScrollText,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ── TOC groups ────────────────────────────────────────────────────────────────

export const ENTERTAINMENT_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [
      { id: "section-basic", title: "Základní informace", icon: Building2 },
      { id: "section-price", title: "Cena", icon: Banknote },
      { id: "section-images", title: "Obrázky", icon: Image },
    ],
  },
  {
    label: "Místo působení",
    sections: [
      { id: "section-location", title: "Místo působení", icon: MapPin },
    ],
  },
  {
    label: "Vystoupení",
    sections: [
      { id: "section-capacity", title: "Kapacita", icon: Users },
      { id: "section-entertainment-types", title: "Typy zábavy", icon: Trophy },
      { id: "section-audience", title: "Publikum", icon: UserCheck },
      { id: "section-logistics", title: "Logistika", icon: Clock },
    ],
  },
  {
    label: "Program a vybavení",
    sections: [
      { id: "section-event-types", title: "Typy akcí", icon: Calendar },
      { id: "section-personnel", title: "Personál", icon: UserCheck },
      { id: "section-necessities", title: "Nezbytnosti", icon: Package },
    ],
  },
  {
    label: "Prezentace",
    sections: [
      { id: "section-rules", title: "Pravidla", icon: ScrollText },
      { id: "section-employees", title: "Zaměstnanci", icon: Users },
      { id: "section-faq", title: "FAQ", icon: CircleHelp },
      { id: "section-references", title: "Reference", icon: BookOpen },
    ],
  },
];

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  eventTypes: z.array(z.string()).default([]),
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
    regions: z.array(z.string()).min(1, "Vyberte alespoň jeden kraj"),
    districts: z.array(z.string()).default([]),
    cities: z.array(z.string()).default([]),
    address: z.string().optional(),
  }),
  capacity: z.coerce
    .number({ message: "Zadejte číslo" })
    .positive("Kapacita musí být kladná")
    .int("Zadejte celé číslo"),
  minimumCapacity: z.coerce.number().nullable().optional(),
  entertainmentTypes: z.array(z.string()).default([]),
  audience: z.array(z.enum(["adults", "kids", "seniors"])).default([]),
  setupAndTearDownRules: z
    .object({
      setupTime: z.coerce.number().nullable().optional(),
      tearDownTime: z.coerce.number().nullable().optional(),
    })
    .optional(),
  personnel: z.array(z.string()).default([]),
  necessities: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
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

export type EntertainmentFormInputs = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  onCancel: () => void;
  onFormChange?: (values: EntertainmentFormInputs) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditEntertainmentListingForm({
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

  function onSubmit(data: EntertainmentFormInputs) {
    const existingDetail = listing?.details.find(
      (
        d,
      ): d is Extract<
        Listing["details"][number],
        { blockType: "entertainment" }
      > => d.blockType === "entertainment",
    );
    mutate(
      {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        eventTypes: data.eventTypes,
        images: {
          ...data.images,
          gallery: data.images.gallery.map((url) => ({ url })),
        },
        price: data.price,
        rules: data.rules,
        employees: data.employees,
        faq: data.faq,
        references: data.references,
        details: [
          {
            ...(existingDetail ?? {}),
            blockType: "entertainment",
            location: {
              address: data.location.address ?? null,
              region: data.location.regions,
              district: data.location.districts,
              city: data.location.cities,
            },
            capacity: data.capacity,
            minimumCapacity: data.minimumCapacity,
            entertainmentTypes: data.entertainmentTypes,
            audience: data.audience,
            setupAndTearDownRules: data.setupAndTearDownRules,
            personnel: data.personnel,
            necessities: data.necessities,
          },
        ],
      },
      { onSuccess: () => router.back() },
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
      rules: [],
      setupAndTearDownRules: {},
      employees: [],
      faq: [],
      references: [],
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as EntertainmentFormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  useEffect(() => {
    if (!listing) return;
    const d = listing.details.find((d) => d.blockType === "entertainment");
    if (!d) return;

    const id = <T extends string | { id: string }>(v: T) =>
      typeof v === "string" ? v : v.id;

    reset({
      name: listing.name,
      shortDescription: listing.shortDescription ?? undefined,
      description: listing.description ?? undefined,
      eventTypes: listing.eventTypes?.map(id) ?? [],
      images: {
        coverImage: listing.images.coverImage,
        logo: listing.images.logo ?? undefined,
        gallery:
          listing.images.gallery?.map((g) => g.url ?? "").filter(Boolean) ?? [],
      },
      price: { startsAt: listing.price.startsAt },
      location: {
        regions: d.location?.region?.map(id) ?? [],
        districts: d.location?.district?.map(id) ?? [],
        cities: d.location?.city?.map(id) ?? [],
        address: d.location?.address ?? undefined,
      },
      capacity: d.capacity,
      minimumCapacity: d.minimumCapacity ?? undefined,
      entertainmentTypes: d.entertainmentTypes?.map(id) ?? [],
      audience: (d.audience ?? []) as ("adults" | "kids" | "seniors")[],
      setupAndTearDownRules: {
        setupTime: d.setupAndTearDownRules?.setupTime ?? undefined,
        tearDownTime: d.setupAndTearDownRules?.tearDownTime ?? undefined,
      },
      personnel: d.personnel?.map(id) ?? [],
      necessities: d.necessities?.map(id) ?? [],
      rules: [...(listing.rules?.map(id) ?? []), ...(d.rules?.map(id) ?? [])],
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

  const audienceLabels: Record<"adults" | "kids" | "seniors", string> = {
    adults: "Dospělí",
    kids: "Děti",
    seniors: "Senioři",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
        {/* ── 1. Základní informace ─────────────────────────────────────────────── */}
        <FormSection
          id="section-basic"
          icon={Building2}
          title="Základní informace"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "DJ Studio Praha",
            }}
            error={errors.name?.message}
          />
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
        </FormSection>

        {/* ── 2. Cena ───────────────────────────────────────────────────────────── */}
        <FormSection
          id="section-price"
          icon={Banknote}
          title="Cena"
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
                placeholder: "7900",
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

        {/* ── 4. Místo působení ────────────────────────────────────────────────── */}
        <FormSection
          id="section-location"
          icon={MapPin}
          title="Místo působení"
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

        {/* ── 5. Kapacita ───────────────────────────────────────────────────────── */}
        <FormSection
          id="section-capacity"
          icon={Users}
          title="Kapacita"
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
                placeholder: "50",
              }}
              error={errors.minimumCapacity?.message}
            />
            <Input
              label="Max. kapacita (osob)"
              inputProps={{
                ...register("capacity"),
                type: "number",
                min: 1,
                placeholder: "500",
              }}
              error={errors.capacity?.message}
            />
          </div>
        </FormSection>

        {/* ── 5. Typy zábavy ────────────────────────────────────────────────────── */}
        <FormSection
          id="section-entertainment-types"
          icon={Trophy}
          title="Typy zábavy"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="entertainmentTypes"
            render={({ field }) => (
              <CheckboxGroup
                items={MOCK_ENTERTAINMENT_TYPES}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 6. Publikum ───────────────────────────────────────────────────────── */}
        <FormSection
          id="section-audience"
          icon={UserCheck}
          title="Publikum"
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

        {/* ── 7. Logistika ──────────────────────────────────────────────────────── */}
        <FormSection
          id="section-logistics"
          icon={Clock}
          title="Logistika"
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

        {/* ── 8. Typy akcí ─────────────────────────────────────────────────────── */}
        <FormSection
          id="section-event-types"
          icon={Calendar}
          title="Typy akcí"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                items={MOCK_EVENT_TYPES}
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
          id="section-personnel"
          icon={UserCheck}
          title="Personál"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="personnel"
            render={({ field }) => (
              <CheckboxGroup
                items={MOCK_PERSONNEL}
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
          id="section-necessities"
          icon={Package}
          title="Nezbytnosti"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="necessities"
            render={({ field }) => (
              <CheckboxGroup
                items={MOCK_NECESSITIES}
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
          id="section-rules"
          icon={ScrollText}
          title="Pravidla"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <Controller
            control={control}
            name="rules"
            render={({ field }) => (
              <CheckboxGroup
                items={MOCK_RULES}
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
          id="section-employees"
          icon={Users}
          title="Zaměstnanci"
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
          id="section-faq"
          icon={CircleHelp}
          title="FAQ"
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

        {/* ── 14. Reference ─────────────────────────────────────────────────────── */}
        <FormSection
          id="section-references"
          icon={BookOpen}
          title="Reference"
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
                      options={MOCK_EVENT_TYPES.map((et) => ({
                        id: et.id,
                        name: et.name,
                      }))}
                      value={{
                        id: field.value ?? "",
                        name:
                          MOCK_EVENT_TYPES.find((et) => et.id === field.value)
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
        groups={ENTERTAINMENT_FORM_GROUPS}
        sticky={true}
        buttonVersion="listingFull"
        buttonText="Uložení"
      />
    </form>
  );
}
