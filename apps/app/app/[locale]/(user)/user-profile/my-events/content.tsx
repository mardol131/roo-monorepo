"use client";

import CardContainer from "@/app/[locale]/(user)/components/card-container";
import { Event } from "@roo/common";
import EntityCard from "../../components/entity-card";

const TABS: { label: string; value: Event["status"] | "all" }[] = [
  { label: "Všechny", value: "all" },
  { label: "Zrušené", value: "deactivated" },
  { label: "Plánované", value: "planning" },
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
          <EntityCard
            key={event.id}
            icon="Calendar"
            label={event.name}
            iconColor="text-rose-500"
            iconBackgroundColor="bg-rose-50"
            items={[
              { icon: "MapPin", content: event.location?.address },
              {
                icon: "Clock",
                content: `Od ${new Date(
                  event.date.start,
                ).toLocaleDateString()} do ${new Date(
                  event.date.end,
                ).toLocaleDateString()}`,
              },
            ]}
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
