"use client";

import { CalendarEvent } from "@roo/common";
import {
  addDays,
  areIntervalsOverlapping,
  endOfDay,
  format,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns";
import { cs } from "date-fns/locale";
import { useEffect, useRef } from "react";
import CalendarDayColumn, {
  CreateRequest,
  HOUR_HEIGHT,
  HOURS,
  TOTAL_HEIGHT,
} from "./calendar-day-column";
import { useCalendarEventsByListing } from "@/app/react-query/calendar-events/hooks";
import { useParams } from "next/navigation";

// ── Layout constants ─────────────────────────────────────────────────────────

const TIME_COL_W = 52; // px
const DAYS = 7;
const SCROLL_TO_HOUR = 7;

// ── All-day strip styles ─────────────────────────────────────────────────────

const ALL_DAY_STYLES: Record<CalendarEvent["status"], string> = {
  confirmed: "bg-calendar text-white",
  tentative:
    "bg-calendar-surface text-calendar border border-dashed border-calendar",
  cancelled: "bg-zinc-200 text-zinc-400 line-through",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  weekStart: Date;
  onCreateRequest: (req: CreateRequest) => void;
  onEditRequest: (event: CalendarEvent, x: number, y: number) => void;
  isCreating?: boolean;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalendarWeekView({
  weekStart,
  onCreateRequest,
  onEditRequest,
  isCreating,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { listingId } = useParams<{ listingId: string }>();
  const { data: events = [] } = useCalendarEventsByListing(listingId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = HOUR_HEIGHT * SCROLL_TO_HOUR;
    }
  }, []);

  const days = Array.from({ length: DAYS }, (_, i) => addDays(weekStart, i));
  const allDayEvents = events.filter((e) => e.allDay);
  const hasAllDay = allDayEvents.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      {/* ── Single scrollable container — header sticks inside so widths always match ── */}
      <div
        ref={scrollRef}
        className="overflow-y-auto overflow-x-auto"
        style={{ maxHeight: 480 }}
      >
        <div style={{ minWidth: TIME_COL_W + DAYS * 80 }}>
          {/* ── Sticky header (day labels + all-day strip) ─────────────────── */}
          <div className="sticky top-0 z-10 bg-white border-b border-zinc-200">
            {/* Day header row */}
            <div className="flex">
              <div style={{ width: TIME_COL_W, minWidth: TIME_COL_W }} />
              {days.map((day) => {
                const today = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className="flex-1 min-w-20 py-2.5 border-l border-zinc-100 flex flex-col items-center"
                  >
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      {format(day, "EEE", { locale: cs })}
                    </span>
                    <span
                      className={`mt-0.5 text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                        today ? "bg-calendar text-white" : "text-zinc-800"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* All-day strip */}
            {hasAllDay && (
              <div className="flex border-t border-zinc-200">
                <div
                  style={{ width: TIME_COL_W, minWidth: TIME_COL_W }}
                  className="flex items-start justify-end pr-2 pt-1.5"
                >
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide leading-none">
                    celý
                    <br />
                    den
                  </span>
                </div>
                {days.map((day) => {
                  const dayStart = startOfDay(day);
                  const dayEnd = endOfDay(day);
                  const items = allDayEvents.filter((e) =>
                    areIntervalsOverlapping(
                      { start: parseISO(e.startsAt), end: parseISO(e.endsAt) },
                      { start: dayStart, end: dayEnd },
                    ),
                  );
                  return (
                    <div
                      key={day.toISOString()}
                      className="flex-1 min-w-20 border-l border-zinc-100 py-1 px-0.5 flex flex-col gap-0.5 min-h-7"
                    >
                      {items.map((e) => (
                        <div
                          key={e.id}
                          title={e.name}
                          className={`text-[11px] font-medium rounded px-1.5 py-0.5 truncate leading-tight ${
                            ALL_DAY_STYLES[e.status] ?? "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {e.name}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Time grid ──────────────────────────────────────────────────── */}
          <div
            className="flex relative"
            style={{ height: TOTAL_HEIGHT }}
          >
            {/* Time gutter */}
            <div
              style={{ width: TIME_COL_W, minWidth: TIME_COL_W }}
              className="relative shrink-0"
            >
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute w-full flex justify-end pr-2"
                  style={{ top: h * HOUR_HEIGHT - 7 }}
                >
                  {h > 0 && (
                    <span className="text-[11px] text-zinc-400 leading-none tabular-nums">
                      {String(h).padStart(2, "0")}:00
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((day) => (
              <CalendarDayColumn
                key={day.toISOString()}
                day={day}
                events={events}
                onCreateRequest={onCreateRequest}
                onEditRequest={onEditRequest}
                isCreating={isCreating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
