"use client";

import InquiryStatusTag from "@/app/[locale]/(user)/components/tags/inquiry-status-tag";
import Text from "@/app/components/ui/atoms/text";
import { Link } from "@/app/i18n/navigation";
import {
  aggregateInquiryStatus,
  formatInquiryCountLabel,
  getIdFromRelationshipField,
  Inquiry,
} from "@roo/common";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import EntityRow from "../../../../components/entity-row";
import RowContainer from "../../../../components/row-container";
import TabFilter from "../../../../components/tab-filter";
import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";

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
      <TabFilter
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {filtered.length === 0 ? (
        <EmptyState
          text="Žádné poptávky"
          subtext="Zatím jste neposlali žádné poptávky."
        />
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
                      items={[
                        {
                          icon: "Clock",
                          content: format(
                            new Date(inquiry.sentAt),
                            "d. M. yyyy",
                          ),
                        },
                        {
                          icon: "Activity",
                          content: {
                            pending: "Čeká na odpověď",
                            confirmed: "Potvrzeno",
                            cancelled: "Zrušeno",
                          }[inquiry.userStatus],
                        },
                        ...(inquiry.quotedPrice
                          ? [
                              {
                                icon: "Wallet" as const,
                                content: `${inquiry.quotedPrice.toLocaleString("cs-CZ")} Kč`,
                              },
                            ]
                          : []),
                      ]}
                      link={{
                        pathname:
                          "/user-profile/my-events/[eventId]/[inquiryId]",
                        params: {
                          eventId: getIdFromRelationshipField(inquiry.event),
                          inquiryId: inquiry.id,
                        },
                      }}
                      rightComponent={
                        <InquiryStatusTag
                          userStatus={inquiry.userStatus}
                          companyStatus={inquiry.companyStatus}
                        />
                      }
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
