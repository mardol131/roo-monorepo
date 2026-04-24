"use client";

import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import Button from "@/app/components/ui/atoms/button";
import { Trash2 } from "lucide-react";
import type { FormInputs } from "./new-listing-form";

interface RoomSpacesFieldsProps {
  control: Control<FormInputs>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}

const EMPTY_ROOM = {
  name: "",
  description: "",
  capacity: undefined,
  area: undefined,
} as const;

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
          ...register(`rooms.${roomIndex}.name`),
          placeholder: "Konferenční místnost 1",
        }}
        error={errors.rooms?.[roomIndex]?.name?.message}
      />
      <Textarea
        label="Popis místnosti"
        inputProps={{
          ...register(`rooms.${roomIndex}.description`),
          placeholder: "Stručný popis místnosti...",
          rows: 2,
        }}
        error={errors.rooms?.[roomIndex]?.description?.message}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kapacita (osob)"
          inputProps={{
            ...register(`rooms.${roomIndex}.capacity`),
            type: "number",
            min: 1,
            placeholder: "50",
          }}
          error={errors.rooms?.[roomIndex]?.capacity?.message}
        />
        <Input
          label="Plocha (m²)"
          inputProps={{
            ...register(`rooms.${roomIndex}.area`),
            type: "number",
            min: 1,
            placeholder: "80",
          }}
          error={errors.rooms?.[roomIndex]?.area?.message}
        />
      </div>
    </div>
  );
}

export default function RoomSpacesFields({
  control,
  register,
  errors,
}: RoomSpacesFieldsProps) {
  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: "rooms",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* První místnost – vždy přítomná, bez karty */}
      <RoomFields register={register} errors={errors} roomIndex={0} />

      {/* Další místnosti */}
      {roomFields.slice(1).map((field, sliceIndex) => {
        const roomIndex = sliceIndex + 1;
        return (
          <div
            key={field.id}
            className="relative flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4"
          >
            <button
              type="button"
              onClick={() => removeRoom(roomIndex)}
              className="absolute right-3 top-3 rounded-md p-1 text-zinc-400 transition-colors hover:bg-danger-surface hover:text-danger"
            >
              <Trash2 size={16} />
            </button>
            <RoomFields register={register} errors={errors} roomIndex={roomIndex} />
          </div>
        );
      })}

      <div>
        <Button
          htmlType="button"
          text="Přidat další místnost"
          version="plain"
          onClick={() => appendRoom(EMPTY_ROOM)}
          iconLeft="Plus"
          size="sm"
        />
      </div>
    </div>
  );
}
