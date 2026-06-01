"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import PriceableCheckboxGroup, {
  BaseItem,
  PriceableItem,
} from "@/app/components/ui/atoms/inputs/priceable-checkbox-group";
import {
  Controller,
  FieldError,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

export type PriceableSectionConfig<T extends FieldValues = FieldValues> = {
  toc: TocSection;
  field: Path<T>;
  items: BaseItem[];
  label: string;
};

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  isActive: boolean;
  sections: PriceableSectionConfig<T>[];
};

export function PriceableOptionsForm<T extends FieldValues>({
  form,
  isActive,
  sections,
}: Props<T>) {
  return (
    <div className={!isActive ? "hidden" : "flex flex-col gap-4"}>
      {sections.map((section) => {
        const fieldError = form.formState.errors[section.field];
        const errorMessage =
          fieldError && "message" in fieldError
            ? (fieldError as FieldError).message
            : undefined;

        return (
          <FormSection
            key={String(section.field)}
            id={section.toc.id}
            icon={section.toc.icon}
            title={section.toc.title}
            color="text-listing"
            surfaceColor="bg-listing-surface"
          >
            <Controller
              control={form.control}
              name={section.field}
              render={({ field }) => (
                <PriceableCheckboxGroup
                  items={section.items}
                  value={(field.value as PriceableItem[]) ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                  label={section.label}
                  error={errorMessage}
                />
              )}
            />
          </FormSection>
        );
      })}
    </div>
  );
}
