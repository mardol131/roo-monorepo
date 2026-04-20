"use client";

import { CalendarEvent } from "@roo/common";
import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  endOfDay,
  isToday,
  max,
  min,
  parseISO,
  startOfDay,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import CalendarEventBlock from "./calendar-event-block";
import { useParams } from "next/navigation";

// ── Constants (must match calendar-week-view) ─────────────────────────────────

export const HOUR_HEIGHT = 56;
export const SLOT_HEIGHT = HOUR_HEIGHT / 4; // 14px per 15 min
export const TOTAL_HEIGHT = HOUR_HEIGHT * 24;
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TOTAL_SLOTS = 96; // 24h × 4

// ── Types ─────────────────────────────────────────────────────────────────────

export type CreateRequest = {
  startsAt: Date;
  endsAt: Date;
  x: number;
  y: number;
};

type DragSlots = { start: number; end: number };

type Props = {
  day: Date;
  events: CalendarEvent[];
  onCreateRequest: (req: CreateRequest) => void;
  onEditRequest: (event: CalendarEvent, x: number, y: number) => void;
  isCreating?: boolean;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalendarDayColumn({
  day,
  events,
  onCreateRequest,
  onEditRequest,
  isCreating,
}: Props) {
  const colRef = useRef<HTMLDivElement>(null);
  const dragStartSlot = useRef<number | null>(null);
  const [dragSlots, setDragSlots] = useState<DragSlots | null>(null);
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();

  // Clear the highlight once the popover closes (save or cancel)
  useEffect(() => {
    if (!isCreating) setDragSlots(null);
  }, [isCreating]);

  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  const dayEvents = events.filter(
    (e) =>
      !e.allDay &&
      areIntervalsOverlapping(
        { start: parseISO(e.startsAt), end: parseISO(e.endsAt) },
        { start: dayStart, end: dayEnd },
      ),
  );

  function slotFromClientY(clientY: number): number {
    const rect = colRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(
      0,
      Math.min(TOTAL_SLOTS - 1, Math.floor((clientY - rect.top) / SLOT_HEIGHT)),
    );
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Ignore clicks on event blocks
    if ((e.target as HTMLElement).closest("[data-event-block]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const slot = slotFromClientY(e.clientY);
    dragStartSlot.current = slot;
    setDragSlots({ start: slot, end: slot });
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStartSlot.current === null) return;
    const slot = slotFromClientY(e.clientY);
    const s = dragStartSlot.current;
    setDragSlots({ start: Math.min(s, slot), end: Math.max(s, slot) });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStartSlot.current === null) return;
    const endSlot = slotFromClientY(e.clientY);
    const s = dragStartSlot.current;
    const start = Math.min(s, endSlot);
    const end = Math.max(s, endSlot);

    dragStartSlot.current = null;
    // Keep dragSlots visible — cleared by the isCreating effect when popover closes

    const startsAt = addMinutes(dayStart, start * 15);
    // Single click → default 1 hour; drag → use selected range
    const durationSlots = start === end ? 4 : end - start + 1;
    const endsAt = addMinutes(startsAt, durationSlots * 15);

    // Position popover at the right edge of this column, centered on the highlight
    const rect = colRef.current?.getBoundingClientRect();
    const displayEndSlot = start + durationSlots; // exclusive
    const highlightCenterY = rect
      ? rect.top + ((start + displayEndSlot) / 2) * SLOT_HEIGHT
      : e.clientY;
    const x = rect ? rect.right : e.clientX;

    onCreateRequest({ startsAt, endsAt, x, y: highlightCenterY });
  }

  return (
    <div
      ref={colRef}
      className="flex-1 min-w-20 border-l border-zinc-100 relative select-none"
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Hour grid lines */}
      {HOURS.map((h) => (
        <div
          key={h}
          className="absolute inset-x-0 border-t border-zinc-100 pointer-events-none"
          style={{ top: h * HOUR_HEIGHT }}
        />
      ))}
      {/* Half-hour ticks */}
      {HOURS.map((h) => (
        <div
          key={`hh-${h}`}
          className="absolute inset-x-0 border-t border-zinc-50 pointer-events-none"
          style={{ top: h * HOUR_HEIGHT + SLOT_HEIGHT * 2 }}
        />
      ))}

      {/* Drag highlight */}
      {dragSlots && (
        <div
          className="absolute inset-x-0.5 rounded bg-calendar/15 border border-calendar/40 pointer-events-none z-10"
          style={{
            top: dragSlots.start * SLOT_HEIGHT,
            height: (dragSlots.end - dragSlots.start + 1) * SLOT_HEIGHT,
          }}
        />
      )}

      {/* Now indicator */}
      {isToday(day) && <NowIndicator />}

      {/* Events */}
      {dayEvents.map((event) => {
        const cStart = max([parseISO(event.startsAt), dayStart]);
        const cEnd = min([parseISO(event.endsAt), dayEnd]);
        const startMin = differenceInMinutes(cStart, dayStart);
        const durationMin = differenceInMinutes(cEnd, cStart);
        const top = (startMin / 15) * SLOT_HEIGHT;
        const height = Math.max((durationMin / 15) * SLOT_HEIGHT, SLOT_HEIGHT);

        return (
          <CalendarEventBlock
            key={`${event.id}-${day.toISOString()}`}
            event={event}
            top={top}
            height={height}
            link={
              event.inquiry
                ? {
                    pathname:
                      "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
                    params: {
                      companyId: companyId,
                      listingId: listingId,
                      inquiryId:
                        typeof event.inquiry === "string"
                          ? event.inquiry
                          : event.inquiry?.id,
                    },
                  }
                : undefined
            }
            onEdit={
              !event.inquiry ? (x, y) => onEditRequest(event, x, y) : undefined
            }
          />
        );
      })}
    </div>
  );
}

// ── Now indicator ─────────────────────────────────────────────────────────────

function NowIndicator() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const top = ((now.getHours() * 60 + now.getMinutes()) / 15) * SLOT_HEIGHT;

  return (
    <div
      className="absolute inset-x-0 z-10 pointer-events-none flex items-center"
      style={{ top }}
    >
      <div className="w-2 h-2 rounded-full bg-calendar -ml-1 shrink-0" />
      <div className="flex-1 h-px bg-calendar" />
    </div>
  );
}
