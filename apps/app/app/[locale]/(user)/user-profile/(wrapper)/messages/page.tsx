import Text from "@/app/components/ui/atoms/text";
import { MessageCircle, MessageSquare } from "lucide-react";
import { Link } from "@/app/i18n/navigation";
import {
  formatInquiryCountLabel,
  getIdFromRelationshipField,
  Inquiry,
} from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import PageHeading from "../../../components/page-heading";
import RowContainer from "../../../components/row-container";
import EntityRow from "../../../components/entity-row";
import { EmptyState } from "../../../components/empty-state";
import EntityComponentTag from "../../../components/tags/entity-component-tag";
import { getInquiries } from "../../../../../_mock/mock";

// ── Helpers ────────────────────────────────────────────────────────────────────

function groupByEvent(
  inquiries: Inquiry[],
): { event: Inquiry["event"]; inquiries: Inquiry[] }[] {
  const map = new Map<
    string,
    { event: Inquiry["event"]; inquiries: Inquiry[] }
  >();
  for (const inquiry of inquiries) {
    const eventId = getIdFromRelationshipField(inquiry.event);
    const existing = map.get(eventId);
    if (existing) {
      existing.inquiries.push(inquiry);
    } else {
      map.set(eventId, { event: inquiry.event, inquiries: [inquiry] });
    }
  }
  return Array.from(map.values());
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const allInquiries = getInquiries();

  const unread = allInquiries.filter((inquiry) => {
    if (!inquiry.activity.lastCompanyMessageSentAt) return false;
    if (!inquiry.activity.lastUserSeenAt) return true;
    return (
      new Date(inquiry.activity.lastCompanyMessageSentAt) >
      new Date(inquiry.activity.lastUserSeenAt)
    );
  });
  const grouped = groupByEvent(unread);

  return (
    <main className="w-full">
      <PageHeading
        heading="Zprávy"
        description="Poptávky s nepřečtenými zprávami."
      />

      {grouped.length === 0 ? (
        <EmptyState
          text="Žádné nepřečtené zprávy"
          subtext="Všechny zprávy jsou přečtené."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(({ event, inquiries }) => {
            if (typeof event === "string") return null;

            return (
              <RowContainer
                key={event.id}
                icon="MessageSquare"
                iconBgColor="bg-inquiry-surface"
                iconColor="text-inquiry"
                label={event.name}
                subLabel={formatInquiryCountLabel(inquiries.length)}
                headerRightComponent={
                  <Link
                    href={{
                      pathname: "/user-profile/events/[eventId]",
                      params: { eventId: event.id },
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                  >
                    Detail události →
                  </Link>
                }
                rowComponents={inquiries
                  .filter((i) => typeof i.listing.value !== "string")
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
                          icon: "Banknote",
                          content: `${inquiry.pricing.quotedPrice ? `${inquiry.pricing.quotedPrice} Kč (nabídka)` : inquiry.pricing.agreedPrice ? `${inquiry.pricing.agreedPrice} Kč (dohodnutá cena)` : "Cena neuvedena"}`,
                        },
                        {
                          icon: "Calendar",
                          content: `${inquiry.request ? "Zákaznická poptávka" : "Standardní poptávka"}`,
                        },
                      ]}
                      link={{
                        pathname: "/user-profile/events/[eventId]/[inquiryId]",
                        params: {
                          eventId: getIdFromRelationshipField(inquiry.event),
                          inquiryId: inquiry.id,
                        },
                      }}
                      rightComponent={
                        inquiry.activity.lastCompanyMessageSentAt ? (
                          <EntityComponentTag
                            bgColor="bg-zinc-100"
                            textColor="text-text-light"
                            text={format(
                              new Date(
                                inquiry.activity.lastCompanyMessageSentAt,
                              ),
                              "dd.mm.yyyy",
                              { locale: cs },
                            )}
                          />
                        ) : undefined
                      }
                      labelComponent={
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 self-center" />
                      }
                    />
                  ))}
                emptyState={{
                  text: "Nemáte žádné nepřečtené zprávy",
                  subtext:
                    "Pokud budete mít u některé poptávky nepřečtenou zprávu, zobrazí se vám zde.",
                }}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
