"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import InputLabel from "@/app/components/ui/atoms/input-label";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import TimeInput from "@/app/components/ui/atoms/inputs/time-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { LucideIcons } from "@roo/common";
import { CalendarRange, Clock } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import SeasonalPricesInput from "@/app/components/ui/atoms/inputs/seasonal-prices-input";

const COLOR = { text: "text-variant", surface: "bg-variant-surface" };

// ── Basic Info ────────────────────────────────────────────────────────────────

type BasicInfoStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  icon?: LucideIcons;
};

export function VariantBasicInfoStep<T extends FieldValues>({
  register,
  errors,
  icon = "Package",
}: BasicInfoStepProps<T>) {
  const e = errors as FieldErrors<{
    name: unknown;
    shortDescription: unknown;
    description: unknown;
    capacity: { max: unknown; min: unknown };
  }>;
  return (
    <>
      {" "}
      <FormSection
        title="Základní informace"
        icon={icon}
        surfaceColor={COLOR.surface}
        color={COLOR.text}
        error={!!(e.name || e.shortDescription)}
      >
        <Input
          label="Název"
          isRequired
          inputProps={{
            ...register("name" as Path<T>),
            placeholder: "Standardní balíček",
          }}
          error={e.name?.message}
        />
        <Input
          label="Krátký popis"
          isRequired
          inputProps={{
            ...register("shortDescription" as Path<T>),
            placeholder: "Stručný popis varianty (max. 50 znaků)",
            maxLength: 150,
          }}
          maxLength={150}
          error={e.shortDescription?.message}
        />
        <Textarea
          label="Detailní popis"
          inputProps={{
            ...register("description" as Path<T>),
            placeholder: "Podrobný popis varianty...",
            rows: 4,
          }}
        />
      </FormSection>
      <FormSection
        icon="Users"
        title="Kapacita"
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={!!(e.capacity?.max || e.capacity?.min)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {" "}
          <Input
            label="Minimální kapacita (osob)"
            inputProps={{
              ...register("capacity.min" as Path<T>),
              type: "number",
              min: 1,
              placeholder: "50",
            }}
            error={e.capacity?.min?.message}
          />
          <Input
            label="Maximální kapacita (osob)"
            inputProps={{
              ...register("capacity.max" as Path<T>),
              type: "number",
              min: 1,
              placeholder: "300",
            }}
            error={e.capacity?.max?.message}
          />
        </div>
      </FormSection>
    </>
  );
}

// ── Price ─────────────────────────────────────────────────────────────────────

type PriceStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export function VariantPriceStep<T extends FieldValues>({
  control,
  register,
  errors,
}: PriceStepProps<T>) {
  const e = errors as FieldErrors<{
    price: { base: unknown; pricingUnit: unknown; seasonalPrices: unknown };
  }>;
  return (
    <>
      <FormSection
        icon="Banknote"
        title="Cena"
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={!!e.price?.base || !!e.price?.pricingUnit}
      >
        <Controller
          control={control}
          name={"price.pricingUnit" as Path<T>}
          render={({ field }) => (
            <PriceInput
              label="Základní cena"
              sublabel="Jednotková cena, podle které naceňujete akce."
              isRequired
              amountProps={{ ...register("price.base" as Path<T>) }}
              unitValue={field.value}
              onUnitChange={field.onChange}
              amountError={e.price?.base?.message}
              unitError={e.price?.pricingUnit?.message}
            />
          )}
        />
      </FormSection>

      <FormSection
        icon="Calendar"
        title="Sezónní ceny"
        surfaceColor="bg-variant-surface"
        color="text-variant"
      >
        <SeasonalPricesInput
          control={control}
          register={register}
          errors={(e?.price?.seasonalPrices as any) ?? []}
        />
      </FormSection>
    </>
  );
}

// ── Availability & Capacity ───────────────────────────────────────────────────

// ── Images ────────────────────────────────────────────────────────────────────

type ImagesStepProps<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
};

export function VariantImagesStep<T extends FieldValues>({
  control,
  errors,
}: ImagesStepProps<T>) {
  const e = errors as FieldErrors<{
    images: { coverImage: unknown; gallery: unknown };
  }>;
  return (
    <FormSection
      title="Fotky"
      icon="Image"
      subtitle="Podporované formáty: jpg, png, webp"
      surfaceColor={COLOR.surface}
      color={COLOR.text}
      error={!!(e.images?.coverImage || e.images?.gallery)}
    >
      <Controller
        control={control as Control<FieldValues>}
        name={"images.coverImage" as Path<T>}
        render={({ field }) => (
          <ImageInput
            label="Titulní obrázek"
            value={field.value}
            onChange={(f) => field.onChange(f ?? "")}
            onUpload={uploadFileToCloud}
            error={e.images?.coverImage?.message}
            isRequired
          />
        )}
      />
      <Controller
        control={control as Control<FieldValues>}
        name={"images.gallery" as Path<T>}
        render={({ field }) => (
          <GalleryInput
            label="Galerie"
            value={field.value ?? []}
            onChange={field.onChange}
            onUpload={uploadFileToCloud}
            maxImages={20}
            error={e.images?.gallery?.message}
          />
        )}
      />
    </FormSection>
  );
}
