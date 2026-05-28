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
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
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
import {
  useCreateListing,
  useCreateListingDetail,
  useListing,
  useListingDetail,
  useUpdateListing,
  useUpdateListingDetail,
} from "@/app/react-query/listings/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, Resolver, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import MapPointInput from "@/app/components/ui/atoms/inputs/map-point-input";
import TimeInput from "@/app/components/ui/atoms/inputs/time-input";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { getIdFromRelationshipField, undefinedToNull } from "@roo/common";
import IconCard from "../new/components/icon-card";
import { commonEditListingFieldsSchema } from "./common-schema";
import { itemSchema, toItem } from "./utils";

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
  location: { id: "section-location", title: "Lokalita", icon: "MapPin" },
  capacity: {
    id: "section-capacity",
    title: "Kapacita a prostor",
    icon: "Maximize2",
  },
  spaces: { id: "section-spaces", title: "Prostory", icon: "DoorOpen" },
  placeTypes: {
    id: "section-place-types",
    title: "Typ místa",
    icon: "Building2",
  },
  eventTypes: {
    id: "section-event-types",
    title: "Typy akcí",
    icon: "Calendar",
  },
  activities: { id: "section-activities", title: "Aktivity", icon: "Activity" },
  activityAddons: {
    id: "section-activity-addons",
    title: "Příplatky za aktivity",
    icon: "Trophy",
  },
  services: { id: "section-services", title: "Služby", icon: "Star" },
  personnel: { id: "section-personnel", title: "Personál", icon: "UserCheck" },
  amenities: { id: "section-amenities", title: "Vybavení", icon: "Package" },
  technology: {
    id: "section-technology",
    title: "Technologie",
    icon: "Monitor",
  },
  storage: { id: "section-storage", title: "Skladování", icon: "Warehouse" },
  rules: { id: "section-rules", title: "Pravidla", icon: "ScrollText" },
  access: {
    id: "section-access",
    title: "Přístup a zásobování",
    icon: "Truck",
  },
  parking: { id: "section-parking", title: "Parkování", icon: "ParkingSquare" },
  breakfast: { id: "section-breakfast", title: "Snídaně", icon: "Coffee" },
  employees: { id: "section-employees", title: "Zaměstnanci", icon: "Users" },
  faq: { id: "section-faq", title: "FAQ", icon: "CircleHelp" },
  references: {
    id: "section-references",
    title: "Reference",
    icon: "BookOpen",
  },
};

export const VENUE_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.price, S.images, S.eventTypes, S.location],
  },
  {
    label: "Prostor",
    sections: [S.capacity, S.placeTypes],
  },
  {
    label: "Program a nabídka",
    sections: [S.activities, S.activityAddons, S.services],
  },
  {
    label: "Vybavenost",
    sections: [S.personnel, S.amenities, S.technology],
  },
  {
    label: "Logistika",
    sections: [S.storage, S.rules, S.access, S.parking, S.breakfast],
  },
  {
    label: "Prezentace",
    sections: [S.employees, S.faq, S.references],
  },
];

const CREATE_VENUE_GROUPS: readonly TocGroup[] = [
  { label: "Základní", sections: [S.basic, S.price, S.images] },
  { label: "Typy akcí", sections: [S.eventTypes] },
  { label: "Místo a prostor", sections: [S.location, S.capacity, S.spaces] },
];

const schema = z
  .object({
    ...commonEditListingFieldsSchema,
    indoor: z.boolean().default(false),
    outdoor: z.boolean().default(false),
    spacesType: z.enum(
      ["area", "building", "room"] as const,
      "Vyberte typ prostoru",
    ),

    location: z.object({
      address: z.string().min(1, "Adresa je povinná"),
      city: z.object(
        {
          id: z.string().min(1, "Město je povinné"),
          name: z.string(),
        },
        "Vyberte město",
      ),
      coordinates: z.object(
        { latitude: z.number(), longitude: z.number() },
        "Vyberte přesnou polohu",
      ),
    }),

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
          activity: itemSchema.nullable().optional(),
          price: z.coerce.number({ message: "Zadejte číslo" }).min(0),
          space: itemSchema.nullable().optional(),
          type: z.enum(["indoor", "outdoor"]),
        }),
      )
      .default([]),
    amenities: z.array(itemSchema).default([]),
    services: z.array(itemSchema).default([]),
    technologies: z.array(itemSchema).default([]),
    placeTypes: z.array(itemSchema).default([]),
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

export type FormInputs = z.infer<typeof schema>;

type Props = {
  type: "create" | "edit";
  onCancel: () => void;
  onFormChange?: (values: FormInputs) => void;
};

function toggleArrayItem(arr: string[], id: string, checked: boolean) {
  return checked ? [...arr, id] : arr.filter((x) => x !== id);
}

export default function VenueListingForm({
  type,
  onCancel,
  onFormChange,
}: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const { data: listing } = useListing(type === "edit" ? listingId : undefined);
  const { data: venueDetail } = useListingDetail(
    "listing-venue-details",
    getIdFromRelationshipField(
      type === "edit" ? listing?.detail.value || "" : "",
    ) || "",
  );
  const { data: filters } = useFilterOptions();
  const { mutate } = useUpdateListing(companyId);
  const { mutate: updateDetail } = useUpdateListingDetail(
    "listing-venue-details",
  );
  const { mutateAsync: createListing } = useCreateListing();
  const { mutateAsync: createListingDetail } = useCreateListingDetail(
    "listing-venue-details",
  );
  const router = useRouter();

  const [citySearch, setCitySearch] = useState("");
  const [cityBbox, setCityBbox] = useState<
    [number, number, number, number] | undefined
  >();

  async function onSubmitCreate(data: FormInputs) {
    try {
      const { doc: detail } = await createListingDetail({
        access: {},
        parking: {},
        breakfast: {},
        spacesType: data.spacesType,
        area: data.area,
      });
      await createListing({
        type: "venue",
        properties: { eventTypes: data.eventTypes.map((i) => i.id) },
        company: companyId,
        name: data.name,
        images: {
          coverImage: data.images.coverImage,
          logo: data.images.logo,
          gallery: data.images.gallery,
        },
        guests: data.guests,
        price: { startsAt: data.price.startsAt },
        location: {
          type: "exact",
          address: data.location.address,
          city: data.location.city.id,
          latitude: data.location.coordinates.latitude,
          longitude: data.location.coordinates.longitude,
        },
        detail: { relationTo: "listing-venue-details", value: detail.id },
      });
      router.push({
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      });
    } catch {
      alert("Nepodařilo se vytvořit inzerát, zkuste to prosím později.");
    }
  }

  function onSubmitEdit(data: FormInputs) {
    if (!venueDetail) return;

    updateDetail(
      {
        id: venueDetail.id,
        data: {
          spacesType: venueDetail.spacesType,
          area: data.area,
          canBeBookedAsWhole: data.canBeBookedAsWhole,
          hasAccommodation: data.hasAccommodation,
          accommodationCapacity: data.accommodationCapacity,
          activityAddons: data.activityAddons
            .filter((a) => a.activity != null)
            .map((a) => ({
              activity: a.activity!.id,
              price: a.price,
              type: a.type,
              ...(a.space ? { space: a.space.id } : {}),
            })),
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
            : {},
          parking: data.parking ?? {},
          breakfast: data.breakfast ?? {},
          employees: data.employees,
          faq: data.faq.map((f) => ({
            active: f.active,
            question: f.question,
            answer: f.answer,
            group: f.groupedBy,
          })),
          references: data.references.map((r) => ({
            ...r,
            eventType: r.eventType ? r.eventType.id : undefined,
          })),
        },
      },
      {
        onSuccess: () => {
          mutate(
            {
              id: listingId,
              data: undefinedToNull({
                guests: data.guests,
                properties: {
                  eventTypes: data.eventTypes.map((i) => i.id),
                  placeTypes: data.placeTypes.map((i) => i.id),
                  services: data.services.map((i) => i.id),
                  activities: data.activities.map((i) => i.id),
                  personnel: data.personnel.map((i) => i.id),
                  amenities: data.amenities.map((i) => i.id),
                  technologies: data.technologies.map((i) => i.id),
                  gastroRules: data.gastroRules.map((i) => i.id),
                  venueRules: data.venueRules.map((i) => i.id),
                  entertainmentRules: data.entertainmentRules.map((i) => i.id),
                },
                name: data.name,
                shortDescription: data.shortDescription,
                description: data.description,
                indoor: data.indoor,
                outdoor: data.outdoor,
                location: {
                  type: "exact",
                  address: data.location.address,
                  city: data.location.city.id,
                  latitude: data.location.coordinates.latitude,
                  longitude: data.location.coordinates.longitude,
                },
                images: data.images,
                price: data.price,
              }),
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
        },
      },
    );
  }

  const onSubmit = type === "create" ? onSubmitCreate : onSubmitEdit;

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema) as Resolver<FormInputs>,
    defaultValues: {
      indoor: false,
      outdoor: false,
      spacesType: venueDetail?.spacesType,
      eventTypes: [],
      activities: [],
      activityAddons: [],
      services: [],
      personnel: [],
      amenities: [],
      technologies: [],
      placeTypes: [],
      gastroRules: [],
      venueRules: [],
      entertainmentRules: [],
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

  useEffect(() => {
    if (type !== "edit") return;
    if (!listing || !venueDetail) return;

    if (
      typeof listing.location.city === "object" &&
      listing.location.city !== null
    ) {
      const c = listing.location.city;
      if (c.bboxMinLon && c.bboxMinLat && c.bboxMaxLon && c.bboxMaxLat) {
        setCityBbox([c.bboxMinLon, c.bboxMinLat, c.bboxMaxLon, c.bboxMaxLat]);
      }
    }

    reset({
      name: listing.name,
      spacesType: venueDetail.spacesType,
      shortDescription: listing.shortDescription ?? undefined,
      description: listing.description ?? undefined,
      indoor: listing.indoor ?? false,
      outdoor: listing.outdoor ?? false,
      eventTypes: listing.properties.eventTypes?.map(toItem) ?? [],
      images: listing.images,
      price: { startsAt: listing.price.startsAt },
      location: {
        address: listing.location.address ?? "",
        city: {
          id:
            typeof listing.location.city === "string"
              ? listing.location.city
              : (listing.location.city?.id ?? ""),
          name:
            typeof listing.location.city === "object" &&
            listing.location.city !== null
              ? listing.location.city.name
              : "",
        },
        coordinates: {
          latitude: listing.location.latitude ?? undefined,
          longitude: listing.location.longitude ?? undefined,
        },
      },
      guests: {
        min: listing.guests?.min ?? undefined,
        max: listing.guests?.max ?? 0,
        ztp: listing.guests?.ztp ?? false,
        pets: listing.guests?.pets ?? false,
      },
      area: venueDetail.area,
      canBeBookedAsWhole: venueDetail.canBeBookedAsWhole ?? false,
      hasAccommodation: venueDetail.hasAccommodation ?? false,
      accommodationCapacity: venueDetail.accommodationCapacity ?? undefined,
      activities: listing.properties.activities?.map(toItem) ?? [],
      activityAddons:
        venueDetail.activityAddons?.map((a) => ({
          activity: toItem(a.activity),
          price: a.price,
          space: a.space
            ? toItem(a.space as string | { id: string; name: string })
            : null,
          type: a.type,
        })) ?? [],
      services: listing.properties.services?.map(toItem) ?? [],
      personnel: listing.properties.personnel?.map(toItem) ?? [],
      amenities: listing.properties.amenities?.map(toItem) ?? [],
      technologies: listing.properties.technologies?.map(toItem) ?? [],
      placeTypes: listing.properties.placeTypes?.map(toItem) ?? [],
      gastroRules: listing.properties.gastroRules?.map(toItem) ?? [],
      venueRules: listing.properties.venueRules?.map(toItem) ?? [],
      entertainmentRules:
        listing.properties.entertainmentRules?.map(toItem) ?? [],
      storage:
        venueDetail.storage?.map((s) => ({ name: s.name, area: s.area })) ?? [],
      access: {
        vehicleTypes: (venueDetail.access?.vehicleTypes ?? []) as string[],
        helpWithLoadingAndUnloading:
          venueDetail.access?.helpWithLoadingAndUnloading ?? false,
        loadingRamp: venueDetail.access?.loadingRamp ?? false,
        loadingElevator: venueDetail.access?.loadingElevator ?? false,
        serviceAccess: venueDetail.access?.serviceAccess ?? false,
        serviceArea: venueDetail.access?.serviceArea ?? false,
      },
      parking: {
        hasParking: venueDetail.parking?.hasParking ?? false,
        parkingCapacity: venueDetail.parking?.parkingCapacity ?? undefined,
        parkingIsIncludedInPrice:
          venueDetail.parking?.parkingIsIncludedInPrice ?? false,
        parkingPrice: venueDetail.parking?.parkingPrice ?? undefined,
      },
      breakfast: {
        included: venueDetail.breakfast?.included ?? false,
        allowAccommodationWithoutBreakfast:
          venueDetail.breakfast?.allowAccommodationWithoutBreakfast ?? false,
        allowMoreBreakfastsThanAccommodation:
          venueDetail.breakfast?.allowMoreBreakfastsThanAccommodation ?? false,
        breakfastIsIncludedInPrice:
          venueDetail.breakfast?.breakfastIsIncludedInPrice ?? false,
        price: venueDetail.breakfast?.price ?? undefined,
        pricePer: venueDetail.breakfast?.pricePer ?? undefined,
        timeFrom: venueDetail.breakfast?.timeFrom ?? undefined,
        timeTo: venueDetail.breakfast?.timeTo ?? undefined,
      },
      employees:
        venueDetail.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image,
        })) ?? [],
      faq:
        venueDetail.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.group ?? "general",
        })) ?? [],
      references:
        venueDetail.references?.map((r) => ({
          image: r.image,
          eventName: r.eventName,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType
            ? toItem(r.eventType as string | { id: string; name: string })
            : undefined,
        })) ?? [],
    });
  }, [type, listing, venueDetail, reset]);

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

  const selectedCity = watch("location.city");

  const { data: cities } = useCities({
    query: citySearch ? { name: { contains: citySearch } } : undefined,
  });

  const maxGuests = watch("guests.max");

  const tocGroups = type === "create" ? CREATE_VENUE_GROUPS : VENUE_FORM_GROUPS;

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
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
              placeholder: "Kongresové centrum Praha",
            }}
            isRequired
            error={errors.name?.message}
          />
          {type === "edit" && (
            <>
              <Input
                label="Krátký popis"
                inputProps={{
                  ...register("shortDescription"),
                  placeholder:
                    "Moderní prostory v centru Prahy až pro 300 osob.",
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
            </>
          )}
        </FormSection>

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
                placeholder: "9900",
              }}
              isRequired
              error={errors.price?.startsAt?.message}
            />
          </div>
        </FormSection>

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
                containerRef={field.ref}
                isRequired
                error={
                  errors.images?.gallery?.[0]?.filename?.message ||
                  errors.images?.gallery?.message
                }
              />
            )}
          />
        </FormSection>

        <FormSection
          id={S.eventTypes.id}
          icon={S.eventTypes.icon}
          title={S.eventTypes.title}
          subtitle={S.eventTypes.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.eventTypes?.message}
        >
          <Controller
            control={control}
            name="eventTypes"
            render={({ field }) => (
              <CheckboxGroup
                isRequired
                items={filters?.eventTypes ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
                error={errors.eventTypes?.message}
              />
            )}
          />
        </FormSection>

        <FormSection
          id={S.location.id}
          icon={S.location.icon}
          title={S.location.title}
          subtitle={S.location.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.location}
        >
          <Input
            label="Adresa"
            inputProps={{
              ...register("location.address"),
              placeholder: "Václavské náměstí 1",
            }}
            isRequired
            error={errors.location?.address?.message}
          />
          <Controller
            control={control}
            name="location.city"
            render={({ field }) => (
              <SearchInput
                ref={field.ref}
                label="Město"
                placeholder="Vyberte město..."
                options={
                  cities?.docs?.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    info: undefined,
                  })) ?? []
                }
                isRequired
                onSearchQueryChange={setCitySearch}
                selectedOption={
                  field.value
                    ? {
                        id: field.value.id,
                        name: field.value.name,
                        info: undefined,
                      }
                    : undefined
                }
                onSelect={(option) => {
                  field.onChange(option);
                  const fullCity = cities?.docs?.find(
                    (c) => c.id === option.id,
                  );
                  if (
                    fullCity?.bboxMinLon &&
                    fullCity?.bboxMinLat &&
                    fullCity?.bboxMaxLon &&
                    fullCity?.bboxMaxLat
                  ) {
                    setCityBbox([
                      fullCity.bboxMinLon,
                      fullCity.bboxMinLat,
                      fullCity.bboxMaxLon,
                      fullCity.bboxMaxLat,
                    ]);
                  } else {
                    setCityBbox(undefined);
                  }
                }}
                onClear={() => {
                  field.onChange(undefined);
                  setCityBbox(undefined);
                }}
                error={errors.location?.city?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="location.coordinates"
            render={({ field }) => (
              <MapPointInput
                inputProps={{ ref: field.ref }}
                label="Kde přesně se Váš prostor nachází?"
                mapDisabled={!selectedCity?.id}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.location?.coordinates?.message}
                externalBbox={cityBbox}
                isRequired
                containerRef={field.ref}
              />
            )}
          />
        </FormSection>

        <FormSection
          id={S.capacity.id}
          icon={S.capacity.icon}
          title={S.capacity.title}
          subtitle={S.capacity.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={
            !!errors.guests?.message ||
            !!errors.area?.message ||
            !!errors.accommodationCapacity?.message
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Max. počet hostů (osob)"
              isRequired
              inputProps={{
                ...register("guests.max"),
                type: "number",
                min: 1,
                placeholder: "300",
              }}
              error={errors.guests?.max?.message}
            />
            <Input
              label="Min. počet hostů (osob)"
              inputProps={{
                ...register("guests.min"),
                type: "number",
                max: maxGuests,
                placeholder: "10",
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
            <Controller
              control={control}
              name="guests.pets"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Přijímáme zvířata"
                  checkColor="text-listing"
                />
              )}
            />
          </div>
          <Input
            label="Plocha (m²)"
            inputProps={{
              ...register("area"),
              type: "number",
              min: 1,
              placeholder: "800",
            }}
            error={errors.area?.message}
            isRequired
          />
          {type === "edit" && (
            <>
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
                className={
                  hasAccommodation ? "" : "opacity-40 pointer-events-none"
                }
              >
                <Input
                  label="Ubytovací kapacita (lůžek)"
                  inputProps={{
                    ...register("accommodationCapacity"),
                    type: "number",
                    disabled: !hasAccommodation,
                  }}
                  error={errors.accommodationCapacity?.message}
                />
              </div>
            </>
          )}
        </FormSection>

        {type === "edit" && (
          <FormSection
            id={S.placeTypes.id}
            icon={S.placeTypes.icon}
            title={S.placeTypes.title}
            subtitle={S.placeTypes.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="placeTypes"
              render={({ field }) => (
                <CheckboxGroup
                  items={filters?.placeTypes ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

        {type === "edit" && (
          <FormSection
            id={S.activities.id}
            icon={S.activities.icon}
            title={S.activities.title}
            subtitle={S.activities.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="activities"
              render={({ field }) => (
                <CheckboxGroup
                  items={filters?.activities ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

        {type === "edit" && (
          <FormSection
            id={S.activityAddons.id}
            icon={S.activityAddons.icon}
            title={S.activityAddons.title}
            subtitle={S.activityAddons.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <RepeaterField
              label="Příplatky"
              fields={activityAddonsFieldArray.fields}
              onAppend={() =>
                activityAddonsFieldArray.append({
                  activity: null,
                  price: 0,
                  space: null,
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
                          options={filters?.activities ?? []}
                          onSelect={field.onChange}
                          onClear={() => field.onChange(null)}
                          name={field.name}
                          onBlur={field.onBlur}
                          selectedOption={field.value ?? undefined}
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
        )}

        {type === "edit" && (
          <FormSection
            id={S.services.id}
            icon={S.services.icon}
            title={S.services.title}
            subtitle={S.services.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="services"
              render={({ field }) => (
                <CheckboxGroup
                  items={filters?.services ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

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

        {type === "edit" && (
          <FormSection
            id={S.amenities.id}
            icon={S.amenities.icon}
            title={S.amenities.title}
            subtitle={S.amenities.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="amenities"
              render={({ field }) => (
                <CheckboxGroup
                  items={filters?.amenities ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

        {type === "edit" && (
          <FormSection
            id={S.technology.id}
            icon={S.technology.icon}
            title={S.technology.title}
            subtitle={S.technology.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={control}
              name="technologies"
              render={({ field }) => (
                <CheckboxGroup
                  items={filters?.technologies ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
          </FormSection>
        )}

        {type === "edit" && (
          <FormSection
            id={S.storage.id}
            icon={S.storage.icon}
            title={S.storage.title}
            subtitle={S.storage.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
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
        )}

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
              name="gastroRules"
              render={({ field }) => (
                <CheckboxGroup
                  label="Pravidla pro jídlo a pití"
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
            <Controller
              control={control}
              name="venueRules"
              render={({ field }) => (
                <CheckboxGroup
                  label="Pravidla prostoru"
                  items={
                    filters?.rules.filter((item) => item.type === "venue") ?? []
                  }
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                />
              )}
            />
            <Controller
              control={control}
              name="entertainmentRules"
              render={({ field }) => (
                <CheckboxGroup
                  label="Pravidla pro entertainment"
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

        {type === "edit" && (
          <FormSection
            id={S.access.id}
            icon={S.access.icon}
            title={S.access.title}
            subtitle={S.access.subTitle}
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
        )}

        {type === "edit" && (
          <FormSection
            id={S.parking.id}
            icon={S.parking.icon}
            title={S.parking.title}
            subtitle={S.parking.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
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
        )}

        {type === "edit" && (
          <FormSection
            id={S.breakfast.id}
            icon={S.breakfast.icon}
            title={S.breakfast.title}
            subtitle={S.breakfast.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
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
                  <Controller
                    control={control}
                    name="breakfast.timeFrom"
                    render={({ field }) => (
                      <TimeInput label="Snídaně od" onChange={field.onChange} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="breakfast.timeTo"
                    render={({ field }) => (
                      <TimeInput label="Snídaně do" onChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </div>
          </FormSection>
        )}

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
                            field.onChange(filename ?? {})
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

        {type === "edit" && (
          <FormSection
            color="text-listing"
            surfaceColor="bg-listing-surface"
            id={S.faq.id}
            icon={S.faq.icon}
            title={S.faq.title}
            subtitle={S.faq.subTitle}
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
        )}

        {type === "edit" && (
          <FormSection
            color="text-listing"
            surfaceColor="bg-listing-surface"
            id={S.references.id}
            icon={S.references.icon}
            title={S.references.title}
            subtitle={S.references.subTitle}
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

        {type === "create" && (
          <FormSection
            id={S.spaces.id}
            icon={S.spaces.icon}
            title={S.spaces.title}
            subtitle={S.spaces.subTitle}
            color="text-listing"
            surfaceColor="bg-listing-surface"
            error={!!errors.spacesType}
          >
            <Controller
              control={control}
              name="spacesType"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <InputLabel label="Co nabízíte?" isRequired />
                  <div
                    ref={field.ref}
                    tabIndex={-1}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
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
                  {errors.spacesType?.message && (
                    <ErrorText error={errors.spacesType.message} />
                  )}
                </div>
              )}
            />
          </FormSection>
        )}

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
