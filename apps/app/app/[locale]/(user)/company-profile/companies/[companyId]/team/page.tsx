"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { canEditCompany } from "@/app/functions/utils/companies";
import AddTeamMemberModal from "@/app/components/ui/molecules/modals/add-team-member-modal";
import EditTeamMemberRoleModal from "@/app/components/ui/molecules/modals/edit-team-member-role-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import { useRouter } from "@/app/i18n/navigation";
import {
  useCompany,
  useUpdateCompany,
} from "@/app/react-query/companies/hooks";
import {
  usePendingInvitationsByCompany,
  useUpdateInvitation,
} from "@/app/react-query/invitations/hooks";
import { Company, CompanyMemberRoles, Invitation, User } from "@roo/common";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

type TeamMember = NonNullable<Company["members"]>[number];

type EditingMember = {
  id: string;
  name: string;
  role: CompanyMemberRoles;
};

export default function page() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: company, isLoading } = useCompany(companyId);
  console.log("Company data:", company);
  const { mutate: updateCompany } = useUpdateCompany();
  const { data: invitations } = usePendingInvitationsByCompany(companyId);
  const { mutate: updateInvitation } = useUpdateInvitation();
  const g = useTranslations("global");
  const { user } = useAuth();
  const router = useRouter();
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EditingMember | null>(
    null,
  );

  if (isLoading) return <Loader text="Načítají se členové týmu..." />;
  if (!company) return router.back();

  function updateInvitationStatus(id: string, status: Invitation["status"]) {
    updateInvitation({ id, data: { status } });
  }

  function handleDeleteMember(memberId: string) {
    if (!company) return;
    const updatedMembers = company.members?.filter(
      (member) => member.id !== memberId,
    );
    updateCompany({ id: companyId, data: { members: updatedMembers } });
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Firemní tým"
        description="Přehled všech členů, kteří mají přístup k této firmě."
        button={
          canEditCompany(company, user?.id)
            ? {
                text: "Přidat člena",
                version: "companyFull",
                size: "sm",
                iconLeft: "Plus",
                onClick: () => setAddUserModalOpen(true),
              }
            : undefined
        }
      />
      <CardContainer
        emptyState={{
          text: "Zatím žádní členové",
          subtext: "Pozvěte kolegy, aby mohli spravovat firmu společně s vámi.",
          button: canEditCompany(company, user?.id)
            ? {
                text: "Přidat člena",
                version: "companyFull",
                size: "sm",
                iconLeft: "Plus",
                onClick: () => setAddUserModalOpen(true),
              }
            : undefined,
          icon: "Users",
        }}
        items={company?.members?.map((member) => (
          <EntityCard
            key={member.id}
            icon="UserRound"
            label={member.invitationEmail}
            iconColor="text-company"
            rightIcon="Pen"
            hideRightIcon={!canEditCompany(company, user?.id)}
            iconBackgroundColor="bg-company-surface"
            items={[
              {
                icon: "Shield",
                content: g(`companies.members.role.${member.role}`),
              },
            ]}
            onClick={
              canEditCompany(company, user?.id)
                ? () => {
                    setEditingMember({
                      id: member.id ?? "",
                      name: member.invitationEmail,
                      role: member.role,
                    });
                  }
                : undefined
            }
            deleteEntityHandler={
              canEditCompany(company, user?.id)
                ? () => handleDeleteMember(member.id ?? "")
                : undefined
            }
          />
        ))}
      />
      {invitations && invitations.docs && invitations?.docs?.length > 0 && (
        <div className="mt-6">
          <CardContainer
            title="Čekající pozvánky"
            subtitle="Seznam pozvánek, které jste odeslali, ale ještě nebyly přijaty."
            emptyState={{
              text: "Zatím žádní členové",
              subtext:
                "Pozvěte kolegy, aby mohli spravovat firmu společně s vámi.",
              icon: "Users",
            }}
            items={invitations.docs?.map((invitation) => (
              <EntityCard
                key={invitation.id}
                icon="UserRound"
                label={invitation.email}
                iconColor="text-company"
                iconBackgroundColor="bg-company-surface"
                deleteEntityHandler={() =>
                  updateInvitationStatus(invitation.id, "cancelled")
                }
                items={[
                  ...(invitation.email
                    ? [{ icon: "Mail" as const, content: invitation.email }]
                    : []),
                  {
                    icon: "Shield" as const,
                    content: g(`companies.members.role.${invitation.role}`),
                  },
                ]}
              />
            ))}
          />
        </div>
      )}
      <AddTeamMemberModal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        companyId={companyId}
      />
      <EditTeamMemberRoleModal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        companyId={companyId}
        member={editingMember}
        allMembers={company.members ?? []}
      />
    </main>
  );
}
