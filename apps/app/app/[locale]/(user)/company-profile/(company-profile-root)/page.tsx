import PageHeading from "../../components/page-heading";
import { Building2, Briefcase, Star, Plus } from "lucide-react";
import { Link } from "@/app/i18n/navigation";
import { COMPANIES, LISTINGS } from "../_mock/mock";
import { SummaryCard } from "../../user-profile/components/summary-card";
import CompanyCard from "../../components/collection-components/company-card";
import RowContainer from "../../components/row-container";
import CompanyRow from "../../components/collection-components/company-row";
import Button from "@/app/components/ui/atoms/button";

export default function CompanyProfileDashboardPage() {
  const totalListings = LISTINGS.length;
  const totalReviews = LISTINGS.reduce(
    (sum, l) => sum + (l.reviewsCount ?? 0),
    0,
  );
  const avgRating =
    LISTINGS.length > 0
      ? (
          LISTINGS.reduce((sum, l) => sum + (l.rating ?? 0), 0) /
          LISTINGS.length
        ).toFixed(1)
      : "–";

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
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
        />
        <SummaryCard
          label="Celkem služeb"
          value={String(totalListings)}
          icon={Briefcase}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
        />
        <SummaryCard
          label="Celkem poptávek"
          value={String(56)}
          icon={Briefcase}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          note={`${30} celkem`}
        />
      </div>

      {/* Companies */}
      <RowContainer
        label="Vaše firmy"
        subLabel="Zde jsou všechny firmy pod vaším účtem"
        icon={
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-rose-500" />
          </div>
        }
        rowComponents={COMPANIES.map((company) => (
          <CompanyRow key={company.id} company={company} />
        ))}
        headerRightComponent={
          <Button
            text="Přidat firmu"
            version="primary"
            size="sm"
            iconLeft="Plus"
            link={{
              pathname: "/company-profile/new-company",
            }}
          />
        }
      />
    </main>
  );
}
