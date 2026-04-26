import { MOCK_EVENTS } from "@/app/_mock/mock";
import type { Event } from "@roo/common";

export async function fetchEvents() {
  const res = MOCK_EVENTS;
  if (!res) throw new Error("Failed to fetch events");
  return res;
}

export async function fetchEventById(id: string) {
  const res = MOCK_EVENTS.find((event) => event.id === id);
  if (!res) throw new Error("Failed to fetch event");
  return res;
}

async function patchEvent(eventId: string, body: Partial<Event>): Promise<Event> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/events/${eventId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error("Failed to update event");
  const data = await res.json();
  return data.doc;
}

export async function addNoteToEvent(
  eventId: string,
  notes: NonNullable<Event["notes"]>,
): Promise<Event> {
  return patchEvent(eventId, { notes });
}

export async function updateChecklist(
  eventId: string,
  checklist: NonNullable<Event["checklist"]>,
): Promise<Event> {
  return patchEvent(eventId, { checklist });
}
