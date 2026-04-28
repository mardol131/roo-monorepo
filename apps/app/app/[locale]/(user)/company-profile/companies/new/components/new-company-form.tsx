"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import { phoneSchema } from "@/app/validation/schema/phone";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company, COUNTRY_CODES, uploadFileToCloud } from "@roo/common";
import { Building2, MapPin, Phone, Receipt } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { useTranslations } from "next-intl";
import PhoneInput from "@/app/components/ui/atoms/inputs/phone-input";
import { CreateCompanyPayload } from "@/app/react-query/companies/fetch";

const schema = z.object({
  name: z.string().min(1, "Název firmy je povinný"),
  ico: z.string().min(1, "IČO je povinné"),
  description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  email: z.string().min(1, "E-mail je povinný"),
  phone: phoneSchema,
  website: z.string().optional().nullable(),
  billingAddress: z.object({
    street: z.string().min(1, "Ulice je povinná"),
    city: z.string().min(1, "Město je povinné"),
    postalCode: z.string().min(1, "PSČ je povinné"),
    country: z.string().min(1, "Země je povinná"),
  }),
  vatId: z.string().optional().nullable(),
});

type FormInputs = CreateCompanyPayload;

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
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      phone: {
        countryCode: defaultValues?.phone?.countryCode || COUNTRY_CODES[0],
        number: defaultValues?.phone?.number,
      },
    },
  });

  console.log("Form errors:", errors);

  const t = useTranslations();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Section 1 — Základní informace */}
      <FormSection
        icon={Building2}
        title="Základní informace"
        error={Boolean(errors.name || errors.ico)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            isRequired
            label="Název firmy"
            inputProps={{ ...register("name") }}
            error={errors.name?.message}
          />
          <Input
            isRequired
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
        <Controller
          name="logo"
          control={control}
          render={({ field }) => (
            <ImageInput
              label="Logo"
              value={field.value}
              onChange={(f) => field.onChange(f ?? null)}
              onUpload={uploadFileToCloud}
              error={errors.logo?.message}
            />
          )}
        />
      </FormSection>

      {/* Section 2 — Kontaktní údaje */}
      <FormSection
        icon={Phone}
        title="Kontaktní údaje"
        error={Boolean(errors.email || errors.phone)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="E-mail"
            inputProps={{ ...register("email"), type: "email" }}
            error={errors.email?.message}
            isRequired
          />
          <PhoneInput
            control={control}
            label="Telefonní číslo"
            countryCodeName="phone.countryCode"
            isRequired
            countryCodeError={errors.phone?.countryCode?.message}
            numberError={errors.phone?.number?.message}
            phoneNumberProps={{ ...register("phone.number") }}
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

      {/* Section 3 — Fakturační adresa */}
      <FormSection
        icon={MapPin}
        title="Fakturační adresa"
        error={Boolean(errors.billingAddress)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            isRequired
            label="Ulice"
            inputProps={{ ...register("billingAddress.street") }}
            error={errors.billingAddress?.street?.message}
          />
          <Input
            isRequired
            label="Město"
            inputProps={{ ...register("billingAddress.city") }}
            error={errors.billingAddress?.city?.message}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            isRequired
            label="PSČ"
            inputProps={{
              ...register("billingAddress.postalCode"),
              inputMode: "numeric",
            }}
            error={errors.billingAddress?.postalCode?.message}
          />
          <Input
            isRequired
            label="Země"
            inputProps={{ ...register("billingAddress.country") }}
            error={errors.billingAddress?.country?.message}
          />
        </div>
      </FormSection>

      {/* Section 4 — Daňové údaje */}
      <FormSection
        icon={Receipt}
        title="Daňové údaje"
        error={Boolean(errors.vatId)}
      >
        <Input
          label="DIČ (plátce DPH)"
          inputProps={{
            ...register("vatId"),
            placeholder: "CZ12345678",
          }}
          error={errors.vatId?.message}
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
        <Button text={submitLabel} version="primary" htmlType="submit" />
      </div>
    </form>
  );
}
