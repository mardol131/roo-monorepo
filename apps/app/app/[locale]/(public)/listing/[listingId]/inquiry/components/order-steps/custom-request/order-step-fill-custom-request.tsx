"use client";

import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { Plus, X } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import StepHeading from "../step-heading";
import InputLabel from "@/app/components/ui/atoms/input-label";

type FormData = {
  note: string;
  requirements: { text: string }[];
};

export default function OrderStepFillCustomRequest() {
  const { setCustomRequest } = useOrderStore();

  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: { note: "", requirements: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });

  const note = useWatch({ control, name: "note" });
  const canContinue = note.trim().length > 0;

  const onSubmit = (data: FormData) => {
    setCustomRequest({
      note: data.note,
      requirements: data.requirements.filter((r) => r.text.trim().length > 0),
    });
  };

  return (
    <div>
      <StepHeading
        title="Vlastní poptávka"
        description="Popište, co potřebujete, a dodavatel vám připraví nabídku na míru"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Textarea
          label="Popis poptávky"
          inputProps={{
            ...register("note"),
            rows: 5,
            placeholder:
              "Popište vaši akci, požadavky na prostory, catering, program...",
          }}
        />

        <div className="flex flex-col gap-3">
          <div className="flex items-start flex-col justify-between">
            <InputLabel label="Další požadavky" />
          </div>

          {fields.length > 0 && (
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name={`requirements.${index}.text`}
                      render={({ field: f }) => (
                        <Input
                          inputProps={{
                            ...f,
                            placeholder: `Požadavek ${index + 1}`,
                          }}
                        />
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-2 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div>
            <Button
              text="Přidat požadavek"
              iconLeft="Plus"
              version="plain"
              size="xs"
              onClick={() => append({ text: "" })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            text="Pokračovat na přehled"
            version="primary"
            iconRight="ArrowRight"
            htmlType="submit"
            disabled={!canContinue}
          />
        </div>
      </form>
    </div>
  );
}
