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
  const block = event.location?.[0];
  if (!block) return "Neznámá adresa";

  if (block.blockType === "venue") {
    if (!block.venue) return "Neznámá adresa";
    return typeof block.venue === "string" ? block.venue : block.venue.name;
  }

  const city = block.city
    ? typeof block.city === "string"
      ? block.city
      : block.city.name
    : null;
  const parts = [block.address, city].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Neznámá adresa";
}
