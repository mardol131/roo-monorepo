"use client";

import React from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";

export default function OrderStepSelectVariant() {
  const {
    currentOfferIndex,
    currentImageIndex,
    offers,
    setCurrentOfferIndex,
    setCurrentImageIndex,
    goToPreviousOffer,
    goToNextOffer,
    goToPreviousImage,
    goToNextImage,
    goToNextStep,
  } = useOrderStore();

  const offer = offers[currentOfferIndex];

  return (
    <div className="flex flex-col gap-6">
      {/* Offer Selection */}
      {offers.length > 1 && (
        <div className="pb-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-4">
            <Text variant="heading5" color="dark" className="font-bold">
              Vyberte variantu
            </Text>
            <Text variant="label3" color="secondary">
              {currentOfferIndex + 1} z {offers.length}
            </Text>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {offers.map((o, index) => (
              <button
                key={o.id}
                onClick={() => setCurrentOfferIndex(index)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                  index === currentOfferIndex
                    ? "border-zinc-900 bg-zinc-50 shadow-lg"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                {/* Preview Image */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-100 mb-3">
                  <Image
                    src={o.images[0]}
                    alt={o.title}
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

                {/* Title and Price */}
                <div className="space-y-1">
                  <Text
                    variant="label1"
                    color={index === currentOfferIndex ? "dark" : "dark"}
                    className="font-semibold truncate"
                  >
                    {o.title}
                  </Text>
                  <div className="flex items-center justify-between">
                    <Text variant="label2" color="dark" className="font-bold">
                      {o.price.toLocaleString("cs-CZ")} Kč
                    </Text>
                    <Text variant="label3" color="secondary">
                      {o.duration}
                    </Text>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Image Carousel and Ideal For */}
        <div className="flex flex-col gap-6">
          {/* Carousel */}
          <div className="relative w-full aspect-square max-w-80 rounded-lg overflow-hidden bg-zinc-100">
            <Image
              src={offer.images[currentImageIndex]}
              alt={`${offer.title} - ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
            {offer.images.length > 1 && (
              <>
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {offer.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Ideal For */}
          {offer.idealFor.length > 0 && (
            <div className="flex flex-col gap-3">
              <Text variant="label1" color="dark" className="font-medium">
                Ideální pro
              </Text>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
                {offer.idealFor.map((category, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"></div>
                    <Text
                      variant="label4"
                      color="secondary"
                      className="text-center"
                    >
                      {category}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Description, Includes, Excludes */}
        <div className="flex flex-col gap-6">
          {/* Description */}
          <div>
            <Text variant="body3" color="secondary" className="leading-relaxed">
              {offer.description}
            </Text>
          </div>

          {/* Includes and Excludes */}
          <div className="grid grid-cols-2 gap-6">
            {/* Includes */}
            <div className="flex flex-col gap-2">
              <Text variant="label1" color="dark" className="font-medium">
                Nabídka obsahuje
              </Text>
              <div className="flex flex-col gap-1.5">
                {offer.includes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <Text
                      variant="label2"
                      color="dark"
                      className="leading-tight"
                    >
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Excludes */}
            <div className="flex flex-col gap-2">
              <Text variant="label1" color="dark" className="font-medium">
                Nabídka neobsahuje
              </Text>
              <div className="flex flex-col gap-1.5">
                {offer.excludes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <Text
                      variant="label2"
                      color="secondary"
                      className="leading-tight"
                    >
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price info */}
          <div className="border-t border-zinc-100 pt-4">
            <div className="flex flex-col gap-0.5">
              <Text variant="heading5" color="dark" className="font-bold">
                {offer.price.toLocaleString("cs-CZ")} Kč
              </Text>
              <Text variant="label2" color="secondary">
                {offer.duration}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
