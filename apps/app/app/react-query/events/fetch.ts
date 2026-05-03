import {
  getCollection,
  patchCollectionItem,
} from "@/app/functions/api/general";
import type { Event } from "@roo/common";

export async function fetchEvents() {
  const res = await getCollection({
    collection: "events",
    sort: "-createdAt",
  });
  if (!res) throw new Error("Failed to fetch events");
  return res;
}

export async function fetchEventById(id: string) {
  const res = await getCollection({
    collection: "events",
    query: { id: { equals: id } },
  });
  if (!res) throw new Error("Failed to fetch event");
  return res;
}

async function patchEvent(
  eventId: string,
  body: Partial<Event>,
): Promise<Event> {
  const res = await patchCollectionItem({
    collection: "events",
    id: eventId,
    data: body,
  });
  return res;
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
