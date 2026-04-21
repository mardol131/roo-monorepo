"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Název firmy je povinný"),
  ico: z.string().regex(/^\d{8}$/, "IČO musí mít přesně 8 číslic"),
  description: z.string().optional(),
  email: z.string().min(1, "E-mail je povinný"),
  phone: z.string().min(1, "Telefon je povinný"),
  website: z.string().optional(),
});

type FormInputs = {
  name: string;
  ico: string;
  description?: string;
  email: string;
  phone: string;
  website?: string;
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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues,
  });

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
