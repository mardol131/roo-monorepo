"use client";

import Button from "@/app/components/ui/atoms/button";
import ModalLayout from "../modal-layout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Text from "@/app/components/ui/atoms/text";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useUpdateCompany } from "@/app/react-query/companies/hooks";
import { Company, CompanyMemberRoles, getCompanyMemberRole } from "@roo/common";
import { useTranslations } from "next-intl";

// ── Types ──────────────────────────────────────────────────────────────────────

type FormData = {
  role: CompanyMemberRoles;
};

type EditingMember = {
  id: string;
  name: string;
  role: CompanyMemberRoles;
};

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = yup
  .object({
    role: yup
      .string()
      .oneOf(getCompanyMemberRole(["admin", "manager", "editor"]))
      .required(),
  })
  .required();

// ── Component ──────────────────────────────────────────────────────────────────

type Props = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  member: EditingMember | null;
  allMembers: NonNullable<Company["members"]>;
};

export default function EditTeamMemberRoleModal({
  isOpen,
  onClose,
  companyId,
  member,
  allMembers,
}: Props) {
  const t = useTranslations("components.editTeamMemberRoleModal");
  const g = useTranslations("global");

  const { mutate: updateCompany } = useUpdateCompany();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    values: { role: member?.role ?? "editor" },
  });

  const handleClose = () => {
    reset();
    setErrorMessage(undefined);
    onClose();
  };

  const submit = (data: FormData) => {
    if (!member) return;
    setErrorMessage(undefined);

    const updatedMembers = allMembers.map((m) =>
      m.id === member.id ? { ...m, role: data.role } : m,
    );

    updateCompany(
      { id: companyId, data: { members: updatedMembers } },
      {
        onSuccess: handleClose,
        onError: () => setErrorMessage("Nepodařilo se uložit změny."),
      },
    );
  };

  const roleOptions: { value: CompanyMemberRoles; label: string; description: string }[] = [
    {
      value: "admin",
      label: g("companies.members.role.admin"),
      description: t("roles.admin.description"),
    },
    {
      value: "manager",
      label: g("companies.members.role.manager"),
      description: t("roles.manager.description"),
    },
    {
      value: "editor",
      label: g("companies.members.role.editor"),
      description: t("roles.editor.description"),
    },
  ];

  return (
    <ModalLayout
      header={t("header")}
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            {t("roleLabel")}
          </Text>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {roleOptions.map((option) => {
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

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-2">
          <Button
            text={t("cancel")}
            version="plain"
            htmlType="button"
            onClick={handleClose}
          />
          <Button
            text={t("submit")}
            version="primary"
            htmlType="submit"
            iconLeft="Pen"
          />
        </div>
      </form>
    </ModalLayout>
  );
}
