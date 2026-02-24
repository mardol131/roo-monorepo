"use client";

import React from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";
import OfferItem from "../../../components/offer-item";
import OfferCard from "./offer-card";

export default function OrderStepSelectVariant() {
  const { currentOfferIndex, offers } = useOrderStore();

  return (
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
  );
}
