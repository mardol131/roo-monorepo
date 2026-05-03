"use client";

import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { createEvents } from "@/app/functions/create-events";
import { useEffect, useState } from "react";
import ForgotPasswordScreen from "./forgot-password-screen";
import ForgotPasswordSuccessScreen from "./forgot-password-success-screen";
import LoginScreen from "./login-screen";
import { useRouter as useNextRouter, useSearchParams } from "next/navigation";

type View = "login" | "forgot" | "forgot-success";
type LoginModalEvents = { open: undefined };
type ReasonsForRequiredLogin = "not_logged_in";

export const loginModalEvents = createEvents<LoginModalEvents>();

const HEADERS: Record<View, string> = {
  login: "Přihlášení",
  forgot: "Zapomenuté heslo",
  "forgot-success": "Zapomenuté heslo",
};

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("login");
  const params = useSearchParams();
  const router = useNextRouter();

  useEffect(() => {
    if (params.get("requireLogin") === "true") {
      setIsOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("requireLogin");
      router.replace(url.pathname + url.search);
    }
  }, []);

  loginModalEvents.useListener({
    event: "open",
    handler: () => setIsOpen(true),
  });

  function handleClose() {
    setIsOpen(false);
    setView("login");
  }

  function handleSuccess() {
    handleClose();
    const redirectTo = params.get("redirectAfterLogin");
    if (redirectTo) {
      router.push(redirectTo);
    }
  }

  return (
    <ModalLayout
      header={HEADERS[view]}
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-md"
      errorMessage={
        params.get("reasonForRequiredLogin") === "not_logged_in"
          ? "Pro pokračování je nutné se přihlásit."
          : undefined
      }
    >
      {view === "login" && (
        <LoginScreen
          onSuccess={handleSuccess}
          onForgotPassword={() => setView("forgot")}
          onClose={handleClose}
        />
      )}
      {view === "forgot" && (
        <ForgotPasswordScreen
          onSuccess={() => setView("forgot-success")}
          onBack={() => setView("login")}
        />
      )}
      {view === "forgot-success" && (
        <ForgotPasswordSuccessScreen onBack={() => setView("login")} />
      )}
    </ModalLayout>
  );
}
