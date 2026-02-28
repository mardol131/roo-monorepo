import Text from "@/app/components/ui/atoms/text";
import InquirySummary from "./components/inquiry-summary";
import InquiryList from "./components/inquiry-list";
import { getInquiries } from "../_mock/mock-data";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  const total = inquiries.length;
  const pending = inquiries.filter((i) => i.status === "pending").length;
  const confirmed = inquiries.filter((i) => i.status === "confirmed").length;

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <Text variant="heading4" color="dark" className="font-bold">
            Poptávky
          </Text>
          <Text variant="label2" color="secondary" className="mt-1">
            Přehled všech vašich poptávek u dodavatelů.
          </Text>
        </div>

        <InquirySummary total={total} pending={pending} confirmed={confirmed} />

        <InquiryList inquiries={inquiries} />
      </div>
    </main>
  );
}
