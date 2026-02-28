import { Guests } from "../types/event";

export function formatGuestsString(guests: Guests) {
  const sum = guests.adults + guests.children;
  if (sum === 0) return "Žádní hosté";
  let guestFormat = "hostů";
  if (sum === 1) guestFormat = "host";
  else if (sum > 1 && sum < 5) guestFormat = "hosté";
  return `Celkem ${sum} ${guestFormat}, ZTP: ${guests.ztp ? "ano" : "ne"}, Zvířata: ${guests.pets ? "ano" : "ne"}`;
}
