"use client";

import React, { useState } from "react";
import Text from "@/app/components/ui/atoms/text";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { formatInquiryCountLabel, Inquiry, InquiryStatus } from "@roo/common";
import { InquiryRow } from "../../components/inquiry-row";

// ── Config ─────────────────────────────────────────────────────────────────────

const TABS: { label: string; value: InquiryStatus | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Čekající", value: "pending" },
  { label: "Potvrzené", value: "confirmed" },
  { label: "Odmítnuté", value: "declined" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function groupByEvent(
  inquiries: Inquiry[],
): { event: Inquiry["event"]; inquiries: Inquiry[] }[] {
  const map = new Map<
    string,
    { event: Inquiry["event"]; inquiries: Inquiry[] }
  >();
  for (const inquiry of inquiries) {
    const existing = map.get(inquiry.event.id);
    if (existing) {
      existing.inquiries.push(inquiry);
    } else {
      map.set(inquiry.event.id, { event: inquiry.event, inquiries: [inquiry] });
    }
  }
  return Array.from(map.values());
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function InquiryList({ inquiries }: { inquiries: Inquiry[] }) {
  const [activeTab, setActiveTab] = useState<InquiryStatus | "all">("all");

  const filtered =
    activeTab === "all"
      ? inquiries
      : inquiries.filter((i) => i.status === activeTab);

  const grouped = groupByEvent(filtered);

  return (
    <div>
      {/* Tabs */}
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

      {/* Grouped list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col items-center justify-center py-12 px-8 text-center">
          <Text variant="label1" color="secondary" className="mb-1">
            Žádné poptávky
          </Text>
          <Text variant="label4" color="secondary">
            V této kategorii nemáte žádné poptávky.
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(({ event, inquiries: group }) => (
            <EventGroup key={event.id} event={event} inquiries={group} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function EventGroup({
  event,
  inquiries,
}: {
  event: Inquiry["event"];
  inquiries: Inquiry[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      {/* Event header */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex flex-col">
            <Text variant="label1" color="dark" className="font-semibold">
              {event.name}
            </Text>
            <Text variant="label4" color="secondary">
              {formatInquiryCountLabel(inquiries.length)}
            </Text>
          </div>
        </div>
        <Link
          href={`/user-profile/my-events/${event.id}`}
          className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
        >
          Detail události →
        </Link>
      </div>

      {/* Inquiry rows */}
      <div className="divide-y divide-zinc-50">
        {inquiries.map((inquiry) => (
          <InquiryRow key={inquiry.id} inquiry={inquiry} eventId={event.id} />
        ))}
      </div>
    </div>
  );
}
