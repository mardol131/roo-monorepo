"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { VariantIncludesExcludes } from "../../../../components/variant-includes-excludes";
import { Variant } from "@roo/common";

type Props = {
  variant: Variant;
  index: number;
};

export default function OrderVariantSummaryCard({ variant, index }: Props) {
  const { currentVariantIndex, setCurrentVariantIndex } = useOrderStore();
  const isSelected = index === currentVariantIndex;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      currentImageIndex === 0
        ? variant.images.length - 1
        : currentImageIndex - 1,
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      currentImageIndex === variant.images.length - 1
        ? 0
        : currentImageIndex + 1,
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setCurrentVariantIndex(index)}
      onKeyDown={(e) => e.key === "Enter" && setCurrentVariantIndex(index)}
      className={`group relative flex flex-col text-left rounded-2xl border-2 transition-all overflow-hidden cursor-pointer ${
        isSelected
          ? "border-primary bg-zinc-50 shadow-sm"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      {/* Carousel */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-zinc-100">
        <Image
          src={variant.images[currentImageIndex]}
          alt={`${variant.title} - ${currentImageIndex + 1}`}
          fill
          className="object-cover"
        />
        {variant.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {variant.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 w-2 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Selected checkmark */}
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? "border-primary bg-primary"
            : "border-white/80 bg-white/60 opacity-0 group-hover:opacity-100"
        }`}
      >
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <div>
          <Text
            variant="label-lg"
            color="textDark"
            className="font-semibold truncate"
          >
            {variant.title}
          </Text>
          <Text
            variant="caption"
            color="secondary"
            className="mt-0.5 line-clamp-2"
          >
            {variant.description}
          </Text>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <Text variant="h4" color="primary" className="font-bold">
            {variant.price.toLocaleString("cs-CZ")} Kč
          </Text>
          <Text variant="caption" color="secondary">
            {variant.duration}
          </Text>
        </div>

        {/* Includes / Excludes */}
        {(variant.includes.length > 0 || variant.excludes.length > 0) && (
          <div className="flex flex-col gap-5 pt-1 border-t border-zinc-100">
            {variant.includes.length > 0 && (
              <VariantIncludesExcludes
                items={variant.includes}
                title="Součástí"
                icon={Check}
                colorClass="text-emerald-500"
              />
            )}
            {variant.excludes.length > 0 && (
              <VariantIncludesExcludes
                items={variant.excludes}
                title="Není součástí"
                icon={X}
                colorClass="text-red-500"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
