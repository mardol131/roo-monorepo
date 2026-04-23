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
import { Event } from "@roo/common";
import StepHeading from "../step-heading";
import * as lucideIcons from "lucide-react";
import { format } from "date-fns";

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
        name: selectedEvent.name,
        icon: selectedEvent.icon,
        date: selectedEvent.date,
        location: selectedEvent.location,
        guests: selectedEvent.guests,
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
              variant="h4"
              color="textDark"
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
                  isActive={eventData?.id === event.id}
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
  handleSelectEvent,
  isActive,
}: {
  event: Event;
  handleSelectEvent: (eventId: string) => void;
  isActive: boolean;
}) {
  const Icon = lucideIcons[event.icon as keyof typeof lucideIcons] || Calendar;

  return (
    <button
      onClick={() => handleSelectEvent(event.id)}
      className={`group w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
        isActive
          ? "border-primary bg-zinc-50 shadow-sm"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <div
        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          isActive ? "bg-primary" : "bg-zinc-100 group-hover:bg-zinc-200"
        }`}
      >
        <Calendar
          className={`w-5 h-5 transition-colors ${
            isActive ? "text-white" : "text-zinc-600"
          }`}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <Text
          variant="label-lg"
          color="textDark"
          className="font-semibold truncate"
        >
          {event.name}
        </Text>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
            <Text variant="caption" color="secondary">
              {format(new Date(event.date.start), "d. M. yyyy")} -{" "}
              {format(new Date(event.date.end), "d. M. yyyy")}
            </Text>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
            {event.location && (
              <Text variant="caption" color="secondary">
                {event.location.city &&
                  typeof event.location.city !== "string" &&
                  `${event.location.city.name}, `}
                {event.location.address}
              </Text>
            )}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-zinc-400 shrink-0" />
            <Text variant="caption" color="secondary">
              Dosp.: {event.guests.adults}, Děti: {event.guests.children}, ZTP:{" "}
              {event.guests.ztp ? "ANO" : "NE"}, Mazlíčci:{" "}
              {event.guests.pets ? "ANO" : "NE"}
            </Text>
          </span>
        </div>
      </div>

      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          isActive
            ? "border-primary bg-primary"
            : "border-zinc-300 group-hover:border-zinc-400"
        }`}
      >
        {isActive && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}
