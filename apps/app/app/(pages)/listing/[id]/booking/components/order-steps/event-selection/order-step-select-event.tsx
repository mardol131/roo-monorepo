"use client";

import React, { useMemo } from "react";
import {
  Plus,
  CheckSquare2,
  Calendar,
  MapPin,
  Check,
  Users,
} from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import EventSelectionButton from "./event-selection-button";
import NewEventForm from "./new-event-form";
import { Event, EventData } from "@roo/common";
import StepHeading from "../step-heading";
import * as lucideIcons from "lucide-react";

type Props = {
  existingEvents: Event[];
};

export default function OrderStepSelectEvent({ existingEvents }: Props) {
  const { eventVariant, setEventData, eventData, setEventVariant } =
    useOrderStore();

  const handleSelectEventType = (type: "existing-event" | "new-event") => {
    setEventVariant(eventVariant === type ? null : type);
  };

  const handleSelectEvent = (eventId: string) => {
    const selectedEvent = existingEvents.find((e) => e.id === eventId);
    if (selectedEvent) {
      setEventData({
        id: eventId,
        name: selectedEvent.data.name,
        icon: selectedEvent.data.icon,
        date: selectedEvent.data.date,
        location: selectedEvent.data.location,
        guests: selectedEvent.data.guests,
      });
    }
  };

  const content = () => {
    if (existingEvents.length === 0) {
      return (
        <>
          <NewEventForm />
        </>
      );
    }

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
          <div className=" mt-12">
            <Text
              variant="heading5"
              color="dark"
              className="font-semibold mb-4"
            >
              Vaše události
            </Text>
            <div className="space-y-2">
              {existingEvents.map((event) => (
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
  };

  const { title, description } = useMemo(() => {
    if (existingEvents.length === 0) {
      return {
        title: "Vytvořte novou událost",
        description:
          "Vytvořte novou událost, do které následně přidáte tohoto dodavatele",
      };
    }
    switch (eventVariant) {
      case "existing-event":
        return {
          title: "Vyberte existující událost",
          description:
            "Vyberte událost, do které chcete přidat tohoto dodavatele",
        };
      case "new-event":
        return {
          title: "Vytvořte novou událost",
          description:
            "Vytvořte novou událost, do které následně přidáte tohoto dodavatele",
        };
      default:
        return {
          title: "Vyberte existující událost nebo vytvořte novou",
          description:
            "Zvolte, zda chcete přidat dodavatele do existujícího eventu nebo vytvořit nový",
        };
    }
  }, [existingEvents, eventVariant]);

  return (
    <div>
      <StepHeading title={title} description={description} />
      {content()}
    </div>
  );
}

function EventCard({
  event,
  eventData,
  handleSelectEvent,
}: {
  event: Event;
  eventData: (EventData & { id?: string }) | undefined;
  handleSelectEvent: (eventId: string) => void;
}) {
  const isSelected = eventData?.id === event.id;

  const Icon =
    lucideIcons[event.data.icon as keyof typeof lucideIcons] || Calendar;

  return (
    <button
      onClick={() => handleSelectEvent(event.id)}
      className={`group w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
        isSelected
          ? "border-primary bg-zinc-50 shadow-sm"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <div
        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          isSelected ? "bg-primary" : "bg-zinc-100 group-hover:bg-zinc-200"
        }`}
      >
        <Calendar
          className={`w-5 h-5 transition-colors ${
            isSelected ? "text-white" : "text-zinc-600"
          }`}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <Text variant="label1" color="dark" className="font-semibold truncate">
          {event.data.name}
        </Text>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
            <Text variant="label4" color="secondary">
              {event.data.date.start.toLocaleDateString("cs-CZ")}
            </Text>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
            <Text variant="label4" color="secondary">
              {event.data.location.name}
            </Text>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-zinc-400 shrink-0" />
            <Text variant="label4" color="secondary">
              Dosp.: {event.data.guests.adults}, Děti:{" "}
              {event.data.guests.children}, ZTP:{" "}
              {event.data.guests.ztp ? "ANO" : "NE"}, Mazlíčci:{" "}
              {event.data.guests.pets ? "ANO" : "NE"}
            </Text>
          </span>
        </div>
      </div>

      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? "border-primary bg-primary"
            : "border-zinc-300 group-hover:border-zinc-400"
        }`}
      >
        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}
