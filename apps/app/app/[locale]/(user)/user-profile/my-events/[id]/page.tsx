"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  PartyPopper,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { formatGuestsString, Inquiry } from "@roo/common";
import type { LucideIcon } from "lucide-react";
import { SummaryCard } from "../../components/summary-card";
import { InquiryRow } from "../../components/inquiry-row";
import { getInquiries, MOCK_EVENT } from "../../_mock/mock-data";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import { EVENT_STATUS } from "@/app/data/event";
import * as lucideIcons from "lucide-react";

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  const event = MOCK_EVENT;
  const eventStatus = EVENT_STATUS[event.status];
  const Icon =
    (lucideIcons[event.data.icon as keyof typeof lucideIcons] as LucideIcon) ??
    Calendar;

  const MOCK_INQUIRIES = getInquiries() as Inquiry[];

  const confirmed = MOCK_INQUIRIES.filter((i) => i.status === "confirmed");
  const pending = MOCK_INQUIRIES.filter((i) => i.status === "pending");
  const totalCost = confirmed
    .reduce((sum, i) => sum + i.offer.price, 0)
    .toLocaleString("cs-CZ");

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Back + header */}
        <Link
          href="/user-profile/my-events"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na události
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Text variant="heading4" color="dark" className="font-bold">
                  {event.data.name}
                </Text>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${eventStatus.className}`}
                >
                  {eventStatus.label}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.data.date.start.toLocaleDateString("cs-CZ")}{" "}
                  {event.data.date.start.toLocaleTimeString("cs-CZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  –{" "}
                  {event.data.date.end.toLocaleTimeString("cs-CZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.data.location.name}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Users className="w-3.5 h-3.5" />
                  {formatGuestsString({ ...event.data.guests })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <SummaryCard
            label="Celkem poptávek"
            value={String(MOCK_INQUIRIES.length)}
            icon={MessageSquare}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <SummaryCard
            label="Potvrzeno"
            value={String(confirmed.length)}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
          />
          <SummaryCard
            label="Odhadované náklady"
            value={`${totalCost} Kč`}
            icon={HelpCircle}
            iconBg="bg-rose-50"
            iconColor="text-rose-500"
            note="pouze potvrzené"
          />
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-rose-500" />
              </div>
              <Text variant="label1" color="dark" className="font-semibold">
                Poptávky dodavatelů
              </Text>
            </div>
            {pending.length > 0 && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                {pending.length} čekají na odpověď
              </span>
            )}
          </div>

          {MOCK_INQUIRIES.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
              <Text variant="label1" color="secondary" className="mb-1">
                Zatím žádné poptávky
              </Text>
              <Text variant="label4" color="secondary">
                Přejděte do katalogu a oslovte dodavatele.
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {MOCK_INQUIRIES.map((inquiry) => {
                return (
                  <InquiryRow
                    key={inquiry.id}
                    inquiry={inquiry}
                    eventId={event.id}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
