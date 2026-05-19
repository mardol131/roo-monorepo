"use client";

import { useOrderStore } from "@/app/store/order-store";
import StepHeading from "../step-heading";
import OrderVariantSummaryCard from "./order-variant-summary-card";
import OrderCustomRequestCard from "./order-custom-request-card";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useParams } from "next/navigation";
import Text from "@/app/components/ui/atoms/text";

export default function OrderStepSelectVariant() {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: variants } = useVariantsByListing(listingId);

  if (!variants) return null;

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
