"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
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
import { useListing } from "@/app/react-query/listings/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFileToCloud } from "@roo/common";
import {
  Activity,
  Banknote,
  BookOpen,
  Building2,
  Calendar,
  CircleHelp,
  Coffee,
  Image,
  MapPin,
  Maximize2,
  Monitor,
  Package,
  ParkingSquare,
  ScrollText,
  Star,
  Trophy,
  Truck,
  UserCheck,
  Users,
  Warehouse,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useCities } from "@/app/react-query/cities/hooks";
import { z } from "zod";
import { useRouter } from "@/app/i18n/navigation";
import { useUpdateListing } from "@/app/react-query/listings/hooks";

import { useActivities } from "@/app/react-query/filters/activities/hooks";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";
import { useAmenities } from "@/app/react-query/filters/amenities/hooks";
import { useTechnologies } from "@/app/react-query/filters/technologies/hooks";
import { useServices } from "@/app/react-query/filters/services/hooks";
import { useRules } from "@/app/react-query/specific/rules/hooks";
import { usePlaceTypes } from "@/app/react-query/filters/place-types/hooks";
import { usePersonnel } from "@/app/react-query/filters/personnel/hooks";

// ── TOC groups (exported for page sidebar) ────────────────────────────────────

export const VENUE_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [
      { id: "section-basic", title: "Základní informace", icon: Building2 },
      { id: "section-price", title: "Cena", icon: Banknote },
      { id: "section-images", title: "Obrázky", icon: Image },
      { id: "section-location", title: "Lokalita", icon: MapPin },
    ],
  },
  {
    label: "Prostor",
    sections: [
      { id: "section-capacity", title: "Kapacita a prostor", icon: Maximize2 },
      { id: "section-place-types", title: "Typ místa", icon: Building2 },
    ],
  },
  {
    label: "Program a nabídka",
    sections: [
      { id: "section-event-types", title: "Typy akcí", icon: Calendar },
      { id: "section-activities", title: "Aktivity", icon: Activity },
      {
        id: "section-activity-addons",
        title: "Příplatky za aktivity",
        icon: Trophy,
      },
      { id: "section-services", title: "Služby", icon: Star },
    ],
  },
  {
    label: "Vybavenost",
    sections: [
      { id: "section-personnel", title: "Personál", icon: UserCheck },
      { id: "section-amenities", title: "Vybavení", icon: Package },
      { id: "section-technology", title: "Technologie", icon: Monitor },
    ],
  },
  {
    label: "Logistika",
    sections: [
      { id: "section-storage", title: "Skladování", icon: Warehouse },
      { id: "section-rules", title: "Pravidla", icon: ScrollText },
      { id: "section-access", title: "Přístup a zásobování", icon: Truck },
      { id: "section-parking", title: "Parkování", icon: ParkingSquare },
      { id: "section-breakfast", title: "Snídaně", icon: Coffee },
    ],
  },
  {
    label: "Prezentace",
    sections: [
      { id: "section-employees", title: "Zaměstnanci", icon: Users },
      { id: "section-faq", title: "FAQ", icon: CircleHelp },
      { id: "section-references", title: "Reference", icon: BookOpen },
    ],
  },
];

// ── Schema ─────────────────────────────────────────────────────────────────────

const itemSchema = z.object({ id: z.string(), name: z.string() });

const schema = z
  .object({
    name: z.string().min(1, "Název je povinný"),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    indoor: z.boolean().default(false),
    outdoor: z.boolean().default(false),
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
      address: z.string().min(1, "Adresa je povinná"),
      city: z.object({
        id: z.string().min(1, "Město je povinné"),
        name: z.string(),
      }),
    }),
    capacity: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Kapacita musí být kladná")
      .int("Zadejte celé číslo"),
    area: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Plocha musí být kladná"),
    canBeBookedAsWhole: z.boolean().default(false),
    hasAccommodation: z.boolean().default(false),
    accommodationCapacity: z.coerce.number().nullable().optional(),
    activities: z.array(itemSchema).default([]),
    activityAddons: z
      .array(
        z.object({
          activity: z.string().min(1, "Vyberte aktivitu"),
          price: z.coerce.number({ message: "Zadejte číslo" }).min(0),
          space: z.string().optional(),
          type: z.enum(["indoor", "outdoor"]),
        }),
      )
      .default([]),
    services: z.array(itemSchema).default([]),
    personnel: z.array(itemSchema).default([]),
    amenities: z.array(itemSchema).default([]),
    technology: z.array(itemSchema).default([]),
    placeTypes: z.array(itemSchema).default([]),
    foodAndDrinkRules: z.array(itemSchema).default([]),
    venueRules: z.array(itemSchema).default([]),
    rules: z.array(itemSchema).default([]),
    storage: z
      .array(
        z.object({
          name: z.string().min(1, "Název je povinný"),
          area: z.coerce.number({ message: "Zadejte číslo" }).positive(),
        }),
      )
      .default([]),
    access: z
      .object({
        vehicleTypes: z.array(z.string()).default([]),
        helpWithLoadingAndUnloading: z.boolean().default(false),
        loadingRamp: z.boolean().default(false),
        loadingElevator: z.boolean().default(false),
        serviceAccess: z.boolean().default(false),
        serviceArea: z.boolean().default(false),
      })
      .optional(),
    parking: z
      .object({
        hasParking: z.boolean().default(false),
        parkingCapacity: z.coerce.number().nullable().optional(),
        parkingIsIncludedInPrice: z.boolean().default(false),
        parkingPrice: z.coerce.number().nullable().optional(),
      })
      .optional(),
    breakfast: z
      .object({
        included: z.boolean().default(false),
        allowAccommodationWithoutBreakfast: z.boolean().default(false),
        allowMoreBreakfastsThanAccommodation: z.boolean().default(false),
        breakfastIsIncludedInPrice: z.boolean().default(false),
        price: z.coerce.number().nullable().optional(),
        pricePer: z.enum(["person", "booking"]).nullable().optional(),
        timeFrom: z.string().nullable().optional(),
        timeTo: z.string().nullable().optional(),
      })
      .optional(),
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
          clientName: z.string().optional(),
          eventType: z.string().optional(),
          description: z.string().optional(),
        }),
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.hasAccommodation && !data.accommodationCapacity) {
      ctx.addIssue({
        code: "custom",
        message: "Ubytovací kapacita je povinná",
        path: ["accommodationCapacity"],
      });
    }
  });

// ── Types ──────────────────────────────────────────────────────────────────────

export type FormInputs = z.infer<typeof schema>;

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  onCancel: () => void;
  onFormChange?: (values: FormInputs) => void;
};

function toggleArrayItem(arr: string[], id: string, checked: boolean) {
  return checked ? [...arr, id] : arr.filter((x) => x !== id);
}
// ── Component ──────────────────────────────────────────────────────────────────

export default function EditVenueListingForm({
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

  const [citySearch, setCitySearch] = useState("");
  const { data: citiesData } = useCities({
    query: citySearch ? { name: { contains: citySearch } } : undefined,
  });

  function onSubmit(data: FormInputs) {
    const venueDetail = listing?.details[0];

    if (venueDetail?.blockType !== "venue") return;
    mutate(
      {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        indoor: data.indoor,
        outdoor: data.outdoor,
        eventTypes: data.eventTypes.map((i) => i.id),
        rules: data.rules.map((i) => i.id),
        employees: data.employees,
        faq: data.faq,
        references: data.references,
        images: {
          ...data.images,
          gallery: data.images.gallery.map((url) => ({ url })),
        },
        price: data.price,
        details: [
          {
            blockType: "venue",
            spacesType: venueDetail?.spacesType ?? "area",
            location: {
              address: data.location.address,
              city: data.location.city.id,
            },
            capacity: data.capacity,
            area: data.area,
            canBeBookedAsWhole: data.canBeBookedAsWhole,
            hasAccommodation: data.hasAccommodation,
            accommodationCapacity: data.accommodationCapacity,
            activities: data.activities.map((i) => i.id),
            activityAddons: data.activityAddons,
            services: data.services.map((i) => i.id),
            personnel: data.personnel.map((i) => i.id),
            amenities: data.amenities.map((i) => i.id),
            technology: data.technology.map((i) => i.id),
            placeTypes: data.placeTypes.map((i) => i.id),
            foodAndDrinkRules: data.foodAndDrinkRules.map((i) => i.id),
            venueRules: data.venueRules.map((i) => i.id),
            storage: data.storage,
            access: data.access
              ? {
                  ...data.access,
                  vehicleTypes: data.access.vehicleTypes as (
                    | "car"
                    | "truck"
                    | "van"
                    | "bus"
                  )[],
                }
              : undefined,
            parking: data.parking,
            breakfast: data.breakfast,
          },
        ],
      },
      {
        onSuccess: () =>
          router.push({
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]",
            params: { companyId, listingId },
          }),
      },
    );
  }

  const { data: activities, isLoading: activitiesLoading } = useActivities({
    limit: 15,
    query: citySearch ? { name: { contains: citySearch } } : undefined,
  });
  const { data: amenities, isLoading: amenitiesLoading } = useAmenities({
    limit: 15,
  });
  const { data: eventTypes, isLoading: eventTypesLoading } = useEventTypes({
    limit: 15,
  });
  const { data: personnel, isLoading: personnelLoading } = usePersonnel({
    limit: 15,
  });
  const { data: placeTypes, isLoading: placeTypesLoading } = usePlaceTypes({
    limit: 15,
  });
  const { data: rules, isLoading: rulesLoading } = useRules({ limit: 15 });
  const { data: services, isLoading: servicesLoading } = useServices({
    limit: 15,
  });
  const { data: technologies, isLoading: technologiesLoading } =
    useTechnologies({ limit: 15 });

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
      indoor: false,
      outdoor: false,
      eventTypes: [],
      activities: [],
      activityAddons: [],
      services: [],
      personnel: [],
      amenities: [],
      technology: [],
      placeTypes: [],
      foodAndDrinkRules: [],
      venueRules: [],
      rules: [],
      storage: [],
      canBeBookedAsWhole: false,
      hasAccommodation: false,
      access: {
        vehicleTypes: [],
        helpWithLoadingAndUnloading: false,
        loadingRamp: false,
        loadingElevator: false,
        serviceAccess: false,
        serviceArea: false,
      },
      parking: {
        hasParking: false,
        parkingIsIncludedInPrice: false,
      },
      breakfast: {
        included: false,
        allowAccommodationWithoutBreakfast: false,
        allowMoreBreakfastsThanAccommodation: false,
        breakfastIsIncludedInPrice: false,
      },
      employees: [],
      faq: [],
      references: [],
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onFormChange?.(values as FormInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  // Populate form from listing data once loaded
  useEffect(() => {
    if (!listing) return;
    const d = listing.details.find((d) => d.blockType === "venue");
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
      indoor: listing.indoor ?? false,
      outdoor: listing.outdoor ?? false,
      eventTypes: listing.eventTypes?.map(toItem) ?? [],
      images: {
        coverImage: listing.images.coverImage,
        logo: listing.images.logo ?? undefined,
        gallery:
          listing.images.gallery?.map((g) => g.url ?? "").filter(Boolean) ?? [],
      },
      price: { startsAt: listing.price.startsAt },
      location: {
        address: d.location.address,
        city: {
          id: id(d.location.city),
          name:
            typeof d.location.city === "object" && d.location.city !== null
              ? (d.location.city as { name: string }).name
              : "",
        },
      },
      capacity: d.capacity,
      area: d.area,
      canBeBookedAsWhole: d.canBeBookedAsWhole ?? false,
      hasAccommodation: d.hasAccommodation ?? false,
      accommodationCapacity: d.accommodationCapacity ?? undefined,
      activities: d.activities?.map(toItem) ?? [],
      activityAddons:
        d.activityAddons?.map((a) => ({
          activity: id(a.activity),
          price: a.price,
          space: a.space ? id(a.space as string | { id: string }) : undefined,
          type: a.type,
        })) ?? [],
      services: d.services?.map(toItem) ?? [],
      personnel: d.personnel?.map(toItem) ?? [],
      amenities: d.amenities?.map(toItem) ?? [],
      technology: d.technology?.map(toItem) ?? [],
      placeTypes: d.placeTypes?.map(toItem) ?? [],
      foodAndDrinkRules: d.foodAndDrinkRules?.map(toItem) ?? [],
      venueRules: d.venueRules?.map(toItem) ?? [],
      rules: listing.rules?.map(toItem) ?? [],
      storage: d.storage?.map((s) => ({ name: s.name, area: s.area })) ?? [],
      access: {
        vehicleTypes: (d.access?.vehicleTypes ?? []) as string[],
        helpWithLoadingAndUnloading:
          d.access?.helpWithLoadingAndUnloading ?? false,
        loadingRamp: d.access?.loadingRamp ?? false,
        loadingElevator: d.access?.loadingElevator ?? false,
        serviceAccess: d.access?.serviceAccess ?? false,
        serviceArea: d.access?.serviceArea ?? false,
      },
      parking: {
        hasParking: d.parking?.hasParking ?? false,
        parkingCapacity: d.parking?.parkingCapacity ?? undefined,
        parkingIsIncludedInPrice: d.parking?.parkingIsIncludedInPrice ?? false,
        parkingPrice: d.parking?.parkingPrice ?? undefined,
      },
      breakfast: {
        included: d.breakfast?.included ?? false,
        allowAccommodationWithoutBreakfast:
          d.breakfast?.allowAccommodationWithoutBreakfast ?? false,
        allowMoreBreakfastsThanAccommodation:
          d.breakfast?.allowMoreBreakfastsThanAccommodation ?? false,
        breakfastIsIncludedInPrice:
          d.breakfast?.breakfastIsIncludedInPrice ?? false,
        price: d.breakfast?.price ?? undefined,
        pricePer: d.breakfast?.pricePer ?? undefined,
        timeFrom: d.breakfast?.timeFrom ?? undefined,
        timeTo: d.breakfast?.timeTo ?? undefined,
      },
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

  const storageFieldArray = useFieldArray({ control, name: "storage" });
  const activityAddonsFieldArray = useFieldArray({
    control,
    name: "activityAddons",
  });
  const employeesFieldArray = useFieldArray({ control, name: "employees" });
  const faqFieldArray = useFieldArray({ control, name: "faq" });
  const referencesFieldArray = useFieldArray({ control, name: "references" });

  const hasAccommodation = watch("hasAccommodation");
  const hasParking = watch("parking.hasParking");
  const breakfastIncluded = watch("breakfast.included");
  const parkingIsIncludedInPrice = watch("parking.parkingIsIncludedInPrice");

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
              placeholder: "Kongresové centrum Praha",
            }}
            error={errors.name?.message}
          />
          <Input
            label="Krátký popis"
            inputProps={{
              ...register("shortDescription"),
              placeholder: "Moderní prostory v centru Prahy až pro 300 osob.",
            }}
            error={errors.shortDescription?.message}
          />
          <Textarea
            label="Popis"
            inputProps={{
              ...register("description"),
              rows: 4,
              placeholder: "Detailní popis prostoru...",
            }}
            error={errors.description?.message}
          />
          <div>
            <InputLabel label="Typ prostoru" />
            <div className="flex gap-6">
              <Controller
                control={control}
                name="indoor"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Interiér"
                    checkColor="text-listing"
                  />
                )}
              />
              <Controller
                control={control}
                name="outdoor"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Exteriér"
                    checkColor="text-listing"
                  />
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* ── 2. Cena ───────────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-price"
          icon={Banknote}
          title="Cena"
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

        {/* ── 4. Lokalita ───────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-location"
          icon={MapPin}
          title="Lokalita"
        >
          <Input
            label="Adresa"
            inputProps={{
              ...register("location.address"),
              placeholder: "Václavské náměstí 1",
            }}
            error={errors.location?.address?.message}
          />
          <div>
            <Controller
              control={control}
              name="location.city"
              render={({ field }) => (
                <SearchInput
                  ref={field.ref}
                  label="Město"
                  placeholder="Vyberte město..."
                  options={citiesData?.docs ?? []}
                  onSearchQueryChange={setCitySearch}
                  value={
                    field.value?.id
                      ? { id: field.value.id, name: field.value.name }
                      : undefined
                  }
                  onSelect={(option) =>
                    field.onChange({ id: option.id, name: option.name })
                  }
                  onClear={() => field.onChange({ id: "", name: "" })}
                  error={errors.location?.city?.id?.message}
                />
              )}
            />
          </div>
        </FormSection>

        {/* ── 5. Kapacita a prostor ─────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-capacity"
          icon={Maximize2}
          title="Kapacita a prostor"
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
          <Controller
            control={control}
            name="canBeBookedAsWhole"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Lze rezervovat jako celek"
                checkColor="text-listing"
              />
            )}
          />
          <Controller
            control={control}
            name="hasAccommodation"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Ubytování k dispozici"
                checkColor="text-listing"
              />
            )}
          />
          <div
            className={hasAccommodation ? "" : "opacity-40 pointer-events-none"}
          >
            <Input
              label="Ubytovací kapacita (lůžek)"
              inputProps={{
                ...register("accommodationCapacity"),
                type: "number",
                min: 1,
                disabled: !hasAccommodation,
              }}
              error={errors.accommodationCapacity?.message}
            />
          </div>
        </FormSection>

        {/* ── 6. Typ místa ──────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-place-types"
          icon={Building2}
          title="Typ místa"
        >
          <Controller
            control={control}
            name="placeTypes"
            render={({ field }) => (
              <CheckboxGroup
                items={placeTypes?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 7. Typy akcí ─────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-event-types"
          icon={Calendar}
          title="Typy akcí"
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

        {/* ── 7. Aktivity ──────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-activities"
          icon={Activity}
          title="Aktivity"
        >
          <Controller
            control={control}
            name="activities"
            render={({ field }) => (
              <CheckboxGroup
                items={activities?.docs || []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 9. Příplatky za aktivity ──────────────────────────────────────────── */}
        <FormSection
          id="section-activity-addons"
          icon={Trophy}
          title="Příplatky za aktivity"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <RepeaterField
            label="Příplatky"
            fields={activityAddonsFieldArray.fields}
            onAppend={() =>
              activityAddonsFieldArray.append({
                activity: "",
                price: 0,
                space: "",
                type: "indoor",
              })
            }
            onRemove={activityAddonsFieldArray.remove}
            addButtonLabel="Přidat příplatek"
            renderItem={(_item, index) => (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Controller
                    control={control}
                    name={`activityAddons.${index}.activity`}
                    render={({ field }) => (
                      <SearchInput
                        ref={field.ref}
                        label="Aktivita"
                        placeholder="Vyberte aktivitu..."
                        options={
                          activities?.docs.map((a) => ({
                            id: a.id,
                            name: a.name,
                          })) ?? []
                        }
                        value={{
                          id: field.value ?? "",
                          name:
                            activities?.docs.find((a) => a.id === field.value)
                              ?.name ?? "",
                        }}
                        onSelect={(option) => field.onChange(option.id)}
                        error={
                          errors.activityAddons?.[index]?.activity?.message
                        }
                      />
                    )}
                  />
                  <Input
                    label="Cena (Kč)"
                    inputProps={{
                      ...register(`activityAddons.${index}.price`),
                      type: "number",
                      min: 0,
                    }}
                    error={errors.activityAddons?.[index]?.price?.message}
                  />
                </div>
                <Controller
                  control={control}
                  name={`activityAddons.${index}.type`}
                  render={({ field }) => (
                    <SelectInput
                      label="Typ"
                      items={[
                        { value: "indoor", label: "Interiér" },
                        { value: "outdoor", label: "Exteriér" },
                      ]}
                      value={field.value ?? "indoor"}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Vyberte..."
                    />
                  )}
                />
              </div>
            )}
          />
        </FormSection>

        {/* ── 10. Služby ────────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-services"
          icon={Star}
          title="Služby"
        >
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <CheckboxGroup
                items={services?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 11. Personál ──────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-personnel"
          icon={UserCheck}
          title="Personál"
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

        {/* ── 9. Vybavení ──────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-amenities"
          icon={Package}
          title="Vybavení"
        >
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <CheckboxGroup
                items={amenities?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 10. Technologie ───────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-technology"
          icon={Monitor}
          title="Technologie"
        >
          <Controller
            control={control}
            name="technology"
            render={({ field }) => (
              <CheckboxGroup
                items={technologies?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 14. Skladování ────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-storage"
          icon={Warehouse}
          title="Skladování"
        >
          <RepeaterField
            label="Skladovací prostory"
            fields={storageFieldArray.fields}
            onAppend={() => storageFieldArray.append({ name: "", area: 0 })}
            onRemove={storageFieldArray.remove}
            addButtonLabel="Přidat sklad"
            renderItem={(_item, index) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Název"
                  inputProps={{
                    ...register(`storage.${index}.name`),
                    placeholder: "Sklad A",
                  }}
                  error={errors.storage?.[index]?.name?.message}
                />
                <Input
                  label="Plocha (m²)"
                  inputProps={{
                    ...register(`storage.${index}.area`),
                    type: "number",
                    min: 1,
                  }}
                  error={errors.storage?.[index]?.area?.message}
                />
              </div>
            )}
          />
        </FormSection>

        {/* ── 15. Pravidla ──────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-rules"
          icon={ScrollText}
          title="Pravidla"
        >
          <Controller
            control={control}
            name="rules"
            render={({ field }) => (
              <CheckboxGroup
                label="Obecná pravidla"
                items={rules?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
          <Controller
            control={control}
            name="foodAndDrinkRules"
            render={({ field }) => (
              <CheckboxGroup
                label="Pravidla pro jídlo a pití"
                items={rules?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
          <Controller
            control={control}
            name="venueRules"
            render={({ field }) => (
              <CheckboxGroup
                label="Pravidla prostoru"
                items={rules?.docs ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
              />
            )}
          />
        </FormSection>

        {/* ── 16. Přístup ───────────────────────────────────────────────────────── */}
        <FormSection
          id="section-access"
          icon={Truck}
          title="Přístup a zásobování"
          color="text-listing"
          surfaceColor="bg-listing-surface"
        >
          <div className="flex flex-col gap-2">
            <InputLabel label="Typ vozidel, které zvládnou vjezd" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["car", "truck", "van", "bus"] as const).map((v) => (
                <Controller
                  key={v}
                  control={control}
                  name="access.vehicleTypes"
                  render={({ field }) => (
                    <Checkbox
                      checkColor="text-listing"
                      checked={field.value?.includes(v) ?? false}
                      onChange={(checked) =>
                        field.onChange(
                          toggleArrayItem(field.value ?? [], v, checked),
                        )
                      }
                      label={
                        {
                          car: "Auto",
                          truck: "Nákladní auto",
                          van: "Dodávka",
                          bus: "Autobus",
                        }[v]
                      }
                    />
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <InputLabel label="Zajištění nakládky a vykládky" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {(
                [
                  [
                    "access.helpWithLoadingAndUnloading",
                    "Pomoc s nakládkou a vykládkou",
                  ],
                  ["access.loadingRamp", "Nakládací rampa"],
                  ["access.loadingElevator", "Nakládací výtah"],
                  ["access.serviceAccess", "Servisní přístup"],
                  ["access.serviceArea", "Servisní zázemí"],
                ] as const
              ).map(([name, label]) => (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value ?? false}
                      onChange={field.onChange}
                      label={label}
                      checkColor="text-listing"
                    />
                  )}
                />
              ))}
            </div>
          </div>
        </FormSection>

        {/* ── 12. Parkování ─────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-parking"
          icon={ParkingSquare}
          title="Parkování"
        >
          <Controller
            control={control}
            name="parking.hasParking"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Parkování k dispozici"
                checkColor="text-listing"
              />
            )}
          />
          <div className={hasParking ? "" : "opacity-40 pointer-events-none"}>
            <div className="flex flex-col gap-4">
              <Input
                label="Počet parkovacích míst"
                inputProps={{
                  ...register("parking.parkingCapacity"),
                  type: "number",
                  min: 0,
                  disabled: !hasParking,
                }}
                error={errors.parking?.parkingCapacity?.message}
              />
              <Controller
                control={control}
                name="parking.parkingIsIncludedInPrice"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Parkování v ceně"
                    checkColor="text-listing"
                  />
                )}
              />
              <div
                className={
                  hasParking && !parkingIsIncludedInPrice
                    ? ""
                    : "opacity-40 pointer-events-none"
                }
              >
                <Input
                  label="Cena parkování (Kč)"
                  inputProps={{
                    ...register("parking.parkingPrice"),
                    type: "number",
                    min: 0,
                    disabled: !hasParking || parkingIsIncludedInPrice,
                  }}
                  error={errors.parking?.parkingPrice?.message}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* ── 13. Snídaně ───────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-breakfast"
          icon={Coffee}
          title="Snídaně"
        >
          <Controller
            control={control}
            name="breakfast.included"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Snídaně k dispozici"
                checkColor="text-listing"
              />
            )}
          />
          <div
            className={
              breakfastIncluded ? "" : "opacity-40 pointer-events-none"
            }
          >
            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="breakfast.breakfastIsIncludedInPrice"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Snídaně v ceně ubytování"
                    checkColor="text-listing"
                  />
                )}
              />
              <Controller
                control={control}
                name="breakfast.allowAccommodationWithoutBreakfast"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Povolit ubytování bez snídaně"
                    checkColor="text-listing"
                  />
                )}
              />
              <Controller
                control={control}
                name="breakfast.allowMoreBreakfastsThanAccommodation"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Povolit více snídaní než ubytovaných"
                    checkColor="text-listing"
                  />
                )}
              />
              <Input
                label="Cena snídaně (Kč)"
                inputProps={{
                  ...register("breakfast.price"),
                  type: "number",
                  min: 0,
                  disabled: !breakfastIncluded,
                }}
                error={errors.breakfast?.price?.message}
              />
              <Controller
                control={control}
                name="breakfast.pricePer"
                render={({ field }) => (
                  <SelectInput
                    label="Cena za"
                    items={[
                      { value: "person", label: "Osobu" },
                      { value: "booking", label: "Celou rezervaci" },
                    ]}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Vyberte..."
                    disabled={!breakfastIncluded}
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Snídaně od"
                  inputProps={{
                    ...register("breakfast.timeFrom"),
                    placeholder: "07:00",
                    disabled: !breakfastIncluded,
                  }}
                  error={errors.breakfast?.timeFrom?.message}
                />
                <Input
                  label="Snídaně do"
                  inputProps={{
                    ...register("breakfast.timeTo"),
                    placeholder: "10:00",
                    disabled: !breakfastIncluded,
                  }}
                  error={errors.breakfast?.timeTo?.message}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* ── 19. Zaměstnanci ───────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-employees"
          icon={Users}
          title="Zaměstnanci"
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

        {/* ── 20. FAQ ───────────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-faq"
          icon={CircleHelp}
          title="FAQ"
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
                    placeholder: "Jaká je kapacita sálu?",
                  }}
                  error={errors.faq?.[index]?.question?.message}
                />
                <Textarea
                  label="Odpověď"
                  inputProps={{
                    ...register(`faq.${index}.answer`),
                    rows: 3,
                    placeholder: "Hlavní sál pojme až 300 osob...",
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

        {/* ── 21. Reference ─────────────────────────────────────────────────────── */}
        <FormSection
          color="text-listing"
          surfaceColor="bg-listing-surface"
          id="section-references"
          icon={BookOpen}
          title="Reference"
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
        groups={VENUE_FORM_GROUPS}
        sticky={true}
        buttonVersion="listingFull"
        buttonText="Uložení"
      />
    </form>
  );
}
