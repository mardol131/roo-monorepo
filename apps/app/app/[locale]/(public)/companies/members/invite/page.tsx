"use client";

import Button from "@/app/components/ui/atoms/button";
import { useAuth } from "@/app/context/auth/auth-context";
import { useSearchParams } from "next/navigation";
import LoginButton from "../../../login-required/components/login-button";
import AcceptInviteButton from "./components/accept-invite-button";
import { usePathname } from "@/app/i18n/navigation";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const companyMemberInviteToken = searchParams.get("companyMemberInviteToken");
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (!companyMemberInviteToken) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Neplatná pozvánka</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            Odkaz, který jste použili, je neplatný nebo vypršel.
          </p>
        </div>
        <Button
          version="companyFull"
          text="Přejít na hlavní stránku"
          link={{ pathname: "/homepage" }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">Načítání...</p>
      </div>
    );
  }
  companyMemberInviteToken;
  if (!user) {
    const returnUrl = new URL(pathname, process.env.NEXT_PUBLIC_WEBSITE_URL);
    returnUrl.searchParams.set(
      "companyMemberInviteToken",
      companyMemberInviteToken,
    );

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            Přihlaste se pro přijetí pozvánky
          </h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            Pozvánku můžete přijmout až po přihlášení ke svému účtu. Pokud účet
            nemáte, zaregistrujte se a pokračujte dle instrukcí.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            version="plain"
            text="Zaregistrovat se"
            link={{
              pathname: "/register",
              query: {
                redirectTo: returnUrl.href,
                accountType: "company",
                email: searchParams.get("email") ?? undefined,
              },
            }}
          />
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Byli jste pozváni do týmu</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          Kliknutím níže potvrdíte přijetí pozvánky a získáte přístup k firmě.
        </p>
      </div>
      <AcceptInviteButton companyMemberInviteToken={companyMemberInviteToken} />
    </div>
  );
}
