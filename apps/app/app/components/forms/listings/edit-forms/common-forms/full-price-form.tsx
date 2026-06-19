"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import InputLabel from "@/app/components/ui/atoms/input-label";
import Input from "@/app/components/ui/atoms/inputs/input";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import SeasonalPricesInput from "@/app/components/ui/atoms/inputs/seasonal-prices-input";
import Switch from "@/app/components/ui/atoms/inputs/switch";
import { Controller, UseFormReturn } from "react-hook-form";
import { FullPriceData } from "../common-schema";
type Props = {
  form: UseFormReturn<FullPriceData>;
  isActive: boolean;
  texts: {
    price: TocSection;
    seasonalPrices: TocSection;
  };
};

export function FullPriceForm({ form, isActive, texts }: Props) {
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
          sublabel="Minimální cena, za kterou dokáže zákazník objednat vaše služby. Bude použita pro filtrování v katalogu a pro výpočet ceny poptávky, pokud nebude jednotková cena dostačující."
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
          name={"price.pricingUnit"}
          render={({ field }) => (
            <PriceInput
              label="Cena pro výpočet poptávky (Kč) bez akcí a slev"
              sublabel="Jednotková cena, podle které naceňujete akce."
              isRequired
              amountProps={form.register("price.base")}
              unitValue={field.value}
              onUnitChange={field.onChange}
              amountError={form.formState.errors.price?.base?.message}
              unitError={form.formState.errors.price?.pricingUnit?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="price.travelFeeEnabled"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <InputLabel label="Cestovní poplatek" />
              <Switch
                checked={field.value ?? false}
                onEnable={() => field.onChange(true)}
                onDisable={() => field.onChange(false)}
              />
            </div>
          )}
        />
        {form.watch("price.travelFeeEnabled") && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cena za km (Kč)"
              inputProps={{
                ...form.register("price.travelFeePerKm"),
                type: "number",
                min: 0,
                placeholder: "10",
              }}
              isRequired
              error={form.formState.errors.price?.travelFeePerKm?.message}
            />
            <Input
              label="Od vzdálenosti (km)"
              inputProps={{
                ...form.register("price.travelFeeStartsAtKm"),
                type: "number",
                min: 0,
                placeholder: "30",
              }}
              isRequired
              error={form.formState.errors.price?.travelFeeStartsAtKm?.message}
            />
          </div>
        )}
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
