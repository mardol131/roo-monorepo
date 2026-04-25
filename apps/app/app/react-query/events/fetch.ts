import { MOCK_EVENTS } from "@/app/_mock/mock";

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
