"use client";

import React from "react";
import { Plus, CheckSquare2, Calendar } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";
import EventSelectionButton from "./event-selection-button";

// Mock data - TODO: Nahradit skutečnými event daty z databáze
const mockEvents = [
  {
    id: "1",
    name: "Svatba Petra a Marie",
    date: "2026-06-15",
    location: "Praha",
  },
  {
    id: "2",
    name: "Firemní ples",
    date: "2026-03-20",
    location: "Ostrava",
  },
  {
    id: "3",
    name: "Narozeninová oslava",
    date: "2026-04-10",
    location: "Brno",
  },
  {
    id: "4",
    name: "Korporátní akce",
    date: "2026-05-05",
    location: "Praha",
  },
  {
    id: "5",
    name: "Vejška",
    date: "2026-07-22",
    location: "Kutná Hora",
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
    const selectedEvent = mockEvents.find((e) => e.id === eventId);
    if (selectedEvent) {
      setEventData({
        eventId: eventId,
        name: selectedEvent.name,
        date: {
          start: new Date(selectedEvent.date),
          end: new Date(selectedEvent.date),
        },
        location: selectedEvent.location,
      });
    }
    goToNextStep();
  };

  const handleNewEventSubmit = () => {
    if (!eventData.name || !eventData.date?.start) {
      return;
    }
    setEventData({
      ...eventData,
      peopleCount: {
        adult: 0,
        child: 0,
        ztp: 0,
        pets: false,
      },
    });
    goToNextStep();
  };

  const isNewEventValid = eventData.name && eventData.date?.start;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <EventSelectionButton
            icon={CheckSquare2}
            onClick={() => handleSelectEventType("existing-event")}
            isActive={eventVariant === "existing-event"}
            heading="Existující událost"
            text="Vyberu si událost z těch, které už mám vytvořené"
          />

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
      {eventVariant === "existing-event" && (
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mt-5">
          <Text variant="label1" color="dark" className="font-semibold mb-4">
            Výběr události
          </Text>
          <div className="space-y-2">
            {mockEvents.length > 0 ? (
              mockEvents.map((event) => (
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
                  <div className="flex-1 min-w-0">
                    <Text
                      variant="label2"
                      color="dark"
                      className="font-semibold truncate"
                    >
                      {event.name}
                    </Text>
                    <Text
                      variant="label3"
                      color="secondary"
                      className="text-xs mt-0.5"
                    >
                      {new Date(event.date).toLocaleDateString("cs-CZ")} •{" "}
                      {event.location}
                    </Text>
                  </div>
                </button>
              ))
            ) : (
              <Text
                variant="label3"
                color="secondary"
                className="text-center py-4"
              >
                Zatím nemáte žádné události
              </Text>
            )}
          </div>
        </div>
      )}

      {/* New Event Section */}
      {eventVariant === "new-event" && (
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mt-5">
          <Text variant="label1" color="dark" className="font-semibold mb-4">
            Vytvoření nové události
          </Text>
          <div className="space-y-4">
            <div>
              <label htmlFor="event-name" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Název události *
                </Text>
              </label>
              <input
                type="text"
                id="event-name"
                value={eventData.name || ""}
                onChange={(e) =>
                  setEventData({ ...eventData, name: e.target.value })
                }
                placeholder="např. Svatba Petra a Marie"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="event-date" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Datum konání *
                </Text>
              </label>
              <input
                type="date"
                id="event-date"
                value={
                  eventData.date?.start
                    ? eventData.date.start.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    date: {
                      start: new Date(e.target.value),
                      end: new Date(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="event-location" className="block mb-1.5">
                <Text variant="label2" color="dark">
                  Místo konání
                </Text>
              </label>
              <input
                type="text"
                id="event-location"
                value={eventData.location || ""}
                onChange={(e) =>
                  setEventData({ ...eventData, location: e.target.value })
                }
                placeholder="např. Praha"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>

            <Button
              disabled={!isNewEventValid}
              onClick={handleNewEventSubmit}
              className="w-full"
              text="Vytvořit událost a pokračovat"
            />
          </div>
        </div>
      )}
    </>
  );
}
