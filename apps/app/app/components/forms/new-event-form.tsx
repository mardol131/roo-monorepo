"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import GuestsInput from "@/app/components/ui/atoms/inputs/guests-input";
import IconSelect from "@/app/components/ui/atoms/inputs/icon-select";
import Input from "@/app/components/ui/atoms/inputs/input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
import { useRouter } from "@/app/i18n/navigation";
import { useCities } from "@/app/react-query/cities/hooks";
import { useCreateEvent } from "@/app/react-query/events/hooks";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";
import { useSpaceTypes } from "@/app/react-query/specific/space-types/hooks";
import { Event as RooEvent } from "@roo/common";
import { Building2, MapPin } from "lucide-react";
import { useState } from "react";
import { Controller, FieldErrors, Resolver, useForm } from "react-hook-form";
import Text from "../ui/atoms/text";

// ── TOC ────────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basic: { id: "section-basic", title: "Základní informace", icon: "Smile" },
  dates: { id: "section-dates", title: "Termín konání", icon: "Calendar" },
  guests: { id: "section-guests", title: "Hosté", icon: "Users" },
  budget: { id: "section-budget", title: "Rozpočet", icon: "Banknote" },
  location: { id: "section-location", title: "Místo konání", icon: "MapPin" },
};

const EVENT_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.dates, S.guests, S.budget],
  },
  {
    label: "Lokalita",
    sections: [S.location],
  },
];

// ── Schema ─────────────────────────────────────────────────────────────────────

type FormInputs = {
  name: string;
  icon: string;
  eventType: { id: string; name: string };
  budget?: number;
  startDate: string;
  endDate: string;
  guests: { adults: number; children: number; ztp: boolean; pets: boolean };
  locationType: "custom" | "venue";
  locationCity?: { id: string; name: string } | null;
  locationAddress?: string;
  locationSpaceType?: { id: string; name: string } | null;
  locationDescription?: string;
};

function validate(values: Partial<FormInputs>): FieldErrors<FormInputs> {
  const e: FieldErrors<FormInputs> = {};

  if (!values.name)
    e.name = { type: "required", message: "Název události je povinný" };
  if (!values.icon)
    e.icon = { type: "required", message: "Ikona události je povinná" };
  if (!values.eventType)
    e.eventType = { type: "required", message: "Musíte vybrat typ události" };
  if (!values.startDate)
    e.startDate = { type: "required", message: "Datum začátku je povinný" };
  if (!values.endDate)
    e.endDate = { type: "required", message: "Datum konce je povinný" };
  if (values.startDate && values.endDate && values.endDate < values.startDate)
    e.endDate = {
      type: "custom",
      message: "Datum konce musí být po datu začátku",
    };
  if (!values.guests?.adults || values.guests.adults < 1)
    e.guests = {
      adults: { type: "min", message: "Počet dospělých musí být alespoň 1" },
    };
  if (values.locationType === "custom" && !values.locationCity)
    e.locationCity = { type: "required", message: "Vyberte město" };
  if (values.locationType === "custom" && !values.locationSpaceType)
    e.locationSpaceType = { type: "required", message: "Vyberte typ prostoru" };

  return e;
}

const resolver: Resolver<FormInputs> = (values) => {
  const errors = validate(values);
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

// ── Form ───────────────────────────────────────────────────────────────────────

interface NewEventFormProps {
  onSuccess?: (event: RooEvent) => void;
  onCancel?: () => void;
  hideToc?: boolean;
  compact?: boolean;
  bgSurfaceColor?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  buttonColor?: ButtonProps["version"];
}

export default function NewEventForm({
  onSuccess,
  onCancel,
  hideToc = false,
  compact = false,
  bgSurfaceColor = "bg-event-surface",
  bgColor = "bg-event",
  textColor = "text-event",
  borderColor = "border-event",
  buttonColor = "eventFull",
}: NewEventFormProps) {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver,
    defaultValues: {
      icon: "Calendar",
      locationType: "custom",
      guests: { adults: 0, children: 0, ztp: false, pets: false },
    },
  });

  const [eventTypeQuery, setEventTypeQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  const { data: eventTypes } = useEventTypes({
    limit: 15,
    query: {
      name: { contains: eventTypeQuery },
    },
  });
  const { data: cities } = useCities({
    limit: 15,
    query: cityQuery ? { name: { contains: cityQuery } } : undefined,
  });

  const { data: spaceTypes } = useSpaceTypes({
    limit: 15,
    query: cityQuery ? { name: { contains: cityQuery } } : undefined,
  });

  const { mutate: createEvent } = useCreateEvent();

  const startDate = watch("startDate");
  const locationType = watch("locationType");

  const onSubmit = (data: FormInputs) => {
    createEvent(
      {
        name: data.name,
        icon: data.icon,
        eventType: data.eventType.id,
        budget: data.budget,
        date: { start: data.startDate, end: data.endDate },
        guests: data.guests,
        location:
          data.locationType === "custom"
            ? [
                {
                  blockType: "custom",
                  city: data.locationCity!.id,
                  address: data.locationAddress,
                  spaceType: data.locationSpaceType?.id ?? "other",
                  description: data.locationDescription,
                },
              ]
            : [{ blockType: "venue" }],
        status: "planning",
      },
      {
        onSuccess: ({ doc }) => {
          if (onSuccess) {
            onSuccess(doc);
          } else {
            router.push({
              pathname: "/user-profile/events/[eventId]",
              params: { eventId: doc.id },
            });
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
        {/* ── 1. Základní informace ──────────────────────────────────────────── */}
        <FormSection
          error={
            !!errors.name?.message ||
            !!errors.icon?.message ||
            !!errors.eventType?.message
          }
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          subtitle={S.basic.subTitle}
          color={textColor}
          surfaceColor={bgSurfaceColor}
        >
          <div className={`flex gap-4 ${!compact ? "flex-col" : ""}`}>
            <div className="w-full">
              <Input
                label="Název události"
                isRequired
                inputProps={{
                  ...register("name"),
                  placeholder: "Firemní večírek 2025",
                }}
                error={errors.name?.message}
              />
            </div>
            {!compact && (
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <IconSelect
                    label="Ikona události"
                    defaultIcon="Calendar"
                    activeIconBgColor={bgColor}
                    onSelect={field.onChange}
                    iconsOptions={[
                      "Calendar",
                      "PartyPopper",
                      "Cake",
                      "Tag",
                      "Heart",
                      "GraduationCap",
                      "Music",
                      "Trophy",
                      "Star",
                      "Smile",
                      "Plane",
                      "Balloon",
                      "Car",
                      "Fish",
                      "Coffee",
                      "Gift",
                      "Camera",
                      "Umbrella",
                    ]}
                    error={errors.icon?.message}
                  />
                )}
              />
            )}
            <div className="w-full">
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <SearchInput
                    label="Typ události"
                    isRequired
                    options={eventTypes?.docs ?? []}
                    selectedOption={field.value}
                    onSelect={field.onChange}
                    onClear={() => field.onChange(null)}
                    onSearchQueryChange={setEventTypeQuery}
                    error={errors.eventType?.message}
                    type="dropdown"
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </div>
          </div>
          {compact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DateTimeInput
                    containerRef={field.ref}
                    isRequired
                    label="Začátek události"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.startDate?.message}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DateTimeInput
                    isRequired
                    containerRef={field.ref}
                    label="Konec události"
                    value={field.value}
                    onChange={field.onChange}
                    min={startDate}
                    error={errors.endDate?.message}
                  />
                )}
              />
            </div>
          )}
        </FormSection>
        {/* ── 2. Termín konání ───────────────────────────────────────────────── */}
        {!compact && (
          <FormSection
            error={!!errors.startDate?.message || !!errors.endDate?.message}
            id={S.dates.id}
            icon={S.dates.icon}
            title={S.dates.title}
            subtitle={S.dates.subTitle}
            color={textColor}
            surfaceColor={bgSurfaceColor}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DateTimeInput
                    containerRef={field.ref}
                    isRequired
                    label="Začátek události"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.startDate?.message}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DateTimeInput
                    isRequired
                    containerRef={field.ref}
                    label="Konec události"
                    value={field.value}
                    onChange={field.onChange}
                    min={startDate}
                    error={errors.endDate?.message}
                  />
                )}
              />
            </div>
          </FormSection>
        )}

        {/* ── 3. Hosté ───────────────────────────────────────────────────────── */}
        <FormSection
          error={!!errors.guests}
          id={S.guests.id}
          icon={S.guests.icon}
          title={S.guests.title}
          subtitle={S.guests.subTitle}
          color={textColor}
          surfaceColor={bgSurfaceColor}
        >
          <Controller
            name="guests"
            control={control}
            render={({ field }) => (
              <GuestsInput
                isRequired
                label="Počet hostů"
                value={field.value}
                onChange={field.onChange}
                error={errors.guests?.adults?.message}
              />
            )}
          />
        </FormSection>
        {/* ── 4. Rozpočet ────────────────────────────────────────────────────── */}
        {!compact && (
          <FormSection
            error={!!errors.budget?.message}
            id={S.budget.id}
            icon={S.budget.icon}
            title={S.budget.title}
            subtitle={S.budget.subTitle}
            color={textColor}
            surfaceColor={bgSurfaceColor}
          >
            <Input
              label="Celkový rozpočet (Kč)"
              inputProps={{
                ...register("budget"),
                type: "number",
                placeholder: "0",
              }}
              error={errors.budget?.message}
            />
          </FormSection>
        )}

        {/* ── 5. Místo konání ────────────────────────────────────────────────── */}
        <FormSection
          error={
            !!(
              errors.locationCity?.root?.message ?? errors.locationCity?.message
            ) ||
            !!errors.locationSpaceType?.message ||
            !!errors.locationType?.message
          }
          id={S.location.id}
          icon={S.location.icon}
          title={S.location.title}
          subtitle={S.location.subTitle}
          color={textColor}
          surfaceColor={bgSurfaceColor}
        >
          <Controller
            control={control}
            name="locationType"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <InputLabel label="Typ místa" isRequired />
                <div className="flex flex-col sm:flex-row gap-3">
                  {(
                    [
                      {
                        value: "custom",
                        label: "Vlastní místo",
                        description:
                          "Zadejte adresu nebo popis vlastního místa",
                        icon: MapPin,
                      },
                      {
                        value: "venue",
                        label: "Místo z katalogu",
                        description:
                          "Najdete si místo přímo v katalogu služeb. Jakmile zadáte poptávku a firma poptávku přijme, můžete ji nastavit jako místo konání události.",
                        icon: Building2,
                      },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                        field.value === option.value
                          ? `${borderColor} ${bgSurfaceColor}`
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <option.icon
                          className={`w-4 h-4 ${textColor} shrink-0`}
                        />
                        <Text variant="label-lg" color="textDark">
                          {option.label}
                        </Text>
                      </div>
                      <Text variant="label" color="textLight">
                        {option.description}
                      </Text>
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          {locationType === "custom" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="locationCity"
                  control={control}
                  render={({ field }) => (
                    <SearchInput
                      label="Město"
                      isRequired
                      placeholder="Vyberte město"
                      options={cities?.docs ?? []}
                      selectedOption={field.value ?? undefined}
                      onSelect={field.onChange}
                      onClear={() => field.onChange(null)}
                      error={
                        errors.locationCity?.root?.message ??
                        errors.locationCity?.message
                      }
                      onSearchQueryChange={setCityQuery}
                      type="dropdown"
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <Input
                  label="Adresa"
                  inputProps={{
                    ...register("locationAddress"),
                    placeholder: "Ulice a číslo popisné",
                  }}
                  error={errors.locationAddress?.message}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="locationSpaceType"
                  control={control}
                  render={({ field }) => (
                    <SearchInput
                      label="Typ prostoru"
                      isRequired
                      placeholder="Vyberte typ prostoru"
                      options={spaceTypes?.docs ?? []}
                      selectedOption={field.value ?? undefined}
                      error={errors.locationSpaceType?.message}
                      type="dropdown"
                      onSelect={field.onChange}
                      onClear={() => field.onChange(null)}
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                    />
                  )}
                />

                <Input
                  label="Popis místa"
                  inputProps={{
                    ...register("locationDescription"),
                    placeholder: "Zahrada u rodinného domu…",
                  }}
                  error={errors.locationDescription?.message}
                />
              </div>
            </>
          )}
        </FormSection>
        {/* ── Submit ────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            onClick={() => (onCancel ? onCancel() : router.back())}
            version="plain"
          />
          <Button
            text="Vytvořit událost"
            version={buttonColor}
            htmlType="submit"
          />
        </div>
      </div>

      {!hideToc && (
        <FormToc
          groups={EVENT_FORM_GROUPS}
          textColor={textColor}
          dotColor={bgColor}
          surfaceColor={bgSurfaceColor}
          buttonVersion={buttonColor}
          buttonText="Vytvořit událost"
          sticky
        />
      )}
    </form>
  );
}
