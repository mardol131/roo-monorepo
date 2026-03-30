"use client";

import Text from "@/app/components/ui/atoms/text";
import { EVENT_STATUS } from "@/app/data/event";
import { formatGuestsString, Inquiry } from "@roo/common";
import type { LucideIcon } from "lucide-react";
import * as lucideIcons from "lucide-react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  HelpCircle,
  MapPin,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import RowContainer from "../../../components/row-container";
import { getInquiries, MOCK_EVENT } from "../../_mock/mock-data";
import { InquiryRow } from "../../../components/collection-components/inquiry-row";
import { SummaryCard } from "../../components/summary-card";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import DashboardHeader from "../../../company-profile/components/dashboard-header";

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
    <main className="w-full">
      {/* Back + header */}
      <Link
        href="/user-profile/my-events"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět na události
      </Link>
      <DashboardHeader
        icon={Icon}
        name={event.data.name}
        nameSideComponent={
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${eventStatus.className}`}
          >
            {eventStatus.label}
          </span>
        }
        infoItems={[
          { icon: "MapPin", text: event.data.location.name },
          {
            icon: "Calendar",
            text: `${format(event.data.date.start, "d. M. yyyy", {
              locale: cs,
            })} ${format(event.data.date.start, "HH:mm", {
              locale: cs,
            })} – ${format(event.data.date.end, "HH:mm", { locale: cs })}`,
          },
          {
            icon: "Users",
            text: formatGuestsString({ ...event.data.guests }),
          },
        ]}
      />

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
      <RowContainer
        icon={<MessageSquare className="w-4 h-4 text-rose-500" />}
        label="Poptávky dodavatelů"
        subLabel={`${MOCK_INQUIRIES.length} celkem, ${pending.length} čekají na odpověď`}
        headerRightComponent={
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            {pending.length} čekají na odpověď
          </span>
        }
        rowComponents={MOCK_INQUIRIES.map((inquiry) => (
          <InquiryRow key={inquiry.id} inquiry={inquiry} eventId={event.id} />
        ))}
        emptyHeading="Zatím žádné poptávky"
        emptyText="Přejděte do katalogu a oslovte dodavatele pro svou akci."
      />
    </main>
  );
}
