"use client";

import { useEvents } from "@/app/react-query/events/hooks";
import { useInquiries } from "@/app/react-query/inquiries/hooks";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar, MessageCircle, MessageSquare } from "lucide-react";
import EntityRow from "../../components/entity-row";
import PageHeading from "../../components/page-heading";
import RowContainer from "../../components/row-container";
import { SummaryCard } from "../../components/summary-card";
import EventStatusTag from "../../components/tags/event-status-tag";
import InquiryStatusTag from "../../components/tags/inquiry-status-tag";

export default function UserProfilePage() {
  const { data: inquiries } = useInquiries();
  const { data: events } = useEvents();

  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Přehled"
        description="Vítejte zpět! Zde je přehled vašich aktivit."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label="Aktivní události"
          value={events ? events.length.toString() : ""}
          icon={Calendar}
          iconBg={"bg-event-surface"}
          iconColor="text-event"
        />
        <SummaryCard
          label="Aktivní poptávky"
          value={inquiries ? inquiries.length.toString() : ""}
          icon={MessageSquare}
          iconBg={"bg-inquiry-surface"}
          iconColor="text-inquiry"
        />
        <SummaryCard
          label="Nové zprávy"
          value={
            inquiries
              ? inquiries
                  .filter(
                    (inq) =>
                      !!inq.lastCompanyMessageSentAt &&
                      (!inq.lastUserSeenAt ||
                        inq.lastCompanyMessageSentAt > inq.lastUserSeenAt),
                  )
                  .length.toString()
              : ""
          }
          icon={MessageCircle}
          iconBg={"bg-blue-100"}
          iconColor="text-blue-500"
        />
      </div>

      {/* Recent events */}
      <RowContainer
        icon={
          <div className="w-8 h-8 rounded-xl bg-event-surface flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-event" />
          </div>
        }
        label="Nedávné události"
        rowComponents={
          !events
            ? []
            : events.map((event) => (
                <EntityRow
                  icon="Calendar"
                  iconColor="text-event"
                  iconBackgroundColor="bg-event-surface"
                  key={event.id}
                  label={event.name}
                  items={[
                    {
                      icon: "Calendar",
                      content: format(
                        new Date(event.date.start),
                        "d. M. yyyy",
                        { locale: cs },
                      ),
                    },
                    {
                      icon: "Users",
                      content: `${event.guests.adults + event.guests.children} hostů`,
                    },
                    ...(event.budget
                      ? [
                          {
                            icon: "Wallet" as const,
                            content: `${event.budget.toLocaleString("cs-CZ")} Kč`,
                          },
                        ]
                      : []),
                  ]}
                  link={{
                    pathname: "/user-profile/my-events/[eventId]",
                    params: { eventId: event.id },
                  }}
                  rightComponent={<EventStatusTag eventStatus={event.status} />}
                />
              ))
        }
        emptyHeading="Zatím žádné události"
        emptyText="Vytvořte první událost a začněte plánovat svou akci."
        className="mb-10"
      />

      {/* Recent inquiries */}

      <RowContainer
        icon={
          <div className="w-8 h-8 rounded-xl bg-inquiry-surface flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-inquiry" />
          </div>
        }
        label="Nedávné poptávky"
        rowComponents={
          !inquiries
            ? []
            : inquiries.map((inquiry) =>
                typeof inquiry.event !== "string" ? (
                  <EntityRow
                    key={inquiry.id}
                    icon="MessageSquare"
                    iconColor="text-inquiry"
                    iconBackgroundColor="bg-inquiry-surface"
                    label={
                      typeof inquiry.listing.value === "string"
                        ? inquiry.listing.value
                        : "Poptávka"
                    }
                    items={[
                      {
                        icon: "Clock",
                        content: format(
                          new Date(inquiry.sentAt),
                          "d. M. yyyy",
                          { locale: cs },
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
                      pathname: "/user-profile/my-events/[eventId]/[inquiryId]",
                      params: {
                        eventId: inquiry.event.id,
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
                ) : null,
              )
        }
        emptyHeading="Zatím žádné poptávky"
        emptyText="Přejděte do katalogu a oslovte dodavatele pro svou akci."
      />
    </main>
  );
}
