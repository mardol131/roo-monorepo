"use client";

import { InquiryCard } from "@/app/[locale]/(user)/components/collection-components/inquiry-card";
import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";
import { getInquiries } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";
import { InquiryStatus } from "@roo/common";
import React, { useState } from "react";

type Props = {
  companyId: string;
  listingId: string;
};

export default function PageContent({ companyId, listingId }: Props) {
  const TABS: { label: string; value: InquiryStatus | "all" }[] = [
    { label: "Všechny", value: "all" },
    { label: "Čekající", value: "pending" },
    { label: "Potvrzené", value: "confirmed" },
    { label: "Odmítnuté", value: "declined" },
  ];

  const inquiries = getInquiries();
  const [activeTab, setActiveTab] = useState<InquiryStatus | "all">("all");

  const filtered =
    activeTab === "all"
      ? inquiries
      : inquiries.filter((i) => i.status === activeTab);
  return (
    <>
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.value
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          text="Zatím žádné poptávky"
          subtext="Poptávky se zobrazí, jakmile zákazníci projeví zájem o vaši službu."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
                params: {
                  companyId,
                  listingId,
                  inquiryId: inquiry.id,
                },
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
