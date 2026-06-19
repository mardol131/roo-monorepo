"use client";

import Text from "@/app/components/ui/atoms/text";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

function formatDurationLabel(ms: number): string {
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function formatDateTime(ms: number): string {
  return format(new Date(ms), "d. M. yyyy H:mm", { locale: cs });
}

export default function EventTimeline({
  eventStart,
  eventEnd,
  serviceStart,
  serviceEnd,
}: {
  eventStart?: string;
  eventEnd?: string;
  serviceStart?: string;
  serviceEnd?: string;
}) {
  if (!eventStart || !eventEnd) return null;

  const eventStartMs = new Date(eventStart).getTime();
  const eventEndMs = new Date(eventEnd).getTime();
  if (!(eventEndMs > eventStartMs)) return null;

  const isPoint = !!serviceStart && !serviceEnd;
  const rangeStart = serviceStart;
  const rangeEnd = serviceEnd ?? serviceStart;
  const hasSelection = !!rangeStart && !!rangeEnd;

  const selStartMs = hasSelection ? new Date(rangeStart!).getTime() : null;
  const selEndMs = hasSelection ? new Date(rangeEnd!).getTime() : null;

  // Shared axis stretches to whichever is wider — the event or the selected service time —
  // so an overflowing selection visibly extends past the event segment instead of being clipped.
  const axisStartMs = Math.min(eventStartMs, selStartMs ?? eventStartMs);
  const axisEndMs = Math.max(eventEndMs, selEndMs ?? eventEndMs);
  const axisDurationMs = axisEndMs - axisStartMs;

  const toPercent = (ms: number) =>
    axisDurationMs > 0 ? ((ms - axisStartMs) / axisDurationMs) * 100 : 0;

  const eventLeft = toPercent(eventStartMs);
  const eventWidth = Math.max(toPercent(eventEndMs) - eventLeft, 0);

  const overflowsBefore = hasSelection && selStartMs! < eventStartMs;
  const overflowsAfter = hasSelection && selEndMs! > eventEndMs;
  const isOverflowing = overflowsBefore || overflowsAfter;

  const selLeft = hasSelection ? toPercent(selStartMs!) : 0;
  const selWidth = hasSelection
    ? Math.max(toPercent(selEndMs!) - selLeft, 0)
    : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-2">
        <Text variant="label-sm" color="secondary">
          Poptávka
        </Text>
        <div className="relative h-3 rounded-full bg-zinc-100">
          {hasSelection && !isPoint && (
            <div
              className="absolute inset-y-0 rounded-full bg-primary"
              style={{
                left: `${selLeft}%`,
                width: `${selWidth}%`,
                minWidth: "6px",
              }}
            />
          )}
          {hasSelection && isPoint && (
            <div
              className="absolute top-1/2 w-3 h-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-primary"
              style={{ left: `${selLeft}%` }}
            />
          )}
        </div>

        <Text variant="label-sm" color="secondary">
          Event
        </Text>
        <div className="relative h-3 rounded-full bg-zinc-100">
          <div
            className="absolute inset-y-0 rounded-full bg-secondary"
            style={{ left: `${eventLeft}%`, width: `${eventWidth}%` }}
          />
        </div>

        <div />
        <div className="flex justify-between">
          <Text variant="caption" color="secondary">
            {formatDateTime(axisStartMs)}
          </Text>
          <Text variant="caption" color="secondary">
            {formatDateTime(axisEndMs)}
          </Text>
        </div>
      </div>

      {/* {isOverflowing && (
        <Text variant="caption" color="warning">
          {[
            overflowsBefore &&
              `Přesahuje začátek eventu o ${formatDurationLabel(eventStartMs - selStartMs!)}`,
            overflowsAfter &&
              `Přesahuje konec eventu o ${formatDurationLabel(selEndMs! - eventEndMs)} (Lze pokračovat)`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Text>
      )} */}
    </div>
  );
}
