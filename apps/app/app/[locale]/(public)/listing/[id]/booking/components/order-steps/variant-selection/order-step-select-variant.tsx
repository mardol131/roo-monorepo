"use client";

import { useOrderStore } from "@/app/store/order-store";
import StepHeading from "../step-heading";
import OrderVariantSummaryCard from "./order-variant-summary-card";

export default function OrderStepSelectVariant() {
  const { variants } = useOrderStore();

  return (
    <div>
      <StepHeading
        title="Vyberte variantu"
        description="Zvolte variantu, kterou chcete objednat"
      />
      <div className="flex flex-col gap-6">
        {/* Variant Selection */}
        {variants.length > 1 && (
          <div className="pb-6 border-zinc-200">
            <div className="grid grid-cols-3 gap-3">
              {variants.map((v, index) => (
                <OrderVariantSummaryCard key={v.id} variant={v} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
