"use client";

import { useCompanies } from "@/app/react-query/companies/hooks";
import EntityCard from "../../../components/entity-card";
import PageHeading from "../../../components/page-heading";
import EntityComponentTag from "../../../components/tags/entity-component-tag";

export default function page() {
  const { data: companies } = useCompanies();
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
      <div className="flex flex-col gap-3 mt-6">
        {companies?.map((company) => (
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
                textColor="text-textDark"
              />
            }
          />
        ))}
      </div>
    </main>
  );
}
