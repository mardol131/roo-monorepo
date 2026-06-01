"use client";

import { useEvents } from "@/app/react-query/events/hooks";
import { useInquiries } from "@/app/react-query/inquiries/hooks";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar, MessageCircle, MessageSquare } from "lucide-react";
import EntityRow from "../components/entity-row";
import PageHeading from "../components/page-heading";
import RowContainer from "../components/row-container";
import { SummaryCard } from "../components/summary-card";
import EventStatusTag from "../components/tags/event-status-tag";
import InquiryStatusTag from "../components/tags/inquiry-status-tag";
import { useAuth } from "@/app/context/auth/auth-context";

export default function UserProfilePage() {
  const { user } = useAuth();
  const { data: events, isPending } = useEvents({
    options: {
      query: {
        owner: { equals: user?.id ?? "" },
      },
    },
    enabled: !!user?.id,
  });
  const { data: inquiries } = useInquiries({
    options: {
      query: {
        user: { equals: user?.id },
      },
    },
    enabled: !!user?.id,
  });

  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Přehled"
        description="Vítejte zpět! Zde je přehled vašich aktivit."
      />

      <div className="flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            label="Aktivní události"
            value={events?.docs ? events.docs?.length.toString() : ""}
            icon={Calendar}
            iconBg={"bg-event-surface"}
            iconColor="text-event"
          />
          <SummaryCard
            label="Aktivní poptávky"
            value={inquiries?.docs ? inquiries.docs?.length.toString() : ""}
            icon={MessageSquare}
            iconBg={"bg-inquiry-surface"}
            iconColor="text-inquiry"
          />
          <SummaryCard
            label="Nové zprávy"
            value={
              inquiries?.docs
                ? inquiries.docs
                    .filter(
                      (inq) =>
                        !!inq.activity?.lastCompanyMessageSentAt &&
                        (!inq.activity?.lastUserSeenAt ||
                          inq.activity?.lastCompanyMessageSentAt >
                            inq.activity?.lastUserSeenAt),
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
          icon="Calendar"
          iconColor="text-event"
          iconBgColor="bg-event-surface"
          label="Nedávné události"
          rowComponents={
            !events?.docs
              ? []
              : events.docs.map((event) => (
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
                      pathname: "/user-profile/events/[eventId]",
                      params: { eventId: event.id },
                    }}
                    rightComponent={
                      <EventStatusTag eventStatus={event.status} />
                    }
                  />
                ))
          }
          emptyState={{
            text: "Zatím nemáte naplánované žádné události",
            subtext: "Vytvořte první událost kliknutím na tlačítko níže",
            button: {
              text: "Vytvořit událost",
              version: "eventFull",
              size: "sm",
              link: {
                pathname: "/user-profile/events/new",
              },
            },
          }}
        />

        {/* Recent inquiries */}

        <RowContainer
          icon="MessageSquare"
          iconBgColor="bg-inquiry-surface"
          iconColor="text-inquiry"
          label="Nedávné poptávky"
          rowComponents={
            !inquiries?.docs
              ? []
              : inquiries.docs.map((inquiry) =>
                  typeof inquiry.event !== "string" ? (
                    <EntityRow
                      key={inquiry.id}
                      icon="MessageSquare"
                      iconColor="text-inquiry"
                      iconBackgroundColor="bg-inquiry-surface"
                      label={
                        typeof inquiry.listing !== "string"
                          ? inquiry.listing.name
                          : "Poptávka"
                      }
                      items={[
                        ...(inquiry.activity?.lastCompanyMessageSentAt &&
                        (!inquiry.activity?.lastUserSeenAt ||
                          inquiry.activity.lastCompanyMessageSentAt >
                            inquiry.activity.lastUserSeenAt)
                          ? [
                              {
                                icon: "CircleDot",
                                content: "Nová zpráva od dodavatele",
                              } as const,
                            ]
                          : []),
                        ...(inquiry.pricing.quotedPrice
                          ? [
                              {
                                icon: "Wallet" as const,
                                content: `${inquiry.pricing.quotedPrice.toLocaleString("cs-CZ")} Kč`,
                              },
                            ]
                          : []),
                      ]}
                      link={{
                        pathname:
                          "/user-profile/events/[eventId]/inquiries/[inquiryId]",
                        params: {
                          eventId: inquiry.event.id,
                          inquiryId: inquiry.id,
                        },
                      }}
                      rightComponent={
                        <InquiryStatusTag status={inquiry.status} />
                      }
                    />
                  ) : null,
                )
          }
          emptyState={{
            text: "Zatím žádné poptávky",
            subtext: "Přejděte do katalogu a oslovte dodavatele pro svou akci.",
          }}
        />
      </div>
    </main>
  );
}
