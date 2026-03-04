"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import { Controller, useForm } from "react-hook-form";
import Input from "@/app/components/ui/atoms/inputs/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import IconSelect from "@/app/components/ui/atoms/inputs/icon-select";
import GuestsInput from "@/app/components/ui/atoms/inputs/guests-input";
import { Calendar, MapPin, Smile } from "lucide-react";
import { useRouter } from "next/navigation";

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
      id: yup.string().required(),
      label: yup.string().required(),
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
  const router = useRouter();

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

  const onSubmit = (data: FormInputs) => {
    // TODO: persist event data
    console.log("New event:", data);
    router.push("/user-profile/events");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Section 1 — Základní informace */}
      <FormSection icon={Smile} title="Základní informace">
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
              error={errors.icon?.message}
            />
          )}
        />
      </FormSection>

      {/* Section 2 — Termín */}
      <FormSection icon={Calendar} title="Termín konání">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateTimeInput
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

      {/* Section 3 — Lokalita a hosté */}
      <FormSection icon={MapPin} title="Lokalita a počet hostů">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <SearchInput
                label="Město nebo obec"
                options={MOCK_LOCATIONS}
                value={field.value}
                onSelect={field.onChange}
                error={errors.location?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="guests"
            render={({ field }) => (
              <GuestsInput
                label="Počet hostů"
                value={field.value}
                onChange={field.onChange}
                error={errors.guests?.message}
              />
            )}
          />
        </div>
      </FormSection>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
        >
          Zrušit
        </button>
        <button
          type="submit"
          disabled={buttonIsDisabled}
          className="px-6 py-2.5 text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          Vytvořit událost
        </button>
      </div>
    </form>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl border border-zinc-200">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-rose-500" />
        </div>
        <Text variant="label1" color="dark" className="font-semibold">
          {title}
        </Text>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}
