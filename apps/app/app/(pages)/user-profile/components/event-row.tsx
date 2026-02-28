import Text from "@/app/components/ui/atoms/text";
import { EVENT_STATUS } from "@/app/data/event";
import { Event } from "@roo/common";
import * as lucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Calendar, ChevronRight, MapPin, Users } from "lucide-react";
import Link from "next/link";

export function EventRow({ event }: { event: Event }) {
  const Icon =
    (lucideIcons[event.data.icon as keyof typeof lucideIcons] as LucideIcon) ??
    Calendar;
  const status = EVENT_STATUS[event.status];

  return (
    <Link
      href={`/user-profile/my-events/${event.id}`}
      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-rose-500" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Text variant="label1" color="dark" className="font-medium truncate">
          {event.data.name}
        </Text>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Calendar className="w-3 h-3" />
            {event.data.date.start.toLocaleDateString("cs-CZ")}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="w-3 h-3" />
            {event.data.location.name}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Users className="w-3 h-3" />
            {event.data.guests.adults}
          </span>
        </div>
      </div>

      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.className}`}
      >
        {status.label}
      </span>

      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </Link>
  );
}
