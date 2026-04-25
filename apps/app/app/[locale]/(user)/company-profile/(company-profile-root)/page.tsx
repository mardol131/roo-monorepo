import Button from "@/app/components/ui/atoms/button";
import { Tag, Building2 } from "lucide-react";
import PageHeading from "../../components/page-heading";
import RowContainer from "../../components/row-container";
import { SummaryCard } from "../../components/summary-card";
import { COMPANIES, LISTINGS } from "../../../../_mock/mock";
import EntityRow from "../../components/entity-row";
import EntityComponentTag from "../../components/tags/entity-component-tag";

export default function CompanyProfileDashboardPage() {
  const totalListings = LISTINGS.length;

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
          value={String(COMPANIES.length)}
          icon={Building2}
          iconBg="bg-company-surface"
          iconColor="text-company"
        />
        <SummaryCard
          label="Celkem služeb"
          value={String(totalListings)}
          icon={Tag}
          iconBg="bg-listing-surface"
          iconColor="text-listing"
        />
        <SummaryCard
          label="Celkem poptávek"
          value={String(56)}
          icon={Tag}
          iconBg="bg-inquiry-surface"
          iconColor="text-inquiry"
          note={`${30} celkem`}
        />
      </div>

      {/* Companies */}
      <RowContainer
        label="Vaše firmy"
        subLabel="Zde jsou všechny firmy pod vaším účtem"
        icon={
          <div className="w-8 h-8 rounded-xl bg-company-surface flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-company" />
          </div>
        }
        rowComponents={COMPANIES.map((company) => (
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
        ))}
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
