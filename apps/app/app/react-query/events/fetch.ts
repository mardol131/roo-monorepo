import {
  getCollection,
  getCollectionItem,
  patchCollectionItem,
  PatchData,
  postCollectionItem,
} from "@/app/functions/api/general";
import type { Event, Where } from "@roo/common";

export async function fetchEvents() {
  const res = await getCollection({
    collection: "events",
    sort: "-createdAt",
  });
  if (!res) throw new Error("Failed to fetch events");
  return res;
}

export async function fetchEventById(id: string) {
  const res = await getCollectionItem({
    collection: "events",
    id,
  });
  if (!res) throw new Error("Failed to fetch event");
  return res;
}

type CreateEventData = Omit<Event, "id" | "owner" | "updatedAt" | "createdAt">;

export async function createEvent(data: CreateEventData) {
  const res = await postCollectionItem({
    collection: "events",
    data,
  });
  if (!res) throw new Error("Failed to create event");
  return res;
}

export async function patchEvent(
  eventId: string,
  body: PatchData<Event>,
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
