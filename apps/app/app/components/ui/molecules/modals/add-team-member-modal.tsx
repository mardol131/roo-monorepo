"use client";

import Input from "@/app/components/ui/atoms/inputs/input";
import Button from "@/app/components/ui/atoms/button";
import ModalLayout from "../modal-layout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Text from "@/app/components/ui/atoms/text";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { companyMemberInvite } from "@/app/functions/api/companies";
import { invitationKeys } from "@/app/react-query/query-keys";

// ── Types ──────────────────────────────────────────────────────────────────────

export type MemberRole = "editor" | "manager";

type FormData = {
  email: string;
  role: MemberRole;
};

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = yup
  .object({
    email: yup
      .string()
      .email("Zadejte platný e-mail")
      .required("E-mail je povinný"),
    role: yup
      .string()
      .oneOf(["editor", "manager"] as const)
      .required(),
  })
  .required();

// ── Role options ───────────────────────────────────────────────────────────────

const ROLE_OPTIONS: {
  value: MemberRole;
  label: string;
  description: string;
}[] = [
  {
    value: "editor",
    label: "Editor",
    description:
      "Může vytvářet a upravovat inzeráty a poptávky. Nemůže nic mazat ani aktivovat inzeráty v katalogu.",
  },
  {
    value: "manager",
    label: "Správce",
    description:
      "Může vše včetně mazání a aktivace inzerátů v katalogu. Nemůže mazat firmu.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

type Props = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
};

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  companyId,
}: Props) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", role: "editor" },
  });

  const handleClose = () => {
    reset();
    setStatus("idle");
    setErrorMessage(undefined);
    onClose();
  };

  const submit = async (data: FormData) => {
    setStatus("submitting");
    setErrorMessage(undefined);
    const res = await companyMemberInvite(data.email, data.role, companyId);

    if (!res.ok) {
      const result = await res.json();
      setErrorMessage(result.error);
      setStatus("idle");
    } else {
      queryClient.invalidateQueries({ queryKey: invitationKeys.byCompany(companyId) });
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <ModalLayout
        header="Pozvánka odeslána"
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-company-surface">
            <CheckCircle2 className="h-7 w-7 text-company" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Text variant="label-lg" color="textDark" className="font-semibold">
              Pozvánka byla úspěšně odeslána
            </Text>
            <Text variant="body-sm" color="textLight">
              Člen týmu obdrží e-mail s odkazem pro přijetí pozvánky.
            </Text>
          </div>
          <Button
            text="Zavřít"
            version="primary"
            htmlType="button"
            onClick={handleClose}
          />
        </div>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout
      header="Přidat člena týmu"
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-lg"
      disableClose={status === "submitting"}
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
        <Input
          label="E-mail uživatele"
          isRequired
          inputProps={{
            ...register("email"),
            type: "email",
            placeholder: "jan@firma.cz",
          }}
          error={errors.email?.message}
        />

        <div className="flex flex-col gap-3">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            Role
          </Text>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const selected = field.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${selected ? "border-company bg-company-surface" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selected ? "border-company" : "border-zinc-300"}`}
                      >
                        {selected && (
                          <div className="h-2 w-2 rounded-full bg-company" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <Text
                          variant="label-lg"
                          color="textDark"
                          className="font-semibold"
                        >
                          {option.label}
                        </Text>
                        <Text variant="body-sm" color="textDark">
                          {option.description}
                        </Text>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <Text variant="body-sm" color="textDark">
              {errorMessage}
            </Text>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button
            text="Zrušit"
            version="plain"
            htmlType="button"
            onClick={handleClose}
            disabled={status === "submitting"}
          />
          <Button
            text="Přidat člena"
            version="primary"
            htmlType="submit"
            iconLeft="UserPlus"
            loading={status === "submitting"}
          />
        </div>
      </form>
    </ModalLayout>
  );
}
