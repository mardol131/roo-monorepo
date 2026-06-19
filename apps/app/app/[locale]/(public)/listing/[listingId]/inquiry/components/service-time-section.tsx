"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import type { Variant } from "@roo/common";
import EventTimeline from "./event-timeline";

type VariantDuration = NonNullable<Variant["duration"]>;

const DURATION_PRESETS: { label: string; minutes: number | null }[] = [
  { label: "30 min", minutes: 30 },
  { label: "1 hod", minutes: 60 },
  { label: "1,5 hod", minutes: 90 },
  { label: "2 hod", minutes: 120 },
  { label: "Celý event", minutes: null },
];

function addMinutesToIso(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

export default function ServiceTimeSection({
  duration,
  eventStart,
  eventEnd,
  isOneTime,
}: {
  duration?: VariantDuration;
  eventStart?: string;
  eventEnd?: string;
  isOneTime: boolean;
}) {
  const { serviceTime, setServiceTime, eventData } = useOrderStore();
  // eventData used only as fallback when caller doesn't pass explicit eventStart/eventEnd

  const effectiveStart = eventStart ?? eventData?.date?.start ?? undefined;
  const effectiveEnd = eventEnd ?? eventData?.date?.end ?? undefined;

  const hasExactDuration =
    !!duration?.hasExactDuration && !!duration.exactDurationMinutes;

  const activeDurationMinutes =
    serviceTime?.startTime && serviceTime?.endTime
      ? Math.round(
          (new Date(serviceTime.endTime).getTime() -
            new Date(serviceTime.startTime).getTime()) /
            60_000,
        )
      : null;

  const isWholeEvent =
    !!serviceTime?.startTime &&
    !!serviceTime?.endTime &&
    !!effectiveStart &&
    !!effectiveEnd &&
    serviceTime.startTime === effectiveStart &&
    serviceTime.endTime === effectiveEnd;

  function applyPreset(minutes: number | null) {
    if (minutes === null) {
      if (effectiveStart && effectiveEnd) {
        setServiceTime({ startTime: effectiveStart, endTime: effectiveEnd });
      }
      return;
    }
    if (!serviceTime?.startTime) return;
    setServiceTime({
      startTime: serviceTime.startTime,
      endTime: addMinutesToIso(serviceTime.startTime, minutes),
    });
  }

  function handleStartChange(value: string | null) {
    if (!value) {
      setServiceTime({ startTime: undefined, endTime: undefined });
      return;
    }
    if (hasExactDuration) {
      setServiceTime({
        startTime: value,
        endTime: addMinutesToIso(value, duration!.exactDurationMinutes!),
      });
      return;
    }
    // Preserve current duration when shifting start time
    const endTime =
      activeDurationMinutes && activeDurationMinutes > 0
        ? addMinutesToIso(value, activeDurationMinutes)
        : serviceTime?.endTime;
    setServiceTime({ startTime: value, endTime });
  }

  const visiblePresets = DURATION_PRESETS.filter(
    (p) =>
      p.minutes === null ||
      !duration?.maxDurationMinutes ||
      p.minutes <= duration.maxDurationMinutes,
  );

  if (isOneTime) {
    return (
      <FormSection
        icon="Clock"
        title="Čas příjezdu"
        subtitle="Kdy má dodavatel přijet?"
      >
        <DateTimeInput
          label="Čas příjezdu"
          value={serviceTime?.arrivalTime ?? null}
          onChange={(v) => setServiceTime({ arrivalTime: v ?? undefined })}
          isRequired
          min={effectiveStart}
        />
        <EventTimeline
          eventStart={effectiveStart}
          eventEnd={effectiveEnd}
          serviceStart={serviceTime?.arrivalTime}
        />
      </FormSection>
    );
  }

  return (
    <FormSection
      icon="Clock"
      title="Čas a délka"
      subtitle="Specifikujte, kdy chcete dodavatele využít"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <DateTimeInput
            label="Od"
            value={serviceTime?.startTime ?? null}
            onChange={handleStartChange}
            isRequired
            min={effectiveStart}
          />
          <DateTimeInput
            label="Do"
            value={serviceTime?.endTime ?? null}
            onChange={(v) => {
              if (!hasExactDuration) {
                setServiceTime({
                  startTime: serviceTime?.startTime,
                  endTime: v ?? undefined,
                });
              }
            }}
            min={serviceTime?.startTime}
            isRequired
          />
        </div>

        <EventTimeline
          eventStart={effectiveStart}
          eventEnd={effectiveEnd}
          serviceStart={serviceTime?.startTime}
          serviceEnd={serviceTime?.endTime}
        />

        <div className="flex flex-wrap gap-2">
          {visiblePresets.map((preset) => {
            const isActive =
              preset.minutes === null
                ? isWholeEvent
                : activeDurationMinutes === preset.minutes && !isWholeEvent;
            const isDisabled =
              preset.minutes !== null
                ? !serviceTime?.startTime
                : !effectiveStart || !effectiveEnd;

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.minutes)}
                disabled={isDisabled}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isActive
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {hasExactDuration && (
          <Text variant="caption" color="secondary">
            Délka je pevně stanovena na {duration!.exactDurationMinutes} minut.
          </Text>
        )}
        {!hasExactDuration && duration?.maxDurationMinutes && (
          <Text variant="caption" color="secondary">
            Max. délka: {duration.maxDurationMinutes} minut
          </Text>
        )}
      </div>
    </FormSection>
  );
}
