import Link from "next/link";
import {
  Building2,
  MessageSquare,
  Briefcase,
  Star,
  ArrowLeft,
  PenLine,
  Plus,
} from "lucide-react";
import { COMPANIES, LISTINGS } from "../../_mock/mock";
import ListingRow from "../../../components/collection-components/listing-row";
import RowContainer from "../../../components/row-container";
import { SummaryCard } from "../../../user-profile/components/summary-card";
import DashboardHeader from "../../components/dashboard-header";

export default async function CompanyDashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = COMPANIES.find((c) => c.id === companyId) ?? COMPANIES[0];
  const listings = LISTINGS;

  const avgRating =
    listings.length > 0
      ? (
          listings.reduce((sum, l) => sum + (l.rating ?? 0), 0) /
          listings.length
        ).toFixed(1)
      : "–";

  const totalInquiries = listings.reduce(
    (sum, l) => sum + (l.reviewsCount ?? 0),
    0,
  );

  return (
    <main className="w-full">
      <Link
        href="/company-profile/companies"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět na firmy
      </Link>

      <DashboardHeader
        icon={Building2}
        name={company.name}
        nameSideComponent={
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">
            IČO {company.ico}
          </span>
        }
        infoItems={[
          { icon: "MapPin", text: company.city.label },
          { icon: "Mail", text: company.email },
          ...(company.phone ? [{ icon: "Phone", text: company.phone }] : []),
          ...(company.website
            ? [{ icon: "Globe", text: company.website.replace("https://", "") }]
            : []),
        ]}
        button={{
          link: {
            pathname: `/company-profile/companies/[companyId]/edit`,
            params: { companyId },
          },
          iconLeft: "Plus",
          text: "Upravit firmu",
          size: "sm",
        }}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Aktivní služby"
          value={String(listings.length)}
          icon={Briefcase}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
        />
        <SummaryCard
          label="Celkem poptávek"
          value={String(totalInquiries)}
          icon={MessageSquare}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <SummaryCard
          label="Průměrné hodnocení"
          value={avgRating}
          icon={Star}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          note="ze všech služeb"
        />
      </div>

      {/* Listings */}
      <RowContainer
        icon={<Briefcase className="w-4 h-4 text-violet-500" />}
        label="Služby firmy"
        headerRightComponent={
          <Link
            href={`/company-profile/companies/${companyId}/listings/new-listing`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors px-3 py-1.5 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" />
            Přidat službu
          </Link>
        }
        rowComponents={listings.map((listing) => (
          <ListingRow
            key={listing.id}
            listing={listing}
            companyId={companyId}
          />
        ))}
        emptyHeading="Zatím žádné služby"
        emptyText="Přidejte první službu a začněte přijímat poptávky."
      />
    </main>
  );
}
