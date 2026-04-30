"use client";

import { useEvents } from "@/app/react-query/events/hooks";
import { Event, formatEventAddress } from "@roo/common";
import CardContainer from "../../../components/card-container";
import EntityCard from "../../../components/entity-card";
import PageHeading from "../../../components/page-heading";
import EntityComponentTag from "../../../components/tags/entity-component-tag";
import { useTranslations } from "next-intl";
import EventStatusTag from "../../../components/tags/event-status-tag";
import { format } from "date-fns";

const TABS: { label: string; value: Event["status"] | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Zrušené", value: "deactivated" },
  { label: "Plánované", value: "planning" },
  { label: "Dokončené", value: "completed" },
];

export default function page() {
  const { data: events } = useEvents();
  const t = useTranslations("event");

  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Moje události"
        description="Přehled všech vašich událostí a jejich stav."
        button={{
          text: "Vytvořit událost",
          version: "eventFull",
          iconRight: "Plus",
          link: "/user-profile/events/new",
          size: "sm",
        }}
      />

      <CardContainer
        filters={TABS}
        defaultFilter="all"
        items={events ?? []}
        filterFn={(item, filter) => (item as Event).status === filter}
        renderItem={(item) => {
          const event = item as Event;
          return (
            <EntityCard
              key={event.id}
              icon="Calendar"
              label={event.name}
              iconColor="text-event"
              iconBackgroundColor="bg-event-surface"
              items={[
                { icon: "MapPin", content: formatEventAddress(event) },
                {
                  icon: "Clock",
                  content: `Od ${format(
                    new Date(event.date.start),
                    "d. M. yyyy",
                  )} do ${format(new Date(event.date.end), "d. M. yyyy")}`,
                },
              ]}
              link={{
                pathname: "/user-profile/events/[eventId]",
                params: { eventId: event.id },
              }}
              rightComponent={<EventStatusTag eventStatus={event.status} />}
            />
          );
        }}
        emptyState={{
          text: "Zatím žádné události",
          subtext: "Vytvořte první událost a začněte plánovat.",
        }}
      />
    </main>
  );
}
