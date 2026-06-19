"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { priceWithoutTravelFeeSchema } from "../../../listings/edit-forms/common-schema";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import z from "zod";
import SeasonalPricesInput from "@/app/components/ui/atoms/inputs/seasonal-prices-input";
import { CompletionWidget } from "@/app/[locale]/(user)/components/completion-widget";

export const priceSchema = z.object({
  price: priceWithoutTravelFeeSchema,
});
export type PriceData = z.infer<typeof priceSchema>;

import type { PricingUnits } from "@roo/common";

type Props = {
  form: UseFormReturn<PriceData>;
  isActive: boolean;
  texts: {
    price: TocSection;
    seasonalPrices: TocSection;
  };
  priceUnitOptions?: PricingUnits[];
};

export function PriceForm({ form, isActive, texts, priceUnitOptions }: Props) {
  return (
    <div className={isActive ? "flex flex-col gap-4" : "hidden"}>
      <FormSection
        id={texts.price.id}
        icon={texts.price.icon}
        title={texts.price.title}
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={!!form.formState.errors.price?.base}
      >
        <Controller
          control={form.control}
          name="price.pricingUnit"
          render={({ field }) => (
            <PriceInput
              label="Základní cena"
              sublabel="Jednotková cena, podle které naceňujete akce."
              isRequired
              amountProps={form.register("price.base")}
              unitValue={field.value}
              onUnitChange={field.onChange}
              amountError={form.formState.errors.price?.base?.message}
              unitError={form.formState.errors.price?.pricingUnit?.message}
              options={priceUnitOptions}
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.seasonalPrices.id}
        icon={texts.seasonalPrices.icon}
        title={texts.seasonalPrices.title}
        surfaceColor="bg-variant-surface"
        color="text-variant"
      >
        <SeasonalPricesInput
          control={form.control}
          register={form.register}
          errors={(form.formState.errors?.price?.seasonalPrices as any) ?? []}
        />
      </FormSection>
    </div>
  );
}
