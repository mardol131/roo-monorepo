"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { OfferIncludesExcludes } from "../../../components/offer-includes-excludes";
import { Offer } from "../../../components/offer-item";

type Props = {
  offer: Offer;
  index: number;
};

export default function OfferCard({ offer, index }: Props) {
  const { currentOfferIndex, setCurrentOfferIndex } = useOrderStore();

  return (
    <button
      key={offer.id}
      onClick={() => setCurrentOfferIndex(index)}
      className={`relative p-4 cursor-pointer rounded-2xl border-2 transition-all text-left hover:shadow-md ${
        index === currentOfferIndex
          ? "border-primary/30 bg-zinc-50 shadow-lg"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      {/* Preview Image */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-zinc-100 mb-3">
        <Image
          src={offer.images[0]}
          alt={offer.title}
          fill
          className="object-cover"
        />
        {index === currentOfferIndex && (
          <div className="absolute inset-0 bg-zinc-900/20 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
              <Check className="w-4 h-4 text-zinc-900" />
            </div>
          </div>
        )}
      </div>

      {/* Title and Information */}
      <div className="space-y-3">
        <Text
          variant="heading5"
          color={index === currentOfferIndex ? "dark" : "dark"}
          className="font-semibold truncate"
        >
          {offer.title}
        </Text>
        <div>
          <Text variant="body5" color="secondary">
            {offer.description}
          </Text>
        </div>
        {/* Price */}
        <div>
          <Text variant="label1" color="secondary" className="text-xs mb-1">
            Cena od{" "}
          </Text>
          <Text variant="heading5" color="dark" className="font-bold">
            {offer.price.toLocaleString("cs-CZ")} Kč
          </Text>
          <Text variant="label3" color="dark">
            {offer.duration}
          </Text>
        </div>

        {/* Includes */}
        {offer.includes.length > 0 && (
          <OfferIncludesExcludes
            items={offer.includes}
            title="Součástí"
            icon={Check}
            colorClass="text-green-600"
          />
        )}

        {/* Excludes */}
        {offer.excludes.length > 0 && (
          <OfferIncludesExcludes
            items={offer.excludes}
            title="Není součástí"
            icon={X}
            colorClass="text-red-600"
          />
        )}
      </div>
    </button>
  );
}
