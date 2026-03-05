import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getInquiry, getMessages } from "../../../_mock/mock-data";
import ChatWindow from "./components/chat-window";
import CompanyCard from "./components/company-card";
import InquiryHeader from "./components/inquiry-header";
import InquirySettings from "./components/inquiry-settings";
import InquiryTimeline from "./components/inquiry-timeline";
import OfferCard from "./components/offer-card";

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string; contractorId: string }>;
}) {
  const { id, contractorId } = await params;
  const [inquiry, messages] = [
    getInquiry(id, contractorId),
    getMessages(contractorId),
  ];

  return (
    <main className="w-full">
      <Link
        href={`/user-profile/my-events/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět na událost
      </Link>

      <div className="flex flex-col gap-5">
        <InquiryHeader eventId={id} inquiry={inquiry} />
        <div className="bg-white rounded-2xl border border-zinc-200 px-8 py-5">
          <InquiryTimeline status={inquiry.status} />
        </div>
        <CompanyCard supplier={inquiry.company} />
        <OfferCard offer={inquiry.offer} />
        <ChatWindow
          supplierName={inquiry.company.name}
          initialMessages={messages}
        />{" "}
        {inquiry.status === "pending" && <InquirySettings />}
      </div>
    </main>
  );
}
