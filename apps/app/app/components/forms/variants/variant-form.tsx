"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useUnsavedChangesWarning } from "@/app/hooks/use-unsaved-changes-warning";
import {
  useCreateVariant,
  useUpdateVariant,
  useVariant,
} from "@/app/react-query/variants/hooks";
import {
  optionalMediaSchema,
  requiredMediaSchema,
} from "@/app/validation/schema/media-schema";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, Resolver, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Cena balíčku nezávisí na čase — hodinové/denní sazby patří do custom
// poptávky, varianta se naceňuje za akci nebo za osobu.
const VARIANT_PRICING_UNITS = ["lump_sum", "per_person"] as const;
const variantPricingUnitSchema = z.enum(
  VARIANT_PRICING_UNITS,
  "Vyberte jednotku ceny",
);

const COLOR = { text: "text-variant", surface: "bg-variant-surface" };

export const MAX_SHORT_DESCRIPTION_LENGTH = 150;

// ── Schema ────────────────────────────────────────────────────────────────────

const variantFormSchema = z
  .object({
    name: z.string().min(1, "Název je povinný"),
    shortDescription: z
      .string()
      .min(1, "Krátký popis je povinný")
      .max(
        MAX_SHORT_DESCRIPTION_LENGTH,
        `Max. ${MAX_SHORT_DESCRIPTION_LENGTH} znaků`,
      ),
    description: z.string().optional(),
    price: z.object({
      base: getPositiveNumber("Zadejte cenu"),
      pricingUnit: variantPricingUnitSchema,
    }),
    // Orientační údaj, pro kolik hostů se varianta hodí — není to tvrdý limit.
    capacity: z.object({
      max: getOptionalPositiveNumber("Zadejte kladné číslo"),
      min: getOptionalPositiveNumber("Zadejte kladné číslo"),
    }),
    includes: z.array(z.object({ item: z.string() })).default([]),
    excludes: z.array(z.object({ item: z.string() })).default([]),
    isOneTime: z.boolean().default(false),
    durationMinutes: getOptionalPositiveNumber("Zadejte délku v minutách"),
    images: z.object({
      coverImage: z.object(requiredMediaSchema, "Titulní obrázek je povinný"),
      gallery: z.array(z.object(optionalMediaSchema)).default([]),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.isOneTime && data.durationMinutes === undefined) {
      ctx.addIssue({
        code: "custom",
        message:
          "Zadejte orientační délku, nebo označte službu jako jednorázovou",
        path: ["durationMinutes"],
      });
    }
  });
export type VariantFormData = z.infer<typeof variantFormSchema>;

const EMPTY_VALUES = {
  name: "",
  shortDescription: "",
  description: "",
  price: { base: undefined, pricingUnit: "lump_sum" as const },
  capacity: { max: undefined, min: undefined },
  includes: [],
  excludes: [],
  isOneTime: false,
  durationMinutes: undefined,
  images: { coverImage: {}, gallery: [] },
};

// ── TOC sections ──────────────────────────────────────────────────────────────

const S = {
  basic: { id: "vf-basic", title: "Základní informace", icon: "Building2" },
  price: { id: "vf-price", title: "Cena", icon: "Banknote" },
  capacity: { id: "vf-capacity", title: "Kapacita", icon: "Users" },
  duration: { id: "vf-duration", title: "Délka služby", icon: "Timer" },
  includesExcludes: {
    id: "vf-includes",
    title: "Zahrnuto / Nezahrnuto",
    icon: "ListChecks",
  },
  images: { id: "vf-images", title: "Obrázky", icon: "Image" },
} as const;

const TOC_GROUPS: readonly TocGroup[] = [
  {
    label: "Varianta",
    sections: [
      S.basic,
      S.price,
      S.capacity,
      S.duration,
      S.includesExcludes,
      S.images,
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  /** Vyplněné = editace existující varianty, jinak vytvoření nové. */
  variantId?: string;
  /** Povinné při vytváření — listing, ke kterému varianta patří. */
  listingId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function VariantForm({
  variantId,
  listingId,
  onSuccess,
  onCancel,
}: Props) {
  const isEdit = !!variantId;
  const { data: variant } = useVariant(variantId);
  const { mutateAsync: createVariantAsync } = useCreateVariant();
  const { mutateAsync: updateVariantAsync } = useUpdateVariant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VariantFormData>({
    resolver: zodResolver(variantFormSchema) as Resolver<VariantFormData>,
    defaultValues: EMPTY_VALUES,
  });

  const isOneTime = form.watch("isOneTime");

  const {
    fields: includesFields,
    append: appendInclude,
    remove: removeInclude,
  } = useFieldArray({ control: form.control, name: "includes" });
  const {
    fields: excludesFields,
    append: appendExclude,
    remove: removeExclude,
  } = useFieldArray({ control: form.control, name: "excludes" });

  const { reset } = form;
  const resetFromVariant = useCallback(() => {
    if (!variant) return;
    const { coverImage, gallery } = variant.images;
    reset({
      name: variant.name,
      shortDescription: variant.shortDescription ?? "",
      description: variant.description ?? "",
      price: {
        base: variant.price.base,
        pricingUnit: variant.price.pricingUnit,
      },
      capacity: {
        max: variant.capacity.max ?? undefined,
        min: variant.capacity.min ?? undefined,
      },
      includes: (variant.includes ?? []).map(({ item }) => ({
        item: item ?? "",
      })),
      excludes: (variant.excludes ?? []).map(({ item }) => ({
        item: item ?? "",
      })),
      isOneTime: variant.isOneTime ?? false,
      durationMinutes: variant.durationMinutes ?? undefined,
      images: {
        coverImage: {
          filename: coverImage?.filename,
          alt: coverImage?.alt,
          width: coverImage?.width,
          height: coverImage?.height,
          size: coverImage?.size,
          mimeType: coverImage?.mimeType,
        },
        gallery: (gallery ?? []).map(
          ({ filename, alt, width, height, size, mimeType }) => ({
            filename,
            alt,
            width,
            height,
            size,
            mimeType,
          }),
        ),
      },
    });
  }, [variant, reset]);

  useEffect(() => {
    resetFromVariant();
  }, [resetFromVariant]);

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0;
  useUnsavedChangesWarning(isDirty);

  async function onSubmit(data: VariantFormData) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description ?? null,
        price: data.price,
        capacity: {
          max: data.capacity.max ?? null,
          min: data.capacity.min ?? null,
        },
        includes: data.includes,
        excludes: data.excludes,
        isOneTime: data.isOneTime,
        durationMinutes: data.isOneTime ? null : (data.durationMinutes ?? null),
        images: data.images,
      };
      if (isEdit) {
        await updateVariantAsync({ id: variantId, data: payload });
        reset(data);
      } else {
        if (!listingId) return;
        await createVariantAsync({ ...payload, listing: listingId });
      }
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (isEdit) {
      resetFromVariant();
    } else {
      onCancel?.();
    }
  }

  console.log(form.formState.errors);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex gap-6"
      noValidate
    >
      <div className="flex w-full flex-col gap-4">
        <FormSection
          id={S.basic.id}
          icon={S.basic.icon}
          title={S.basic.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={
            !!form.formState.errors.name ||
            !!form.formState.errors.shortDescription
          }
        >
          <Input
            label="Název"
            isRequired
            inputProps={{
              ...form.register("name"),
              placeholder: "Standardní balíček",
            }}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="Krátký popis"
            isRequired
            inputProps={{
              ...form.register("shortDescription"),
              placeholder: "Stručný popis varianty",
            }}
            maxLength={MAX_SHORT_DESCRIPTION_LENGTH}
            error={form.formState.errors.shortDescription?.message}
          />
          <Textarea
            label="Detailní popis"
            inputProps={{
              ...form.register("description"),
              placeholder: "Podrobný popis varianty...",
              rows: 4,
            }}
          />
        </FormSection>

        <FormSection
          id={S.price.id}
          icon={S.price.icon}
          title={S.price.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!form.formState.errors.price}
        >
          <Controller
            control={form.control}
            name="price.pricingUnit"
            render={({ field }) => (
              <PriceInput
                label="Základní cena"
                sublabel="Cena za celou akci, nebo za osobu."
                isRequired
                amountProps={form.register("price.base")}
                unitValue={field.value}
                onUnitChange={field.onChange}
                amountError={form.formState.errors.price?.base?.message}
                unitError={form.formState.errors.price?.pricingUnit?.message}
                options={[...VARIANT_PRICING_UNITS]}
              />
            )}
          />
        </FormSection>

        <FormSection
          id={S.capacity.id}
          icon={S.capacity.icon}
          title={S.capacity.title}
          subtitle="Orientační údaj, pro kolik hostů se varianta hodí"
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!form.formState.errors.capacity}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Od (osob)"
              inputProps={{
                ...form.register("capacity.min"),
                type: "number",
                min: 1,
                placeholder: "50",
              }}
              error={form.formState.errors.capacity?.min?.message}
            />
            <Input
              label="Do (osob)"
              inputProps={{
                ...form.register("capacity.max"),
                type: "number",
                min: 1,
                placeholder: "300",
              }}
              error={form.formState.errors.capacity?.max?.message}
            />
          </div>
        </FormSection>

        <FormSection
          id={S.duration.id}
          icon={S.duration.icon}
          title={S.duration.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!form.formState.errors.durationMinutes}
        >
          <Controller
            control={form.control}
            name="isOneTime"
            render={({ field }) => (
              <Checkbox
                checked={field.value ?? false}
                onChange={(checked) => {
                  field.onChange(checked);
                  if (checked) form.clearErrors("durationMinutes");
                }}
                label="Jednorázová služba (dodavatel přijede v daný čas)"
                checkColor={COLOR.text}
              />
            )}
          />
          {!isOneTime && (
            <Input
              label="Orientační délka (minuty)"
              isRequired
              inputProps={{
                ...form.register("durationMinutes"),
                type: "number",
                min: 1,
                placeholder: "120",
              }}
              error={form.formState.errors.durationMinutes?.message}
            />
          )}
        </FormSection>

        <FormSection
          id={S.includesExcludes.id}
          icon={S.includesExcludes.icon}
          title={S.includesExcludes.title}
          surfaceColor={COLOR.surface}
          color={COLOR.text}
        >
          <RepeaterField
            label="Co je zahrnuto"
            fields={includesFields}
            onAppend={() => appendInclude({ item: "" })}
            onRemove={removeInclude}
            addButtonLabel="Přidat položku"
            renderItem={(_, i) => (
              <Input
                label="Položka"
                inputProps={{
                  ...form.register(`includes.${i}.item`),
                  placeholder: "např. Technika, Obsluha...",
                }}
              />
            )}
          />
          <RepeaterField
            label="Co není zahrnuto"
            fields={excludesFields}
            onAppend={() => appendExclude({ item: "" })}
            onRemove={removeExclude}
            addButtonLabel="Přidat položku"
            renderItem={(_, i) => (
              <Input
                label="Položka"
                inputProps={{
                  ...form.register(`excludes.${i}.item`),
                  placeholder: "např. Catering, Parkování...",
                }}
              />
            )}
          />
        </FormSection>

        <FormSection
          id={S.images.id}
          icon={S.images.icon}
          title={S.images.title}
          subtitle="Podporované formáty: jpg, png, webp"
          surfaceColor={COLOR.surface}
          color={COLOR.text}
          error={!!form.formState.errors.images?.coverImage}
        >
          <Controller
            control={form.control}
            name="images.coverImage"
            render={({ field }) => (
              <ImageInput
                label="Titulní obrázek"
                isRequired
                value={field.value}
                onChange={(f) => field.onChange(f ?? "")}
                onUpload={uploadFileToCloud}
                error={
                  form.formState.errors.images?.coverImage?.filename?.message
                }
              />
            )}
          />
          <Controller
            control={form.control}
            name="images.gallery"
            render={({ field }) => (
              <GalleryInput
                label="Galerie"
                value={field.value ?? []}
                onChange={field.onChange}
                onUpload={uploadFileToCloud}
                maxImages={20}
              />
            )}
          />
        </FormSection>

        <div className="flex justify-end gap-3 pt-2">
          {(isDirty || !isEdit) && (
            <>
              <Button
                htmlType="button"
                text="Zrušit"
                onClick={handleCancel}
                version="plainFull"
              />
              <Button
                text={isEdit ? "Uložit" : "Vytvořit variantu"}
                version="variantFull"
                htmlType="submit"
                disabled={isSubmitting}
              />
            </>
          )}
        </div>
      </div>

      <FormToc
        textColor={COLOR.text}
        dotColor={COLOR.text}
        surfaceColor={COLOR.surface}
        groups={TOC_GROUPS}
        sticky
        buttonVersion="variantFull"
        buttonText={isEdit ? "Uložit" : "Vytvořit variantu"}
        showControlButtons={isDirty || !isEdit}
        onCancelButtonClick={handleCancel}
      />
    </form>
  );
}
