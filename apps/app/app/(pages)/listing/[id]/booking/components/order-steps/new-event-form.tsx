"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";
import { Controller, set, useForm } from "react-hook-form";
import Input from "@/app/components/ui/atoms/input";
import { EventData } from "@roo/types";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DateFilter from "@/app/(pages)/catalog/[type]/components/date-filter";
import SearchInput from "../../../../../../components/ui/atoms/search-input";
import DateTimeInput from "../../../../../../components/ui/atoms/date-time-input";
import IconSelect, { LucideIcons } from "@/app/components/ui/atoms/icon-select";

type Props = {};

// Mock data pro lokace
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
  location: yup.object({
    id: yup.string().required("ID lokace je povinné"),
    label: yup.string().required("Název lokace je povinný"),
  }),
});

type FormInputs = yup.InferType<typeof schema>;

export default function NewEventForm({}: Props) {
  const { eventData, setEventData, goToNextStep } = useOrderStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const handleNewEventSubmit = (inputs: FormInputs) => {
    console.log("Submitting new event with data:", {
      ...inputs,
    });
  };

  const startDateValue = watch("startDate");

  const onSubmit = handleSubmit(handleNewEventSubmit);

  return (
    <form
      onSubmit={onSubmit}
      className=" rounded-xl p-4 border border-zinc-200 mt-5"
    >
      <Text variant="label1" color="dark" className="font-semibold mb-4">
        Vytvoření nové události
      </Text>
      <div className="space-y-4">
        <Input label="Název události" inputProps={{ ...register("name") }} />
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconSelect
              label="Ikona události"
              defaultIcon={"Calendar" as LucideIcons}
              onSelect={(val) => field.onChange(val)}
              iconsOptions={["Calendar", "AArrowDown", "Badge"]}
            />
          )}
        />
        <div className="flex w-full gap-5">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateTimeInput
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
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <SearchInput
              value={field.value}
              label="Místo konání"
              options={MOCK_LOCATIONS}
              onSelect={field.onChange}
            />
          )}
        />

        <Button text="Vytvořit událost a pokračovat" htmlType="submit" />
      </div>
    </form>
  );
}
