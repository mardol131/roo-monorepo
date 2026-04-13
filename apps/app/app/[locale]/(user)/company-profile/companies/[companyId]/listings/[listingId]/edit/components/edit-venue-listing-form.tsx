"use client";

import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import Text from "@/app/components/ui/atoms/text";
import {
  MOCK_ACTIVITIES,
  MOCK_AMENITIES,
  MOCK_CITIES,
  MOCK_EVENT_TYPES,
  MOCK_PERSONNEL,
  MOCK_PLACE_TYPES,
  MOCK_RULES,
  MOCK_SERVICES,
  MOCK_TECHNOLOGIES,
} from "@/app/_mock/mock";
import { zodResolver } from "@hookform/resolvers/zod";
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
import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@roo/common";
import InputLabel from "@/app/components/ui/atoms/input-label";

// ── Sections config (exported for TOC) ────────────────────────────────────────

export const VENUE_FORM_SECTIONS = [
  { id: "section-basic", title: "Základní informace", icon: Building2 },
  { id: "section-price", title: "Cena", icon: Banknote },
  { id: "section-images", title: "Obrázky", icon: Image },
  { id: "section-location", title: "Lokalita", icon: MapPin },
  { id: "section-capacity", title: "Kapacita a prostor", icon: Maximize2 },
  { id: "section-place-types", title: "Typ místa", icon: Building2 },
  { id: "section-event-types", title: "Typy akcí", icon: Calendar },
  { id: "section-activities", title: "Aktivity", icon: Activity },
  {
    id: "section-activity-addons",
    title: "Příplatky za aktivity",
    icon: Trophy,
  },
  { id: "section-services", title: "Služby", icon: Star },
  { id: "section-personnel", title: "Personál", icon: UserCheck },
  { id: "section-amenities", title: "Vybavení", icon: Package },
  { id: "section-technology", title: "Technologie", icon: Monitor },
  { id: "section-storage", title: "Skladování", icon: Warehouse },
  { id: "section-rules", title: "Pravidla", icon: ScrollText },
  { id: "section-access", title: "Přístup a zásobování", icon: Truck },
  { id: "section-parking", title: "Parkování", icon: ParkingSquare },
  { id: "section-breakfast", title: "Snídaně", icon: Coffee },
  { id: "section-employees", title: "Zaměstnanci", icon: Users },
  { id: "section-faq", title: "FAQ", icon: CircleHelp },
  { id: "section-references", title: "Reference", icon: BookOpen },
] as const;

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Název je povinný"),
  slug: z.string().min(1, "Slug je povinný"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  indoor: z.boolean().default(false),
  outdoor: z.boolean().default(false),
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
    address: z.string().min(1, "Adresa je povinná"),
    city: z.string().min(1, "Město je povinné"),
    postalCode: z.string().optional(),
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
  activities: z.array(z.string()).default([]),
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
  services: z.array(z.string()).default([]),
  personnel: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  technology: z.array(z.string()).default([]),
  placeTypes: z.array(z.string()).default([]),
  foodAndDrinkRules: z.array(z.string()).default([]),
  venueRules: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
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
        eventName: z.string().optional(),
        clientName: z.string().optional(),
        eventType: z.string().optional(),
      }),
    )
    .default([]),
});

// ── Types ──────────────────────────────────────────────────────────────────────

export type FormInputs = z.infer<typeof schema>;

// ── Props ──────────────────────────────────────────────────────────────────────

type Props = {
  onSubmit: (data: FormInputs) => void;
  onCancel: () => void;
  onFormChange?: (values: FormInputs) => void;
};

function toggleArrayItem(arr: string[], id: string, checked: boolean) {
  return checked ? [...arr, id] : arr.filter((x) => x !== id);
}
// ── Component ──────────────────────────────────────────────────────────────────

export default function NewVenueListingForm({
  onSubmit,
  onCancel,
  onFormChange,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    watch,
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
  const nameValue = watch("name");
  const coverImageValue = watch("images.coverImage");
  const addressValue = watch("location.address");
  const cityValue = watch("location.city");
  const capacityValue = watch("capacity");
  const areaValue = watch("area");
  const startsAtValue = watch("price.startsAt");

  const isSubmitDisabled =
    !nameValue ||
    !coverImageValue ||
    !addressValue ||
    !cityValue ||
    !capacityValue ||
    !areaValue ||
    !startsAtValue;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* ── 1. Základní informace ─────────────────────────────────────────────── */}
      <FormSection
        id="section-basic"
        icon={Building2}
        title="Základní informace"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Kongresové centrum Praha",
            }}
            error={errors.name?.message}
          />
          <Input
            label="Slug"
            inputProps={{
              ...register("slug"),
              placeholder: "kongresove-centrum-praha",
            }}
            error={errors.slug?.message}
          />
        </div>
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
                />
              )}
            />
          </div>
        </div>
      </FormSection>

      {/* ── 2. Cena ───────────────────────────────────────────────────────────── */}
      <FormSection id="section-price" icon={Banknote} title="Cena">
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
      <FormSection id="section-location" icon={MapPin} title="Lokalita">
        <Input
          label="Adresa"
          inputProps={{
            ...register("location.address"),
            placeholder: "Václavské náměstí 1",
          }}
          error={errors.location?.address?.message}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="location.city"
            render={({ field }) => (
              <SearchInput
                label="Město"
                placeholder="Vyberte město..."
                options={MOCK_CITIES.map((c) => ({
                  id: c.id,
                  label: c.name,
                }))}
                value={{
                  id: field.value ?? "",
                  label:
                    MOCK_CITIES.find((c) => c.id === field.value)?.name ?? "",
                }}
                onSelect={(option) => field.onChange(option.id)}
                error={errors.location?.city?.message}
              />
            )}
          />
          <Input
            label="PSČ"
            inputProps={{
              ...register("location.postalCode"),
              placeholder: "110 00",
            }}
            error={errors.location?.postalCode?.message}
          />
        </div>
      </FormSection>

      {/* ── 5. Kapacita a prostor ─────────────────────────────────────────────── */}
      <FormSection
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
      <FormSection id="section-place-types" icon={Building2} title="Typ místa">
        <Controller
          control={control}
          name="placeTypes"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_PLACE_TYPES.map((pt) => (
                <Checkbox
                  key={pt.id}
                  checked={field.value?.includes(pt.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], pt.id, checked),
                    )
                  }
                  label={pt.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 7. Typy akcí ─────────────────────────────────────────────────────── */}
      <FormSection id="section-event-types" icon={Calendar} title="Typy akcí">
        <Controller
          control={control}
          name="eventTypes"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_EVENT_TYPES.map((et) => (
                <Checkbox
                  key={et.id}
                  checked={field.value?.includes(et.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], et.id, checked),
                    )
                  }
                  label={et.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 7. Aktivity ──────────────────────────────────────────────────────── */}
      <FormSection id="section-activities" icon={Activity} title="Aktivity">
        <Controller
          control={control}
          name="activities"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_ACTIVITIES.map((a) => (
                <Checkbox
                  key={a.id}
                  checked={field.value?.includes(a.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], a.id, checked),
                    )
                  }
                  label={a.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 9. Příplatky za aktivity ──────────────────────────────────────────── */}
      <FormSection
        id="section-activity-addons"
        icon={Trophy}
        title="Příplatky za aktivity"
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
                      label="Aktivita"
                      placeholder="Vyberte aktivitu..."
                      options={MOCK_ACTIVITIES.map((a) => ({
                        id: a.id,
                        label: a.name,
                      }))}
                      value={{
                        id: field.value ?? "",
                        label:
                          MOCK_ACTIVITIES.find((a) => a.id === field.value)
                            ?.name ?? "",
                      }}
                      onSelect={(option) => field.onChange(option.id)}
                      error={errors.activityAddons?.[index]?.activity?.message}
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
      <FormSection id="section-services" icon={Star} title="Služby">
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_SERVICES.map((s) => (
                <Checkbox
                  key={s.id}
                  checked={field.value?.includes(s.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], s.id, checked),
                    )
                  }
                  label={s.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 11. Personál ──────────────────────────────────────────────────────── */}
      <FormSection id="section-personnel" icon={UserCheck} title="Personál">
        <Controller
          control={control}
          name="personnel"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_PERSONNEL.map((p) => (
                <Checkbox
                  key={p.id}
                  checked={field.value?.includes(p.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], p.id, checked),
                    )
                  }
                  label={p.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 9. Vybavení ──────────────────────────────────────────────────────── */}
      <FormSection id="section-amenities" icon={Package} title="Vybavení">
        <Controller
          control={control}
          name="amenities"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_AMENITIES.map((a) => (
                <Checkbox
                  key={a.id}
                  checked={field.value?.includes(a.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], a.id, checked),
                    )
                  }
                  label={a.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 10. Technologie ───────────────────────────────────────────────────── */}
      <FormSection id="section-technology" icon={Monitor} title="Technologie">
        <Controller
          control={control}
          name="technology"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_TECHNOLOGIES.map((t) => (
                <Checkbox
                  key={t.id}
                  checked={field.value?.includes(t.id) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      toggleArrayItem(field.value ?? [], t.id, checked),
                    )
                  }
                  label={t.name}
                />
              ))}
            </div>
          )}
        />
      </FormSection>

      {/* ── 14. Skladování ────────────────────────────────────────────────────── */}
      <FormSection id="section-storage" icon={Warehouse} title="Skladování">
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
      <FormSection id="section-rules" icon={ScrollText} title="Pravidla">
        <Controller
          control={control}
          name="rules"
          render={({ field }) => (
            <div>
              <InputLabel label="Obecná pravidla" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {MOCK_RULES.map((r) => (
                  <Checkbox
                    key={r.id}
                    checked={field.value?.includes(r.id) ?? false}
                    onChange={(checked) =>
                      field.onChange(
                        toggleArrayItem(field.value ?? [], r.id, checked),
                      )
                    }
                    label={r.name}
                  />
                ))}
              </div>
            </div>
          )}
        />
        <Controller
          control={control}
          name="foodAndDrinkRules"
          render={({ field }) => (
            <div>
              <InputLabel label="Pravidla pro jídlo a pití" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {MOCK_RULES.map((r) => (
                  <Checkbox
                    key={r.id}
                    checked={field.value?.includes(r.id) ?? false}
                    onChange={(checked) =>
                      field.onChange(
                        toggleArrayItem(field.value ?? [], r.id, checked),
                      )
                    }
                    label={r.name}
                  />
                ))}
              </div>
            </div>
          )}
        />
        <Controller
          control={control}
          name="venueRules"
          render={({ field }) => (
            <div>
              <InputLabel label="Pravidla prostoru" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {MOCK_RULES.map((r) => (
                  <Checkbox
                    key={r.id}
                    checked={field.value?.includes(r.id) ?? false}
                    onChange={(checked) =>
                      field.onChange(
                        toggleArrayItem(field.value ?? [], r.id, checked),
                      )
                    }
                    label={r.name}
                  />
                ))}
              </div>
            </div>
          )}
        />
      </FormSection>

      {/* ── 16. Přístup ───────────────────────────────────────────────────────── */}
      <FormSection
        id="section-access"
        icon={Truck}
        title="Přístup a zásobování"
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
                  />
                )}
              />
            ))}
          </div>
        </div>
      </FormSection>

      {/* ── 12. Parkování ─────────────────────────────────────────────────────── */}
      <FormSection id="section-parking" icon={ParkingSquare} title="Parkování">
        <Controller
          control={control}
          name="parking.hasParking"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Parkování k dispozici"
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
      <FormSection id="section-breakfast" icon={Coffee} title="Snídaně">
        <Controller
          control={control}
          name="breakfast.included"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Snídaně k dispozici"
            />
          )}
        />
        <div
          className={breakfastIncluded ? "" : "opacity-40 pointer-events-none"}
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
      <FormSection id="section-employees" icon={Users} title="Zaměstnanci">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder: "Manažer",
                  }}
                  error={errors.employees?.[index]?.role?.message}
                />
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
      <FormSection id="section-faq" icon={CircleHelp} title="FAQ">
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
      <FormSection id="section-references" icon={BookOpen} title="Reference">
        <RepeaterField
          label="Reference"
          fields={referencesFieldArray.fields}
          onAppend={() =>
            referencesFieldArray.append({
              image: "",
              eventName: "",
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
              <Controller
                control={control}
                name={`references.${index}.eventType`}
                render={({ field }) => (
                  <SearchInput
                    label="Typ akce"
                    placeholder="Vyberte typ akce..."
                    options={MOCK_EVENT_TYPES.map((et) => ({
                      id: et.id,
                      label: et.name,
                    }))}
                    value={{
                      id: field.value ?? "",
                      label:
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
          text="Vytvořit listing"
          version="primary"
          disabled={isSubmitDisabled}
          htmlType="submit"
        />
      </div>
    </form>
  );
}
