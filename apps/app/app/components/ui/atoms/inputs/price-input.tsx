"use client";

import React from "react";
import type { PricingUnits } from "@roo/common";
import Input from "./input";
import InputLabel from "../input-label";
import SelectInput from "./select-input";
import { useTranslations } from "next-intl";

type Props = {
  label: string;
  sublabel?: string;
  isRequired?: boolean;
  amountProps?: React.InputHTMLAttributes<HTMLInputElement>;
  unitValue?: PricingUnits;
  onUnitChange?: (value: PricingUnits) => void;
  amountError?: string;
  unitError?: string;
  options?: PricingUnits[];
};

export default function PriceInput({
  label,
  sublabel,
  isRequired,
  amountProps,
  unitValue,
  onUnitChange,
  amountError,
  unitError,
  options,
}: Props) {
  const g = useTranslations("global.pricing.units");
  const PRICING_UNIT_OPTIONS: { value: PricingUnits; label: string }[] = options
    ? options.map((option) => ({ value: option, label: g(option) }))
    : [
        { value: "lump_sum", label: g("lump_sum") },
        { value: "per_person", label: g("per_person") },
        { value: "per_hour", label: g("per_hour") },
        { value: "per_day", label: g("per_day") },
      ];
  return (
    <div className="w-full">
      {label && (
        <InputLabel label={label} sublabel={sublabel} isRequired={isRequired} />
      )}
      <div className="grid grid-cols-2 gap-2">
        <Input
          inputProps={{
            ...amountProps,
            type: "number",
            min: amountProps?.min ?? 0,
          }}
          placeholder="6999"
          isRequired={isRequired}
          error={amountError}
        />
        <SelectInput
          value={unitValue}
          isRequired={isRequired}
          onChange={(e) => onUnitChange?.(e.target.value as PricingUnits)}
          items={PRICING_UNIT_OPTIONS}
          error={unitError}
        />
      </div>
    </div>
  );
}
