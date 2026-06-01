"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import InputLabel from "@/app/components/ui/atoms/input-label";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import TimeInput from "@/app/components/ui/atoms/inputs/time-input";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { SupplementaryData } from "./schemas";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";

type Props = {
  form: UseFormReturn<SupplementaryData>;
  isActive: boolean;
  filters: ReturnType<typeof useFilterOptions>["data"];
  texts: {
    storage: TocSection;
    rules: TocSection;
    access: TocSection;
    parking: TocSection;
    breakfast: TocSection;
    references: TocSection;
  };
};

function toggleArrayItem(arr: string[], id: string, checked: boolean) {
  return checked ? [...arr, id] : arr.filter((x) => x !== id);
}

export function SupplementaryForm({ form, isActive, filters, texts }: Props) {
  const storageFieldArray = useFieldArray({
    control: form.control,
    name: "storage",
  });
  const referencesFieldArray = useFieldArray({
    control: form.control,
    name: "references",
  });

  const hasParking = form.watch("parking.hasParking");
  const breakfastIncluded = form.watch("breakfast.included");
  const parkingIsIncludedInPrice = form.watch(
    "parking.parkingIsIncludedInPrice",
  );

  if (!isActive) return null;

  return (
    <>
      <FormSection
        id={texts.storage.id}
        icon={texts.storage.icon}
        title={texts.storage.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <RepeaterField
          label="Skladovací prostory"
          fields={storageFieldArray.fields}
          onAppend={() => storageFieldArray.append({ name: "", area: 0 })}
          onRemove={storageFieldArray.remove}
          addButtonLabel="Přidat sklad"
          renderItem={(_item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Název"
                inputProps={{
                  ...form.register(`storage.${index}.name`),
                  placeholder: "Sklad A",
                }}
                error={form.formState.errors.storage?.[index]?.name?.message}
              />
              <Input
                label="Plocha (m²)"
                inputProps={{
                  ...form.register(`storage.${index}.area`),
                  type: "number",
                  min: 1,
                }}
                error={form.formState.errors.storage?.[index]?.area?.message}
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection
        id={texts.rules.id}
        icon={texts.rules.icon}
        title={texts.rules.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
          name="venueRules"
          render={({ field }) => (
            <CheckboxGroup
              label="Pravidla pro jídlo a pití"
              items={filters?.venueRules ?? []}
              value={field.value ?? []}
              onChange={field.onChange}
              checkColor="text-listing"
              searchable
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.access.id}
        icon={texts.access.icon}
        title={texts.access.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <div className="flex flex-col gap-2">
          <InputLabel label="Typ vozidel, které zvládnou vjezd" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["car", "truck", "van", "bus"] as const).map((v) => (
              <Controller
                key={v}
                control={form.control}
                name="access.vehicleTypes"
                render={({ field }) => (
                  <Checkbox
                    checkColor="text-listing"
                    checked={field.value?.includes(v) ?? false}
                    onChange={(checked) =>
                      field.onChange(
                        toggleArrayItem(field.value ?? [], v, checked),
                      )
                    }
                    label={
                      {
                        car: "Auto",
                        truck: "Nákladní auto",
                        van: "Dodávka",
                        bus: "Autobus",
                      }[v]
                    }
                  />
                )}
              />
            ))}
          </div>
        </div>
        <div>
          <InputLabel label="Zajištění nakládky a vykládky" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {(
              [
                ["access.loadingRamp", "Nakládací rampa"],
                ["access.loadingElevator", "Nakládací výtah"],
                ["access.serviceAccess", "Servisní přístup"],
                ["access.serviceArea", "Servisní zázemí"],
              ] as const
            ).map(([name, label]) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label={label}
                    checkColor="text-listing"
                  />
                )}
              />
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection
        id={texts.parking.id}
        icon={texts.parking.icon}
        title={texts.parking.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
          name="parking.hasParking"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Parkování k dispozici"
              checkColor="text-listing"
            />
          )}
        />
        <div className={hasParking ? "" : "opacity-40 pointer-events-none"}>
          <div className="flex flex-col gap-4">
            <Input
              label="Počet parkovacích míst"
              inputProps={{
                ...form.register("parking.parkingCapacity"),
                type: "number",
                min: 0,
                disabled: !hasParking,
              }}
              error={form.formState.errors.parking?.parkingCapacity?.message}
            />
            <Controller
              control={form.control}
              name="parking.parkingIsIncludedInPrice"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Parkování v ceně"
                  checkColor="text-listing"
                />
              )}
            />
            <div
              className={
                hasParking && !parkingIsIncludedInPrice
                  ? ""
                  : "opacity-40 pointer-events-none"
              }
            >
              <Input
                label="Cena parkování (Kč)"
                inputProps={{
                  ...form.register("parking.parkingPrice"),
                  type: "number",
                  min: 0,
                  disabled: !hasParking || parkingIsIncludedInPrice,
                }}
                error={form.formState.errors.parking?.parkingPrice?.message}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        id={texts.breakfast.id}
        icon={texts.breakfast.icon}
        title={texts.breakfast.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <Controller
          control={form.control}
          name="breakfast.included"
          render={({ field }) => (
            <Checkbox
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Snídaně k dispozici"
              checkColor="text-listing"
            />
          )}
        />
        <div
          className={breakfastIncluded ? "" : "opacity-40 pointer-events-none"}
        >
          <div className="flex flex-col gap-4">
            <Controller
              control={form.control}
              name="breakfast.breakfastIsIncludedInPrice"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Snídaně v ceně ubytování"
                  checkColor="text-listing"
                />
              )}
            />
            <Controller
              control={form.control}
              name="breakfast.allowAccommodationWithoutBreakfast"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Povolit ubytování bez snídaně"
                  checkColor="text-listing"
                />
              )}
            />
            <Controller
              control={form.control}
              name="breakfast.allowMoreBreakfastsThanAccommodation"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Povolit více snídaní než ubytovaných"
                  checkColor="text-listing"
                />
              )}
            />
            <Input
              label="Cena snídaně (Kč)"
              inputProps={{
                ...form.register("breakfast.price"),
                type: "number",
                min: 0,
                disabled: !breakfastIncluded,
              }}
              error={form.formState.errors.breakfast?.price?.message}
            />
            <Controller
              control={form.control}
              name="breakfast.pricePer"
              render={({ field }) => (
                <SelectInput
                  label="Cena za"
                  items={[
                    { value: "person", label: "Osobu" },
                    { value: "booking", label: "Celou rezervaci" },
                  ]}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Vyberte..."
                  disabled={!breakfastIncluded}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="breakfast.timeFrom"
                render={({ field }) => (
                  <TimeInput label="Snídaně od" onChange={field.onChange} />
                )}
              />
              <Controller
                control={form.control}
                name="breakfast.timeTo"
                render={({ field }) => (
                  <TimeInput label="Snídaně do" onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        id={texts.references.id}
        icon={texts.references.icon}
        title={texts.references.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <RepeaterField
          label="Reference"
          fields={referencesFieldArray.fields}
          onAppend={() =>
            referencesFieldArray.append({
              image: {},
              eventName: "",
              description: "",
              clientName: "",
              eventType: undefined,
            })
          }
          onRemove={referencesFieldArray.remove}
          addButtonLabel="Přidat referenci"
          renderItem={(_item, index) => (
            <div className="flex flex-col gap-3">
              <Controller
                control={form.control}
                name={`references.${index}.image`}
                render={({ field }) => (
                  <ImageInput
                    label="Obrázek"
                    value={field.value}
                    onChange={(filename) => field.onChange(filename ?? "")}
                    onUpload={uploadFileToCloud}
                  />
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Název akce"
                  inputProps={{
                    ...form.register(`references.${index}.eventName`),
                    placeholder: "Firemní večírek ABC",
                  }}
                  error={
                    form.formState.errors.references?.[index]?.eventName
                      ?.message
                  }
                />
                <Input
                  label="Jméno klienta"
                  inputProps={{
                    ...form.register(`references.${index}.clientName`),
                    placeholder: "Jan Novák",
                  }}
                  error={
                    form.formState.errors.references?.[index]?.clientName
                      ?.message
                  }
                />
              </div>
              <Input
                label="Popis"
                inputProps={{
                  ...form.register(`references.${index}.description`),
                  placeholder: "Krátký popis akce nebo spolupráce...",
                }}
                error={
                  form.formState.errors.references?.[index]?.description
                    ?.message
                }
              />
              <Controller
                control={form.control}
                name={`references.${index}.eventType`}
                render={({ field }) => (
                  <SearchInput
                    label="Typ akce"
                    placeholder="Vyberte typ akce..."
                    options={filters?.eventTypes ?? []}
                    onSelect={field.onChange}
                    onClear={() => field.onChange(null)}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    selectedOption={
                      filters?.eventTypes?.find(
                        (et) => et.id === field.value?.id,
                      ) ?? undefined
                    }
                  />
                )}
              />
            </div>
          )}
        />
      </FormSection>
    </>
  );
}
