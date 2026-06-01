"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { RecommendedData } from "./schemas";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";

type Props = {
  form: UseFormReturn<RecommendedData>;
  isActive: boolean;
  filters: ReturnType<typeof useFilterOptions>["data"];
  texts: {
    capacity: TocSection;
    placeTypes: TocSection;
    faq: TocSection;
    employees: TocSection;
  };
};

export function RecommendedForm({ form, isActive, filters, texts }: Props) {
  const faqFieldArray = useFieldArray({ control: form.control, name: "faq" });
  const employeesFieldArray = useFieldArray({
    control: form.control,
    name: "employees",
  });

  const hasAccommodation = form.watch("hasAccommodation");
  const maxGuests = form.watch("guests.max");

  if (!isActive) return null;

  return (
    <>
      <FormSection
        id={texts.capacity.id}
        icon={texts.capacity.icon}
        title={texts.capacity.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={
          !!form.formState.errors.guests?.message ||
          !!form.formState.errors.area?.message ||
          !!form.formState.errors.accommodationCapacity?.message
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Max. počet hostů (osob)"
            isRequired
            inputProps={{
              ...form.register("guests.max"),
              type: "number",
              min: 1,
              placeholder: "300",
            }}
            error={form.formState.errors.guests?.max?.message}
          />
          <Input
            label="Min. počet hostů (osob)"
            inputProps={{
              ...form.register("guests.min"),
              type: "number",
              max: maxGuests,
              placeholder: "10",
            }}
            error={form.formState.errors.guests?.min?.message}
          />
        </div>
        <div className="flex gap-6">
          <Controller
            control={form.control}
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
            control={form.control}
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
            ...form.register("area"),
            type: "number",
            min: 1,
            placeholder: "800",
          }}
          error={form.formState.errors.area?.message}
          isRequired
        />
        <Controller
          control={form.control}
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
          control={form.control}
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
              ...form.register("accommodationCapacity"),
              type: "number",
              disabled: !hasAccommodation,
            }}
            error={form.formState.errors.accommodationCapacity?.message}
          />
        </div>
      </FormSection>

      <FormSection
        id={texts.placeTypes.id}
        icon={texts.placeTypes.icon}
        title={texts.placeTypes.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
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

      <FormSection
        id={texts.faq.id}
        icon={texts.faq.icon}
        title={texts.faq.title}
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
                  ...form.register(`faq.${index}.question`),
                  placeholder: "Jaká je kapacita sálu?",
                }}
                error={form.formState.errors.faq?.[index]?.question?.message}
              />
              <Textarea
                label="Odpověď"
                inputProps={{
                  ...form.register(`faq.${index}.answer`),
                  rows: 3,
                  placeholder: "Hlavní sál pojme až 300 osob...",
                }}
                error={form.formState.errors.faq?.[index]?.answer?.message}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  control={form.control}
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
                  control={form.control}
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

      <FormSection
        id={texts.employees.id}
        icon={texts.employees.icon}
        title={texts.employees.title}
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
                  control={form.control}
                  name={`employees.${index}.image`}
                  render={({ field }) => (
                    <ImageInput
                      label="Fotografie"
                      value={field.value}
                      onChange={(filename) => field.onChange(filename ?? {})}
                      onUpload={uploadFileToCloud}
                    />
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Input
                    label="Jméno"
                    inputProps={{
                      ...form.register(`employees.${index}.name`),
                      placeholder: "Jan Novák",
                    }}
                    error={
                      form.formState.errors.employees?.[index]?.name?.message
                    }
                  />
                  <Input
                    label="Role"
                    inputProps={{
                      ...form.register(`employees.${index}.role`),
                      placeholder: "Manažer",
                    }}
                    error={
                      form.formState.errors.employees?.[index]?.role?.message
                    }
                  />
                </div>
              </div>
              <Textarea
                label="Popis"
                inputProps={{
                  ...form.register(`employees.${index}.description`),
                  rows: 2,
                  placeholder: "Krátký popis zaměstnance...",
                }}
                error={
                  form.formState.errors.employees?.[index]?.description?.message
                }
              />
            </div>
          )}
        />
      </FormSection>
    </>
  );
}
