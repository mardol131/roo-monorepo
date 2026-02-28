import Text from "@/app/components/ui/atoms/text";
import {
  ArrowRight,
  Calendar,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { getInquiries, MOCK_EVENTS, STATS } from "./_mock/mock-data";
import { EventRow } from "./components/event-row";
import { InquiryRow } from "./components/inquiry-row";
import { SummaryCard } from "./components/summary-card";

export default function UserProfilePage() {
  const events = MOCK_EVENTS.slice(0, 3);
  const inquiries = getInquiries().slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Text variant="heading4" color="dark" className="font-bold">
          Přehled
        </Text>
        <Text variant="label2" color="secondary" className="mt-1">
          Vítejte zpět! Zde je přehled vaší aktivity.
        </Text>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <SummaryCard
            key={label}
            label={label}
            value={value}
            icon={Icon}
            iconBg={color}
            iconColor=""
          />
        ))}
      </div>

      {/* Recent events */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <Text variant="label1" color="dark" className="font-semibold">
            Nedávné události
          </Text>
          {events.length > 0 && (
            <Link
              href="/user-profile/my-events"
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              Zobrazit vše
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {events.length === 0 ? (
          <EmptyEvents />
        ) : (
          <div className="divide-y divide-zinc-50">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <Text variant="label1" color="dark" className="font-semibold">
            Nedávné poptávky
          </Text>
          {inquiries.length > 0 && (
            <Link
              href="/user-profile/inquiries"
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              Zobrazit vše
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {inquiries.length === 0 ? (
          <EmptyInquiries />
        ) : (
          <div className="divide-y divide-zinc-50">
            {inquiries.map((inquiry) => (
              <InquiryRow
                key={inquiry.id}
                inquiry={inquiry}
                eventId={inquiry.event.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty states ────────────────────────────────────────────────────────────────

function EmptyEvents() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-8 text-center">
      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
        <Calendar className="w-5 h-5 text-rose-400" />
      </div>
      <Text variant="label1" color="dark" className="font-semibold mb-1">
        Zatím žádné události
      </Text>
      <Text variant="label4" color="secondary" className="mb-5 max-w-xs">
        Vytvořte první událost a začněte plánovat svou akci.
      </Text>
      <Link
        href="/user-profile/new-event"
        className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Vytvořit událost
      </Link>
    </div>
  );
}

function EmptyInquiries() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-8 text-center">
      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
        <MessageSquare className="w-5 h-5 text-rose-400" />
      </div>
      <Text variant="label1" color="dark" className="font-semibold mb-1">
        Zatím žádné poptávky
      </Text>
      <Text variant="label4" color="secondary" className="mb-5 max-w-xs">
        Přejděte do katalogu a oslovte dodavatele pro svou akci.
      </Text>
      <Link
        href="/catalog"
        className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors text-sm font-medium"
      >
        <Search className="w-4 h-4" />
        Procházet katalog
      </Link>
    </div>
  );
}
