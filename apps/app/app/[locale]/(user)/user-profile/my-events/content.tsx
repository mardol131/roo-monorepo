"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import { Event, EventStatus } from "@roo/common";
import { EventCard } from "../../components/collection-components/event-card";

const TABS: { label: string; value: EventStatus | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Aktivní", value: "active" },
  { label: "Plánované", value: "planned" },
  { label: "Dokončené", value: "completed" },
];

type Props = {
  items: Event[];
};

export default function PageContent({ items }: Props) {
  return (
    <CardContainer
      filters={TABS}
      defaultFilter="all"
      items={items ?? []}
      filterFn={(item, filter) => (item as Event).status === filter}
      renderItem={(item) => {
        const event = item as Event;
        return (
          <EventCard
            event={event}
            link={{
              pathname: "/user-profile/my-events/[eventId]",
              params: { eventId: event.id },
            }}
          />
        );
      }}
      emptyState={{
        text: "Zatím žádné události",
        subtext: "Vytvořte první událost a začněte plánovat.",
      }}
    />
  );
}
