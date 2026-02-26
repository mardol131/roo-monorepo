"use client";

import React from "react";
import { Plus, CheckSquare2, Calendar } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";
import EventSelectionButton from "./event-selection-button";
import NewEventForm from "./new-event-form";
import { EventData } from "@roo/types";

// Mock data - TODO: Nahradit skutečnými event daty z databáze
const mockEventsWithIds: Array<EventData & { id: string }> = [
  {
    id: "1",
    name: "Svatba Petra a Marie",
    date: {
      start: new Date("2026-06-15"),
      end: new Date("2026-06-15"),
    },
    location: {
      id: "prague-1",
      name: "Praha",
    },
  },
  {
    id: "2",
    name: "Firemní ples",
    date: {
      start: new Date("2026-03-20"),
      end: new Date("2026-03-20"),
    },
    location: {
      id: "ostrava-1",
      name: "Ostrava",
    },
  },
  {
    id: "3",
    name: "Narozeninová oslava",
    date: {
      start: new Date("2026-04-10"),
      end: new Date("2026-04-10"),
    },
    location: {
      id: "brno-1",
      name: "Brno",
    },
  },
  {
    id: "4",
    name: "Korporátní akce",
    date: {
      start: new Date("2026-05-05"),
      end: new Date("2026-05-05"),
    },
    location: {
      id: "prague-2",
      name: "Praha",
    },
  },
  {
    id: "5",
    name: "Vejška",
    date: {
      start: new Date("2026-07-22"),
      end: new Date("2026-07-22"),
    },
    location: {
      id: "kutna-hora-1",
      name: "Kutná Hora",
    },
  },
];

type Props = {};

export default function OrderStepSelectEvent({}: Props) {
  const {
    goToNextStep,
    eventVariant,
    setEventData,
    eventData,
    setEventVariant,
    clearEventData,
  } = useOrderStore();

  const handleSelectEventType = (type: "existing-event" | "new-event") => {
    setEventVariant(eventVariant === type ? null : type);
    if (type === "new-event") {
      clearEventData();
    }
  };

  const handleSelectEvent = (eventId: string) => {
    const selectedEvent = mockEventsWithIds.find((e) => e.id === eventId);
    if (selectedEvent) {
      setEventData({
        eventId: eventId,
        name: selectedEvent.name,
        date: selectedEvent.date,
        location: selectedEvent.location,
      });
    }
    goToNextStep();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div
          className={`grid ${mockEventsWithIds.length > 0 ? "grid-cols-2" : "grid-cols-1"} gap-5`}
        >
          {mockEventsWithIds.length > 0 && (
            <EventSelectionButton
              icon={CheckSquare2}
              onClick={() => handleSelectEventType("existing-event")}
              isActive={eventVariant === "existing-event"}
              heading="Existující událost"
              text="Vyberu si událost z těch, které už mám vytvořené"
            />
          )}

          <EventSelectionButton
            icon={Plus}
            onClick={() => handleSelectEventType("new-event")}
            isActive={eventVariant === "new-event"}
            heading="Nová událost"
            text="Vytvořím si novou událost a přidám sem tohoto dodavatele"
          />
        </div>
      </div>
      {/* Existing Events Section */}
      {eventVariant === "existing-event" && mockEventsWithIds.length > 0 && (
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mt-5">
          <Text variant="label1" color="dark" className="font-semibold mb-4">
            Výběr události
          </Text>
          <div className="space-y-2">
            {mockEventsWithIds.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                handleSelectEvent={handleSelectEvent}
                eventData={eventData}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Event Section */}
      {eventVariant === "new-event" && <NewEventForm />}
    </>
  );
}

function EventCard({
  event,
  eventData,
  handleSelectEvent,
}: {
  event: (typeof mockEventsWithIds)[0];
  eventData: any;
  handleSelectEvent: (eventId: string) => void;
}) {
  return (
    <button
      key={event.id}
      onClick={() => handleSelectEvent(event.id)}
      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
        eventData.eventId === event.id
          ? "border-zinc-900 bg-white"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded lg bg-zinc-100 flex items-center justify-center mt-0.5">
        <Calendar className="w-4 h-4 text-zinc-600" />
      </div>
      <div className="flex flex-col min-w-0">
        <Text variant="label2" color="dark" className="font-semibold truncate">
          {event.name}
        </Text>
        <Text variant="label3" color="secondary" className="text-xs mt-0.5">
          {event.date.start.toLocaleDateString("cs-CZ")} • {event.location.name}
        </Text>
      </div>
    </button>
  );
}
