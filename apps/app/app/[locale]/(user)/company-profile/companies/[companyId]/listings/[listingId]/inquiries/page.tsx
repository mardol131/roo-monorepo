"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { Inquiry } from "@roo/common";
import CardContainer from "@/app/[locale]/(user)/components/card-container";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import InquiryStatusTag from "@/app/[locale]/(user)/components/tags/inquiry-status-tag";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useInquiriesByListing } from "@/app/react-query/inquiries/hooks";
import { icons } from "lucide-react";

export default function page() {
  const t = useTranslations();

  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();

  const { data: inquiries } = useInquiriesByListing(listingId);

  return (
    <main className="w-full">
      <PageHeading
        heading="Poptávky"
        description="Zde můžete spravovat poptávky související s vaší službou."
      />

      {/* Tabs */}
      <CardContainer
        filters={[
          { label: t("common.words.all"), value: "all" },
          { label: t("inquiries.status.pending"), value: "pending" },
          { label: t("inquiries.status.confirmed"), value: "confirmed" },
          { label: t("inquiries.status.cancelled"), value: "cancelled" },
        ]}
        defaultFilter="all"
        items={inquiries ?? []}
        filterFn={(item, filter) => (item as Inquiry).status.user === filter}
        renderItem={(item) => {
          const inquiry = item as Inquiry;
          return (
            <EntityCard
              key={inquiry.id}
              label={
                typeof inquiry.listing.value !== "string"
                  ? inquiry.listing.value.name
                  : "Poptávka"
              }
              rightComponent={
                <InquiryStatusTag
                  userStatus={inquiry.status.user}
                  companyStatus={inquiry.status.company}
                />
              }
              icon="MessageSquare"
              iconBackgroundColor="bg-inquiry-surface"
              iconColor="text-inquiry"
              items={[
                ...(inquiry.pricing.agreedPrice
                  ? [
                      {
                        content: `${inquiry.pricing.agreedPrice} Kč`,
                        icon: "Tag",
                      } as const,
                    ]
                  : inquiry.pricing.quotedPrice
                    ? [
                        {
                          content: `${inquiry.pricing.quotedPrice} Kč`,
                          icon: "Tag",
                        } as const,
                      ]
                    : []),
              ]}
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
                params: {
                  companyId,
                  listingId,
                  inquiryId: inquiry.id,
                },
              }}
            />
          );
        }}
        emptyState={{
          text: "Zatím žádné poptávky",
          subtext:
            "Poptávky se zobrazí, jakmile zákazníci projeví zájem o vaši službu.",
        }}
      />
    </main>
  );
}
