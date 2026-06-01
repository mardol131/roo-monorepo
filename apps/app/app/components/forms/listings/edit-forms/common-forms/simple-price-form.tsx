"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import Input from "@/app/components/ui/atoms/inputs/input";
import SeasonalPricesInput from "@/app/components/ui/atoms/inputs/seasonal-prices-input";
import { Controller, UseFormReturn } from "react-hook-form";
import { SimplePriceData } from "../common-schema";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";

type Props = {
  form: UseFormReturn<SimplePriceData>;
  isActive: boolean;
  texts: {
    price: TocSection;
    seasonalPrices: TocSection;
  };
};

export function SimplePriceForm({ form, isActive, texts }: Props) {
  return (
    <div className={!isActive ? "hidden" : "flex flex-col gap-4"}>
      <FormSection
        id={texts.price.id}
        icon={texts.price.icon}
        title={texts.price.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.price?.base}
      >
        <Input
          label="Minimální cena za event (Kč)"
          sublabel="Minimální cena, za kterou dokáže zákazník objednat vaše služby. Bude použita pro filtrování v katalogu."
          inputProps={{
            ...form.register("minimumPricePerEvent"),
            type: "number",
            min: 0,
            placeholder: "7900",
          }}
          error={form.formState.errors?.minimumPricePerEvent?.message}
          isRequired
        />
      
        <Controller
          control={form.control}
          name="price.pricingUnit"
          render={({ field }) => (
            <PriceInput
              label="Cena pro výpočet poptávky (Kč) bez akcí a slev"
              isRequired
              amountProps={form.register("price.base")}
              unitValue={field.value}
              onUnitChange={field.onChange}
              amountError={form.formState.errors.price?.base?.message}
              unitError={form.formState.errors.price?.pricingUnit?.message}
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.seasonalPrices.id}
        icon={texts.seasonalPrices.icon}
        title={texts.seasonalPrices.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors?.price?.seasonalPrices}
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
