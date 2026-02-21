"use client";

import React from "react";
import { Calendar, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";

export default function OrderStepReviewVariant() {
  const {
    currentOfferIndex,
    currentImageIndex,
    offers,
    setCurrentImageIndex,
    goToPreviousImage,
    goToNextImage,
    goToNextStep,
    goToPreviousStep,
  } = useOrderStore();

  const offer = offers[currentOfferIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-4 border-b border-zinc-200">
        <Text variant="heading5" color="dark" className="font-bold">
          Kontrola vybrané varianty
        </Text>
        <Text variant="body3" color="secondary" className="mt-1">
          Zkontrolujte si údaje před pokračováním k vytvoření poptávky
        </Text>
      </div>

      {/* Selected Offer Card */}
      <div className="border border-zinc-200 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Image Carousel */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-100">
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

          {/* Right Column - Details */}
          <div className="flex flex-col gap-4">
            <div>
              <Text variant="heading5" color="dark" className="font-bold mb-2">
                {offer.title}
              </Text>
              <Text
                variant="body3"
                color="secondary"
                className="leading-relaxed"
              >
                {offer.description}
              </Text>
            </div>

            {/* Price */}
            <div className="bg-zinc-50 rounded-lg p-4">
              <Text
                variant="label3"
                color="secondary"
                className="uppercase tracking-wide mb-2"
              >
                Cena
              </Text>
              <Text variant="heading4" color="dark" className="font-bold">
                {offer.price.toLocaleString("cs-CZ")} Kč
              </Text>
              <Text variant="label2" color="secondary">
                {offer.duration}
              </Text>
              {offer.availableDate && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-200">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <div>
                    <Text
                      variant="label2"
                      color="secondary"
                      className="text-xs"
                    >
                      Dostupné od
                    </Text>
                    <Text variant="label1" color="dark" className="font-medium">
                      {offer.availableDate}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Includes and Excludes */}
        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-zinc-200">
          {/* Includes */}
          <div className="flex flex-col gap-2">
            <Text variant="label1" color="dark" className="font-medium">
              Nabídka obsahuje
            </Text>
            <div className="flex flex-col gap-1.5">
              {offer.includes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <Text variant="label2" color="dark" className="leading-tight">
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

        {/* Ideal For */}
        {offer.idealFor.length > 0 && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <Text variant="label1" color="dark" className="font-medium mb-3">
              Ideální pro
            </Text>
            <div className="flex flex-wrap gap-2">
              {offer.idealFor.map((category, i) => (
                <div key={i} className="px-3 py-1.5 bg-zinc-100 rounded-full">
                  <Text variant="label3" color="dark" className="font-medium">
                    {category}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
    </div>
  );
}
