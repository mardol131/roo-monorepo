"use client";

import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import { simpleConfirmActionModalEvents } from "@/app/components/ui/molecules/modals/simple-confirm-action-modal";
import { SingleInputModal } from "@/app/components/ui/molecules/modals/single-input-modal";
import { userImagesGalleryModalEvents } from "@/app/components/ui/molecules/modals/user-images-gallery-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import { switchAccountTypeToCompany } from "@/app/functions/api/users";
import { useState } from "react";

type OpenModal = "email" | "password" | null;

export function AccountSettingsSection() {
  const { user, refresh } = useAuth();
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const isCompany = user?.roles.includes("company");

  function closeModal() {
    setOpenModal(null);
  }

  async function onEmailSubmit(_newEmail: string) {
    setEmailSent(true);
  }

  async function onPasswordSubmit(_email: string) {
    setPasswordResetSent(true);
  }

  async function onSwitchToCompanyConfirm() {
    if (!user) return;
    const res = await switchAccountTypeToCompany(user.id);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.errors?.[0]?.message ?? "Změna účtu selhala.");
    }
    await refresh();
  }
  return (
    <>
      <ControlSection
        rows={[
          {
            icon: "Mail",
            iconColor: "text-blue-600",
            iconBgColor: "bg-blue-50",
            title: "E-mailová adresa",
            text: user?.email ?? "",
            button: {
              disabled: emailSent,
              text: "Změnit e-mail",
              version: "outlined",
              size: "sm",
              onClick: () => setOpenModal("email"),
            },
          },
          {
            icon: "KeyRound",
            iconColor: "text-amber-600",
            iconBgColor: "bg-amber-50",
            title: "Heslo",
            text: "Změňte přihlašovací heslo ke svému účtu.",
            button: {
              disabled: passwordResetSent,
              text: "Změnit heslo",
              version: "outlined",
              size: "sm",
              onClick: () => setOpenModal("password"),
            },
          },
          {
            icon: "Building2",
            iconColor: isCompany ? "text-zinc-400" : "text-emerald-600",
            iconBgColor: isCompany ? "bg-zinc-100" : "bg-emerald-50",
            title: "Firemní účet",
            text: isCompany
              ? "Váš účet je již firemní."
              : "Přepnutí na firemní účet je nevratná akce.",
            button: {
              text: isCompany ? "Aktivní" : "Přepnout na firemní",
              version: isCompany ? "outlined" : "successFull",
              size: "sm",
              onClick: () =>
                simpleConfirmActionModalEvents.emit("open", {
                  header: "Potvrzení přepnutí na firemní účet",
                  description:
                    "Tato akce je nevratná. Po přepnutí na firemní účet již nebude možné vrátit se na běžný uživatelský účet. Firemní účet vám umožní spravovat inzeráty a přijímat poptávky.",
                  confirmLabel: "Ano, přepnout",
                  onConfirm: onSwitchToCompanyConfirm,
                }),
            },
            disabled: isCompany,
          },
          {
            icon: "Image",
            iconColor: "text-success",
            iconBgColor: "bg-success-surface",
            title: "Obrázky a videa",
            text: "Spravujte své nahrané obrázky a videa, které používáte ve svých inzerátech.",
            button: {
              text: "Zobrazit",
              version: "outlined",
              size: "sm",
              onClick: () =>
                userImagesGalleryModalEvents.emit("open", {
                  onMediaClick: (media) => {},
                  allowDelete: true,
                  allowCloseOnMediaClick: false,
                }),
            },
          },
        ]}
      />

      <SingleInputModal
        isOpen={openModal === "email"}
        onClose={closeModal}
        onSubmit={onEmailSubmit}
        header="Změna e-mailové adresy"
        description="Zadejte novou e-mailovou adresu. Zašleme vám ověřovací odkaz pro potvrzení změny."
        inputLabel="Nová e-mailová adresa"
        inputType="email"
        placeholder="novy@email.cz"
        submitLabel="Odeslat ověřovací e-mail"
        successHeader="Ověřovací e-mail odeslán"
        successMessage={`Na adresu ${user?.email} jsme odeslali ověřovací odkaz. Kliknutím na odkaz v e-mailu potvrdíte změnu e-mailové adresy.`}
      />

      <SingleInputModal
        isOpen={openModal === "password"}
        onClose={closeModal}
        onSubmit={onPasswordSubmit}
        header="Změna hesla"
        description="Pro změnu hesla zadejte svůj aktuální e-mail. Zašleme vám odkaz pro nastavení nového hesla."
        inputLabel="Váš e-mail"
        inputType="email"
        placeholder={user?.email}
        submitLabel="Odeslat odkaz pro změnu hesla"
        successHeader="Odkaz pro změnu hesla odeslán"
        successMessage="Na vaši e-mailovou adresu jsme odeslali odkaz pro změnu hesla. Kliknutím na odkaz v e-mailu nastavíte nové heslo."
      />
    </>
  );
}
