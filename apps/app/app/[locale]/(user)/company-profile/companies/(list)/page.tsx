import CompanyCard from "../../../components/collection-components/company-card";
import PageHeading from "../../../components/page-heading";
import { COMPANIES } from "../../_mock/mock";

export default function page() {
  return (
    <main className="w-full">
      <PageHeading
        heading="Seznam spravovaných firem"
        description="Zde najdete přehled všech firem, které spravujete. Kliknutím na firmu zobrazíte její profil a služby."
      />
      <div className="flex flex-col gap-3 mt-6">
        {COMPANIES.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </main>
  );
}
