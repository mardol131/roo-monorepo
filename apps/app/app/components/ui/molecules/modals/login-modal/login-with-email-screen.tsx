"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { sendMagicLinkLoginEmail } from "@/app/functions/api/users";
import { useForm } from "react-hook-form";

type FormValues = { email: string };

type Props = {
  onSuccess: () => void;
  onBack: () => void;
};

export default function LoginWithEmailScreen({ onSuccess, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>();

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  async function onSubmit(data: FormValues) {
    try {
      const res = await sendMagicLinkLoginEmail(data.email, currentUrl);
      if (!res.ok) {
        setError("root", {
          message: "Nepodařilo se odeslat e-mail. Zkuste to prosím znovu.",
        });
        return;
      }
      onSuccess();
    } catch {
      setError("root", {
        message: "Nepodařilo se připojit k serveru. Zkuste to prosím znovu.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Text variant="body-sm" color="textLight">
        Zadejte svůj e-mail a pošleme vám přihlašovací odkaz platný 15 minut.
      </Text>

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
          autoFocus: true,
        }}
      />

      {errors.root && (
        <Text variant="caption" color="primary">
          {errors.root.message}
        </Text>
      )}

      <Button
        text="Odeslat přihlašovací odkaz"
        htmlType="submit"
        version="secondary"
        size="md"
        rounding="lg"
        loading={isSubmitting}
        className="w-full"
      />

      <Button
        text="Zpět na přihlášení"
        htmlType="button"
        version="plain"
        size="md"
        rounding="lg"
        loading={isSubmitting}
        className="w-full"
        onClick={onBack}
      />
    </form>
  );
}
