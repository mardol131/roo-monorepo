import { CALENDAR_EVENTS, getInquiries, LISTINGS } from "@/app/_mock/mock";
import { Listing } from "@roo/common";

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

export async function updateInquiry(id: string, data: Partial<Listing>) {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inquiry");
  return res.json();
}
