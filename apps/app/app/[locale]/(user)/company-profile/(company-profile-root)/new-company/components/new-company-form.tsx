"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import { Controller, Resolver, useForm } from "react-hook-form";
import Input from "@/app/components/ui/atoms/inputs/input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, MapPin, Phone } from "lucide-react";
import Button from "@/app/components/ui/atoms/button";

const MOCK_CITIES = [
  { id: "loc-1", label: "Praha" },
  { id: "loc-2", label: "Brno" },
  { id: "loc-3", label: "Ostrava" },
  { id: "loc-4", label: "Plzeň" },
  { id: "loc-5", label: "Liberec" },
  { id: "loc-6", label: "Pardubice" },
];

const schema = yup.object({
  name: yup.string().required("Název firmy je povinný"),
  ico: yup
    .string()
    .matches(/^\d{8}$/, "IČO musí mít přesně 8 číslic")
    .required("IČO je povinné"),
  description: yup.string(),
  email: yup
    .string()
    .email("Zadejte platný e-mail")
    .required("E-mail je povinný"),
  phone: yup.string(),
  website: yup.string(),
  city: yup
    .object({ id: yup.string().required(), label: yup.string().required() })
    .required("Město je povinné"),
});

type FormInputs = {
  name: string;
  ico: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  city: { id: string; label: string };
};

type Props = {
  defaultValues?: Partial<FormInputs>;
  onSubmit: (data: FormInputs) => void;
  onBackClick: () => void;
  submitLabel: string;
  cancelLabel: string;
};

export default function CompanyForm({
  defaultValues,
  onSubmit,
  onBackClick,
  submitLabel,
  cancelLabel,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema) as unknown as Resolver<FormInputs>,
    defaultValues,
  });

  const nameValue = watch("name");
  const icoValue = watch("ico");
  const emailValue = watch("email");
  const cityValue = watch("city");

  const buttonIsDisabled = !nameValue || !icoValue || !emailValue || !cityValue;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Section 1 — Základní informace */}
      <FormSection icon={Building2} title="Základní informace">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Název firmy"
            inputProps={{ ...register("name") }}
            error={errors.name?.message}
          />
          <Input
            label="IČO"
            inputProps={{
              ...register("ico"),
              maxLength: 8,
              inputMode: "numeric",
            }}
            error={errors.ico?.message}
          />
        </div>
        <Input
          label="Popis firmy"
          inputProps={{ ...register("description") }}
          error={errors.description?.message}
        />
      </FormSection>

      {/* Section 2 — Kontaktní údaje */}
      <FormSection icon={Phone} title="Kontaktní údaje">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="E-mail"
            inputProps={{ ...register("email"), type: "email" }}
            error={errors.email?.message}
          />
          <Input
            label="Telefon"
            inputProps={{ ...register("phone"), type: "tel" }}
            error={errors.phone?.message}
          />
        </div>
        <Input
          label="Webová stránka"
          inputProps={{
            ...register("website"),
            placeholder: "https://...",
          }}
          error={errors.website?.message}
        />
      </FormSection>

      {/* Section 3 — Lokalita */}
      <FormSection icon={MapPin} title="Lokalita">
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <SearchInput
              label="Město nebo obec"
              options={MOCK_CITIES}
              value={field.value}
              onSelect={field.onChange}
              error={errors.city?.message}
            />
          )}
        />
      </FormSection>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          htmlType="button"
          text={cancelLabel}
          onClick={onBackClick}
          version="plain"
        />
        <Button
          text={submitLabel}
          version="primary"
          disabled={buttonIsDisabled}
          htmlType="submit"
        />
      </div>
    </form>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl border border-zinc-200">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-rose-500" />
        </div>
        <Text variant="label1" color="dark" className="font-semibold">
          {title}
        </Text>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}
