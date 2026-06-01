"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import z from "zod";

export const capacitySchema = z.object({
  max: getPositiveNumber("Zadejte maximální kapacitu"),
  min: getOptionalPositiveNumber("Zadejte kladné číslo"),
});
export type CapacityData = z.infer<typeof capacitySchema>;

type Props = {
  form: UseFormReturn<CapacityData>;
  isActive: boolean;
  texts: {
    capacity: TocSection;
  };
};

export function CapacityForm({ form, isActive, texts }: Props) {
  return (
    <div className={isActive ? "flex flex-col gap-4" : "hidden"}>
      <FormSection
        id={texts.capacity.id}
        icon={texts.capacity.icon}
        title={texts.capacity.title}
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={!!form.formState.errors.max}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Maximální kapacita (osob)"
            isRequired
            inputProps={{
              ...form.register("max"),
              type: "number",
              min: 1,
              placeholder: "300",
            }}
            error={form.formState.errors.max?.message}
          />
          <Input
            label="Minimální kapacita (osob)"
            inputProps={{
              ...form.register("min"),
              type: "number",
              min: 1,
              placeholder: "50",
            }}
            error={form.formState.errors.min?.message}
          />
        </div>
      </FormSection>
    </div>
  );
}
