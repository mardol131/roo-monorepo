"use client";

import React, { useEffect, useMemo } from "react";
import {
  Calendar,
  Check,
  CheckSquare2,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import EventSelectionButton from "./event-selection-button";
import { Event } from "@roo/common";
import StepHeading from "../step-heading";
import * as lucideIcons from "lucide-react";
import { format } from "date-fns";
import { useEvents } from "@/app/react-query/events/hooks";

function getLocationLabel(location: Event["location"]): string | null {
  if (!location) return null;

  const districtName = location.district
    ? typeof location.district === "string"
      ? location.district
      : location.district.name
    : null;
  const parts = [districtName, location.address].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export default function OrderStepSelectEvent() {
  const { eventVariant, setEventData, eventData, setEventVariant } =
    useOrderStore();
  const { data: events } = useEvents();

  const hasExistingEvents = !!(events?.docs && events.docs.length > 0);

  // Auto-switch to create mode when user has no events
  useEffect(() => {
    if (events !== undefined && !hasExistingEvents && eventVariant === null) {
      setEventVariant("new-event");
    }
  }, [events, hasExistingEvents, eventVariant, setEventVariant]);

  const handleSelectEventType = (type: "existing-event" | "new-event") => {
    setEventVariant(eventVariant === type ? null : type);
  };

  const handleSelectEvent = (eventId: string) => {
    const selectedEvent = events?.docs?.find((e) => e.id === eventId);
    if (selectedEvent) {
      setEventData(selectedEvent);
    }
  };

  const { title, description } = useMemo(() => {
    switch (eventVariant) {
      case "existing-event":
        return {
          title: "Vyberte existující událost",
          description:
            "Vyberte událost, do které chcete přidat tohoto dodavatele",
        };
      default:
        return {
          title: "Vyberte existující událost nebo vytvořte novou",
          description:
            "Zvolte, zda chcete přidat dodavatele do existujícího eventu nebo vytvořit nový",
        };
    }
  }, [eventVariant]);

  return (
    <div>
      <StepHeading title={title} description={description} />
      <div className="flex flex-col gap-6 mt-6">
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
            heading="Kliknětě pro vytvoření události"
            text="Kliknutím se vám otevře formulář pro vytvoření nové události"
          />
        </div>

        {eventVariant === "existing-event" && (
          <div>
            <Text variant="h4" color="textDark" className="font-semibold mb-4">
              Vaše události
            </Text>
            <div className="space-y-2">
              {events?.docs?.map((event) => (
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
      </div>
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
  const Icon =
    (event.icon
      ? (lucideIcons[
          event.icon as keyof typeof lucideIcons
        ] as React.ComponentType<{ className?: string }>)
      : null) ?? Calendar;

  const locationLabel = getLocationLabel(event.location);

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
        <Icon
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
              {format(new Date(event.date.start), "d. M. yyyy")} –{" "}
              {format(new Date(event.date.end), "d. M. yyyy")}
            </Text>
          </span>
          {locationLabel && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
              <Text variant="caption" color="secondary">
                {locationLabel}
              </Text>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-zinc-400 shrink-0" />
            <Text variant="caption" color="secondary">
              Dosp.: {event.guests.adults}, Děti: {event.guests.children}
              {event.guests.ztp && ", ZTP"}
              {event.guests.pets && ", Mazlíčci"}
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
