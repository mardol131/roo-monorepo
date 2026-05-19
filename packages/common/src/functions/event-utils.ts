import { Event } from "../types/payload-types";

export function formatGuestsString(
  guests: Event["guests"],
  includeDetails = false,
) {
  const sum = guests.adults + guests.children;
  if (sum === 0) return "Žádní hosté";
  let guestFormat = "hostů";
  if (sum === 1) guestFormat = "host";
  else if (sum > 1 && sum < 5) guestFormat = "hosté";
  if (includeDetails) {
    return `Celkem ${sum} ${guestFormat}, ZTP: ${guests.ztp ? "ano" : "ne"}, Zvířata: ${guests.pets ? "ano" : "ne"}`;
  }
  return `${sum} ${guestFormat}`;
}
export function formatEventAddress(event: Event): string {
  const loc = event.location;
  if (!loc) return "Neznámá adresa";

  if (loc.venue) {
    return typeof loc.venue === "string" ? loc.venue : loc.venue.name;
  }

  const city = loc.city
    ? typeof loc.city === "string"
      ? loc.city
      : loc.city.name
    : null;
  const parts = [loc.address, city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Neznámá adresa";
}
