"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import EntityRow from "@/app/[locale]/(user)/components/entity-row";
import InquiryStatusTag from "@/app/[locale]/(user)/components/inquiry-status-tag";
import { getIdFromRelationshipField, Inquiry } from "@roo/common";
import { icons } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  companyId: string;
  listingId: string;
  items: Inquiry[];
};

export default function PageContent({ companyId, listingId, items }: Props) {
  const t = useTranslations();
  return (
    <CardContainer
      filters={[
        { label: t("common.words.all"), value: "all" },
        { label: t("inquiries.status.pending"), value: "pending" },
        { label: t("inquiries.status.confirmed"), value: "confirmed" },
        { label: t("inquiries.status.cancelled"), value: "cancelled" },
      ]}
      defaultFilter="all"
      items={items ?? []}
      filterFn={(item, filter) => (item as Inquiry).userStatus === filter}
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
                userStatus={inquiry.userStatus}
                companyStatus={inquiry.companyStatus}
              />
            }
            icon="MessageSquare"
            iconBackgroundColor="bg-inquiry-surface"
            iconColor="text-inquiry"
            items={[
              ...(inquiry.agreedPrice
                ? [
                    {
                      content: `${inquiry.agreedPrice} Kč`,
                      icon: "Tag" as keyof typeof icons,
                    },
                  ]
                : inquiry.quotedPrice
                  ? [
                      {
                        content: `${inquiry.quotedPrice} Kč`,
                        icon: "Tag" as keyof typeof icons,
                      },
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
  );
}
