"use client";

import {
  Control,
  Controller,
  FieldError,
  UseFormRegister,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import DateTimeInput from "./date-time-input";
import Input from "./input";
import RepeaterField from "./repeater-field";
import SelectInput from "./select-input";
import { format } from "date-fns";

const ADJUSTMENT_TYPE_OPTIONS = [
  { value: "surcharge", label: "Příplatek" },
  { value: "discount", label: "Sleva" },
];

const VALUE_TYPE_OPTIONS = [
  { value: "absolute", label: "Absolutní (Kč)" },
  { value: "percentage", label: "Procentuální (%)" },
];

type ItemError = Record<string, FieldError | undefined> | undefined;

type Props = {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors?: ItemError[];
};

export default function SeasonalPricesInput({
  control,
  register,
  errors = [],
}: Props) {
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "price.seasonalPrices",
  });
  const watchedItems = useWatch({ control, name: "price.seasonalPrices" });

  function getItemLabel(_: unknown, index: number) {
    const item = watchedItems?.[index];
    return item?.title || `Sezonní cena #${index + 1}`;
  }

  function getItemSubLabel(_: unknown, index: number) {
    const item = watchedItems?.[index];
    if (!item?.from && !item?.to) return undefined;
    const from = item?.from ? format(new Date(item.from), "dd.MM.yyyy") : "?";
    const to = item?.to ? format(new Date(item.to), "dd.MM.yyyy") : "?";
    return `${from} – ${to}`;
  }

  return (
    <RepeaterField
      label="Sezonní ceny"
      fields={fields}
      onAppend={() =>
        append({
          amount: undefined,
          adjustmentType: "surcharge",
          valueType: "absolute",
          description: "",
          from: "",
          to: "",
        })
      }
      onRemove={remove}
      onDuplicate={(index) => insert(index + 1, { ...watchedItems?.[index] })}
      addButtonLabel="Přidat sezonní cenu"
      collapsible
      getItemLabel={getItemLabel}
      getItemSubLabel={getItemSubLabel}
      renderItem={(_, index) => {
        const itemErrors = errors[index];
        const currentFrom = watchedItems?.[index]?.from;
        const currentTo = watchedItems?.[index]?.to;
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Hodnota"
                isRequired
                inputProps={{
                  ...register(`price.seasonalPrices.${index}.amount`),
                  type: "number",
                  min: 0,
                  placeholder: "10",
                }}
                error={itemErrors?.amount?.message}
              />
              <Controller
                control={control}
                name={`price.seasonalPrices.${index}.adjustmentType`}
                render={({ field }) => (
                  <SelectInput
                    label="Typ úpravy"
                    isRequired
                    items={ADJUSTMENT_TYPE_OPTIONS}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={itemErrors?.adjustmentType?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name={`price.seasonalPrices.${index}.valueType`}
                render={({ field }) => (
                  <SelectInput
                    label="Typ hodnoty"
                    isRequired
                    items={VALUE_TYPE_OPTIONS}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={itemErrors?.valueType?.message}
                  />
                )}
              />
            </div>
            <Input
              label="Popis"
              isRequired
              inputProps={{
                ...register(`price.seasonalPrices.${index}.title`),
                placeholder: "Letní sezona",
              }}
              error={itemErrors?.title?.message}
            />
            <div className="grid grid-cols-2 gap-3">
              <Controller
                control={control}
                name={`price.seasonalPrices.${index}.from`}
                render={({ field }) => (
                  <DateTimeInput
                    label="Od"
                    isRequired
                    dateOnly
                    value={field.value ?? null}
                    onChange={field.onChange}
                    max={currentTo ?? undefined}
                    error={itemErrors?.from?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name={`price.seasonalPrices.${index}.to`}
                render={({ field }) => (
                  <DateTimeInput
                    label="Do"
                    isRequired
                    dateOnly
                    value={field.value ?? null}
                    onChange={field.onChange}
                    min={currentFrom ?? undefined}
                    error={itemErrors?.to?.message}
                  />
                )}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
