"use client";

import Button from "@/app/components/ui/atoms/button";
import { loginModalEvents } from "@/app/components/ui/molecules/modals/login-modal/login-modal";

type Props = {
  redirectTo?: string;
};

export default function LoginButton({ redirectTo }: Props) {
  return (
    <Button
      version="primary"
      text="Přihlásit se"
      onClick={() => loginModalEvents.emit("open", undefined)}
    />
  );
}
