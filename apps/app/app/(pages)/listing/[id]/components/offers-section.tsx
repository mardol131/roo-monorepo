"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useRouter } from "next/navigation";
import OfferItem, { Offer } from "./offer-item";

interface OffersSectionProps {
  offers: Offer[];
  title?: string;
}

export default function OffersSection({
  offers,
  title = "Dostupné nabídky",
}: OffersSectionProps) {
  const { setCurrentOfferIndex, setCurrentStep } = useOrderStore();
  const router = useRouter();

  const handleOfferClick = (index: number) => {
    setCurrentOfferIndex(index);
    setCurrentStep(2);
    router.push(`/inzerat/${offers[index].id}/poptavka`);
  };

  return (
    <section className="flex flex-col gap-6">
      <Text variant="heading5" color="dark">
        {title}
      </Text>

      <div className="grid grid-cols-1 gap-6">
        {offers.map((offer, index) => (
          <OfferItem
            key={offer.id}
            offer={offer}
            onOrderButtonClick={() => handleOfferClick(index)}
            orderButtonText="Přejít k vytvoření poptávky"
          />
        ))}
      </div>
    </section>
  );
}
