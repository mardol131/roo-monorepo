"use client";

import { useInquiries } from "@/app/react-query/inquiries/hooks";
import { aggregateInquiryStatus } from "@roo/common";
import PageHeading from "../../../components/page-heading";
import InquiryList from "./components/inquiry-list";
import InquirySummary from "./components/inquiry-summary";

export default function page() {
  const { data: inquiries } = useInquiries();

  const total = inquiries?.length;
  const pending = inquiries?.filter(
    (i) => aggregateInquiryStatus(i.status) === "pending",
  ).length;
  const confirmed = inquiries?.filter(
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

      <InquiryList inquiries={inquiries ?? []} />
    </main>
  );
}
