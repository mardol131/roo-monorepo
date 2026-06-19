"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import Input from "@/app/components/ui/atoms/inputs/input";
import Text from "@/app/components/ui/atoms/text";
import { useListing, useListingDetail } from "@/app/react-query/listings/hooks";
import { getOptionalPositiveNumber } from "@/app/validation/schema/utils";
import { getIdFromRelationshipField } from "@roo/common";
import { useParams } from "next/navigation";
import { Controller, UseFormReturn } from "react-hook-form";
import z from "zod";

export const durationSchema = z.object({
  hasExactDuration: z.boolean().default(false),
  exactDurationMinutes: getOptionalPositiveNumber("Zadejte kladné číslo"),
  maxDurationMinutes: getOptionalPositiveNumber("Zadejte kladné číslo"),
});
export type DurationData = z.infer<typeof durationSchema>;

type Props = {
  form: UseFormReturn<DurationData>;
  isActive: boolean;
  texts: { duration: TocSection };
};

export function DurationForm({ form, isActive, texts }: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: listing } = useListing(listingId);
  const detailId = listing ? getIdFromRelationshipField(listing.detail.value) : undefined;
  const collection = listing
    ? (`listing-${listing.type}-details` as const)
    : ("listing-entertainment-details" as const);
  const { data: detail } = useListingDetail(collection, detailId);

  const hasExactDuration = form.watch("hasExactDuration");
  const pricingUnit = detail?.price?.pricingUnit;
  const isOneTime = pricingUnit === 'lump_sum' || pricingUnit === 'per_person';

  return (
    <div className={isActive ? "flex flex-col gap-4" : "hidden"}>
      <FormSection
        id={texts.duration.id}
        icon={texts.duration.icon}
        title={texts.duration.title}
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={!!form.formState.errors.exactDurationMinutes}
      >
        {isOneTime ? (
          <Text variant="body" color="secondary">
            Pro jednorázové služby se délka nenastavuje — dodavatel jednoduše přijede a odejde.
          </Text>
        ) : (
          <div className="flex flex-col gap-4">
            <Controller
              control={form.control}
              name="hasExactDuration"
              render={({ field }) => (
                <Checkbox
                  checked={field.value ?? false}
                  onChange={field.onChange}
                  label="Pevně stanovená délka"
                  checkColor="text-variant"
                />
              )}
            />
            {hasExactDuration && (
              <Input
                label="Přesná délka (min)"
                isRequired
                inputProps={{
                  ...form.register("exactDurationMinutes"),
                  type: "number",
                  min: 1,
                  placeholder: "120",
                }}
                error={form.formState.errors.exactDurationMinutes?.message}
              />
            )}
            <Input
              label="Max. délka (min)"
              inputProps={{
                ...form.register("maxDurationMinutes"),
                type: "number",
                min: 1,
                placeholder: "240",
              }}
              error={form.formState.errors.maxDurationMinutes?.message}
            />
          </div>
        )}
      </FormSection>
    </div>
  );
}
