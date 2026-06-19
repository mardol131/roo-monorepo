"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { loginModalEvents } from "@/app/components/ui/molecules/modals/login-modal/login-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import { Link } from "@/app/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z
  .object({
    password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Hesla se neshodují",
    path: ["passwordConfirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function PasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [submitted, setSubmitted] = useState(false);
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/reset-password`,
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
      await logout();
      setSubmitted(true);
    } catch {
      setError("root", {
        message: "Nepodařilo se připojit k serveru. Zkuste to prosím znovu.",
      });
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-3">
        <Text variant="body-sm" color="primary">
          Odkaz pro obnovení hesla je neplatný nebo vypršel. Požádejte o nový.
        </Text>
        <Button
          text="Zpět na hlavní stránku"
          version="primary"
          size="md"
          rounding="lg"
          link="/homepage"
        />
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
        <Button
          text="Přihlásit se"
          version="successFull"
          size="md"
          rounding="lg"
          onClick={() => loginModalEvents.emit("open", undefined)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nové heslo"
        isRequired
        error={errors.password?.message}
        inputProps={{
          ...register("password"),
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
          ...register("passwordConfirm"),
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
