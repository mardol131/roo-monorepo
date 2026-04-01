"use client";

import { InquiryCard } from "@/app/[locale]/(user)/components/collection-components/inquiry-card";
import CardContainer from "@/app/[locale]/(user)/components/card-container";
import { getInquiries } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";
import { Inquiry, InquiryStatus } from "@roo/common";

const TABS: { label: string; value: InquiryStatus | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Čekající", value: "pending" },
  { label: "Potvrzené", value: "confirmed" },
  { label: "Odmítnuté", value: "declined" },
];

type Props = {
  companyId: string;
  listingId: string;
  items: Inquiry[];
};

export default function PageContent({ companyId, listingId, items }: Props) {
  return (
    <CardContainer
      filters={TABS}
      defaultFilter="all"
      items={items ?? []}
      filterFn={(item, filter) => (item as Inquiry).status === filter}
      renderItem={(item) => {
        const inquiry = item as Inquiry;
        return (
          <InquiryCard
            inquiry={inquiry}
            link={{
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
              params: { companyId, listingId, inquiryId: inquiry.id },
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
