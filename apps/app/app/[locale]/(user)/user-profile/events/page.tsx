"use client";

import { useEvents } from "@/app/react-query/events/hooks";
import { Event } from "@roo/common";
import CardContainer from "../../components/card-container";
import EntityCard from "../../components/entity-card";
import PageHeading from "../../components/page-heading";
import EntityComponentTag from "../../components/tags/entity-component-tag";
import { useTranslations } from "next-intl";
import EventStatusTag from "../../components/tags/event-status-tag";
import { format } from "date-fns";
import Loader from "../../components/loader";
import { useAuth } from "@/app/context/auth/auth-context";
import TabFilter from "../../components/tab-filter";
import { useState } from "react";

export default function page() {
  const { user } = useAuth();
  const { data: events, isPending } = useEvents({
    options: {
      query: {
        owner: { equals: user?.id ?? "" },
      },
      depth: 4,
    },
    enabled: !!user?.id,
  });
  const t = useTranslations("global.events");
  const [activeFilter, setActiveFilter] = useState<Event["status"] | "all">(
    "all",
  );
  console.log(events);
  if (isPending) return <Loader text="Vaše události se načítají..." />;

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
        filterComponent={
          <TabFilter
            tabs={[
              { label: "Všechny", value: "all" },
              { label: "Zrušené", value: "disabled" },
              { label: "Plánované", value: "active" },
              { label: "Dokončené", value: "completed" },
            ]}
            activeTab={activeFilter}
            onChange={(value) => {
              setActiveFilter(value);
            }}
          />
        }
        items={events?.docs
          ?.filter((event) => {
            if (activeFilter === "all") return true;
            return event.status === activeFilter;
          })
          .map((event) => (
            <EntityCard
              key={event.id}
              icon="Calendar"
              label={event.name}
              iconColor="text-event"
              iconBackgroundColor="bg-event-surface"
              items={[
                {
                  icon: "MapPin",
                  content:
                    typeof event.location.district === "object"
                      ? event.location.district.name
                      : event.location.district,
                },
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
          ))}
        emptyState={{
          text: "Zatím žádné události",
          subtext: "Vytvořte první událost a začněte plánovat.",
        }}
      />
    </main>
  );
}
