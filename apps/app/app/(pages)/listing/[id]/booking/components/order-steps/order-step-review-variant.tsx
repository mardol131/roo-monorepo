"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import OfferItem from "../../../components/offer-item";

export default function OrderStepReviewVariant() {
  const {
    currentOfferIndex,
    currentImageIndex,
    offers,
    setCurrentImageIndex,
    goToPreviousImage,
    goToNextImage,
  } = useOrderStore();

  const offer = offers[currentOfferIndex];

  const { goToNextStep } = useOrderStore();

  return (
    <div className="flex flex-col gap-6">
      {/* Selected Offer Card */}
      <OfferItem
        offer={offer}
        onOrderButtonClick={goToNextStep}
        orderButtonText="Pokračovat"
      />
    </div>
  );
}
