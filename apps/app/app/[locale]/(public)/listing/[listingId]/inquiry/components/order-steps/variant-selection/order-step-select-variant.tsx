"use client";

import { useOrderStore } from "@/app/store/order-store";
import StepHeading from "../step-heading";
import OrderVariantSummaryCard from "./order-variant-summary-card";
import OrderCustomRequestCard from "./order-custom-request-card";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useParams } from "next/navigation";
import Text from "@/app/components/ui/atoms/text";
import ServiceTimeSection from "../../service-time-section";
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import type { CustomRequestFormData } from "../custom-request/custom-request-form-schema";

export default function OrderStepSelectVariant({
  eventStart,
  eventEnd,
  listingType,
  control,
  setValue,
  errors,
}: {
  eventStart?: string;
  eventEnd?: string;
  listingType?: string;
  control: Control<CustomRequestFormData>;
  setValue: UseFormSetValue<CustomRequestFormData>;
  errors: FieldErrors<CustomRequestFormData>;
}) {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: variants } = useVariantsByListing(listingId);
  const { currentVariantId } = useOrderStore();

  if (!variants) return null;

  const selectedVariant = variants.docs?.find((v) => v.id === currentVariantId);

  return (
    <div>
      <StepHeading
        title="Vyberte variantu"
        description="Zvolte variantu, kterou chcete objednat"
      />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          {variants?.docs?.map((v, index) => (
            <OrderVariantSummaryCard key={v.id} variant={v} index={index} />
          ))}
        </div>

        {selectedVariant && (
          <ServiceTimeSection
            durationMinutes={selectedVariant.durationMinutes ?? undefined}
            eventStart={eventStart}
            eventEnd={eventEnd}
            isOneTime={!!selectedVariant.isOneTime}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-200" />
          <Text variant="h4" color="secondary">
            nebo
          </Text>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <OrderCustomRequestCard />
      </div>
    </div>
  );
}
