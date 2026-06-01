"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import Input from "@/app/components/ui/atoms/inputs/input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import {
  Controller,
  UseFormReturn,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { RecommendedData } from "./schemas";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";

type Props = {
  form: UseFormReturn<RecommendedData>;
  isActive: boolean;
  texts: Record<keyof RecommendedData, TocSection>;
};

export function RecommendedForm({ form, isActive, texts }: Props) {
  const faqFieldArray = useFieldArray({ control: form.control, name: "faq" });
  const employeesFieldArray = useFieldArray({
    control: form.control,
    name: "employees",
  });
  const servesAlcohol = useWatch({
    control: form.control,
    name: "alcohol.servesAlcohol",
  });

  if (!isActive) return null;

  return (
    <>
      <FormSection
        id={texts.setupAndTearDown.id}
        icon={texts.setupAndTearDown.icon}
        title={texts.setupAndTearDown.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={
          !!form.formState.errors.setupAndTearDown?.setupTime ||
          !!form.formState.errors.setupAndTearDown?.tearDownTime
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Čas přípravy (min)"
            inputProps={{
              ...form.register("setupAndTearDown.setupTime"),
              type: "number",
              min: 0,
              placeholder: "60",
            }}
            error={form.formState.errors.setupAndTearDown?.setupTime?.message}
          />
          <Input
            label="Čas úklidu (min)"
            inputProps={{
              ...form.register("setupAndTearDown.tearDownTime"),
              type: "number",
              min: 0,
              placeholder: "45",
            }}
            error={
              form.formState.errors.setupAndTearDown?.tearDownTime?.message
            }
          />
        </div>
      </FormSection>
      <FormSection
        id={texts.alcohol.id}
        icon={texts.alcohol.icon}
        title={texts.alcohol.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={
          !!form.formState.errors.alcohol?.servesAlcohol ||
          !!form.formState.errors.alcohol?.pricingUnit
        }
      >
        <div className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="alcohol.servesAlcohol"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Podáváme alkohol"
                checkColor="text-listing"
              />
            )}
          />
          {servesAlcohol && (
            <Controller
              control={form.control}
              name="alcohol.pricingUnit"
              render={({ field }) => (
                <SelectInput
                  label="Způsob účtování alkoholu"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  items={[
                    { value: "per_person", label: "Na osobu" },
                    { value: "per_event", label: "Paušálně za akci" },
                  ]}
                  error={form.formState.errors.alcohol?.pricingUnit?.message}
                />
              )}
            />
          )}
        </div>
      </FormSection>
      <FormSection
        id={texts.guests.id}
        icon={texts.guests.icon}
        title={texts.guests.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={
          !!form.formState.errors.guests?.max ||
          !!form.formState.errors.guests?.min
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Max. počet hostů (osob)"
            isRequired
            inputProps={{
              ...form.register("guests.max"),
              type: "number",
              min: 1,
              placeholder: "200",
            }}
            error={form.formState.errors.guests?.max?.message}
          />
          <Input
            label="Min. počet hostů (osob)"
            inputProps={{
              ...form.register("guests.min"),
              type: "number",
              min: 1,
              placeholder: "10",
            }}
            error={form.formState.errors.guests?.min?.message}
          />
        </div>
        <div className="flex gap-6">
          <Controller
            control={form.control}
            name="guests.ztp"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Přístupné pro ZTP"
                checkColor="text-listing"
              />
            )}
          />
          <Controller
            control={form.control}
            name="guests.pets"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Vstup se zvířaty"
                checkColor="text-listing"
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection
        id={texts.faq.id}
        icon={texts.faq.icon}
        title={texts.faq.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <RepeaterField
          label="Často kladené otázky"
          fields={faqFieldArray.fields}
          onAppend={() =>
            faqFieldArray.append({
              active: true,
              question: "",
              answer: "",
              groupedBy: "general",
            })
          }
          onRemove={faqFieldArray.remove}
          addButtonLabel="Přidat otázku"
          renderItem={(_item, index) => (
            <div className="flex flex-col gap-3">
              <Input
                label="Otázka"
                inputProps={{
                  ...form.register(`faq.${index}.question`),
                  placeholder: "Jaká je minimální objednávka?",
                }}
                error={form.formState.errors.faq?.[index]?.question?.message}
              />
              <Textarea
                label="Odpověď"
                inputProps={{
                  ...form.register(`faq.${index}.answer`),
                  rows: 3,
                  placeholder: "Minimální objednávka je...",
                }}
                error={form.formState.errors.faq?.[index]?.answer?.message}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  control={form.control}
                  name={`faq.${index}.groupedBy`}
                  render={({ field }) => (
                    <SelectInput
                      label="Kategorie"
                      items={[
                        { value: "general", label: "Obecné" },
                        { value: "booking", label: "Rezervace" },
                        { value: "cancellation", label: "Storno" },
                        { value: "payment", label: "Platba" },
                        { value: "other", label: "Ostatní" },
                      ]}
                      value={field.value ?? "general"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name={`faq.${index}.active`}
                  render={({ field }) => (
                    <div className="flex items-end pb-2">
                      <Checkbox
                        checked={field.value ?? true}
                        onChange={field.onChange}
                        label="Aktivní"
                        checkColor="text-listing"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        />
      </FormSection>

      <FormSection
        id={texts.employees.id}
        icon={texts.employees.icon}
        title={texts.employees.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <RepeaterField
          label="Zaměstnanci"
          fields={employeesFieldArray.fields}
          onAppend={() =>
            employeesFieldArray.append({
              name: "",
              role: "",
              description: "",
              image: {},
            })
          }
          onRemove={employeesFieldArray.remove}
          addButtonLabel="Přidat zaměstnance"
          renderItem={(_item, index) => (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  control={form.control}
                  name={`employees.${index}.image`}
                  render={({ field }) => (
                    <ImageInput
                      label="Fotografie"
                      value={field.value}
                      onChange={(filename) => field.onChange(filename ?? "")}
                      onUpload={uploadFileToCloud}
                    />
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Input
                    label="Jméno"
                    inputProps={{
                      ...form.register(`employees.${index}.name`),
                      placeholder: "Jan Novák",
                    }}
                    error={
                      form.formState.errors.employees?.[index]?.name?.message
                    }
                  />
                  <Input
                    label="Role"
                    inputProps={{
                      ...form.register(`employees.${index}.role`),
                      placeholder: "Kuchař",
                    }}
                    error={
                      form.formState.errors.employees?.[index]?.role?.message
                    }
                  />
                </div>
              </div>
              <Textarea
                label="Popis"
                inputProps={{
                  ...form.register(`employees.${index}.description`),
                  rows: 2,
                  placeholder: "Krátký popis zaměstnance...",
                }}
                error={
                  form.formState.errors.employees?.[index]?.description?.message
                }
              />
            </div>
          )}
        />
      </FormSection>
    </>
  );
}
