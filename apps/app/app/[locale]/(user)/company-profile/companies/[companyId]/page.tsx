"use client";

import Button from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useListingsByCompany } from "@/app/react-query/listings/hooks";
import { Tag, Building2, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "../../../components/breadcrumbs";
import EntityRow from "../../../components/entity-row";
import RowContainer from "../../../components/row-container";
import ListingStatusTag from "../../../components/tags/listing-status-tag";
import { SummaryCard } from "../../../components/summary-card";
import DashboardHeader from "../../../components/dashboard-header";
import InfoSection from "../../../components/info-section";
import { DashboardSection } from "../../../components/dashboard-section";
import { formatCompanyBillingAddress, formatPhoneNumber } from "@roo/common";

export default function page() {
  const { companyId } = useParams<{ companyId: string }>();
  const router = useRouter();

  const { data: company, isLoading } = useCompany(companyId);
  const { data: listings } = useListingsByCompany(companyId);

  useEffect(() => {
    if (!isLoading && !company) {
      router.push("/company-profile/companies");
    }
  }, [isLoading, company, router]);

  if (!company) {
    return null;
  }

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
          ...(company.phone
            ? [
                {
                  icon: "Phone",
                  text: formatPhoneNumber(
                    company.phone.number,
                    company.phone.countryCode,
                  ),
                },
              ]
            : []),
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

      <div className="flex flex-col gap-5">
        {" "}
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            label="Aktivní služby"
            value={String(listings?.length || 0)}
            icon={Tag}
            iconBg="bg-listing-surface"
            iconColor="text-listing"
          />
          <SummaryCard
            label="Nepřečtených zpráv"
            value={"3"} // TODO: get real number of unread messages
            icon={MessageCircle}
            iconBg="bg-inquiry-surface"
            iconColor="text-inquiry"
          />
          {/* 
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
          icon={
            <div className="w-8 h-8 rounded-xl bg-listing-surface flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4 text-listing" />
            </div>
          }
          label="Služby, které firma nabízí"
          headerRightComponent={
            <Button
              text="Přidat službu"
              version="listing"
              size="sm"
              iconLeft="Plus"
              link={{
                pathname: "/company-profile/companies/[companyId]/listings/new",
                params: { companyId },
              }}
            />
          }
          rowComponents={
            !listings?.length
              ? []
              : listings?.map((listing) => (
                  <EntityRow
                    key={listing.id}
                    icon="Tag"
                    iconColor="text-listing"
                    iconBackgroundColor="bg-listing-surface"
                    label={listing.name}
                    items={[
                      {
                        icon: "Banknote",
                        content: `${listing.price.startsAt} Kč`,
                      },
                    ]}
                    link={{
                      pathname: `/company-profile/companies/[companyId]/listings/[listingId]`,
                      params: { companyId, listingId: listing.id },
                    }}
                    rightComponent={
                      <ListingStatusTag status={listing.status} />
                    }
                  />
                ))
          }
          emptyState={{
            text: "Zatím nemáte žádné služby",
            subtext:
              "V tuto chvíli vaše firma neposkytuje žádné služby. Klikněte na tlačítko níže a přidejte svou první službu.",
            button: {
              text: "Přidat službu",
              version: "listingFull",
              size: "sm",
              link: {
                pathname: "/company-profile/companies/[companyId]/listings/new",
                params: { companyId },
              },
            },
            icon: "Tag",
          }}
        />
        <DashboardSection
          title="Informace o firmě"
          icon={Building2}
          iconBg="bg-company-surface"
          iconColor="text-company"
        >
          <InfoSection
            items={[
              {
                type: "text",
                label: "IČO",
                value: company.ico,
              },
              ...(company.vatId
                ? [
                    {
                      type: "text",
                      label: "DIČ",
                      value: company.vatId,
                    } as const,
                  ]
                : []),
              {
                type: "text",
                label: "Datum vytvoření",
                value: company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString()
                  : "Neznámé",
              },
              {
                type: "text",
                label: "Adresa",
                value: formatCompanyBillingAddress(company.billingAddress),
              },
              {
                type: "text",
                label: "Kontaktní email",
                value: company.email,
              },
              {
                type: "text",
                label: "Kontaktní telefon",
                value: formatPhoneNumber(
                  company.phone.number,
                  company.phone.countryCode,
                ),
              },
            ]}
          />
        </DashboardSection>
      </div>
    </main>
  );
}
