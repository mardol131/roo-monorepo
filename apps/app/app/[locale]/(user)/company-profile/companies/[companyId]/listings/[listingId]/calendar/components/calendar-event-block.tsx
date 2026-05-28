"use client";

import { IntlLink, Link } from "@/app/i18n/navigation";
import { CalendarEvent } from "@roo/common";
import { format, parseISO } from "date-fns";
import { MessageSquare, PenLine } from "lucide-react";

type Props = {
  calendarEvent: CalendarEvent;
  top: number;
  height: number;
  /** Provided for inquiry events — clicking navigates here */
  link?: IntlLink;
  /** Provided for manual events — clicking opens the edit modal */
  onEdit?: () => void;
};

const STATUS_STYLES: Record<
  CalendarEvent["source"],
  {
    [K in CalendarEvent["status"]]: string;
  }
> = {
  manual: {
    confirmed: "bg-calendar text-white",
    tentative:
      "bg-calendar-surface text-calendar border border-dashed border-calendar",
    cancelled: "bg-zinc-200 text-zinc-400 line-through",
  },
  inquiry: {
    confirmed: "bg-inquiry text-white",
    tentative: "bg-inquiry-surface text-inquiry border border-dashed",
    cancelled: "bg-zinc-200 text-zinc-400 line-through",
  },
};

export default function CalendarEventBlock({
  calendarEvent,
  top,
  height,
  link,
  onEdit,
}: Props) {
  const isInquiry = calendarEvent.source === "inquiry";
  const colorClass = STATUS_STYLES[calendarEvent.source][calendarEvent.status];
  const isShort = height < 26;

  const spaceName = (() => {
    if (!calendarEvent.spaces || calendarEvent.spaces.length === 0) return null;
    if (calendarEvent.spaces?.length > 1) {
      return `Prostory: ${calendarEvent.spaces.length}`;
    } else if (typeof calendarEvent.spaces[0] !== "string") {
      return calendarEvent.spaces[0].name;
    }
  })();

  const sharedClassName = `absolute left-0.5 right-0.5 rounded-lg overflow-hidden px-1.5 py-1 transition-all ${colorClass} cursor-pointer hover:brightness-95`;
  const sharedStyle = { top, height: Math.max(height, 14) };

  const icon = isInquiry ? (
    <MessageSquare className="w-2.5 h-2.5 opacity-60 shrink-0" />
  ) : (
    <PenLine className="w-2.5 h-2.5 opacity-60 shrink-0" />
  );

  const inner = (
    <>
      <div className="flex items-start justify-between gap-0.5">
        <p className="text-xs font-semibold leading-tight truncate">
          {calendarEvent.name}
        </p>
        {icon}
      </div>
      {!isShort && (
        <p className="text-[11px] opacity-70 truncate leading-tight mt-0.5">
          {format(parseISO(calendarEvent.startsAt), "HH:mm")}
          {" – "}
          {format(parseISO(calendarEvent.endsAt), "HH:mm")}
          {spaceName ? ` · ${spaceName}` : ""}
        </p>
      )}
    </>
  );

  if (link) {
    return (
      <Link
        data-event-block="true"
        href={link}
        onClick={(e) => e.stopPropagation()}
        title={calendarEvent.name}
        className={sharedClassName}
        style={sharedStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      data-event-block="true"
      title={calendarEvent.name}
      className={sharedClassName}
      style={sharedStyle}
      onClick={(e) => {
        e.stopPropagation();
        onEdit?.();
      }}
    >
      {inner}
    </div>
  );
}
