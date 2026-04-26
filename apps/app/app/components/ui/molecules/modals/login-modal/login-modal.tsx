"use client";

import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { createEvents } from "@/app/functions/create-events";
import { useState } from "react";
import ForgotPasswordScreen from "./forgot-password-screen";
import ForgotPasswordSuccessScreen from "./forgot-password-success-screen";
import LoginScreen from "./login-screen";

type View = "login" | "forgot" | "forgot-success";
type LoginModalEvents = { open: undefined };

export const loginModalEvents = createEvents<LoginModalEvents>();

const HEADERS: Record<View, string> = {
  login: "Přihlášení",
  forgot: "Zapomenuté heslo",
  "forgot-success": "Zapomenuté heslo",
};

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("login");

  loginModalEvents.useListener({
    event: "open",
    handler: () => setIsOpen(true),
  });

  function handleClose() {
    setIsOpen(false);
    setView("login");
  }

  return (
    <ModalLayout
      header={HEADERS[view]}
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-md"
    >
      {view === "login" && (
        <LoginScreen
          onSuccess={handleClose}
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
