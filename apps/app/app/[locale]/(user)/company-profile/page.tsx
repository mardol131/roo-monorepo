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

export default function page() {
  const { data: listings } = useListings();
  const { data: companies } = useCompanies();

  return (
    <main className="w-full">
      <PageHeading
        heading="Celkový přehled"
        description="Přehled vašich firem, služeb a hodnocení."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Registrované firmy"
          value={String(companies?.docs.length ?? 0)}
          icon={Building2}
          iconBg="bg-company-surface"
          iconColor="text-company"
        />
        <SummaryCard
          label="Celkem služeb"
          value={String(listings?.length ?? 0)}
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
          companies?.docs && companies?.docs.length !== 0
            ? companies.docs.map((company) => (
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
    </main>
  );
}
