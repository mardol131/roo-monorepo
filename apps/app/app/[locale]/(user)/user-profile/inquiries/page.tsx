import Text from "@/app/components/ui/atoms/text";
import InquirySummary from "./components/inquiry-summary";
import InquiryList from "./components/inquiry-list";
import { getInquiries } from "../_mock/mock-data";
import PageHeading from "../components/page-heading";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  const total = inquiries.length;
  const pending = inquiries.filter((i) => i.status === "pending").length;
  const confirmed = inquiries.filter((i) => i.status === "confirmed").length;

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
