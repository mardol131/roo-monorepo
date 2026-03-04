import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InquiryHeader from "./components/inquiry-header";
import InquiryTimeline from "./components/inquiry-timeline";
import SupplierCard from "./components/supplier-card";
import OfferCard from "./components/offer-card";
import InquirySettings from "./components/inquiry-settings";
import ChatWindow from "./components/chat-window";
import { getInquiry, getMessages } from "../../../_mock/mock-data";

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
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-8 py-10">
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
          <SupplierCard supplier={inquiry.supplier} />
          <OfferCard offer={inquiry.offer} />
          <ChatWindow
            supplierName={inquiry.supplier.name}
            initialMessages={messages}
          />{" "}
          {inquiry.status === "pending" && <InquirySettings />}
        </div>
      </div>
    </main>
  );
}
