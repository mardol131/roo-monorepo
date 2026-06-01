"use client";

import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import TabFilter from "@/app/[locale]/(user)/components/tab-filter";
import Button from "@/app/components/ui/atoms/button";
import InputLabel from "@/app/components/ui/atoms/input-label";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useUnsavedChangesWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { useUpdateVariant, useVariant } from "@/app/react-query/variants/hooks";
import { optionalMediaSchema } from "@/app/validation/schema/media-schema";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, Resolver, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { BASE_VARIANT_TABS, hasDirtyFields, VariantGroupKey } from "../common";
import { useVariantEditTocData } from "../common-forms/useTocData";
import {
  BaseData,
  BaseForm,
  baseSchema,
} from "../common-forms/variant-base-form";
import {
  PriceData,
  PriceForm,
  priceSchema,
} from "../common-forms/variant-price-form";
import {
  CapacityData,
  CapacityForm,
  capacitySchema,
} from "../common-forms/variant-capacity-form";

const COLOR = { text: "text-variant", surface: "bg-variant-surface" };

const S: Record<string, TocSection> = {
  basic: { id: "ve-basic", title: "Základní informace", icon: "Music" },
  images: { id: "ve-images", title: "Obrázky", icon: "Image" },
  includes: {
    id: "ve-includes",
    title: "Zahrnuto / Nezahrnuto",
    icon: "ListChecks",
  },
  price: { id: "ve-price", title: "Základní cena", icon: "Banknote" },
  seasonalPrices: {
    id: "ve-seasonal-prices",
    title: "Sezónní ceny",
    icon: "CalendarRange",
  },
  capacity: { id: "ve-capacity", title: "Kapacita", icon: "Users" },
  audience: { id: "ve-audience", title: "Publikum", icon: "Users" },
  performance: { id: "ve-performance", title: "Vystoupení", icon: "Mic" },
};

// ── Schemas ────────────────────────────────────────────────────────────────────

const entertainmentSchema = z.object({
  audience: z.array(z.enum(["adults", "kids", "seniors"])).default([]),
  numberOfSets: getOptionalPositiveNumber("Zadejte kladné číslo"),
  pauseBetweenSetsInMinutes: getOptionalPositiveNumber("Zadejte kladné číslo"),
  entertainmentIsPerformance: z.boolean().default(false),
});
type EntertainmentData = z.infer<typeof entertainmentSchema>;

// ── Component ──────────────────────────────────────────────────────────────────

export default function EntertainmentVariantForm() {
  const { variantId } = useParams<{
    variantId: string;
    listingId: string;
  }>();
  const S = useVariantEditTocData();

  const TOC_BY_TAB: Record<VariantGroupKey, readonly TocGroup[]> = {
    base: [
      { label: "Základ", sections: [S.basic, S.images, S.includesExcludes] },
    ],
    price: [{ label: "Cena", sections: [S.price, S.seasonalPrices] }],
    capacity: [{ label: "Kapacita", sections: [S.capacity] }],
    details: [{ label: "Program", sections: [S.audience, S.performance] }],
  };

  const GROUP_TABS = [
    ...BASE_VARIANT_TABS,
    { label: "Program", value: "details" as VariantGroupKey },
  ];
  const { data: variant } = useVariant(variantId);
  const { mutateAsync: updateVariantAsync } = useUpdateVariant();

  const [activeGroup, setActiveGroup] = useState<VariantGroupKey>("base");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Forms ──────────────────────────────────────────────────────────────────

  const baseForm = useForm<BaseData>({
    resolver: zodResolver(baseSchema) as Resolver<BaseData>,
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      images: { coverImage: undefined, gallery: [] },
      includes: [],
      excludes: [],
    },
  });

  const priceForm = useForm<PriceData>({
    resolver: zodResolver(priceSchema) as Resolver<PriceData>,
    defaultValues: { price: { base: undefined, seasonalPrices: [] } },
  });

  const capacityForm = useForm<CapacityData>({
    resolver: zodResolver(capacitySchema) as Resolver<CapacityData>,
    defaultValues: {
      max: undefined,
      min: undefined,
    },
  });

  const entertainmentForm = useForm<EntertainmentData>({
    resolver: zodResolver(entertainmentSchema) as Resolver<EntertainmentData>,
    defaultValues: {
      audience: [],
      entertainmentIsPerformance: false,
    },
  });

  // ── Dirty state ────────────────────────────────────────────────────────────

  const anyDirty =
    hasDirtyFields(baseForm.formState.dirtyFields) ||
    hasDirtyFields(priceForm.formState.dirtyFields) ||
    hasDirtyFields(capacityForm.formState.dirtyFields) ||
    hasDirtyFields(entertainmentForm.formState.dirtyFields);

  const activeFormIsDirty =
    activeGroup === "base"
      ? hasDirtyFields(baseForm.formState.dirtyFields)
      : activeGroup === "price"
        ? hasDirtyFields(priceForm.formState.dirtyFields)
        : activeGroup === "capacity"
          ? hasDirtyFields(capacityForm.formState.dirtyFields)
          : hasDirtyFields(entertainmentForm.formState.dirtyFields);

  useUnsavedChangesWarning(anyDirty);

  // ── Reset ──────────────────────────────────────────────────────────────────

  const { reset: resetBase } = baseForm;
  const { reset: resetPrice } = priceForm;
  const { reset: resetCapacity } = capacityForm;
  const { reset: resetEntertainment } = entertainmentForm;

  const resetAllForms = useCallback(() => {
    if (!variant) return;
    const block = variant.details.find((d) => d.blockType === "entertainment");
    if (!block || block.blockType !== "entertainment") return;

    const { coverImage, gallery } = variant.images;
    resetBase({
      name: variant.name,
      shortDescription: variant.shortDescription ?? "",
      description: variant.description ?? "",
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
      includes: (variant.includes ?? []).map(({ item }) => ({
        item: item ?? "",
      })),
      excludes: (variant.excludes ?? []).map(({ item }) => ({
        item: item ?? "",
      })),
    });

    resetPrice({
      price: {
        base: variant.price.base,
        seasonalPrices: (variant.price.seasonalPrices ?? []).map((sp) => ({
          amount: sp.amount,
          title: sp.title,
          adjustmentType: sp.adjustmentType,
          valueType: sp.valueType,
          from: sp.from,
          to: sp.to,
        })),
        pricingUnit: variant.price.pricingUnit,
      },
    });

    resetCapacity({
      max: variant.capacity.max,
      min: variant.capacity.min ?? undefined,
    });

    resetEntertainment({
      audience: (block.audience ?? []) as ("adults" | "kids" | "seniors")[],
      numberOfSets: block.performance?.numberOfSets ?? undefined,
      pauseBetweenSetsInMinutes:
        block.performance?.pauseBetweenSetsInMinutes ?? undefined,
      entertainmentIsPerformance:
        block.performance?.entertainmentIsPerformance ?? false,
    });
  }, [variant, resetBase, resetPrice, resetCapacity, resetEntertainment]);

  useEffect(() => {
    resetAllForms();
  }, [resetAllForms]);

  // ── Tab change ─────────────────────────────────────────────────────────────

  function handleTabChange(newTab: VariantGroupKey) {
    if (
      activeFormIsDirty &&
      !window.confirm("Máte neuložené změny. Chcete pokračovat bez uložení?")
    )
      return;
    setActiveGroup(newTab);
  }

  // ── Submit handlers ────────────────────────────────────────────────────────

  async function onSubmitBase(data: BaseData) {
    setIsSubmitting(true);
    try {
      await updateVariantAsync({
        id: variantId,
        data: {
          name: data.name,
          shortDescription: data.shortDescription,
          description: data.description ?? null,
          images: data.images,
          includes: data.includes,
          excludes: data.excludes,
        },
      });
      resetBase(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitPrice(data: PriceData) {
    setIsSubmitting(true);
    try {
      await updateVariantAsync({
        id: variantId,
        data: {
          price: data.price,
        },
      });
      resetPrice(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitCapacity(data: CapacityData) {
    setIsSubmitting(true);
    try {
      await updateVariantAsync({
        id: variantId,
        data: {
          capacity: { max: data.max, min: data.min ?? null },
        },
      });
      resetCapacity(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitEntertainment(data: EntertainmentData) {
    if (!variant) return;
    const block = variant.details.find((d) => d.blockType === "entertainment");
    if (!block || block.blockType !== "entertainment") return;
    setIsSubmitting(true);
    try {
      await updateVariantAsync({
        id: variantId,
        data: {
          details: [
            {
              blockType: "entertainment",
              id: block.id,
              audience: data.audience,
              performance: {
                entertainmentIsPerformance: data.entertainmentIsPerformance,
                numberOfSets: data.numberOfSets ?? null,
                pauseBetweenSetsInMinutes:
                  data.pauseBetweenSetsInMinutes ?? null,
              },
            },
          ],
        },
      });
      resetEntertainment(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitConfig: Record<
    VariantGroupKey,
    (e?: React.BaseSyntheticEvent) => Promise<void>
  > = {
    base: baseForm.handleSubmit(onSubmitBase),
    price: priceForm.handleSubmit(onSubmitPrice),
    capacity: capacityForm.handleSubmit(onSubmitCapacity),
    details: entertainmentForm.handleSubmit(onSubmitEntertainment),
  };

  const audience = entertainmentForm.watch("audience");

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={submitConfig[activeGroup]}
      className="flex gap-6"
      noValidate
    >
      <div className="flex w-full flex-col gap-4">
        <TabFilter
          tabs={GROUP_TABS}
          activeTab={activeGroup}
          onChange={handleTabChange}
        />

        <BaseForm form={baseForm} isActive={activeGroup === "base"} texts={S} />
        <PriceForm
          form={priceForm}
          isActive={activeGroup === "price"}
          texts={S}
        />
        <CapacityForm
          form={capacityForm}
          isActive={activeGroup === "capacity"}
          texts={S}
        />
        {/* ENTERTAINMENT */}
        <div
          className={
            activeGroup !== "details" ? "hidden" : "flex flex-col gap-4"
          }
        >
          <FormSection
            id={S.audience.id}
            icon={S.audience.icon}
            title="Cílové publikum"
            surfaceColor={COLOR.surface}
            color={COLOR.text}
          >
            <div className="flex flex-col gap-2">
              <InputLabel label="Cílové publikum" />
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    { value: "adults", label: "Dospělí" },
                    { value: "kids", label: "Děti" },
                    { value: "seniors", label: "Senioři" },
                  ] as const
                ).map(({ value, label }) => (
                  <Checkbox
                    key={value}
                    checked={(audience ?? []).includes(value)}
                    onChange={(checked) =>
                      entertainmentForm.setValue(
                        "audience",
                        checked
                          ? [...(audience ?? []), value]
                          : (audience ?? []).filter((v) => v !== value),
                      )
                    }
                    label={label}
                    checkColor={COLOR.text}
                  />
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection
            id={S.performance.id}
            icon={S.performance.icon}
            title="Vystoupení"
            surfaceColor={COLOR.surface}
            color={COLOR.text}
          >
            <Controller
              control={entertainmentForm.control}
              name="entertainmentIsPerformance"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Jde o živé vystoupení / performance"
                  checkColor={COLOR.text}
                />
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Počet setů"
                inputProps={{
                  ...entertainmentForm.register("numberOfSets"),
                  type: "number",
                  min: 1,
                  placeholder: "2",
                }}
                error={entertainmentForm.formState.errors.numberOfSets?.message}
              />
              <Input
                label="Přestávka mezi sety (min)"
                inputProps={{
                  ...entertainmentForm.register("pauseBetweenSetsInMinutes"),
                  type: "number",
                  min: 0,
                  placeholder: "15",
                }}
                error={
                  entertainmentForm.formState.errors.pauseBetweenSetsInMinutes
                    ?.message
                }
              />
            </div>
          </FormSection>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {activeFormIsDirty && (
            <>
              <Button
                htmlType="button"
                text="Zrušit"
                onClick={resetAllForms}
                version="plainFull"
              />
              <Button
                text="Uložit"
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
        groups={TOC_BY_TAB[activeGroup]}
        sticky
        buttonVersion="variantFull"
        buttonText="Uložit"
        showControlButtons={activeFormIsDirty}
        onCancelButtonClick={resetAllForms}
      />
    </form>
  );
}
