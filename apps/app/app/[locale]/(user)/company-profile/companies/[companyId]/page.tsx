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
import RowContainer from "../../../components/row-container";
import { SummaryCard } from "../../../user-profile/components/summary-card";
import DashboardHeader from "../../components/dashboard-header";
import EntityRow from "../../../components/entity-row";
import Button from "@/app/components/ui/atoms/button";
import EntityComponentTag from "../../../components/entity-component-tag";
import { getTranslations } from "next-intl/server";
import ListingStatusTag from "../../../components/listing-status-tag";
import Breadcrumbs from "../../../components/breadcrumbs";

export default async function CompanyDashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const t = await getTranslations();

  const { companyId } = await params;
  const company = COMPANIES.find((c) => c.id === companyId) ?? COMPANIES[0];
  const listings = LISTINGS;

  //   const avgRating =
  //     listings.length > 0
  //       ? (
  //           listings.reduce((sum, l) => sum + (l.rating ?? 0), 0) /
  //           listings.length
  //         ).toFixed(1)
  //       : "–";

  //   const totalInquiries = listings.reduce(
  //     (sum, l) => sum + (l.reviewsCount ?? 0),
  //     0,
  //   );

  return (
    <main className="w-full">
      <Breadcrumbs />

      <DashboardHeader
        icon={Building2}
        name={company.name}
        nameSideComponent={
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">
            IČO {company.ico}
          </span>
        }
        infoItems={[
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
        {/* <SummaryCard
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
        /> */}
      </div>

      {/* Listings */}
      <RowContainer
        icon={<Briefcase className="w-4 h-4 text-violet-500" />}
        label="Služby, které firma nabízí"
        headerRightComponent={
          <Button
            text="Přidat službu"
            version="listing"
            size="sm"
            iconLeft="Plus"
            link={{
              pathname:
                "/company-profile/companies/[companyId]/listings/new-listing",
              params: { companyId },
            }}
          />
        }
        rowComponents={listings.map((listing) => (
          <EntityRow
            key={listing.id}
            icon="Briefcase"
            iconColor="text-violet-500"
            iconBackgroundColor="bg-violet-50"
            label={listing.name}
            items={[
              { icon: "MapPin", content: listing.location.address },
              { icon: "Banknote", content: `${listing.price.generalPrice} Kč` },
            ]}
            link={{
              pathname: `/company-profile/companies/[companyId]/listings/[listingId]`,
              params: { companyId, listingId: listing.id },
            }}
            rightComponent={<ListingStatusTag status={listing.status} />}
          />
        ))}
        emptyHeading="Zatím žádné služby"
        emptyText="Přidejte první službu a začněte přijímat poptávky."
      />
    </main>
  );
}
