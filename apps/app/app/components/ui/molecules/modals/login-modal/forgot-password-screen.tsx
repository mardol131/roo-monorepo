"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { useForm } from "react-hook-form";

type ForgotFormValues = { email: string };

type Props = {
  onSuccess: () => void;
  onBack: () => void;
};

export default function ForgotPasswordScreen({ onSuccess, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotFormValues>();

  async function onSubmit(data: ForgotFormValues) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError("root", {
          message:
            body?.errors?.[0]?.message ??
            "Nepodařilo se odeslat e-mail. Zkuste to prosím znovu.",
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
        Zadejte svůj e-mail a pošleme vám odkaz pro obnovení hesla.
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
        text="Odeslat odkaz"
        htmlType="submit"
        version="secondary"
        size="md"
        rounding="lg"
        loading={isSubmitting}
        className="w-full"
      />

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-zinc-700 hover:underline transition-colors"
        >
          Zpět na přihlášení
        </button>
      </div>
    </form>
  );
}
