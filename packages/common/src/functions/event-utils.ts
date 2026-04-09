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
  const { location } = event;
  if (!location || (!location.address && !location.city && !location.venue))
    return "Neznámá adresa";

  return `${location.address ? location.address + ", " : ""}${location.city ? location.city : ""}`;
}
