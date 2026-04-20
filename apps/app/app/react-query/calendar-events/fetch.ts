import { CALENDAR_EVENTS, getInquiries, LISTINGS } from "@/app/_mock/mock";
import { CalendarEvent, Listing } from "@roo/common";

export type CreateCalendarEventInput = {
  listingId: string;
  name: string;
  startsAt: Date;
  endsAt: Date;
  allDay: boolean;
  status: CalendarEvent["status"];
  description?: string;
};

export async function createCalendarEvent(
  input: CreateCalendarEventInput,
): Promise<CalendarEvent> {
  const newEvent: CalendarEvent = {
    id: `ce-${Date.now()}`,
    listing: input.listingId,
    source: "manual",
    status: input.status,
    name: input.name,
    startsAt: input.startsAt.toISOString(),
    endsAt: input.endsAt.toISOString(),
    allDay: input.allDay,
    description: input.description ?? null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  CALENDAR_EVENTS.push(newEvent);
  return newEvent;
}

export async function fetchCalendarEventsByListing(listingId: string) {
  const res = CALENDAR_EVENTS.filter((event) => {
    if (typeof event.listing === "string") {
      return event.listing === listingId;
    }
    return event.listing.id === listingId;
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchCalendarEvent(id: string) {
  const res = CALENDAR_EVENTS.find((event) => event.id === id);
  if (!res) throw new Error("Failed to fetch inquiry");
  return res;
}

export type UpdateCalendarEventInput = {
  id: string;
  name?: string;
  status?: CalendarEvent["status"];
};

export async function updateCalendarEvent({ id, ...data }: UpdateCalendarEventInput): Promise<CalendarEvent> {
  const idx = CALENDAR_EVENTS.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Event not found");
  CALENDAR_EVENTS[idx] = { ...CALENDAR_EVENTS[idx], ...data, updatedAt: new Date().toISOString() };
  return CALENDAR_EVENTS[idx];
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const idx = CALENDAR_EVENTS.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Event not found");
  CALENDAR_EVENTS.splice(idx, 1);
}

export async function updateInquiry(id: string, data: Partial<Listing>) {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inquiry");
  return res.json();
}
