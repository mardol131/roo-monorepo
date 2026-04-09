import EntityCard from "../../../components/entity-card";
import EntityComponentTag from "../../../components/entity-component-tag";
import PageHeading from "../../../components/page-heading";
import { COMPANIES } from "../../_mock/mock";

export default function page() {
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
            pathname: "/company-profile/new-company",
          },
        }}
      />
      <div className="flex flex-col gap-3 mt-6">
        {COMPANIES.map((company) => (
          <EntityCard
            key={company.id}
            icon="Building2"
            label={company.name}
            iconColor="text-rose-500"
            iconBackgroundColor="bg-rose-50"
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
