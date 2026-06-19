"use client";

import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { simpleConfirmActionModalEvents } from "@/app/components/ui/molecules/modals/simple-confirm-action-modal";
import { SingleInputModal } from "@/app/components/ui/molecules/modals/single-input-modal";
import { userImagesGalleryModalEvents } from "@/app/components/ui/molecules/modals/user-images-gallery-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import {
  switchAccountTypeToCompany,
  updateUserName,
} from "@/app/functions/api/users";
import { useState } from "react";
import { DashboardSection } from "./dashboard-section";

type OpenModal = "email" | "password" | null;

export function AccountSettingsSection() {
  const { user, refresh, requestEmailChange, requestPasswordReset } = useAuth();
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const nameChanged =
    firstName.trim() !== (user?.firstName ?? "") ||
    lastName.trim() !== (user?.lastName ?? "");

  const isCompany = user?.roles.includes("company");

  function closeModal() {
    setOpenModal(null);
  }

  async function onEmailSubmit(newEmail: string) {
    const res = await requestEmailChange(newEmail, window.location.pathname);
  }

  async function onPasswordChangeSubmit() {
    if (!user?.email) return;
    await requestPasswordReset(user?.email, window.location.pathname);
    setPasswordResetSent(true);
  }

  async function onNameSave() {
    if (!user) return;
    setNameSaving(true);
    setNameError(null);
    try {
      const res = await updateUserName(
        user.id,
        firstName.trim(),
        lastName.trim(),
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.errors?.[0]?.message ?? "Uložení jména selhalo.");
      }
      await refresh();
    } catch (e: unknown) {
      setNameError(e instanceof Error ? e.message : "Uložení jména selhalo.");
    } finally {
      setNameSaving(false);
    }
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
      <DashboardSection
        title="Ovládání"
        icon={"Cog"}
        iconBg="bg-zinc-100"
        iconColor="text-zinc-500"
      >
        {" "}
        <ControlSection
          rows={[
            {
              icon: "Mail",
              iconColor: "text-blue-600",
              iconBgColor: "bg-blue-50",
              title: "E-mailová adresa",
              text: user?.email ?? "",
              button: {
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
                onClick: () => {
                  simpleConfirmActionModalEvents.emit("open", {
                    header: "Změna hesla",
                    description:
                      "Odeslat e-mail pro změnu hesla na vaši registrovanou e-mailovou adresu?",
                    confirmLabel: "Odeslat",
                    onConfirm: async () => onPasswordChangeSubmit(),
                  });
                },
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
      </DashboardSection>

      <DashboardSection
        title="Jméno účtu"
        icon={"UserRound"}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Input
              label="Jméno"
              placeholder="Jan"
              inputProps={{
                value: firstName,
                onChange: (e) => setFirstName(e.target.value),
              }}
            />
            <Input
              label="Příjmení"
              placeholder="Novák"
              inputProps={{
                value: lastName,
                onChange: (e) => setLastName(e.target.value),
              }}
            />
          </div>
          {nameError && (
            <Text variant="label-lg" color="danger">
              {nameError}
            </Text>
          )}
          {nameChanged && (
            <div className="flex items-center justify-end gap-3">
              <Button
                size="sm"
                version="successFull"
                onClick={onNameSave}
                disabled={nameSaving}
                text={nameSaving ? "Ukládám…" : "Uložit jméno"}
              />
            </div>
          )}
        </div>
      </DashboardSection>

      <SingleInputModal
        isOpen={openModal === "email"}
        onClose={closeModal}
        onSubmit={onEmailSubmit}
        header="Změna e-mailové adresy"
        description="Zadejte novou e-mailovou adresu."
        inputLabel="Nová e-mailová adresa"
        inputType="email"
        placeholder="novy@email.cz"
        submitLabel="Odeslat ověřovací e-mail"
        successHeader="Na nový e-mail byl odeslán ověřovací odkaz"
        successMessage={
          <Text variant="label-lg">
            Zkontrolujte svůj nový e-mail a klikněte na odkaz pro potvrzení.
            Pokud email nenajdete, zkontrolujte složku spamu. Pokud email stále
            nemůžete najít, kontaktujte nás.{" "}
            <strong>
              Po kliknutí na tlačítko v emailu bude nutné se znovu přihlásit.
            </strong>
          </Text>
        }
      />
    </>
  );
}
