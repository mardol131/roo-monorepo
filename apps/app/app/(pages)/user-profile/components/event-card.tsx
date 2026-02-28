import Text from "@/app/components/ui/atoms/text";
import { EVENT_STATUS } from "@/app/data/event";
import {
  Event,
  formatGuestsString,
  formatInquiryCountLabel,
} from "@roo/common";
import { format } from "date-fns";
import * as lucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Users,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export function EventCard({ event }: { event: Event }) {
  const Icon =
    (lucideIcons[event.data.icon as keyof typeof lucideIcons] as LucideIcon) ??
    lucideIcons.Calendar;
  const status = EVENT_STATUS[event.status];

  return (
    <Link
      href={`/user-profile/my-events/${event.id}`}
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all px-6 py-5 flex items-center gap-5"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-rose-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <Text
            variant="label1"
            color="dark"
            className="font-semibold truncate"
          >
            {event.data.name}
          </Text>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            {format(event.data.date.start, "d. M. yyyy")} -{" "}
            {format(event.data.date.end, "d. M. yyyy")}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            {event.data.location.name}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="w-3.5 h-3.5" />
            {formatGuestsString(event.data.guests)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MessageSquare className="w-3.5 h-3.5" />
            {formatInquiryCountLabel(event.inquiries?.length ?? 0)}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
    </Link>
  );
}
