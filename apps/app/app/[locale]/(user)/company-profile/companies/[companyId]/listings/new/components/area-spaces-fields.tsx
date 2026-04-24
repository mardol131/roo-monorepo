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

// ── AreaFields ───────────────────────────────────────────────────────────────

function AreaFields({
  register,
  errors,
}: {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Název areálu"
        inputProps={{ ...register("areaName"), placeholder: "Areál Výstaviště" }}
        error={errors.areaName?.message}
      />
      <Textarea
        label="Popis areálu"
        inputProps={{ ...register("areaDescription"), placeholder: "Stručný popis areálu...", rows: 3 }}
        error={errors.areaDescription?.message}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kapacita (osob)"
          inputProps={{ ...register("areaCapacity"), type: "number", min: 1, placeholder: "500" }}
          error={errors.areaCapacity?.message}
        />
        <Input
          label="Plocha (m²)"
          inputProps={{ ...register("areaArea"), type: "number", min: 1, placeholder: "2000" }}
          error={errors.areaArea?.message}
        />
      </div>
    </div>
  );
}

// ── BuildingRoomFields ───────────────────────────────────────────────────────

function BuildingRoomFields({
  register,
  errors,
  buildingIndex,
  roomIndex,
}: {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  buildingIndex: number;
  roomIndex: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Název místnosti"
        inputProps={{
          ...register(`buildings.${buildingIndex}.rooms.${roomIndex}.name`),
          placeholder: "Konferenční místnost 1",
        }}
        error={errors.buildings?.[buildingIndex]?.rooms?.[roomIndex]?.name?.message}
      />
      <Textarea
        label="Popis místnosti"
        inputProps={{
          ...register(`buildings.${buildingIndex}.rooms.${roomIndex}.description`),
          placeholder: "Stručný popis místnosti...",
          rows: 2,
        }}
        error={errors.buildings?.[buildingIndex]?.rooms?.[roomIndex]?.description?.message}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kapacita (osob)"
          inputProps={{
            ...register(`buildings.${buildingIndex}.rooms.${roomIndex}.capacity`),
            type: "number",
            min: 1,
            placeholder: "50",
          }}
          error={errors.buildings?.[buildingIndex]?.rooms?.[roomIndex]?.capacity?.message}
        />
        <Input
          label="Plocha (m²)"
          inputProps={{
            ...register(`buildings.${buildingIndex}.rooms.${roomIndex}.area`),
            type: "number",
            min: 1,
            placeholder: "80",
          }}
          error={errors.buildings?.[buildingIndex]?.rooms?.[roomIndex]?.area?.message}
        />
      </div>
    </div>
  );
}

// ── BuildingRoomsFields ──────────────────────────────────────────────────────

interface BuildingRoomsFieldsProps {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  buildingIndex: number;
  watch: UseFormWatch<FormInputs>;
}

function BuildingRoomsFields({
  control,
  register,
  errors,
  buildingIndex,
  watch,
}: BuildingRoomsFieldsProps) {
  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: `buildings.${buildingIndex}.rooms`,
  });

  const hasRooms = watch(`buildings.${buildingIndex}.hasRooms`);

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Název budovy"
        inputProps={{ ...register(`buildings.${buildingIndex}.name`), placeholder: "Budova A" }}
        error={errors.buildings?.[buildingIndex]?.name?.message}
      />
      <Textarea
        label="Popis budovy"
        inputProps={{ ...register(`buildings.${buildingIndex}.description`), placeholder: "Stručný popis budovy...", rows: 2 }}
        error={errors.buildings?.[buildingIndex]?.description?.message}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kapacita (osob)"
          inputProps={{ ...register(`buildings.${buildingIndex}.capacity`), type: "number", min: 1, placeholder: "200" }}
          error={errors.buildings?.[buildingIndex]?.capacity?.message}
        />
        <Input
          label="Plocha (m²)"
          inputProps={{ ...register(`buildings.${buildingIndex}.area`), type: "number", min: 1, placeholder: "500" }}
          error={errors.buildings?.[buildingIndex]?.area?.message}
        />
      </div>

      <Controller
        control={control}
        name={`buildings.${buildingIndex}.hasRooms`}
        render={({ field }) => (
          <Checkbox
            checked={field.value ?? false}
            onChange={field.onChange}
            label="Budova má separátní místnosti"
            checkColor="text-listing"
          />
        )}
      />

      {hasRooms && (
        <div className="ml-4 border-l-2 border-border pl-4">
          <RepeaterField
            label="Místnosti"
            fields={roomFields as unknown as Record<string, unknown>[]}
            onAppend={() => appendRoom({ name: "", description: "", capacity: undefined, area: undefined })}
            onRemove={removeRoom}
            addButtonLabel="Přidat místnost"
            renderItem={(_item, roomIndex) => (
              <BuildingRoomFields
                register={register}
                errors={errors}
                buildingIndex={buildingIndex}
                roomIndex={roomIndex}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}

// ── AreaSpacesFields ─────────────────────────────────────────────────────────

interface AreaSpacesFieldsProps {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  watch: UseFormWatch<FormInputs>;
}

export default function AreaSpacesFields({
  control,
  register,
  errors,
  watch,
}: AreaSpacesFieldsProps) {
  const {
    fields: buildingFields,
    append: appendBuilding,
    remove: removeBuilding,
  } = useFieldArray({
    control,
    name: "buildings",
  });

  const hasBuildings = watch("hasBuildings");

  return (
    <div className="flex flex-col gap-6">
      <AreaFields register={register} errors={errors} />

      <Controller
        control={control}
        name="hasBuildings"
        render={({ field }) => (
          <Checkbox
            checked={field.value ?? false}
            onChange={field.onChange}
            label="Areál obsahuje budovy"
            checkColor="text-listing"
          />
        )}
      />

      {hasBuildings && (
        <div className="ml-4 border-l-2 border-border pl-4">
          <RepeaterField
            label="Budovy"
            fields={buildingFields as unknown as Record<string, unknown>[]}
            onAppend={() =>
              appendBuilding({
                name: "",
                description: "",
                capacity: undefined,
                area: undefined,
                hasRooms: false,
                rooms: [],
              })
            }
            onRemove={removeBuilding}
            addButtonLabel="Přidat budovu"
            renderItem={(_item, buildingIndex) => (
              <BuildingRoomsFields
                control={control}
                register={register}
                errors={errors}
                buildingIndex={buildingIndex}
                watch={watch}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}
