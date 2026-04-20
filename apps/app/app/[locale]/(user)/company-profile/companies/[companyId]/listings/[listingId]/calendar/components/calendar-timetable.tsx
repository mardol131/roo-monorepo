"use client";

import Text from "@/app/components/ui/atoms/text";
import { useCalendarEventsByListing } from "@/app/react-query/calendar-events/hooks";
import { CalendarEvent } from "@roo/common";
import { format, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import { cs } from "date-fns/locale";
import { MessageSquare, PenLine } from "lucide-react";
import { useParams } from "next/navigation";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDayHeading(date: Date): string {
  if (isToday(date))
    return `Dnes · ${format(date, "EEEE d. MMMM yyyy", { locale: cs })}`;
  if (isTomorrow(date))
    return `Zítra · ${format(date, "EEEE d. MMMM yyyy", { locale: cs })}`;
  return format(date, "EEEE d. MMMM yyyy", { locale: cs });
}

function formatTimeRange(event: CalendarEvent): string {
  if (event.allDay) return "Celý den";
  return `${format(parseISO(event.startsAt), "HH:mm", { locale: cs })} – ${format(parseISO(event.endsAt), "HH:mm", { locale: cs })}`;
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<
  CalendarEvent["source"],
  Record<CalendarEvent["status"], string>
> = {
  inquiry: {
    confirmed: "bg-inquiry text-white",
    tentative:
      "bg-inquiry-surface text-inquiry border border-dashed border-inquiry",
    cancelled: "bg-zinc-100 text-zinc-400 line-through",
  },
  manual: {
    confirmed: "bg-calendar text-white",
    tentative:
      "bg-calendar-surface text-calendar border border-dashed border-calendar",
    cancelled: "bg-zinc-100 text-zinc-400 line-through",
  },
};

const STATUS_LABEL: Record<CalendarEvent["status"], string> = {
  confirmed: "Potvrzeno",
  tentative: "V plánování",
  cancelled: "Zrušeno",
};

// ── Grouping ──────────────────────────────────────────────────────────────────

type DayGroup = {
  day: Date;
  events: CalendarEvent[];
};

function groupByDay(events: CalendarEvent[]): DayGroup[] {
  const today = startOfDay(new Date());
  const upcoming = events
    .filter((e) => parseISO(e.endsAt) >= today)
    .sort(
      (a, b) => parseISO(a.startsAt).getTime() - parseISO(b.startsAt).getTime(),
    );

  const map = new Map<string, CalendarEvent[]>();
  for (const e of upcoming) {
    const key = startOfDay(parseISO(e.startsAt)).toISOString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }

  return Array.from(map.entries()).map(([key, evts]) => ({
    day: new Date(key),
    events: evts,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalendarTimetable() {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: events = [] } = useCalendarEventsByListing(listingId);

  const groups = groupByDay(events);

  return (
    <div className=" mt-6 flex flex-col gap-3">
      <Text variant="heading5" color="dark">
        Nadcházející události
      </Text>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl  border border-zinc-300 px-6 py-10 text-center">
          <Text variant="label1" color="muted">
            Žádné nadcházející události
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {groups.map(({ day, events: dayEvents }) => (
            <div
              key={day.toISOString()}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden"
            >
              {/* Day header */}
              <div className="flex items-center justify-between py-3 px-5 border-b border-zinc-300 bg-zinc-50">
                <Text variant="label1" color="dark">
                  {formatDayHeading(day)}
                </Text>
                <Text variant="label4" color="muted" as="span">
                  {dayEvents.length === 1
                    ? "1 událost"
                    : `${dayEvents.length} události`}
                </Text>
              </div>

              {/* Events */}
              <div className="divide-y divide-zinc-100">
                {dayEvents.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Event row ─────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: CalendarEvent }) {
  const isInquiry = !!event.inquiry;

  return (
    <div className="flex items-center gap-4 px-5 py-3">
      {/* Time */}
      <div className="w-28 shrink-0">
        <Text variant="label2" color="muted" as="span">
          {formatTimeRange(event)}
        </Text>
      </div>

      {/* Source indicator */}
      <div className="shrink-0">
        {isInquiry ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-inquiry/10 text-inquiry">
            <MessageSquare className="w-3 h-3" />
            Poptávka
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500"
            title="Vlastní událost"
          >
            <PenLine className="w-3 h-3" />
            Vlastní
          </span>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <Text
          variant="label1"
          color="dark"
          as="span"
          className={`truncate block ${event.status === "cancelled" ? "line-through opacity-50" : ""}`}
        >
          {event.name}
        </Text>
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[event.source][event.status]}`}
        >
          {STATUS_LABEL[event.status]}
        </span>
      </div>
    </div>
  );
}
