"use client";

import React from "react";
import Input from "./input";
import { Control, Controller } from "react-hook-form";
import SelectInput from "./select-input";
import { COUNTRY_CODES } from "@roo/common";
import { useTranslations } from "next-intl";
import InputLabel from "../input-label";

type Props = {
  control: Control<any, any, any>;
  label?: string;
  isRequired?: boolean;
  disabled?: boolean;
  countryCodeError?: string;
  numberError?: string;
  phoneNumberProps?: React.InputHTMLAttributes<HTMLInputElement>;
  countryCodeProps?: React.InputHTMLAttributes<HTMLSelectElement>;
  countryCodeName: string;
};

export default function PhoneInput({
  control,
  label = "Telefon",
  isRequired,
  disabled,
  countryCodeError,
  numberError,
  phoneNumberProps,
  countryCodeName,
}: Props) {
  const t = useTranslations("phone.countryCodes");
  return (
    <div className={`w-full ${disabled ? "opacity-50" : ""}`}>
      <InputLabel label={label} isRequired={isRequired} />

      <div className="flex gap-2">
        <div className="w-25">
          <Controller
            name={countryCodeName}
            control={control}
            render={({ field }) => (
              <SelectInput
                items={COUNTRY_CODES.map((code) => ({
                  value: code,
                  label: t(`${code}`) || code,
                }))}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                error={countryCodeError}
              />
            )}
          />
        </div>
        <div className="flex-1">
          <Input
            error={numberError}
            filterRegex={/\d/}
            inputProps={{
              ...phoneNumberProps,
              type: "tel",
              placeholder: "123 456 789",
              autoComplete: "tel-national",
              maxLength: 9,
            }}
          />
        </div>
      </div>
    </div>
  );
}
