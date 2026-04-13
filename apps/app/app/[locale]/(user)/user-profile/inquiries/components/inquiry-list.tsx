"use client";

import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import {
  aggregateInquiryStatus,
  formatInquiryCountLabel,
  getIdFromRelationshipField,
  Inquiry,
} from "@roo/common";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import RowContainer from "../../../components/row-container";
import EntityRow from "../../../components/entity-row";

// ── Config ─────────────────────────────────────────────────────────────────────

const TABS: { label: string; value: Inquiry["userStatus"] | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Čekající", value: "pending" },
  { label: "Potvrzené", value: "confirmed" },
  { label: "Odmítnuté", value: "cancelled" },
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
    const existing = map.get(getIdFromRelationshipField(inquiry.event));
    if (existing) {
      existing.inquiries.push(inquiry);
    } else {
      map.set(getIdFromRelationshipField(inquiry.event), {
        event: inquiry.event,
        inquiries: [inquiry],
      });
    }
  }
  return Array.from(map.values());
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function InquiryList({ inquiries }: { inquiries: Inquiry[] }) {
  const [activeTab, setActiveTab] = useState<Inquiry["userStatus"] | "all">(
    "all",
  );

  const filtered =
    activeTab === "all"
      ? inquiries
      : inquiries.filter((i) => aggregateInquiryStatus(i) === activeTab);

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
          {grouped.map(({ event, inquiries: group }) => {
            if (typeof event === "string") return null; // Shouldn't happen

            return (
              <RowContainer
                key={getIdFromRelationshipField(event)}
                icon={
                  <div className="w-8 h-8 rounded-xl bg-inquiry-surface flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-inquiry" />
                  </div>
                }
                label={event.name}
                subLabel={formatInquiryCountLabel(group.length)}
                rowComponents={group
                  .filter(
                    (inquiry) =>
                      typeof inquiry.listing.value !== "string" &&
                      inquiry.listing.value,
                  )
                  .map((inquiry) => (
                    <EntityRow
                      key={inquiry.id}
                      label={
                        typeof inquiry.listing.value !== "string"
                          ? inquiry.listing.value.name
                          : "Poptávka"
                      }
                      icon="MessageSquare"
                      iconBackgroundColor="bg-inquiry-surface"
                      iconColor="text-inquiry"
                      items={[]}
                      link={{
                        pathname:
                          "/user-profile/my-events/[eventId]/[inquiryId]",
                        params: {
                          eventId: getIdFromRelationshipField(inquiry.event),
                          inquiryId: inquiry.id,
                        },
                      }}
                    />
                  ))}
                headerRightComponent={
                  <Link
                    href={{
                      pathname: "/user-profile/my-events/[eventId]",
                      params: { eventId: event.id },
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                  >
                    Detail události →
                  </Link>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
