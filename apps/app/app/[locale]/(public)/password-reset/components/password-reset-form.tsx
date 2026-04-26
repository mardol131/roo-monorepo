"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = { password: string; passwordConfirm: string };

export default function PasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  if (!token) {
    return (
      <div className="flex flex-col gap-3">
        <Text variant="body-sm" color="primary">
          Odkaz pro obnovení hesla je neplatný nebo vypršel. Požádejte o nový.
        </Text>
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          Zpět na přihlášení
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle className="w-14 h-14 text-success" strokeWidth={1.5} />
        <div className="flex flex-col gap-1">
          <Text variant="h3" color="textDark">
            Heslo bylo změněno
          </Text>
          <Text variant="body-sm" color="textLight">
            Nyní se můžete přihlásit pomocí nového hesla.
          </Text>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-900 hover:underline mt-2"
        >
          Přihlásit se
        </Link>
      </div>
    );
  }

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: data.password }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError("root", {
          message:
            body?.errors?.[0]?.message ??
            "Nepodařilo se změnit heslo. Odkaz mohl vypršet.",
        });
        return;
      }
      setSubmitted(true);
    } catch {
      setError("root", {
        message: "Nepodařilo se připojit k serveru. Zkuste to prosím znovu.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nové heslo"
        isRequired
        error={errors.password?.message}
        inputProps={{
          ...register("password", {
            required: "Heslo je povinné",
            minLength: { value: 8, message: "Heslo musí mít alespoň 8 znaků" },
          }),
          type: "password",
          placeholder: "Alespoň 8 znaků",
          autoComplete: "new-password",
          autoFocus: true,
        }}
      />

      <Input
        label="Nové heslo znovu"
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

      {errors.root && (
        <Text variant="caption" color="primary">
          {errors.root.message}
        </Text>
      )}

      <Button
        text="Nastavit nové heslo"
        htmlType="submit"
        version="secondary"
        size="md"
        rounding="lg"
        loading={isSubmitting}
        className="w-full mt-1"
      />
    </form>
  );
}
