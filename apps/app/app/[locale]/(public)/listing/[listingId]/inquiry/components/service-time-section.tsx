"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import EventTimeline from "./event-timeline";
import Button from "@/app/components/ui/atoms/button";
import { useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  useWatch,
} from "react-hook-form";
import type { CustomRequestFormData } from "./order-steps/custom-request/custom-request-form-schema";

const DURATION_PRESETS: { label: string; minutes: number | null }[] = [
  { label: "30 min", minutes: 30 },
  { label: "1 hod", minutes: 60 },
  { label: "1,5 hod", minutes: 90 },
  { label: "2 hod", minutes: 120 },
  { label: "5 hod", minutes: 300 },
  { label: "Celý event", minutes: null },
];

function addMinutesToIso(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

export default function ServiceTimeSection({
  durationMinutes,
  eventStart,
  eventEnd,
  isOneTime,
  control,
  setValue,
  errors,
}: {
  /** Pevná délka služby varianty — konec se dopočítá automaticky. */
  durationMinutes?: number;
  eventStart?: string;
  eventEnd?: string;
  isOneTime: boolean;
  control: Control<CustomRequestFormData>;
  setValue: UseFormSetValue<CustomRequestFormData>;
  errors: FieldErrors<CustomRequestFormData>;
}) {
  const { setServiceTime, eventData } = useOrderStore();
  // eventData used only as fallback when caller doesn't pass explicit eventStart/eventEnd
  const [priceAxisVisible, setPriceAxisVisible] = useState(false);

  const serviceTime = useWatch({ control, name: "serviceTime" });

  // Mirror the form value into the order store so price calculation, the
  // preview, and submission (which never see the RHF form) stay in sync.
  useEffect(() => {
    const hasValue =
      !!serviceTime?.arrivalTime ||
      !!serviceTime?.startTime ||
      !!serviceTime?.endTime;
    setServiceTime(hasValue ? serviceTime : null);
  }, [serviceTime, setServiceTime]);

  const effectiveStart = eventStart ?? eventData?.date?.start ?? undefined;
  const effectiveEnd = eventEnd ?? eventData?.date?.end ?? undefined;

  const hasExactDuration = !!durationMinutes;

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
        setValue("serviceTime.startTime", effectiveStart, {
          shouldValidate: true,
        });
        setValue("serviceTime.endTime", effectiveEnd, {
          shouldValidate: true,
        });
      }
      return;
    }
    if (!serviceTime?.startTime) return;
    setValue(
      "serviceTime.endTime",
      addMinutesToIso(serviceTime.startTime, minutes),
      { shouldValidate: true },
    );
  }

  function handleStartChange(value: string | null) {
    if (!value) {
      setValue("serviceTime.startTime", undefined, { shouldValidate: true });
      setValue("serviceTime.endTime", undefined, { shouldValidate: true });
      return;
    }
    if (hasExactDuration) {
      setValue("serviceTime.startTime", value, { shouldValidate: true });
      setValue(
        "serviceTime.endTime",
        addMinutesToIso(value, durationMinutes!),
        { shouldValidate: true },
      );
      return;
    }
    // Preserve current duration when shifting start time
    const endTime =
      activeDurationMinutes && activeDurationMinutes > 0
        ? addMinutesToIso(value, activeDurationMinutes)
        : serviceTime?.endTime;
    setValue("serviceTime.startTime", value, { shouldValidate: true });
    setValue("serviceTime.endTime", endTime, { shouldValidate: true });
  }

  const visiblePresets = DURATION_PRESETS;

  if (isOneTime) {
    return (
      <FormSection
        icon="Clock"
        title="Čas příjezdu"
        subtitle="Kdy má dodavatel přijet?"
        error={!!errors.serviceTime?.arrivalTime?.message}
      >
        <Controller
          control={control}
          name="serviceTime.arrivalTime"
          render={({ field }) => (
            <DateTimeInput
              label="Čas příjezdu"
              value={field.value ?? null}
              onChange={(v) =>
                setValue("serviceTime.arrivalTime", v ?? undefined, {
                  shouldValidate: true,
                })
              }
              isRequired
              min={effectiveStart}
              error={errors.serviceTime?.arrivalTime?.message}
            />
          )}
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
      error={
        !!errors.serviceTime?.startTime?.message ||
        !!errors.serviceTime?.endTime?.message
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name="serviceTime.startTime"
            render={({ field }) => (
              <DateTimeInput
                label="Od"
                value={field.value ?? null}
                onChange={handleStartChange}
                isRequired
                min={effectiveStart}
                error={errors.serviceTime?.startTime?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="serviceTime.endTime"
            render={({ field }) => (
              <DateTimeInput
                label="Do"
                value={field.value ?? null}
                error={errors.serviceTime?.endTime?.message}
                onChange={(v) => {
                  if (!hasExactDuration) {
                    setValue("serviceTime.endTime", v ?? undefined, {
                      shouldValidate: true,
                    });
                  }
                }}
                min={serviceTime?.startTime}
                isRequired
              />
            )}
          />
        </div>

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
              <Button
                text={preset.label}
                key={preset.label}
                htmlType="button"
                size="sm"
                version={isActive ? "primary" : "outlined"}
                onClick={() => applyPreset(preset.minutes)}
                disabled={isDisabled}
                disableResize
              />
            );
          })}
        </div>
        <Button
          text="Zobrazit časovou osu"
          iconLeft={priceAxisVisible ? "ChevronUp" : "ChevronDown"}
          size="sm"
          version="plain"
          className="self-start"
          onClick={() => setPriceAxisVisible(!priceAxisVisible)}
        />
        {priceAxisVisible && (
          <div>
            <EventTimeline
              eventStart={effectiveStart}
              eventEnd={effectiveEnd}
              serviceStart={serviceTime?.startTime}
              serviceEnd={serviceTime?.endTime}
            />
          </div>
        )}
        {hasExactDuration && (
          <Text variant="caption" color="secondary">
            Délka je pevně stanovena na {durationMinutes} minut.
          </Text>
        )}
      </div>
    </FormSection>
  );
}
