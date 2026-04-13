import Text from "@/app/components/ui/atoms/text";
import InquirySummary from "./components/inquiry-summary";
import InquiryList from "./components/inquiry-list";
import PageHeading from "../../components/page-heading";
import { aggregateInquiryStatus } from "@roo/common";
import { getInquiries } from "../../../../_mock/mock";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  const total = inquiries.length;
  const pending = inquiries.filter(
    (i) => aggregateInquiryStatus({ ...i }) === "pending",
  ).length;
  const confirmed = inquiries.filter(
    (i) => aggregateInquiryStatus({ ...i }) === "confirmed",
  ).length;

  return (
    <main className="w-full">
      <PageHeading
        heading="Poptávky"
        description="Přehled všech vašich poptávek u dodavatelů."
      />

      <InquirySummary total={total} pending={pending} confirmed={confirmed} />

      <InquiryList inquiries={inquiries} />
    </main>
  );
}
