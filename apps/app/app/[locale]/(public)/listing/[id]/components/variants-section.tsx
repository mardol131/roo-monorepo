"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useRouter } from "next/navigation";
import { Variant } from "@roo/common";
import VariantItem from "./variant-item";

interface VariantsSectionProps {
  variants: Variant[];
  title?: string;
}

export default function VariantsSection({
  variants,
  title = "Dostupné Varianty",
}: VariantsSectionProps) {
  const { setCurrentVariantIndex, setCurrentStep } = useOrderStore();
  const router = useRouter();

  const handleVariantClick = (index: number) => {
    setCurrentVariantIndex(index);
    setCurrentStep(2);
    router.push(`/inzerat/${variants[index].id}/poptavka`);
  };

  return (
    <section className="flex flex-col gap-6">
      <Text variant="h4" color="textDark">
        {title}
      </Text>

      <div className="grid grid-cols-1 gap-6">
        {variants.map((variant, index) => (
          <VariantItem
            key={variant.id}
            variant={variant}
            onOrderButtonClick={() => handleVariantClick(index)}
            orderButtonText="Přejít k vytvoření poptávky"
          />
        ))}
      </div>
    </section>
  );
}
