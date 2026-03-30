import { ArrowLeft, Package } from "lucide-react";

import Link from "next/link";
import { getInquiry, getMessages } from "../../../_mock/mock-data";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import ChatWindow from "./components/chat-window";
import CompanyCard from "./components/company-card";
import InquirySettings from "./components/inquiry-settings";
import InquiryTimeline from "./components/inquiry-timeline";
import OfferCard from "./components/offer-card";
import DashboardHeader from "@/app/[locale]/(user)/company-profile/components/dashboard-header";

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

  const status = INQUIRY_STATUS[inquiry.status];

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
        <DashboardHeader
          icon={Package}
          name={inquiry.company.name}
          nameSideComponent={
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
            >
              {status.label}
            </span>
          }
          infoItems={[
            { icon: "Tag", text: inquiry.company.category },
            { icon: "Clock", text: `Odesláno ${inquiry.sentAt}` },
            { icon: "PartyPopper", text: inquiry.event.name },
          ]}
          button={{
            version: "outlined",
            text: "Profil dodavatele",
            iconLeft: "ExternalLink",
            size: "sm",
            link: {
              pathname: "/listing/[id]",
              params: { id: inquiry.company.slug },
            },
          }}
        />

        <div className="bg-white rounded-2xl border border-zinc-200 px-8 py-5">
          <InquiryTimeline status={inquiry.status} />
        </div>
        <CompanyCard supplier={inquiry.company} />
        <OfferCard offer={inquiry.offer} />
        <ChatWindow
          supplierName={inquiry.company.name}
          initialMessages={messages}
        />
        {inquiry.status === "pending" && <InquirySettings />}
      </div>
    </main>
  );
}
