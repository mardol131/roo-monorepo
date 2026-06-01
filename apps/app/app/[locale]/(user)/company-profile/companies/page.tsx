"use client";

import {
  useCompanies,
  useUpdateCompany,
} from "@/app/react-query/companies/hooks";
import EntityCard from "../../components/entity-card";
import PageHeading from "../../components/page-heading";
import EntityComponentTag from "../../components/tags/entity-component-tag";
import CardContainer from "../../components/card-container";
import { getIdFromRelationshipField } from "@roo/common";
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
  });

  const { mutate: updateCompany } = useUpdateCompany();
  const router = useRouter();

  if (isLoading) return <Loader text="Načítají se firmy..." />;

  const myCompanies = companies?.docs?.filter(
    (company) => getIdFromRelationshipField(company.owner) === auth?.user?.id,
  );

  const memberCompanies = companies?.docs?.filter(
    (company) =>
      getIdFromRelationshipField(company.owner) !== auth?.user?.id &&
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
        heading="Seznam spravovaných firem"
        description="Zde najdete přehled všech firem, které spravujete. Kliknutím na firmu zobrazíte její profil a služby."
        button={{
          text: "Přidat firmu",
          version: "primary",
          size: "sm",
          iconLeft: "Plus",
          link: {
            pathname: "/company-profile/companies/new",
          },
        }}
      />
      <CardContainer
        emptyState={{
          text: "Zatím nemáte žádné firmy",
          subtext:
            "Abyste mohli nabízet služby, musíte nejprve vytvořit firmu, která je nabízí. Začněte kliknutím na tlačítko níže.",
          button: {
            text: "Přidat firmu",
            version: "primary",
            size: "sm",
            iconLeft: "Plus",
            link: {
              pathname: "/company-profile/companies/new",
            },
          },
          icon: "Building2",
        }}
        items={(myCompanies ?? []).map((company) => (
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

      {memberCompanies && memberCompanies && memberCompanies.length > 0 && (
        <div className="mt-6">
          <CardContainer
            title="Firmy, ve kterých působíte jako člen"
            subtitle="Zde najdete přehled všech firem, ke kterým máte přístup jako člen. Kliknutím na firmu zobrazíte její profil a služby."
            items={memberCompanies.map((company) => (
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
                    onConfirmClick: async () =>
                      deleteCompanyHandler(company.id),
                  });
                }}
              />
            ))}
            emptyState={{
              text: "Zatím nemáte žádné firmy",
              subtext:
                "Abyste mohli nabízet služby, musíte nejprve vytvořit firmu, která je nabízí. Začněte kliknutím na tlačítko níže.",
              button: {
                text: "Přidat firmu",
                version: "primary",
                size: "sm",
                iconLeft: "Plus",
                link: {
                  pathname: "/company-profile/companies/new",
                },
              },
              icon: "Building2",
            }}
          />
        </div>
      )}
    </main>
  );
}
