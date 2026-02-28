"use client";

import React from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";
import ButtonSection from "../../button-section";
import OfferCard from "./offer-card";
import StepHeading from "../step-heading";

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
