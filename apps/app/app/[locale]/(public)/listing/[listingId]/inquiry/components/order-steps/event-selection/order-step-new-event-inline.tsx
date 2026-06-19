"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Button from "@/app/components/ui/atoms/button";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import GuestsInput from "@/app/components/ui/atoms/inputs/guests-input";
import LocationInput from "@/app/components/ui/atoms/inputs/location-input";
import PhoneInput from "@/app/components/ui/atoms/inputs/phone-input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import { useAuth } from "@/app/context/auth/auth-context";
import { useCities } from "@/app/react-query/cities/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import type { EventFormInputs } from "@/app/components/forms/events/new-event-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import Text from "@/app/components/ui/atoms/text";

export type NewEventFormProps = {
  control: Control<EventFormInputs>;
  errors: FieldErrors<EventFormInputs>;
  watch: UseFormWatch<EventFormInputs>;
  register: UseFormRegister<EventFormInputs>;
  setValue: UseFormSetValue<EventFormInputs>;
};

type Section = "basic" | "location-contact";

export default function OrderStepNewEventInline({
  section,
  control,
  errors,
  watch,
  register,
  setValue,
}: NewEventFormProps & { section: Section }) {
  const { user } = useAuth();
  const { data: filters } = useFilterOptions();
  const [eventTypeQuery, setEventTypeQuery] = useState("");
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  const selectedDistrictId = watch("locationDistrict")?.id;
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const prevDistrictIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (selectedDistrictId !== prevDistrictIdRef.current) {
      if (prevDistrictIdRef.current !== undefined) {
        setValue("locationCity", null);
      }
      prevDistrictIdRef.current = selectedDistrictId;
    }
  }, [selectedDistrictId, setValue]);

  const { data: cities } = useCities({
    query: selectedDistrictId
      ? { district: { equals: selectedDistrictId } }
      : undefined,
    enabled: !!selectedDistrictId,
  });
  const cityOptions =
    cities?.docs?.map((c) => ({ id: c.id, name: c.name })) ?? [];

  const normalizeStr = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const filteredEventTypes = (filters?.eventTypes ?? []).filter((et) =>
    normalizeStr(et.name).includes(normalizeStr(eventTypeQuery)),
  );

  const fillContactFromUser = () => {
    if (!user) return;
    setValue("contactPerson.name", `${user.firstName} ${user.lastName}`, {
      shouldValidate: true,
    });
    setValue("contactPerson.email", user.email, { shouldValidate: true });
    if (user.phone?.countryCode)
      setValue("contactPerson.phone.countryCode", user.phone.countryCode, {
        shouldValidate: true,
      });
    if (user.phone?.number)
      setValue("contactPerson.phone.number", user.phone.number, {
        shouldValidate: true,
      });
  };

  if (section === "basic") {
    return (
      <FormSection
        icon="Smile"
        title="Základní informace"
        subtitle="Název, typ a termín události"
        error={
          !!errors.name ||
          !!errors.eventType ||
          !!errors.guests ||
          !!errors.startDate ||
          !!errors.endDate
        }
      >
        <Input
          label="Název události"
          isRequired
          inputProps={{
            ...register("name"),
          }}
          placeholder="Firemní večírek 2025"
          error={errors.name?.message}
        />
        <Controller
          name="eventType"
          control={control}
          render={({ field }) => (
            <SearchInput
              label="Typ události"
              isRequired
              options={filteredEventTypes}
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
        <Controller
          name="guests"
          control={control}
          render={({ field }) => (
            <GuestsInput
              isRequired
              label="Počet hostů"
              value={field.value}
              onChange={field.onChange}
              error={errors.guests?.adults?.message ?? errors.guests?.message}
            />
          )}
        />
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
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Místo konání ───────────────────────────────────────────────────── */}
      <FormSection
        icon="MapPin"
        title="Místo konání"
        subtitle="Okres a město události"
        error={
          !!(
            errors.locationDistrict?.root?.message ??
            errors.locationDistrict?.message
          )
        }
      >
        <Controller
          name="locationDistrict"
          control={control}
          render={({ field }) => (
            <LocationInput
              ref={field.ref}
              types={["districts"]}
              value={
                field.value ? { type: "district", ...field.value } : undefined
              }
              onChange={field.onChange}
              onBlur={field.onBlur}
              label="Okres"
              isRequired
              error={errors.locationDistrict?.message}
            />
          )}
        />
        <div
          className={
            !selectedDistrictId ? "opacity-50 pointer-events-none" : undefined
          }
        >
          <Controller
            name="locationCity"
            control={control}
            render={({ field }) => (
              <SearchInput
                label="Město"
                placeholder={
                  selectedDistrictId ? "Vyberte město" : "Nejprve vyberte okres"
                }
                options={cityOptions}
                selectedOption={field.value ?? undefined}
                onSelect={field.onChange}
                onClear={() => field.onChange(null)}
                type="dropdown"
                ref={field.ref}
                name={field.name}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
        <Button
          text={
            showLocationDetails
              ? "Skrýt podrobnosti"
              : "Vyplnit podrobnosti místa"
          }
          version="plain"
          size="xs"
          iconLeft={showLocationDetails ? "ChevronUp" : "ChevronDown"}
          onClick={() => setShowLocationDetails((v) => !v)}
          className="self-start"
        />

        {showLocationDetails && (
          <div className="flex flex-col gap-3">
            <Input
              label="Adresa"
              inputProps={{
                ...register("locationAddress"),
                placeholder: "Ulice a číslo popisné",
              }}
              error={errors.locationAddress?.message}
            />
            <Controller
              name="locationSpaceType"
              control={control}
              render={({ field }) => (
                <SearchInput
                  label="Typ prostoru"
                  placeholder="Vyberte typ prostoru"
                  options={filters?.spaceTypes ?? []}
                  selectedOption={field.value ?? undefined}
                  onSelect={field.onChange}
                  onClear={() => field.onChange(null)}
                  type="dropdown"
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
        )}
      </FormSection>

      {/* ── Kontaktní osoba ────────────────────────────────────────────────── */}
      <FormSection
        icon="Phone"
        title="Kontaktní osoba (bude sdíleno s dodavatelem)"
        subtitle="Kdo bude k zastižení ohledně události"
        error={!!errors.contactPerson?.name || !!errors.contactPerson?.email}
        headerRightComponent={
          <Button
            text="Doplnit z profilu"
            version="outlined"
            size="xs"
            onClick={fillContactFromUser}
          />
        }
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
    </div>
  );
}
