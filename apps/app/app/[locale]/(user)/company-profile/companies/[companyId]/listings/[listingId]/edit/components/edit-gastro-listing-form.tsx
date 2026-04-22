"use client";

import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import {
  MOCK_CUISINES,
  MOCK_DIETARY_OPTIONS,
  MOCK_DISH_TYPES,
  MOCK_EVENT_TYPES,
  MOCK_FOOD_SERVICE_STYLES,
  MOCK_NECESSITIES,
  MOCK_PERSONNEL,
  MOCK_RULES,
} from "@/app/_mock/mock";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  BookOpen,
  Building2,
  Calendar,
  ChefHat,
  CircleHelp,
  Image,
  Package,
  ScrollText,
  Star,
  UserCheck,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@roo/common";
import InputLabel from "@/app/components/ui/atoms/input-label";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";

// ── TOC groups ────────────────────────────────────────────────────────────────

export const GASTRO_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [
      { id: "section-basic", title: "Základní informace", icon: Building2 },
      { id: "section-price", title: "Cena", icon: Banknote },
      { id: "section-images", title: "Obrázky", icon: Image },
    ],
  },
  {
    label: "Kapacita a nabídka",
    sections: [
      { id: "section-capacity", title: "Kapacita a objednávky", icon: Users },
      { id: "section-cuisines", title: "Kuchyně", icon: ChefHat },
      { id: "section-offer", title: "Nabídka", icon: Utensils },
      { id: "section-extras", title: "Doplňky", icon: Star },
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
  slug: z.string().min(1, "Slug je povinný"),
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
  capacity: z.coerce
    .number({ message: "Zadejte číslo" })
    .positive("Kapacita musí být kladná")
    .int("Zadejte celé číslo"),
  minimumCapacity: z.coerce.number().nullable().optional(),
  cuisines: z.array(z.string()).default([]),
  dishTypes: z.array(z.string()).default([]),
  dietaryOptions: z.array(z.string()).default([]),
  foodServiceStyles: z.array(z.string()).default([]),
  personnel: z.array(z.string()).default([]),
  necessities: z.array(z.string()).default([]),
  kidsMenu: z.boolean().default(false),
  hasAlcoholLicense: z.boolean().default(false),
  foodAndDrinkRules: z.array(z.string()).default([]),
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
        eventName: z.string().optional(),
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
  onSubmit: (data: GastroFormInputs) => void;
  onCancel: () => void;
  onFormChange?: (values: GastroFormInputs) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditGastroListingForm({
  onSubmit,
  onCancel,
  onFormChange,
}: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: listing } = useListing(listingId);

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

    reset({
      name: listing.name,
      slug: listing.slug,
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
      capacity: d.capacity,
      minimumCapacity: d.minimumCapacity ?? undefined,
      cuisines: d.cuisines?.map(id) ?? [],
      dishTypes: d.dishTypes?.map(id) ?? [],
      dietaryOptions: d.dietaryOptions?.map(id) ?? [],
      foodServiceStyles: d.foodServiceStyles?.map(id) ?? [],
      personnel: d.personnel?.map(id) ?? [],
      necessities: d.necessities?.map(id) ?? [],
      kidsMenu: d.kidsMenu ?? false,
      hasAlcoholLicense: d.hasAlcoholLicense ?? false,
      foodAndDrinkRules: d.foodAndDrinkRules?.map(id) ?? [],
      rules: listing.rules?.map(id) ?? [],
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* ── 1. Základní informace ─────────────────────────────────────────────── */}
      <FormSection
        id="section-basic"
        icon={Building2}
        title="Základní informace"
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Název"
            inputProps={{
              ...register("name"),
              placeholder: "Novák Catering",
            }}
            error={errors.name?.message}
          />
          <Input
            label="Slug"
            inputProps={{
              ...register("slug"),
              placeholder: "novak-catering",
            }}
            error={errors.slug?.message}
          />
        </div>
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
              placeholder: "4900",
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

      {/* ── 4. Kapacita a objednávky ──────────────────────────────────────────── */}
      <FormSection
        id="section-capacity"
        icon={Users}
        title="Kapacita a objednávky"
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
        id="section-cuisines"
        icon={ChefHat}
        title="Kuchyně"
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={control}
          name="cuisines"
          render={({ field }) => (
            <CheckboxGroup
              items={MOCK_CUISINES}
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
        id="section-offer"
        icon={Utensils}
        title="Nabídka"
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={control}
          name="dishTypes"
          render={({ field }) => (
            <CheckboxGroup
              label="Typy jídel"
              items={MOCK_DISH_TYPES}
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
              items={MOCK_DIETARY_OPTIONS}
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
              items={MOCK_FOOD_SERVICE_STYLES}
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
        id="section-extras"
        icon={Star}
        title="Doplňky"
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
                    placeholder: "Šéfkuchař",
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
                    ref={field.ref}
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
        <Button text="Uložit úpravy" version="listingFull" htmlType="submit" />
      </div>
    </form>
  );
}
