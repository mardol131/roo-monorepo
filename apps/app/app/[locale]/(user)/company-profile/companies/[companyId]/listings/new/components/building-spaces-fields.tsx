"use client";

import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import type { FormInputs } from "./new-listing-form";

// ── BuildingFields ───────────────────────────────────────────────────────────

function BuildingFields({
  register,
  errors,
}: {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Název budovy"
        inputProps={{ ...register("buildingName"), placeholder: "Kongresové centrum" }}
        error={errors.buildingName?.message}
      />
      <Textarea
        label="Popis budovy"
        inputProps={{ ...register("buildingDescription"), placeholder: "Stručný popis budovy...", rows: 3 }}
        error={errors.buildingDescription?.message}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kapacita (osob)"
          inputProps={{ ...register("buildingCapacity"), type: "number", min: 1, placeholder: "300" }}
          error={errors.buildingCapacity?.message}
        />
        <Input
          label="Plocha (m²)"
          inputProps={{ ...register("buildingArea"), type: "number", min: 1, placeholder: "800" }}
          error={errors.buildingArea?.message}
        />
      </div>
    </div>
  );
}

// ── RoomFields ───────────────────────────────────────────────────────────────

function RoomFields({
  register,
  errors,
  roomIndex,
}: {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  roomIndex: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Název místnosti"
        inputProps={{
          ...register(`buildingRooms.${roomIndex}.name`),
          placeholder: "Konferenční místnost 1",
        }}
        error={errors.buildingRooms?.[roomIndex]?.name?.message}
      />
      <Textarea
        label="Popis místnosti"
        inputProps={{
          ...register(`buildingRooms.${roomIndex}.description`),
          placeholder: "Stručný popis místnosti...",
          rows: 2,
        }}
        error={errors.buildingRooms?.[roomIndex]?.description?.message}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kapacita (osob)"
          inputProps={{ ...register(`buildingRooms.${roomIndex}.capacity`), type: "number", min: 1, placeholder: "50" }}
          error={errors.buildingRooms?.[roomIndex]?.capacity?.message}
        />
        <Input
          label="Plocha (m²)"
          inputProps={{ ...register(`buildingRooms.${roomIndex}.area`), type: "number", min: 1, placeholder: "80" }}
          error={errors.buildingRooms?.[roomIndex]?.area?.message}
        />
      </div>
    </div>
  );
}

// ── BuildingSpacesFields ─────────────────────────────────────────────────────

interface BuildingSpacesFieldsProps {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  watch: UseFormWatch<FormInputs>;
}

export default function BuildingSpacesFields({
  control,
  register,
  errors,
  watch,
}: BuildingSpacesFieldsProps) {
  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: "buildingRooms",
  });

  const buildingHasRooms = watch("buildingHasRooms");

  return (
    <div className="flex flex-col gap-6">
      <BuildingFields register={register} errors={errors} />

      <Controller
        control={control}
        name="buildingHasRooms"
        render={({ field }) => (
          <Checkbox
            checked={field.value ?? false}
            onChange={field.onChange}
            label="Budova má separátní místnosti"
            checkColor="text-listing"
          />
        )}
      />

      {buildingHasRooms && (
        <div className="ml-4 border-l-2 border-border pl-4">
          <RepeaterField
            label="Místnosti"
            fields={roomFields as unknown as Record<string, unknown>[]}
            onAppend={() => appendRoom({ name: "", description: "", capacity: undefined, area: undefined })}
            onRemove={removeRoom}
            addButtonLabel="Přidat místnost"
            renderItem={(_item, roomIndex) => (
              <RoomFields register={register} errors={errors} roomIndex={roomIndex} />
            )}
          />
        </div>
      )}
    </div>
  );
}
