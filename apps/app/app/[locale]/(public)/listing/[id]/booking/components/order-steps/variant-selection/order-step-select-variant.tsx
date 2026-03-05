"use client";

import { useOrderStore } from "@/app/store/order-store";
import StepHeading from "../step-heading";
import OfferCard from "./offer-card";

export default function OrderStepSelectVariant() {
  const { offers } = useOrderStore();

  return (
    <div>
      <StepHeading
        title="Vyberte variantu"
        description="Zvolte variantu, kterou chcete objednat"
      />
      <div className="flex flex-col gap-6">
        {/* Offer Selection */}
        {offers.length > 1 && (
          <div className="pb-6 border-zinc-200">
            <div className="grid grid-cols-3 gap-3">
              {offers.map((o, index) => (
                <OfferCard key={o.id} offer={o} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
