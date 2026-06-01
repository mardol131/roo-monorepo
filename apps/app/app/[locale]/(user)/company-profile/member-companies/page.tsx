"use client";

import {
  useCompanies,
  useUpdateCompany,
} from "@/app/react-query/companies/hooks";
import EntityCard from "../../components/entity-card";
import PageHeading from "../../components/page-heading";
import EntityComponentTag from "../../components/tags/entity-component-tag";
import { EmptyState } from "../../components/empty-state";
import CardContainer from "../../components/card-container";
import { Company, getIdFromRelationshipField } from "@roo/common";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { Trash2 } from "lucide-react";
import { useRouter } from "@/app/i18n/navigation";
import Loader from "../../components/loader";
import { useAuth } from "@/app/context/auth/auth-context";

export default function page() {
  const auth = useAuth();
  const { data: companies, isLoading } = useCompanies({
    options: {
      query: {
        or: [
          { owner: { equals: auth?.user?.id } },
          { "members.user": { equals: auth?.user?.id } },
        ],
      },
    },
    enabled: !!auth?.user?.id,
  });

  const { mutate: updateCompany } = useUpdateCompany();
  const router = useRouter();

  if (isLoading) return <Loader text="Načítají se firmy..." />;

  const memberCompanies = companies?.docs?.filter((company) =>
    company?.members?.some(
      (member) => getIdFromRelationshipField(member.user) === auth?.user?.id,
    ),
  );

  function deleteCompanyHandler(companyId: string) {
    updateCompany(
      { id: companyId, data: { status: "archived" } },
      {
        onSuccess: () => {
          router.push("/company-profile/companies");
        },
      },
    );
  }
  return (
    <main className="w-full">
      <PageHeading
        heading="Firmy, ve kterých jste členem"
        description="Zde najdete přehled všech firem, ve kterých jste členem. Kliknutím na firmu zobrazíte její profil a služby."
      />
      <CardContainer
        emptyState={{
          text: "Zatím nejste členem v žádné cizí firmě",
          subtext:
            "Jakmile vás nějaká firma přidá mezi své členy, přijde Vám do emailu pozvánka. Po přijetí se cizí firmy, ke kterým máte přístup, objeví zde.",
          icon: "Building2",
        }}
        items={memberCompanies?.map((company) => (
          <EntityCard
            key={company.id}
            icon="Building2"
            label={company.name}
            iconColor="text-company"
            iconBackgroundColor="bg-company-surface"
            items={[{ icon: "Mail", content: company.email }]}
            link={{
              pathname: "/company-profile/companies/[companyId]",
              params: { companyId: company.id },
            }}
            rightComponent={
              <EntityComponentTag
                text={`IČO: ${company.ico}`}
                bgColor="bg-zinc-100"
                textColor="text-on-dark"
              />
            }
            deleteEntityHandler={(e) => {
              e.stopPropagation();
              e.preventDefault();
              confirmActionModalEvents.emit("open", {
                title: "Smazat společnost",
                description:
                  "Tato akce je nevratná a trvale odstraní tuto společnost z platformy.",
                Icon: Trash2,
                buttonText: "Smazat společnost",
                buttonVersion: "dangerFull",
                confirmPhrase: company.name,
                whatIsGoingToHappenText:
                  "Opravdu chcete smazat tuto společnost?",
                whatIsGoingToHappenTextColor: "danger",
                whatIsGoingToHappenList: [
                  "Všechny záznamy spojené s touto společností budou nenávratně smazány",
                  "Všechny poptávky budou zrušeny",
                ],
                bgColor: "bg-danger-surface",
                onConfirmClick: async () => deleteCompanyHandler(company.id),
              });
            }}
          />
        ))}
      />
    </main>
  );
}
