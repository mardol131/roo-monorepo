"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { useAuth } from "@/app/context/auth/auth-context";
import { login } from "@/app/functions/api/users";
import { Link } from "@/app/i18n/navigation";
import { useForm } from "react-hook-form";

type LoginFormValues = { email: string; password: string };

type Props = {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onClose: () => void;
};

export default function LoginScreen({
  onSuccess,
  onForgotPassword,
  onClose,
}: Props) {
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>();

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await auth.login(data.email, data.password);
      console.log(res);
      if (res.error) {
        setError("root", {
          message:
            res?.error ?? "Nesprávný e-mail nebo heslo. Zkuste to znovu.",
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

      <div className="flex flex-col gap-1">
        <Input
          label="Heslo"
          isRequired
          error={errors.password?.message}
          inputProps={{
            ...register("password", { required: "Heslo je povinné" }),
            type: "password",
            placeholder: "Vaše heslo",
            autoComplete: "current-password",
          }}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-zinc-400 hover:text-zinc-700 hover:underline transition-colors"
          >
            Zapomněli jste heslo?
          </button>
        </div>
      </div>

      {errors.root && (
        <Text variant="caption" color="primary">
          {errors.root.message}
        </Text>
      )}

      <Button
        text="Přihlásit se"
        htmlType="submit"
        version="secondary"
        size="md"
        rounding="lg"
        loading={isSubmitting}
        className="w-full"
      />

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-zinc-100" />
        <Text variant="caption" color="textLight">
          nebo
        </Text>
        <div className="flex-1 h-px bg-zinc-100" />
      </div>

      <div className="text-center">
        <Text variant="body-sm" color="textLight" as="span">
          Nemáte účet?{" "}
        </Text>
        <Link
          href="/register"
          className="text-sm font-medium text-zinc-900 hover:underline"
          onClick={onClose}
        >
          Zaregistrujte se
        </Link>
      </div>
    </form>
  );
}
