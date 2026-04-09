import { ArrowLeft, Package } from "lucide-react";

import Link from "next/link";
import { getInquiry, getMessages } from "../../../_mock/mock-data";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import ChatWindow from "./components/chat-window";
import CompanyCard from "./components/company-card";
import InquirySettings from "./components/inquiry-settings";
import InquiryTimeline from "./components/inquiry-timeline";
import DashboardHeader from "@/app/[locale]/(user)/company-profile/components/dashboard-header";
import EventDashboardVariantSection from "./components/event-dashboard-variant-section";
import { aggregateInquiryStatus } from "@roo/common";

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

  const status = INQUIRY_STATUS[aggregateInquiryStatus(inquiry)];

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
          name={
            typeof inquiry.listing.value === "string"
              ? inquiry.listing.value
              : "Poptávka"
          }
          nameSideComponent={
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
            >
              {status.label}
            </span>
          }
          infoItems={[
            { icon: "Tag", text: inquiry.listingType },
            { icon: "Clock", text: `Odesláno ${inquiry.sentAt}` },
          ]}
          button={{
            version: "outlined",
            text: "Profil dodavatele",
            iconLeft: "ExternalLink",
            size: "sm",
            link: {
              pathname: "/listing/[id]",
              params: {
                id:
                  typeof inquiry.listing.value === "string"
                    ? inquiry.listing.value
                    : inquiry.listing.value.id,
              },
            },
          }}
        />
        <div className="bg-white rounded-2xl border border-zinc-200 px-8 py-5">
          <InquiryTimeline status={aggregateInquiryStatus(inquiry)} />
        </div>
        {typeof inquiry.listing.value !== "string" &&
          typeof inquiry.listing.value.company !== "string" && (
            <CompanyCard company={inquiry.listing.value.company} />
          )}
        {typeof inquiry.variant?.value !== "string" &&
          inquiry.variant?.value && (
            <EventDashboardVariantSection variant={inquiry.variant?.value} />
          )}
        <ChatWindow
          supplierName={
            typeof inquiry.listing.value !== "string"
              ? inquiry.listing.value.name
              : "Chat s dodavatelem"
          }
          initialMessages={messages}
        />
        {aggregateInquiryStatus(inquiry) === "pending" && <InquirySettings />}
      </div>
    </main>
  );
}
