"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Text from "@/app/components/ui/atoms/text";
import AddTeamMemberModal, {
  MemberRole,
} from "@/app/components/ui/molecules/modals/add-team-member-modal";
import { companyMemberInvite } from "@/app/functions/api/companies";
import { useRouter } from "@/app/i18n/navigation";
import {
  useCompany,
  useUpdateCompany,
} from "@/app/react-query/companies/hooks";
import {
  usePendingInvitationsByCompany,
  useUpdateInvitation,
} from "@/app/react-query/invitations/hooks";
import { Company, Invitation, User } from "@roo/common";
import { useParams } from "next/navigation";
import { useState } from "react";

type TeamMember = NonNullable<Company["members"]>[number];

export default function page() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: company, isLoading } = useCompany(companyId);
  const { mutate: updateCompany } = useUpdateCompany();
  const { data: invitations } = usePendingInvitationsByCompany(companyId);
  const { mutate: updateInvitation } = useUpdateInvitation();

  const router = useRouter();
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

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
        heading="Váš tým"
        description="Přehled všech členů, kteří mají přístup k této firmě."
        button={{
          text: "Přidat člena",
          version: "companyFull",
          size: "sm",
          iconLeft: "Plus",
          onClick: () => setAddUserModalOpen(true),
        }}
      />
      <CardContainer
        items={company.members ?? []}
        emptyState={{
          text: "Zatím žádní členové",
          subtext: "Pozvěte kolegy, aby mohli spravovat firmu společně s vámi.",
          button: {
            text: "Přidat člena",
            version: "companyFull",
            size: "sm",
            iconLeft: "Plus",
            onClick: () => setAddUserModalOpen(true),
          },
          icon: "Users",
        }}
        renderItem={(item) => {
          const member = item as TeamMember;
          const user = member.user as User;
          const name =
            typeof member.user === "string"
              ? member.user
              : `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                user.email;
          const email =
            typeof member.user === "string" ? undefined : user.email;

          const roleLabel = member.role === "manager" ? "Správce" : "Editor";

          return (
            <EntityCard
              key={member.id}
              icon="UserRound"
              label={name}
              iconColor="text-company"
              iconBackgroundColor="bg-company-surface"
              items={[
                ...(email ? [{ icon: "Mail" as const, content: email }] : []),
                { icon: "Shield" as const, content: roleLabel },
              ]}
              deleteEntityHandler={() => handleDeleteMember(member.id ?? "")}
            />
          );
        }}
      />
      {invitations && invitations.docs && invitations?.docs?.length > 0 && (
        <div className="mt-6">
          <CardContainer
            title="Čekající pozvánky"
            subtitle="Seznam pozvánek, které jste odeslali, ale ještě nebyly přijaty."
            items={invitations.docs ?? []}
            emptyState={{
              text: "Zatím žádní členové",
              subtext:
                "Pozvěte kolegy, aby mohli spravovat firmu společně s vámi.",
              icon: "Users",
            }}
            renderItem={(item) => {
              const invitation = item as Invitation;

              const roleLabel =
                invitation.role === "manager" ? "Správce" : "Editor";

              return (
                <EntityCard
                  key={invitation.id}
                  icon="UserRound"
                  label={invitation.email}
                  iconColor="text-company"
                  iconBackgroundColor="bg-company-surface"
                  hideLinkIcon
                  deleteEntityHandler={() =>
                    updateInvitationStatus(invitation.id, "cancelled")
                  }
                  items={[
                    ...(invitation.email
                      ? [{ icon: "Mail" as const, content: invitation.email }]
                      : []),
                    { icon: "Shield" as const, content: roleLabel },
                  ]}
                />
              );
            }}
          />
        </div>
      )}
      <AddTeamMemberModal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        companyId={companyId}
      />
    </main>
  );
}
