"use client";

import Button from "@/app/components/ui/atoms/button";
import { OAuthButton } from "@/app/components/ui/atoms/oauth-button";
import Text from "@/app/components/ui/atoms/text";
import { loginModalEvents } from "@/app/components/ui/molecules/modals/login-modal/login-modal";
import { oAuthSignIn } from "@/app/functions/auth/o-auth-sign-in";
import { useRouter } from "@/app/i18n/navigation";

export default function OrderStepLogin() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center gap-8 py-4 mt-20">
      <div className="flex flex-col items-center gap-5">
        <Text variant="display-xl" color="textDark" className="font-bold">
          Přihlaste se pro odeslání poptávky
        </Text>
        <Text variant="body-lg" color="secondary" className="max-w-sm">
          Po přihlášení budete moci dokončit poptávku a sledovat ji ve svém
          profilu.
        </Text>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          text="Přihlásit se"
          version="primary"
          onClick={() => loginModalEvents.emit("open", undefined)}
        />
        <Button
          text="Vytvořit účet"
          version="outlined"
          onClick={() => router.push({ pathname: "/register" })}
        />
        <OAuthButton
          size="md"
          onClick={() => oAuthSignIn("google", window.location.href)}
          provider="google"
        />
      </div>
    </div>
  );
}
