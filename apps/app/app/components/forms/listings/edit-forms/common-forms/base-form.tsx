"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import SearchInput, {
  SearchOption,
} from "@/app/components/ui/atoms/inputs/search-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { BaseData } from "../common-schema";

type Props = {
  form: UseFormReturn<BaseData>;
  isActive: boolean;
  filters: ReturnType<typeof useFilterOptions>["data"];
  texts: {
    basic: TocSection;
    images: TocSection;
    eventTypes: TocSection;
  };
  subTypeOptions: SearchOption[];
};

export function BaseForm({
  form,
  isActive,
  filters,
  texts,
  subTypeOptions,
}: Props) {
  const [subTypeSearch, setSubTypeSearch] = useState("");

  const servesAll = form.watch("eventTypeSelection.servesAll");

  return (
    <div className={!isActive ? "hidden" : "flex flex-col gap-4"}>
      <FormSection
        id={texts.basic.id}
        icon={texts.basic.icon}
        title={texts.basic.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.name || !!form.formState.errors.subType}
      >
        <Input
          label="Název"
          sublabel="Tento název bude viditelný v katalogu"
          inputProps={{
            ...form.register("name"),
            placeholder: "DJ Studio Praha",
          }}
          error={form.formState.errors.name?.message}
          isRequired
        />
        <Input
          label="Krátký popis"
          isRequired
          inputProps={{
            ...form.register("shortDescription"),
            placeholder: "Profesionální DJ na vaši akci.",
          }}
          error={form.formState.errors.shortDescription?.message}
        />
        <Textarea
          label="Popis"
          inputProps={{
            ...form.register("description"),
            rows: 4,
            placeholder: "Detailní popis vystoupení...",
          }}
        />
        <Controller
          control={form.control}
          name="subType"
          render={({ field }) => (
            <SearchInput
              isRequired
              label="Typ služby"
              options={subTypeOptions.filter(
                (i) =>
                  !subTypeSearch ||
                  i.name.toLowerCase().includes(subTypeSearch.toLowerCase()),
              )}
              selectedOption={
                field.value
                  ? (subTypeOptions.find((i) => i.id === field.value) ?? null)
                  : null
              }
              onSelect={(option) => field.onChange(option.id)}
              onClear={() => field.onChange("")}
              onSearchQueryChange={setSubTypeSearch}
              error={form.formState.errors.subType?.message}
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.images.id}
        icon={texts.images.icon}
        title={texts.images.title}
        subtitle={texts.images.subTitle}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.images}
      >
        <Controller
          control={form.control}
          name="images.coverImage"
          render={({ field }) => (
            <ImageInput
              containerRef={field.ref}
              label="Titulní obrázek"
              value={field.value}
              onChange={(filename) => field.onChange(filename ?? "")}
              onUpload={uploadFileToCloud}
              error={form.formState.errors.images?.coverImage?.message}
              isRequired
            />
          )}
        />
        <Controller
          control={form.control}
          name="images.logo"
          render={({ field }) => (
            <ImageInput
              label="Logo"
              value={field.value}
              onChange={(filename) => field.onChange(filename ?? "")}
              onUpload={uploadFileToCloud}
              error={form.formState.errors.images?.logo?.message}
            />
          )}
        />
        <Controller
          control={form.control}
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
              error={form.formState.errors.images?.gallery?.message}
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.eventTypes.id}
        icon={texts.eventTypes.icon}
        title={texts.eventTypes.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.eventTypeSelection?.types}
      >
        <Controller
          control={form.control}
          name="eventTypeSelection.servesAll"
          render={({ field }) => (
            <Checkbox
              title="Vyberte tuto možnost, pokud poskytujete služby pro všechny typy akcí."
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Poskytujeme služby pro všechny typy akcí"
              checkColor="text-listing"
            />
          )}
        />
        {!servesAll && (
          <Controller
            control={form.control}
            name="eventTypeSelection.types"
            render={({ field }) => (
              <CheckboxGroup
                hideTags
                items={filters?.eventTypes ?? []}
                value={field.value ?? []}
                onChange={field.onChange}
                checkColor="text-listing"
                searchable
                isRequired
                error={form.formState.errors.eventTypeSelection?.types?.message}
              />
            )}
          />
        )}
      </FormSection>
    </div>
  );
}
