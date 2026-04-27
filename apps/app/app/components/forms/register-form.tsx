"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import InputLabel from "@/app/components/ui/atoms/input-label";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import Text from "@/app/components/ui/atoms/text";
import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { CheckCircle, Building2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { COUNTRY_CODES, User } from "@roo/common";
import { registerUser } from "@/app/functions/api/users";
import Checkbox from "../ui/atoms/inputs/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { phoneSchema } from "@/app/validation/schema/phone";
import { useTranslations } from "next-intl";

type CountryCode = NonNullable<NonNullable<User["phone"]>["countryCode"]>;
type AccountType = User["type"];

type RegisterFormValues = zod.infer<typeof formSchema>;

type Props = {
  accountType: AccountType;
  onSuccess?: () => void;
  buttonVersion?: ButtonProps["version"];
  buttonText?: string;
  buttonIconLeft?: ButtonProps["iconLeft"];
};

const formSchema = zod
  .object({
    firstName: zod.string().min(1, "Jméno je povinné"),
    lastName: zod.string().min(1, "Příjmení je povinné"),
    email: zod.string().min(1, "E-mail je povinný"),
    phone: phoneSchema,
    password: zod.string().min(8, "Heslo musí mít alespoň 8 znaků"),
    passwordConfirm: zod.string().min(8, "Heslo musí mít alespoň 8 znaků"),
    legal: zod
      .boolean()
      .refine((v) => v === true, { message: "Musíte souhlasit s podmínkami" }),
    marketing: zod.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Hesla se neshodují",
  });

export default function RegisterForm({
  accountType,
  onSuccess,
  buttonVersion = "secondary",
  buttonText = "Registrovat",
  buttonIconLeft = "User",
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: { countryCode: "420", number: "" },
      legal: false,
      marketing: false,
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setServerError(undefined);
    try {
      const res = await registerUser({
        ...data,
        type: accountType,
        marketingConsent: data.marketing,
        gdprConsent: data.legal,
        termsOfUseConsent: data.legal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.log("Registration error:", body);
        const errorMessage = body?.errors?.[0]?.data?.errors?.[0];
        if (
          errorMessage.path === "gdprConsent" ||
          errorMessage.path === "termsOfUseConsent"
        ) {
          setServerError("Musíte souhlasit s podmínkami.");
          return;
        }
        setServerError(
          errorMessage ?? "Registrace se nezdařila. Zkuste to prosím znovu.",
        );
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setServerError(
        "Nepodařilo se připojit k serveru. Zkuste to prosím znovu.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle className="w-14 h-14 text-success" strokeWidth={1.5} />
        <div className="flex flex-col gap-1">
          <Text variant="h3" color="textDark">
            Zkontrolujte svůj e-mail
          </Text>
          <Text variant="body-sm" color="textLight">
            Zaslali jsme vám potvrzovací odkaz. Kliknutím na něj dokončíte
            registraci.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {accountType === "company" && (
        <AlertSection
          icon={Building2}
          iconBg="bg-company-surface"
          iconColor="text-company"
          borderColor="border-company/30"
          bgColor="bg-company-surface/40"
          title="Registrace firemního účtu"
          text="Po registraci budete moci vytvořit firemní profil a spravovat nabídky služeb pro vaše klienty."
        />
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          label="Jméno"
          isRequired
          error={errors.firstName?.message}
          inputProps={{
            ...register("firstName", { required: "Jméno je povinné" }),
            placeholder: "Jan",
            autoComplete: "given-name",
          }}
        />
        <Input
          label="Příjmení"
          isRequired
          error={errors.lastName?.message}
          inputProps={{
            ...register("lastName", { required: "Příjmení je povinné" }),
            placeholder: "Novák",
            autoComplete: "family-name",
          }}
        />
      </div>
      <Input
        label="E-mail"
        isRequired
        error={errors.email?.message}
        inputProps={{
          ...register("email", {
            required: "E-mail je povinný",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Zadejte platný e-mail",
            },
          }),
          type: "email",
          placeholder: "jan.novak@email.cz",
          autoComplete: "email",
        }}
      />
      {/* Phone */}
      <div className="w-full">
        <InputLabel label="Telefon" />
        <div className="flex gap-2">
          <div className="w-36 shrink-0">
            <Controller
              name="phone.countryCode"
              control={control}
              render={({ field }) => (
                <SelectInput
                  label=""
                  items={COUNTRY_CODES.map((code) => ({
                    value: code,
                    label: t(`phone.countryCodes.${code}` as const) || code,
                  }))}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.phone?.countryCode?.message}
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Input
              label=""
              error={errors.phone?.number?.message}
              filterRegex={/\d/}
              inputProps={{
                ...register("phone.number"),
                type: "tel",
                placeholder: "123 456 789",
                autoComplete: "tel-national",
                maxLength: 9,
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          label="Heslo"
          isRequired
          error={errors.password?.message}
          inputProps={{
            ...register("password", {
              required: "Heslo je povinné",
              minLength: {
                value: 8,
                message: "Heslo musí mít alespoň 8 znaků",
              },
            }),
            type: "password",
            placeholder: "Alespoň 8 znaků",
            autoComplete: "new-password",
          }}
        />

        <Input
          label="Heslo znovu"
          isRequired
          error={errors.passwordConfirm?.message}
          inputProps={{
            ...register("passwordConfirm", {
              required: "Potvrzení hesla je povinné",
              validate: (v) => v === watch("password") || "Hesla se neshodují",
            }),
            type: "password",
            placeholder: "Zopakujte heslo",
            autoComplete: "new-password",
          }}
        />
      </div>
      <Controller
        name="legal"
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChange={field.onChange}
            isRequired
            error={errors.legal?.message}
            label="Souhlasím s obchodními podmínkami a podmínkami ochrany osobních údajů"
          />
        )}
      />
      <Controller
        name="marketing"
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onChange={field.onChange}
            label="Chci dostávat marketingové e-maily s novinkami a speciálními nabídkami"
          />
        )}
      />
      {serverError && (
        <Text variant="caption" color="primary">
          {serverError}
        </Text>
      )}
      <Button
        text={buttonText}
        htmlType="submit"
        version={buttonVersion}
        size="md"
        loading={isSubmitting}
        iconLeft={buttonIconLeft}
        className="w-full mt-1"
      />
    </form>
  );
}
