"use client";

import Button from "@/app/components/ui/atoms/button";
import { Tag, Building2 } from "lucide-react";
import PageHeading from "../components/page-heading";
import RowContainer from "../components/row-container";
import { SummaryCard } from "../components/summary-card";
import EntityRow from "../components/entity-row";
import EntityComponentTag from "../components/tags/entity-component-tag";
import { useListings } from "@/app/react-query/listings/hooks";
import { useCompanies } from "@/app/react-query/companies/hooks";
import { useAuth } from "@/app/context/auth/auth-context";
import { getIdFromRelationshipField } from "@roo/common";

export default function page() {
  const { data: listings } = useListings();
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

  return (
    <main className="w-full">
      <PageHeading
        heading="Celkový přehled"
        description="Přehled vašich firem, služeb a hodnocení."
      />

      <div className="flex flex-col w-full gap-4">
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            label="Registrované firmy"
            value={String(companies?.docs?.length ?? 0)}
            icon={Building2}
            iconBg="bg-company-surface"
            iconColor="text-company"
          />
          <SummaryCard
            label="Celkem služeb"
            value={String(listings?.docs?.length ?? 0)}
            icon={Tag}
            iconBg="bg-listing-surface"
            iconColor="text-listing"
          />
        </div>
        {/* Companies */}
        <RowContainer
          label="Vaše firmy"
          subLabel="Zde jsou všechny firmy pod vaším účtem"
          icon="Building2"
          iconColor="text-company"
          iconBgColor="bg-company-surface"
          rowComponents={
            myCompanies && myCompanies.length !== 0
              ? myCompanies.map((company) => (
                  <EntityRow
                    key={company.id}
                    icon="Building2"
                    iconColor="text-company"
                    iconBackgroundColor="bg-company-surface"
                    label={company.name}
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
                  />
                ))
              : []
          }
          emptyState={{
            button: {
              text: "Přidat firmu",
              version: "primary",
              size: "sm",
              iconLeft: "Plus",
              link: {
                pathname: "/company-profile/companies/new",
              },
            },

            text: "Zatím nemáte žádné firmy",
            subtext:
              "Abyste mohli začít nabízet služby, musíte nejprve vytvořit firmu, která je bude nabízet. Klikněte na tlačítko níže.",
          }}
          headerRightComponent={
            <Button
              text="Přidat firmu"
              version="primary"
              size="sm"
              iconLeft="Plus"
              link={{
                pathname: "/company-profile/companies/new",
              }}
            />
          }
        />
        {memberCompanies && memberCompanies.length > 0 && (
          <RowContainer
            label="Firmy, kde jste členem"
            subLabel="Zde jsou všechny firmy, kde jste členem"
            icon="Building2"
            iconColor="text-company"
            iconBgColor="bg-company-surface"
            rowComponents={
              memberCompanies && memberCompanies.length !== 0
                ? memberCompanies.map((company) => (
                    <EntityRow
                      key={company.id}
                      icon="Building2"
                      iconColor="text-company"
                      iconBackgroundColor="bg-company-surface"
                      label={company.name}
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
                    />
                  ))
                : []
            }
            emptyState={{
              text: "Zatím nemáte žádné firmy",
              subtext:
                "Abyste mohli začít nabízet služby, musíte nejprve vytvořit firmu, která je bude nabízet. Klikněte na tlačítko níže.",
            }}
            headerRightComponent={
              <Button
                text="Přidat firmu"
                version="primary"
                size="sm"
                iconLeft="Plus"
                link={{
                  pathname: "/company-profile/companies/new",
                }}
              />
            }
          />
        )}
      </div>
    </main>
  );
}
