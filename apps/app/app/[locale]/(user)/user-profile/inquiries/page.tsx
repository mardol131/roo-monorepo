"use client";

import { useInquiries } from "@/app/react-query/inquiries/hooks";
import { aggregateInquiryStatus } from "@roo/common";
import PageHeading from "../../components/page-heading";
import InquiryList from "./components/inquiry-list";
import InquirySummary from "./components/inquiry-summary";
import { useAuth } from "@/app/context/auth/auth-context";

export default function page() {
  const { user } = useAuth();
  const { data: inquiries } = useInquiries({
    options: {
      query: {
        user: { equals: user?.id },
      },
    },
    enabled: !!user?.id,
    refetchInterval: 60_000,
  });

  const total = inquiries?.docs?.length;
  const pending = inquiries?.docs?.filter(
    (i) => aggregateInquiryStatus(i.status) === "pending",
  ).length;
  const confirmed = inquiries?.docs?.filter(
    (i) => aggregateInquiryStatus(i.status) === "confirmed",
  ).length;

  return (
    <main className="w-full">
      <PageHeading
        heading="Poptávky"
        description="Přehled všech vašich poptávek u dodavatelů."
      />

      <InquirySummary
        total={total ?? 0}
        pending={pending ?? 0}
        confirmed={confirmed ?? 0}
      />

      <InquiryList inquiries={inquiries?.docs ?? []} />
    </main>
  );
}
