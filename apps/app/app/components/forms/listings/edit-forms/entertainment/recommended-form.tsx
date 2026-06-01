"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { RecommendedData } from "./schemas";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";

type Props = {
  form: UseFormReturn<RecommendedData>;
  isActive: boolean;
  texts: {
    capacity: TocSection;
    audience: TocSection;
    logistics: TocSection;
    faq: TocSection;
    employees: TocSection;
  };
};

const audienceLabels: Record<"adults" | "kids" | "seniors", string> = {
  adults: "Dospělí",
  kids: "Děti",
  seniors: "Senioři",
};

export function RecommendedForm({ form, isActive, texts }: Props) {
  const faqFieldArray = useFieldArray({ control: form.control, name: "faq" });
  const employeesFieldArray = useFieldArray({
    control: form.control,
    name: "employees",
  });

  const faqErrors = Array.isArray(form.formState.errors.faq)
    ? form.formState.errors.faq
    : [];
  const employeeErrors = Array.isArray(form.formState.errors.employees)
    ? form.formState.errors.employees
    : [];

  return (
    <div className={!isActive ? "hidden" : "flex flex-col gap-4"}>
      <FormSection
        id={texts.capacity.id}
        icon={texts.capacity.icon}
        title={texts.capacity.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Min. počet hostů (osob)"
            inputProps={{
              ...form.register("guests.min"),
              type: "number",
            }}
            placeholder="50"
          />
          <Input
            label="Max. počet hostů (osob)"
            inputProps={{
              ...form.register("guests.max"),
              type: "number",
            }}
            placeholder="500"
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
        </div>
      </FormSection>

      <FormSection
        id={texts.audience.id}
        icon={texts.audience.icon}
        title={texts.audience.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
      >
        <div className="flex gap-6">
          {(["adults", "kids", "seniors"] as const).map((a) => (
            <Controller
              key={a}
              control={form.control}
              name="audience"
              render={({ field }) => (
                <Checkbox
                  checked={field.value?.includes(a) ?? false}
                  onChange={(checked) =>
                    field.onChange(
                      checked
                        ? [...(field.value ?? []), a]
                        : (field.value ?? []).filter((v: string) => v !== a),
                    )
                  }
                  label={audienceLabels[a]}
                  checkColor="text-listing"
                />
              )}
            />
          ))}
        </div>
      </FormSection>

      <FormSection
        id={texts.logistics.id}
        icon={texts.logistics.icon}
        title={texts.logistics.title}
        color="text-listing"
        surfaceColor="bg-listing-surface"
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
          />
          <Input
            label="Čas úklidu (min)"
            inputProps={{
              ...form.register("setupAndTearDown.tearDownTime"),
              type: "number",
              placeholder: "45",
            }}
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
                  placeholder: "Jak dlouho trvá příprava?",
                }}
                error={faqErrors[index]?.question?.message}
              />
              <Textarea
                label="Odpověď"
                inputProps={{
                  ...form.register(`faq.${index}.answer`),
                  rows: 3,
                  placeholder: "Příprava trvá přibližně...",
                }}
                error={faqErrors[index]?.answer?.message}
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
                    error={employeeErrors[index]?.name?.message}
                  />
                  <Input
                    label="Role"
                    inputProps={{
                      ...form.register(`employees.${index}.role`),
                      placeholder: "DJ",
                    }}
                    error={employeeErrors[index]?.role?.message}
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
                error={employeeErrors[index]?.description?.message}
              />
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
