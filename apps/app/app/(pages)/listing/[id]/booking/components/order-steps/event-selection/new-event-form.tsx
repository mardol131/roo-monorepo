"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";
import { Controller, useForm } from "react-hook-form";
import Input from "@/app/components/ui/atoms/inputs/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchInput from "../../../../../../../components/ui/atoms/inputs/search-input";
import DateTimeInput from "../../../../../../../components/ui/atoms/inputs/date-time-input";
import IconSelect, {
  LucideIcons,
} from "@/app/components/ui/atoms/inputs/icon-select";
import { Calendar, MapPin, Smile, Users } from "lucide-react";
import GuestsFilter from "@/app/(pages)/catalog/[type]/components/guests-filter";
import GuestsInput from "@/app/components/ui/atoms/inputs/guests-input";

const MOCK_LOCATIONS = [
  { id: "loc-1", label: "Praha" },
  { id: "loc-2", label: "Brno" },
  { id: "loc-3", label: "Ostrava" },
  { id: "loc-4", label: "Plzeň" },
  { id: "loc-5", label: "Liberec" },
  { id: "loc-6", label: "Pardubice" },
];

const schema = yup.object({
  icon: yup.string().required("Ikona události je povinná"),
  name: yup.string().required("Název události je povinný"),
  startDate: yup.date().required("Datum začátku je povinné"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "Datum konce musí být po datu začátku")
    .required("Datum konce je povinné"),
  location: yup
    .object({
      id: yup.string().required("ID lokace je povinné"),
      label: yup.string().required("Název lokace je povinný"),
    })
    .required("Lokalita je povinná"),
  guests: yup
    .object({
      adults: yup.number().min(1).required(),
      children: yup.number().min(0).required(),
      ztp: yup.boolean().required(),
      pets: yup.boolean().required(),
    })
    .required("Počet hostů je povinný"),
});

type FormInputs = yup.InferType<typeof schema>;

export default function NewEventForm() {
  const { setEventData } = useOrderStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      icon: "Calendar",
      guests: { adults: 1, children: 0, ztp: false, pets: false },
    },
  });

  const startDateValue = watch("startDate");
  const iconValue = watch("icon");
  const nameValue = watch("name");
  const endDateValue = watch("endDate");
  const locationValue = watch("location");
  const guestsValue = watch("guests");

  const buttonIsDisabled =
    !iconValue ||
    !nameValue ||
    !startDateValue ||
    !endDateValue ||
    !locationValue ||
    !guestsValue;

  const handleNewEventSubmit = (inputs: FormInputs) => {
    setEventData({
      name: inputs.name,
      icon: inputs.icon,
      date: { start: inputs.startDate, end: inputs.endDate },
      location: { id: inputs.location.id, name: inputs.location.label },
      guests: {
        adults: inputs.guests.adults,
        children: inputs.guests.children,
        ztp: inputs.guests.ztp,
        pets: inputs.guests.pets,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleNewEventSubmit)}
      className="border border-zinc-200 rounded-2xl mt-5"
    >
      {/* Section 1 — Základní informace */}
      <FormSection number={1} icon={Smile} title="Základní informace">
        <Input
          label="Název události"
          inputProps={{ ...register("name") }}
          error={errors.name?.message}
        />

        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconSelect
              error={errors.icon?.message}
              label="Ikona události"
              defaultIcon="Calendar"
              onSelect={(val) => field.onChange(val)}
              iconsOptions={[
                "Calendar",
                "PartyPopper",
                "Briefcase",
                "Heart",
                "GraduationCap",
                "Music",
              ]}
            />
          )}
        />
      </FormSection>

      <Divider />

      {/* Section 2 — Termín */}
      <FormSection number={2} icon={Calendar} title="Termín konání">
        <div className="grid grid-cols-2 gap-5">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateTimeInput
                error={errors.startDate?.message}
                label="Začátek události"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DateTimeInput
                label="Konec události"
                value={field.value}
                onChange={field.onChange}
                min={startDateValue ? new Date(startDateValue) : undefined}
                error={errors.endDate?.message}
              />
            )}
          />
        </div>
      </FormSection>

      <Divider />

      <FormSection number={3} icon={MapPin} title="Lokalita a počet hostů">
        <div className="grid grid-cols-2 gap-5 w-full">
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <SearchInput
                error={errors.location?.message}
                value={field.value}
                label="Město nebo obec"
                options={MOCK_LOCATIONS}
                onSelect={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="guests"
            render={({ field }) => (
              <GuestsInput
                error={errors.guests?.message}
                label="Vyberte počet hostů"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </FormSection>
      <div className="p-5 flex justify-end border-t border-zinc-200">
        <Button
          text="Zkontrolovat a pokračovat"
          htmlType="submit"
          disabled={buttonIsDisabled}
          version="primary"
        />
      </div>
    </form>
  );
}

function FormSection({
  number,
  icon,
  title,
  children,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = icon;

  return (
    <div className="px-6 py-5 flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        {/* <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold shrink-0">
          {number}
        </span> */}
        <div className="flex items-center gap-1.5 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <Text variant="heading5" color="dark">
          {title}
        </Text>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-zinc-200" />;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text variant="label4" color="secondary" className="text-red-500 mt-0.5">
      {message}
    </Text>
  );
}
