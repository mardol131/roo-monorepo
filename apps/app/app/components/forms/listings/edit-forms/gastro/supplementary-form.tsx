"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { SupplementaryData } from "./schemas";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";

type Props = {
  form: UseFormReturn<SupplementaryData>;
  isActive: boolean;
  filters: ReturnType<typeof useFilterOptions>["data"];
  texts: Record<keyof SupplementaryData, TocSection>;
};

export function SupplementaryForm({ form, isActive, filters, texts }: Props) {
  const referencesFieldArray = useFieldArray({
    control: form.control,
    name: "references",
  });

  if (!isActive) return null;

  return (
    <>
      <FormSection
        id={texts.necessities.id}
        icon={texts.necessities.icon}
        title={texts.necessities.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
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
      <FormSection
        id={texts.dishTypes.id}
        icon={texts.dishTypes.icon}
        title={texts.dishTypes.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
          name="dishTypes"
          render={({ field }) => (
            <CheckboxGroup
              items={filters?.dishTypes ?? []}
              value={field.value ?? []}
              onChange={field.onChange}
              checkColor="text-listing"
              searchable
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.gastroRules.id}
        icon={texts.gastroRules.icon}
        title={texts.gastroRules.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
          name="gastroRules"
          render={({ field }) => (
            <CheckboxGroup
              items={filters?.gastroRules ?? []}
              value={field.value ?? []}
              onChange={field.onChange}
              checkColor="text-listing"
              searchable
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.dietaryOptions.id}
        icon={texts.dietaryOptions.icon}
        title={texts.dietaryOptions.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
          name="dietaryOptions"
          render={({ field }) => (
            <CheckboxGroup
              items={filters?.dietaryOptions ?? []}
              value={field.value ?? []}
              onChange={field.onChange}
              checkColor="text-listing"
              searchable
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.references.id}
        icon={texts.references.icon}
        title={texts.references.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.references}
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
                control={form.control}
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
                    ...form.register(`references.${index}.eventName`),
                    placeholder: "Firemní večírek ABC",
                  }}
                  error={
                    form.formState.errors.references?.[index]?.eventName
                      ?.message
                  }
                />
                <Input
                  label="Jméno klienta"
                  inputProps={{
                    ...form.register(`references.${index}.clientName`),
                    placeholder: "Jan Novák",
                  }}
                  error={
                    form.formState.errors.references?.[index]?.clientName
                      ?.message
                  }
                />
              </div>
              <Input
                label="Popis"
                inputProps={{
                  ...form.register(`references.${index}.description`),
                  placeholder: "Krátký popis akce nebo spolupráce...",
                }}
                error={
                  form.formState.errors.references?.[index]?.description
                    ?.message
                }
              />
              <Controller
                control={form.control}
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
    </>
  );
}
