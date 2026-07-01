"use client";

import Text from "@/app/components/ui/atoms/text";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

const HOUR_MS = 3_600_000;
const QUARTER_HOUR_MS = 900_000;
const MAX_QUARTER_MARKS = 96;

function formatDateTime(ms: number): string {
  return format(new Date(ms), "d. M. yyyy H:mm", { locale: cs });
}

function formatServiceLabel(ms: number, referenceMs: number): string {
  const date = new Date(ms);
  const reference = new Date(referenceMs);
  const sameDay =
    date.getDate() === reference.getDate() &&
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear();
  return format(date, sameDay ? "H:mm" : "d. M. H:mm", { locale: cs });
}

type TickKind = "quarterHour" | "hour";

const TICK_STYLE: Record<TickKind, string> = {
  quarterHour: "h-2 bg-zinc-200",
  hour: "h-3 bg-zinc-300",
};

type AxisTick = { ms: number; kind: TickKind };

// Heuristic minimum horizontal gap (in % of axis width) for two adjacent
// labels to fit side by side without visually overlapping.
const MIN_LABEL_GAP_PERCENT = 16;

function labelsWouldOverlap(
  leftPercent: number,
  rightPercent: number,
): boolean {
  return rightPercent - leftPercent < MIN_LABEL_GAP_PERCENT;
}

// Quarter-hour gradations across the axis; whole hours are tagged separately
// so they render as a taller tick. Thinned out for very wide axes so the line
// never has to render an unreasonable number of marks. Marks landing too
// close to a protected instant (the event's own start/end, which get their
// own labeled dot) are dropped so an unlabeled mark never crowds a labeled one.
function buildQuarterHourMarks(
  axisStartMs: number,
  axisEndMs: number,
  protectedMs: number[],
): number[] {
  const durationMs = axisEndMs - axisStartMs;
  if (!(durationMs > 0)) return [];

  const totalQuarters = durationMs / QUARTER_HOUR_MS;
  const stepQuarters = Math.max(
    1,
    Math.ceil(totalQuarters / MAX_QUARTER_MARKS),
  );
  const stepMs = stepQuarters * QUARTER_HOUR_MS;
  const minGapMs = stepMs / 2;
  const firstQuarterMs =
    Math.ceil(axisStartMs / QUARTER_HOUR_MS) * QUARTER_HOUR_MS;

  const marks: number[] = [];
  let quarterIndex = 0;
  for (
    let t = firstQuarterMs;
    t < axisEndMs;
    t += QUARTER_HOUR_MS, quarterIndex++
  ) {
    if (quarterIndex % stepQuarters !== 0) continue;
    if (protectedMs.some((p) => Math.abs(t - p) < minGapMs)) continue;
    marks.push(t);
  }
  return marks;
}

function buildTicks(
  axisStartMs: number,
  axisEndMs: number,
  eventStartMs: number,
  eventEndMs: number,
): AxisTick[] {
  return buildQuarterHourMarks(axisStartMs, axisEndMs, [
    eventStartMs,
    eventEndMs,
  ]).map((ms) => ({ ms, kind: ms % HOUR_MS === 0 ? "hour" : "quarterHour" }));
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
  const selEndMs =
    hasSelection && !isPoint ? new Date(rangeEnd!).getTime() : null;

  // Shared axis stretches to whichever is wider — the event or the selected service time —
  // so an overflowing selection visibly extends past the event's own dots instead of being clipped.
  const axisStartMs = Math.min(eventStartMs, selStartMs ?? eventStartMs);
  const axisEndMs = Math.max(eventEndMs, selEndMs ?? selStartMs ?? eventEndMs);
  const axisDurationMs = axisEndMs - axisStartMs;

  const toPercent = (ms: number) =>
    axisDurationMs > 0 ? ((ms - axisStartMs) / axisDurationMs) * 100 : 0;

  const selLeft = hasSelection ? toPercent(selStartMs!) : 0;
  const selRight = hasSelection ? toPercent(selEndMs ?? selStartMs!) : 0;

  const eventLeft = toPercent(eventStartMs);
  const eventRight = toPercent(eventEndMs);

  const ticks = buildTicks(axisStartMs, axisEndMs, eventStartMs, eventEndMs);

  // When two adjacent labels would overlap, keep only the later one.
  const hideSelStartLabel =
    hasSelection && !isPoint && labelsWouldOverlap(selLeft, selRight);
  const hideEventStartLabel = labelsWouldOverlap(eventLeft, eventRight);

  return (
    <div className="flex flex-col gap-1 pb-4">
      {/* Labels for the selected service time, above its own indicator */}
      {hasSelection && (
        <div className="flex items-start gap-3">
          <div className="w-16 shrink-0" />
          <div className="relative flex-1 h-5">
            {!hideSelStartLabel && (
              <div
                className="absolute top-0 flex flex-col items-center"
                style={{
                  left: `${selLeft}%`,
                  transform:
                    selStartMs === axisStartMs
                      ? "translateX(0)"
                      : "translateX(-50%)",
                }}
              >
                <Text
                  variant="caption"
                  color="success"
                  className="whitespace-nowrap"
                >
                  {formatServiceLabel(selStartMs!, axisStartMs)}
                </Text>
              </div>
            )}
            {!isPoint && (
              <div
                className="absolute top-0 flex flex-col items-center"
                style={{
                  left: `${selRight}%`,
                  transform:
                    selEndMs === axisEndMs
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
                }}
              >
                <Text
                  variant="caption"
                  color="success"
                  className="whitespace-nowrap"
                >
                  {formatServiceLabel(selEndMs!, axisStartMs)}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend + selected service time, drawn above the axis: dot — line — dot */}
      <div className="flex items-center gap-3">
        <div className="w-16 shrink-0 flex items-center justify-end gap-1.5">
          <Text
            variant="label-sm"
            color="secondary"
            className="whitespace-nowrap"
          >
            Služba
          </Text>
          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
        </div>
        <div className="relative flex-1 h-3">
          {hasSelection && !isPoint && (
            <>
              <div
                className="absolute z-5 top-1/2 -translate-y-1/2 h-1 bg-success"
                style={{
                  left: `${selLeft}%`,
                  width: `${Math.max(selRight - selLeft, 0)}%`,
                }}
              />
              <div
                className="absolute z-5 top-1/2 w-2 h-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-success"
                style={{ left: `${selLeft}%` }}
              />
              <div
                className="absolute z-5 top-1/2 w-2 h-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-success"
                style={{ left: `${selRight}%` }}
              />
            </>
          )}
          {hasSelection && isPoint && (
            <div
              className="absolute z-5 top-1/2 w-2 h-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-success"
              style={{ left: `${selLeft}%` }}
            />
          )}
        </div>
      </div>

      {/* Legend + shared quarter-hour axis */}
      <div className="flex items-start gap-3">
        <div className="w-16 shrink-0 flex items-start justify-end gap-1.5">
          <Text
            variant="label-sm"
            color="secondary"
            className="whitespace-nowrap"
          >
            Událost
          </Text>
          <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
        </div>
        <div className="relative flex-1 h-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-zinc-200" />

          {/* Event, marked directly on the axis: dot — line — dot, above the ticks */}
          <div
            className="absolute z-5 top-0 -translate-y-1/2 h-1 bg-secondary"
            style={{
              left: `${eventLeft}%`,
              width: `${Math.max(eventRight - eventLeft, 0)}%`,
            }}
          />
          <div
            className="absolute z-5 top-0 w-2 h-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-secondary"
            style={{ left: `${eventLeft}%` }}
          />
          <div
            className="absolute z-5 top-0 w-2 h-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-secondary"
            style={{ left: `${eventRight}%` }}
          />

          {ticks.map((tick) => (
            <div
              key={tick.ms}
              className="absolute top-0"
              style={{
                left: `${toPercent(tick.ms)}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className={`w-px ${TICK_STYLE[tick.kind]}`} />
            </div>
          ))}

          {/* Event start/end labels, anchored to the event's own dots */}
          {!hideEventStartLabel && (
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{
                left: `${eventLeft}%`,
                transform:
                  eventStartMs === axisStartMs
                    ? "translateX(0)"
                    : "translateX(-50%)",
              }}
            >
              <Text
                variant="caption"
                color="secondary"
                className="mt-2 whitespace-nowrap"
              >
                {formatDateTime(eventStartMs)}
              </Text>
              <Text
                variant="caption"
                color="secondary"
                className="whitespace-nowrap"
              >
                Začátek
              </Text>
            </div>
          )}
          <div
            className="absolute top-0 flex flex-col items-center"
            style={{
              left: `${eventRight}%`,
              transform:
                eventEndMs === axisEndMs
                  ? "translateX(-100%)"
                  : "translateX(-50%)",
            }}
          >
            <Text
              variant="caption"
              color="secondary"
              className="mt-2 whitespace-nowrap"
            >
              {formatDateTime(eventEndMs)}
            </Text>
            <Text
              variant="caption"
              color="secondary"
              className="whitespace-nowrap"
            >
              Konec
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
