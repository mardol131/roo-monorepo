import {
  deleteCollectionItem,
  getCollection,
  getCollectionItem,
  patchCollectionItem,
  postCollectionItem,
} from "@/app/functions/api/general";
import { CalendarEvent, Listing } from "@roo/common";

export async function createCalendarEvent(
  input: Omit<CalendarEvent, "id" | "updatedAt" | "createdAt">,
) {
  const res = await postCollectionItem({
    collection: "calendar-events",
    data: input,
  });
  if (!res) throw new Error("Failed to create calendar event");

  return res;
}

export async function fetchCalendarEventsByListing(listingId: string) {
  const res = await getCollection({
    collection: "calendar-events",
    query: { listing: { equals: listingId } },
    sort: "-createdAt",
  });
  if (!res) throw new Error("Failed to fetch inquiries");
  return res;
}

export async function fetchCalendarEvent(id: string) {
  const res = await getCollectionItem({
    collection: "calendar-events",
    id,
  });
  if (!res) throw new Error("Failed to fetch inquiry");
  return res;
}

export type UpdateCalendarEventInput = {
  id: string;
  name?: string;
  status?: CalendarEvent["status"];
};

export async function updateCalendarEvent({
  id,
  ...data
}: UpdateCalendarEventInput) {
  const res = await patchCollectionItem({
    collection: "calendar-events",
    id,
    data,
  });
  if (!res) throw new Error("Failed to update calendar event");
  return res;
}

export async function deleteCalendarEvent(id: string) {
  const res = await deleteCollectionItem({
    collection: "calendar-events",
    id,
  });
  return res;
}
