"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useRouter } from "@/app/i18n/navigation";
import { useOrderStore } from "@/app/store/order-store";
import { BadgeCheck, CircleCheck } from "lucide-react";
import { useParams } from "next/navigation";

interface Props {
  startingPrice?: number;
}

export default function OrderBox({ startingPrice }: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  const router = useRouter();
  const { setCurrentStep } = useOrderStore();

  const handleOrderClick = () => {
    setCurrentStep(1);
    router.push({
      pathname: "/listing/[listingId]/inquiry",
      params: { listingId },
    });
  };

  return (
    <div className="border border-zinc-200 rounded-2xl overflow-hidden sticky top-30 shadow-sm">
      {/* Cena */}
      <div className="p-6 flex flex-col gap-1">
        {startingPrice != null ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <Text variant="caption" color="secondary">
                od
              </Text>
              <Text variant="h2" color="primary">
                {startingPrice.toLocaleString("cs-CZ")} Kč
              </Text>
            </div>
            <Text variant="caption" color="secondary">
              Konečná cena závisí na vybrané variantě
            </Text>
          </>
        ) : (
          <Text variant="h4" color="textDark">
            Nezávazná poptávka
          </Text>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        <Button
          onClick={handleOrderClick}
          size="lg"
          text="Vyplnit poptávku"
          version="primary"
          className="w-full"
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CircleCheck size={14} className="text-zinc-400 shrink-0" />
            <Text variant="caption" color="secondary">
              Zatím nebude nic účtováno
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <CircleCheck size={14} className="text-zinc-400 shrink-0" />
            <Text variant="caption" color="secondary">
              Pronajímatel odpoví do 48 hodin
            </Text>
          </div>
        </div>
      </div>

      {/* Premium badge */}
      <div className="relative overflow-hidden border-t border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-6 py-4 flex items-center gap-3">
        <BadgeCheck size={20} className="text-primary shrink-0" />
        <div>
          <Text variant="label-lg" color="textDark">
            Prémiový partner ROO
          </Text>
          <Text variant="caption" color="secondary">
            Ověřený a prověřený pronajímatel
          </Text>
        </div>
        <div className="absolute right-0 top-0 h-full flex gap-2 opacity-10 pointer-events-none">
          <div className="w-2 h-full bg-primary rotate-12 translate-x-1" />
          <div className="w-2 h-full bg-primary rotate-12" />
          <div className="w-2 h-full bg-primary rotate-12 -translate-x-1" />
        </div>
      </div>
    </div>
  );
}
