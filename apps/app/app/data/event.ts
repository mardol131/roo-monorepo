import { Event } from "@roo/common";

export const EVENT_STATUS: Record<
  Event["status"],
  { label: string; className: string }
> = {
  deactivated: {
    label: "Neaktivní",
    className: "bg-emerald-100 text-emerald-700",
  },
  planning: { label: "Plánovaná", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Dokončená", className: "bg-zinc-100 text-zinc-600" },
};
