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
  const [showAll, setShowAll] = useState(false);

  const displayCount = 2;
  const displayedOffers = showAll ? offers : offers.slice(0, displayCount);

  return (
    <section className="flex flex-col gap-6">
      <Text variant="heading5" color="dark">
        {title}
      </Text>

      <div className="grid grid-cols-1 gap-6">
        {displayedOffers.map((offer) => (
          <OfferItem key={offer.id} offer={offer} />
        ))}
      </div>

      {displayCount < offers.length && (
        <div>
          <Button
            text={
              showAll
                ? "Skrýt nabídky"
                : `Ukázat všech ${offers.length} nabídek`
            }
            version="primary"
            iconRight={showAll ? "ChevronUp" : "ChevronDown"}
            onClick={() => setShowAll(!showAll)}
          />
        </div>
      )}
    </section>
  );
}
