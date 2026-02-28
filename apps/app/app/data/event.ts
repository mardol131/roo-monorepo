import { EventStatus } from "@roo/common";

export const EVENT_STATUS: Record<
  EventStatus,
  { label: string; className: string }
> = {
  active: { label: "Aktivní", className: "bg-emerald-100 text-emerald-700" },
  planned: { label: "Plánovaná", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Dokončená", className: "bg-zinc-100 text-zinc-600" },
};
