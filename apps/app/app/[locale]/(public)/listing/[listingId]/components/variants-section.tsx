"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useParams } from "next/navigation";
import { Variant } from "@roo/common";
import VariantItem from "./variant-item";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useRouter } from "@/app/i18n/navigation";

interface VariantsSectionProps {
  title?: string;
}

export default function VariantsSection({
  title = "Dostupné Varianty",
}: VariantsSectionProps) {
  const { listingId } = useParams<{ listingId: string }>();

  const { setCurrentVariantId, setCurrentStep } = useOrderStore();
  const { data: variants } = useVariantsByListing(listingId);
  const router = useRouter();

  if (!variants || variants.docs?.length === 0) return null;

  const handleVariantClick = (variantId: string) => {
    setCurrentVariantId(variantId);
    setCurrentStep(2);
    router.push({
      pathname: "/listing/[listingId]/inquiry",
      params: { listingId },
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <Text variant="h4" color="textDark">
        {title}
      </Text>

      <div className="grid grid-cols-1 gap-6">
        {variants?.docs?.map((variant) => (
          <VariantItem
            key={variant.id}
            variant={variant}
            onOrderButtonClick={() => handleVariantClick(variant.id)}
            orderButtonText="Přejít k vytvoření poptávky"
          />
        ))}
      </div>
    </section>
  );
}
