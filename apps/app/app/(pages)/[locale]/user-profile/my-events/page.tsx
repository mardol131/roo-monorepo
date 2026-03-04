"use client";

import Text from "@/app/components/ui/atoms/text";
import { EventStatus } from "@roo/common";
import {
  Briefcase,
  Calendar,
  GraduationCap,
  Heart,
  Music,
  PartyPopper,
  Plus,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { MOCK_EVENTS } from "../_mock/mock-data";
import { EventCard } from "../components/event-card";

const TABS: { label: string; value: EventStatus | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Aktivní", value: "active" },
  { label: "Plánované", value: "planned" },
  { label: "Dokončené", value: "completed" },
];

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState<EventStatus | "all">("all");

  const filtered =
    activeTab === "all"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((e) => e.status === activeTab);

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Text variant="heading4" color="dark" className="font-bold">
              Moje události
            </Text>
            <Text variant="label2" color="secondary" className="mt-1">
              Přehled všech vašich událostí a jejich stav.
            </Text>
          </div>
          <Link
            href="/user-profile/new-event"
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors text-sm font-semibold shrink-0"
          >
            <Plus className="w-4 h-4" />
            Nový event
          </Link>
        </div>

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

        {/* Events list */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
        <Calendar className="w-6 h-6 text-rose-400" />
      </div>
      <Text variant="label1" color="dark" className="font-semibold mb-1">
        Zatím žádné události
      </Text>
      <Text variant="label4" color="secondary" className="mb-6 max-w-xs">
        Vytvořte první událost a začněte plánovat.
      </Text>
      <Link
        href="/user-profile/new-event"
        className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors text-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        Vytvořit událost
      </Link>
    </div>
  );
}
