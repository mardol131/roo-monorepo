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
import { useCreateEvent, useUpdateEvent } from "@/app/react-query/events/hooks";
import { Event } from "@roo/common";
import { Building2, Info, MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, FieldErrors, Resolver, useForm } from "react-hook-form";
import Text from "../ui/atoms/text";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { AlertSection } from "../ui/molecules/alert-section";
import PhoneInput from "../ui/atoms/inputs/phone-input";
import { useAuth } from "@/app/context/auth/auth-context";

// ── TOC ────────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basic: { id: "section-basic", title: "Základní informace", icon: "Smile" },
  dates: { id: "section-dates", title: "Termín konání", icon: "Calendar" },
  budget: { id: "section-budget", title: "Rozpočet", icon: "Banknote" },
  contact: { id: "section-contact", title: "Kontaktní osoba", icon: "Phone" },
  location: { id: "section-location", title: "Místo konání", icon: "MapPin" },
};

const EVENT_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Základní",
    sections: [S.basic, S.dates, S.budget, S.contact],
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
  contactPerson: {
    name: string;
    email: string;
    phone: { countryCode: string; number: string };
  };
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
  if (!values.contactPerson?.name)
    e.contactPerson = {
      ...e.contactPerson,
      name: { type: "required", message: "Jméno kontaktní osoby je povinné" },
    };
  if (!values.contactPerson?.email)
    e.contactPerson = {
      ...e.contactPerson,
      email: { type: "required", message: "Email kontaktní osoby je povinný" },
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

export type { FormInputs as EventFormInputs };

function eventToFormInputs(event: Event): Partial<FormInputs> {
  const loc = event.location;
  const isCustom = loc?.type === "custom";

  return {
    name: event.name,
    icon: event.icon ?? undefined,
    eventType:
      typeof event.eventType === "string"
        ? { id: event.eventType, name: "" }
        : { id: event.eventType.id, name: event.eventType.name },
    budget: event.budget ?? undefined,
    startDate: event.date.start,
    endDate: event.date.end,
    guests: {
      adults: event.guests.adults,
      children: event.guests.children,
      ztp: event.guests.ztp ?? false,
      pets: event.guests.pets ?? false,
    },
    contactPerson: {
      name: event.contactPerson?.name ?? "",
      email: event.contactPerson?.email ?? "",
      phone: {
        countryCode: event.contactPerson?.phone?.countryCode ?? "420",
        number: event.contactPerson?.phone?.number ?? "",
      },
    } as FormInputs["contactPerson"],
    locationType: loc?.type ?? "custom",
    locationCity:
      isCustom && loc?.city
        ? typeof loc.city === "string"
          ? { id: loc.city, name: "" }
          : { id: loc.city.id, name: loc.city.name }
        : undefined,
    locationAddress: isCustom ? (loc?.address ?? undefined) : undefined,
    locationSpaceType:
      isCustom && loc?.spaceType
        ? typeof loc.spaceType === "string"
          ? { id: loc.spaceType, name: "" }
          : { id: loc.spaceType.id, name: loc.spaceType.name }
        : undefined,
    locationDescription: isCustom ? (loc?.description ?? undefined) : undefined,
  };
}

interface NewEventFormProps {
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
  hideToc?: boolean;
  type?: "create-full" | "create-compact" | "edit";
  edditedEvent?: Event;
  hasConfirmedInquiries?: boolean;
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
  type = "create-full",
  edditedEvent,
  hasConfirmedInquiries = false,
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
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver,
    defaultValues: {
      icon: "Calendar",
      locationType: "custom",
      guests: { adults: 0, children: 0, ztp: false, pets: false },
      contactPerson: {
        name: "",
        email: "",
        phone: { countryCode: "420", number: "" },
      },
      ...(edditedEvent ? eventToFormInputs(edditedEvent) : {}),
    },
  });
  const { user } = useAuth();

  const { data: filters } = useFilterOptions();

  const [eventTypeQuery, setEventTypeQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const { data: cities } = useCities({
    limit: 15,
    query: cityQuery ? { name: { contains: cityQuery } } : undefined,
  });

  const { mutate: createEvent } = useCreateEvent();
  const { mutate: updateEvent } = useUpdateEvent({});

  const normalizeStr = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filteredEventTypes = filters?.eventTypes.filter((et) =>
    normalizeStr(et.name).includes(normalizeStr(eventTypeQuery)),
  );

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const locationType = watch("locationType");

  const locked = type === "edit" && hasConfirmedInquiries;

  const buildLocation = (data: FormInputs) =>
    data.locationType === "custom"
      ? {
          type: "custom" as const,
          city: data.locationCity!.id,
          address: data.locationAddress,
          spaceType: data.locationSpaceType?.id,
          description: data.locationDescription,
        }
      : { type: "venue" as const };

  const onCreateSubmit = (data: FormInputs) => {
    createEvent(
      {
        name: data.name,
        icon: data.icon,
        eventType: data.eventType.id,
        budget: data.budget,
        date: { start: data.startDate, end: data.endDate },
        guests: data.guests,
        contactPerson: {
          ...data.contactPerson,
          phone: {
            countryCode: data.contactPerson.phone.countryCode as "420",
            number: data.contactPerson.phone.number,
          },
        },
        sharing: {},
        location: buildLocation(data),
        status: "active",
      },
      {
        onSuccess: ({ doc }) => {
          if (onSuccess) {
            onSuccess(doc);
          } else {
            router.push({ pathname: "/user-profile/events" });
          }
        },
      },
    );
  };

  const onUpdateSubmit = (data: FormInputs) => {
    if (!edditedEvent) return;
    updateEvent(
      {
        id: edditedEvent.id,
        data: {
          name: data.name,
          icon: data.icon,
          eventType: data.eventType.id,
          budget: data.budget,
          date: { start: data.startDate, end: data.endDate },
          guests: data.guests,
          contactPerson: {
            ...data.contactPerson,
            phone: {
              countryCode: data.contactPerson.phone.countryCode as "420",
              number: data.contactPerson.phone.number,
            },
          },
          location: buildLocation(data),
        },
      },
      {
        onSuccess: (doc) => {
          if (onSuccess) {
            onSuccess(doc);
          } else {
            router.push({
              pathname: "/user-profile/events/[eventId]",
              params: {
                eventId: edditedEvent.id,
              },
            });
          }
        },
      },
    );
  };

  const onSubmit = type === "edit" ? onUpdateSubmit : onCreateSubmit;

  const fillContactInfoFromUserHandler = useCallback(() => {
    if (!user) return;
    const name = `${user.firstName} ${user.lastName}`;
    const email = user.email;
    const countryCode = user.phone?.countryCode;
    const number = user.phone?.number;
    setValue("contactPerson.name", name);
    setValue("contactPerson.email", email);
    if (countryCode && number) {
      setValue("contactPerson.phone.countryCode", countryCode);
      setValue("contactPerson.phone.number", number);
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <div className="flex w-full flex-col gap-4">
        {/* ── 1. Základní informace ──────────────────────────────────────────── */}
        <FormSection
          error={
            !!errors.name?.message ||
            !!errors.icon?.message ||
            !!errors.eventType?.message ||
            !!errors.guests
          }
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          subtitle={S.basic.subTitle}
          color={textColor}
          surfaceColor={bgSurfaceColor}
        >
          <div
            className={`flex gap-4 ${type !== "create-compact" ? "flex-col" : ""}`}
          >
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
            {type !== "create-compact" && (
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
                    options={filteredEventTypes ?? []}
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

          <div
            className={locked ? "pointer-events-none opacity-50" : undefined}
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
          </div>

          {type === "create-compact" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DateTimeInput
                    containerRef={field.ref}
                    isRequired
                    max={endDate}
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
        {type !== "create-compact" && (
          <div
            className={locked ? "pointer-events-none opacity-50" : undefined}
          >
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
                      max={endDate}
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
          </div>
        )}

        {/* ── 3. Rozpočet ────────────────────────────────────────────────────── */}
        {type !== "create-compact" && (
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

        {/* ── 4. Kontaktní osoba ─────────────────────────────────────────────── */}
        <FormSection
          error={!!errors.contactPerson?.name || !!errors.contactPerson?.email}
          id={S.contact.id}
          icon={S.contact.icon}
          title={S.contact.title}
          subtitle={S.contact.subTitle}
          color={textColor}
          headerRightComponent={
            <Button
              text="Doplnit"
              version="outlined"
              size="xs"
              onClick={fillContactInfoFromUserHandler}
            />
          }
          surfaceColor={bgSurfaceColor}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jméno"
              isRequired
              inputProps={{
                ...register("contactPerson.name"),
                placeholder: "Jan Novák",
              }}
              error={errors.contactPerson?.name?.message}
            />
            <Input
              label="Email"
              isRequired
              inputProps={{
                ...register("contactPerson.email"),
                type: "email",
                placeholder: "jan@example.com",
              }}
              error={errors.contactPerson?.email?.message}
            />
          </div>
          <PhoneInput
            label="Telefon"
            control={control}
            countryCodeName="contactPerson.phone.countryCode"
            countryCodeError={errors.contactPerson?.phone?.countryCode?.message}
            numberError={errors.contactPerson?.phone?.number?.message}
            phoneNumberProps={{ ...register("contactPerson.phone.number") }}
          />
        </FormSection>

        {locked && (
          <AlertSection
            icon={Info}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            borderColor="border-zinc-200"
            bgColor="bg-amber-50"
            title="Část polí nelze upravit"
            text="Termín, počet hostů a místo konání jsou zamčeny, protože událost má potvrzené poptávky. Změna by mohla narušit plánování dodavatelů."
          />
        )}

        {/* ── 5. Místo konání ────────────────────────────────────────────────── */}
        <div className={locked ? "pointer-events-none opacity-50" : undefined}>
          <FormSection
            error={
              !!(
                errors.locationCity?.root?.message ??
                errors.locationCity?.message
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
                        onClick={() => {
                          field.onChange(option.value);
                          trigger(["locationCity", "locationSpaceType"]);
                        }}
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
                        options={filters?.spaceTypes ?? []}
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
        </div>
        {/* ── Submit ────────────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            htmlType="button"
            text="Zrušit"
            onClick={() => (onCancel ? onCancel() : router.back())}
            version="plain"
          />
          <Button
            text={type === "edit" ? "Uložit změny" : "Vytvořit událost"}
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
          buttonText={type === "edit" ? "Uložit změny" : "Vytvořit událost"}
          sticky
        />
      )}
    </form>
  );
}
