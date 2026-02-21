"use client";

import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import React, { useState } from "react";
import OfferItem, { Offer } from "./offer-item";

interface OffersSectionProps {
  offers: Offer[];
  title?: string;
}

export default function OffersSection({
  offers,
  title = "Dostupné nabídky",
}: OffersSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <Text variant="heading5" color="dark">
        {title}
      </Text>

      <div className="grid grid-cols-1 gap-6">
        {offers.map((offer) => (
          <OfferItem key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
