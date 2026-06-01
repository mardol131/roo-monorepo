"use client";

import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import TabFilter from "@/app/[locale]/(user)/components/tab-filter";
import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import DateTimeInput from "@/app/components/ui/atoms/inputs/date-time-input";
import ErrorText from "@/app/components/ui/atoms/inputs/error-text";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import SpacesCheckboxInput from "@/app/components/ui/atoms/inputs/spaces-checkbox-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { useUnsavedChangesWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { useUpdateVariant, useVariant } from "@/app/react-query/variants/hooks";
import { optionalMediaSchema } from "@/app/validation/schema/media-schema";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, Resolver, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { hasDirtyFields, VariantGroupKey } from "../common";
import { toItem } from "@/app/components/forms/listings/utils";
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
import { useVariantEditTocData } from "../common-forms/useTocData";
import { CompletionWidget } from "@/app/[locale]/(user)/components/completion-widget";
import { getFullVariantCompletion } from "@/app/functions/utils/variants";

// ── Color ──────────────────────────────────────────────────────────────────────

const COLOR = { text: "text-variant", surface: "bg-variant-surface" };

// ── TOC sections ───────────────────────────────────────────────────────────────

// ── Schemas ────────────────────────────────────────────────────────────────────

const venueSchema = z.object({
  includedSpaces: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .default([]),
  hasAccommodation: z.boolean().default(false),
  accommodationIncluded: z.boolean().default(false),
  accommodationCapacity: getOptionalPositiveNumber("Zadejte kladné číslo"),
  hasBreakfast: z.boolean().default(false),
  breakfastIncluded: z.boolean().default(false),
  breakfastPrice: getOptionalPositiveNumber("Zadejte kladné číslo"),
  breakfastLoweredPrice: getOptionalPositiveNumber("Zadejte kladné číslo"),
});
type VenueData = z.infer<typeof venueSchema>;

// ── Component ──────────────────────────────────────────────────────────────────

export default function VenueVariantForm() {
  const { variantId, listingId, companyId } = useParams<{
    variantId: string;
    listingId: string;
    companyId: string;
  }>();
  const S = useVariantEditTocData();

  const TOC_BY_TAB: Record<VariantGroupKey, readonly TocGroup[]> = {
    base: [
      { label: "Základ", sections: [S.basic, S.images, S.includesExcludes] },
    ],
    price: [{ label: "Cena", sections: [S.price, S.seasonalPrices] }],
    capacity: [{ label: "Kapacita", sections: [S.capacity] }],
    details: [
      {
        label: "Prostor",
        sections: [S.spaces, S.accommodation, S.breakfast],
      },
    ],
  };

  const GROUP_TABS: { label: string; value: VariantGroupKey }[] = [
    { label: "Základ", value: "base" },
    { label: "Cena", value: "price" },
    { label: "Kapacita", value: "capacity" },
    { label: "Prostor", value: "details" },
  ];

  const { data: variant } = useVariant(variantId);
  const { data: spaces } = useSpacesByListing(listingId);
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

  const venueForm = useForm<VenueData>({
    resolver: zodResolver(venueSchema) as Resolver<VenueData>,
    defaultValues: {
      includedSpaces: [],
      hasAccommodation: false,
      accommodationIncluded: false,
      hasBreakfast: false,
      breakfastIncluded: false,
    },
  });

  // ── Dirty state ────────────────────────────────────────────────────────────

  const anyDirty =
    hasDirtyFields(baseForm.formState.dirtyFields) ||
    hasDirtyFields(priceForm.formState.dirtyFields) ||
    hasDirtyFields(capacityForm.formState.dirtyFields) ||
    hasDirtyFields(venueForm.formState.dirtyFields);

  const activeFormIsDirty =
    activeGroup === "base"
      ? hasDirtyFields(baseForm.formState.dirtyFields)
      : activeGroup === "price"
        ? hasDirtyFields(priceForm.formState.dirtyFields)
        : activeGroup === "capacity"
          ? hasDirtyFields(capacityForm.formState.dirtyFields)
          : hasDirtyFields(venueForm.formState.dirtyFields);

  useUnsavedChangesWarning(anyDirty);

  // ── Reset all from variant data ────────────────────────────────────────────

  const { reset: resetBase } = baseForm;
  const { reset: resetPrice } = priceForm;
  const { reset: resetCapacity } = capacityForm;
  const { reset: resetVenue } = venueForm;

  const resetAllForms = useCallback(() => {
    if (!variant) return;
    const block = variant.details.find((d) => d.blockType === "venue");
    if (!block || block.blockType !== "venue") return;

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
      max: variant.capacity.max ?? undefined,
      min: variant.capacity.min ?? undefined,
    });

    resetVenue({
      includedSpaces: (block.includedSpaces ?? []).map((s) =>
        typeof s === "string"
          ? { id: s, name: "" }
          : toItem(s as string | { id: string; name: string }),
      ),

      hasAccommodation:
        (block.accommodation as any)?.hasAccommodation ??
        ((block.accommodation as any)?.included != null ||
          (block.accommodation as any)?.capacity != null),
      accommodationIncluded: (block.accommodation as any)?.included ?? false,
      accommodationCapacity:
        (block.accommodation as any)?.capacity ?? undefined,
      hasBreakfast:
        (block.breakfast as any)?.included != null ||
        (block.breakfast as any)?.price != null,
      breakfastIncluded: (block.breakfast as any)?.included ?? false,
      breakfastPrice: (block.breakfast as any)?.price ?? undefined,
      breakfastLoweredPrice:
        (block.breakfast as any)?.loweredPrice ?? undefined,
    });
  }, [variant, resetBase, resetPrice, resetCapacity, resetVenue]);

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

  async function onSubmitVenue(data: VenueData) {
    if (!variant) return;
    const block = variant.details.find((d) => d.blockType === "venue");
    if (!block || block.blockType !== "venue") return;
    setIsSubmitting(true);
    try {
      await updateVariantAsync({
        id: variantId,
        data: {
          details: [
            {
              blockType: "venue",
              id: block.id,
              includedSpaces: data.includedSpaces.map((s) => s.id),

              accommodation: data.hasAccommodation
                ? {
                    included: data.accommodationIncluded,
                    capacity: data.accommodationCapacity ?? null,
                  }
                : {},
              breakfast: data.hasBreakfast
                ? {
                    included: data.breakfastIncluded,
                    price: data.breakfastPrice ?? null,
                    loweredPrice: data.breakfastLoweredPrice ?? null,
                  }
                : {},
            },
          ],
        },
      });
      resetVenue(data);
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
    details: venueForm.handleSubmit(onSubmitVenue),
  };

  // ── Watch values ───────────────────────────────────────────────────────────

  const hasAccommodation = venueForm.watch("hasAccommodation");
  const hasBreakfast = venueForm.watch("hasBreakfast");

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={submitConfig[activeGroup]}
      className="flex gap-6"
      noValidate
    >
      <div className="flex w-full flex-col gap-4">
        {variant && (
          <CompletionWidget
            title="Co doporučujeme vyplnit"
            data={getFullVariantCompletion(variant)}
          />
        )}
        <TabFilter
          tabs={GROUP_TABS}
          activeTab={activeGroup}
          onChange={handleTabChange}
        />

        {/* ── BASE TAB ── */}
        <BaseForm form={baseForm} isActive={activeGroup === "base"} texts={S} />

        {/* ── PRICE TAB ── */}

        <PriceForm
          form={priceForm}
          isActive={activeGroup === "price"}
          texts={S}
        />
        {/* ── CAPACITY TAB ── */}
        <CapacityForm
          form={capacityForm}
          isActive={activeGroup === "capacity"}
          texts={S}
        />

        {/* ── VENUE TAB ── */}
        <div
          className={
            activeGroup !== "details" ? "hidden" : "flex flex-col gap-4"
          }
        >
          <FormSection
            id={S.spaces.id}
            icon={S.spaces.icon}
            title="Prostory"
            surfaceColor={COLOR.surface}
            color={COLOR.text}
          >
            <Controller
              control={venueForm.control}
              name="includedSpaces"
              render={({ field }) => (
                <SpacesCheckboxInput
                  spaces={spaces?.docs ?? []}
                  label="Zahrnuté prostory"
                  onChange={field.onChange}
                  value={field.value}
                  checkColor={COLOR.text}
                />
              )}
            />
          </FormSection>

          <FormSection
            id={S.accommodation.id}
            icon={S.accommodation.icon}
            title="Ubytování"
            surfaceColor={COLOR.surface}
            color={COLOR.text}
          >
            <Controller
              control={venueForm.control}
              name="hasAccommodation"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Dostupné ubytování"
                  checkColor={COLOR.text}
                />
              )}
            />
            {hasAccommodation && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Kapacita ubytování (lůžek)"
                    inputProps={{
                      ...venueForm.register("accommodationCapacity"),
                      type: "number",
                      min: 1,
                      placeholder: "20",
                    }}
                    error={
                      venueForm.formState.errors.accommodationCapacity?.message
                    }
                  />
                </div>
                <Controller
                  control={venueForm.control}
                  name="accommodationIncluded"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value ?? false}
                      onChange={field.onChange}
                      label="Ubytování v ceně"
                      checkColor={COLOR.text}
                    />
                  )}
                />
              </div>
            )}
          </FormSection>

          <FormSection
            id={S.breakfast.id}
            icon={S.breakfast.icon}
            title="Snídaně"
            surfaceColor={COLOR.surface}
            color={COLOR.text}
          >
            <Controller
              control={venueForm.control}
              name="hasBreakfast"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Snídaně k dispozici"
                  checkColor={COLOR.text}
                />
              )}
            />
            {hasBreakfast && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Cena snídaně (Kč/osoba)"
                    inputProps={{
                      ...venueForm.register("breakfastPrice"),
                      type: "number",
                      min: 0,
                      placeholder: "250",
                    }}
                    error={venueForm.formState.errors.breakfastPrice?.message}
                  />
                  <Input
                    label="Zvýhodněná cena (Kč/osoba)"
                    inputProps={{
                      ...venueForm.register("breakfastLoweredPrice"),
                      type: "number",
                      min: 0,
                      placeholder: "150",
                    }}
                    error={
                      venueForm.formState.errors.breakfastLoweredPrice?.message
                    }
                  />
                </div>
                <Controller
                  control={venueForm.control}
                  name="breakfastIncluded"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value ?? false}
                      onChange={field.onChange}
                      label="Snídaně v ceně"
                      checkColor={COLOR.text}
                    />
                  )}
                />
              </div>
            )}
          </FormSection>
        </div>

        {/* ── Save / Cancel buttons ── */}
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
