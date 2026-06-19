"use client";

import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { createEvents } from "@/app/functions/create-events";
import { useEffect, useState } from "react";
import ForgotPasswordScreen from "./forgot-password-screen";
import LoginScreen from "./login-screen";
import LoginWithEmailScreen from "./login-with-email-screen";
import { useRouter as useNextRouter, useSearchParams } from "next/navigation";
import {
  loginModalSearchParamsGroups,
  loginModalSeachParamsMessages,
} from "./login-modal-params";
import { useLoginModalMessages } from "./use-login-modal-messages";
import SuccessScreen from "./success-screen";

export { loginModalSearchParamsGroups, loginModalSeachParamsMessages };

type View =
  | "login"
  | "login-with-email"
  | "login-with-email-success"
  | "forgot"
  | "forgot-success";
type LoginModalEvents = { open: undefined };

export const loginModalEvents = createEvents<LoginModalEvents>();

const HEADERS: Record<View, string> = {
  login: "Přihlášení",
  "login-with-email": "Přihlášení e-mailem",
  "login-with-email-success": "Přihlášení e-mailem",
  forgot: "Zapomenuté heslo",
  "forgot-success": "Zapomenuté heslo",
};

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("login");
  const params = useSearchParams();
  const router = useNextRouter();
  const modalMessages = useLoginModalMessages();

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

  if (!isOpen) return null;

  return (
    <ModalLayout
      header={HEADERS[view]}
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-md"
      errorMessages={modalMessages
        .filter((m) => m.type === "error")
        .map((m) => m.message)}
      infoMessages={modalMessages
        .filter((m) => m.type === "info")
        .map((m) => m.message)}
      successMessages={modalMessages
        .filter((m) => m.type === "success")
        .map((m) => m.message)}
    >
      {view === "login" && (
        <LoginScreen
          onSuccess={handleSuccess}
          onForgotPassword={() => setView("forgot")}
          onLoginWithEmail={() => setView("login-with-email")}
          onClose={handleClose}
        />
      )}
      {view === "login-with-email" && (
        <LoginWithEmailScreen
          onSuccess={() => setView("login-with-email-success")}
          onBack={() => setView("login")}
        />
      )}
      {view === "login-with-email-success" && (
        <SuccessScreen
          onBack={() => setView("login")}
          title="Přihlášení e-mailem"
          message="Pokud zadaná adresa existuje v systému, přišel vám e-mail s odkazem pro přihlášení."
          buttonText="Zpět na přihlášení"
        />
      )}
      {view === "forgot" && (
        <ForgotPasswordScreen
          onSuccess={() => setView("forgot-success")}
          onBack={() => setView("login")}
        />
      )}
      {view === "forgot-success" && (
        <SuccessScreen
          onBack={() => setView("login")}
          title="Zapomenuté heslo"
          message="Pokud zadaná adresa existuje v systému, přišel vám e-mail s odkazem pro obnovení hesla."
          buttonText="Zpět na přihlášení"
        />
      )}
    </ModalLayout>
  );
}
