"use client";

import React from "react";
import { Calendar, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { useOrderStore } from "@/app/store/order-store";

export default function OrderModal() {
  const {
    isOrderModalOpen,
    currentOfferIndex,
    currentImageIndex,
    offers,
    setCurrentOfferIndex,
    setCurrentImageIndex,
    goToPreviousOffer,
    goToNextOffer,
    goToPreviousImage,
    goToNextImage,
    closeOrderModal,
  } = useOrderStore();

  const offer = offers[currentOfferIndex];

  const handleOrder = () => {
    // TODO: Handle order submission
    console.log("Order submitted for:", offer.id);
    closeOrderModal();
  };

  return (
    <ModalLayout
      header={offer.title}
      isOpen={isOrderModalOpen}
      onClose={closeOrderModal}
      maxWidth="max-w-300"
    >
      <div className="flex flex-col gap-8">
        {/* Offer Selection */}
        {offers.length > 1 && (
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-200">
            <button
              onClick={goToPreviousOffer}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-600" />
            </button>

            <div className="flex gap-3 overflow-x-auto flex-1">
              {offers.map((o, index) => (
                <button
                  key={o.id}
                  onClick={() => setCurrentOfferIndex(index)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    index === currentOfferIndex
                      ? "bg-rose-500 text-white"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  <Text variant="label2" className="font-medium">
                    {o.title}
                  </Text>
                </button>
              ))}
            </div>

            <button
              onClick={goToNextOffer}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </button>
          </div>
        )}

        {/* Content */}
        {/* Carousel and Ideal For */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            {/* Carousel */}
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

            {/* Ideal For */}
            {offer.idealFor.length > 0 && (
              <div className="flex flex-col gap-3">
                <Text variant="label1" color="dark" className="font-medium">
                  Ideální pro
                </Text>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                  {offer.idealFor.map((category, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100"></div>
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

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Description */}
            <div>
              <Text variant="body3" color="secondary" className="mb-3">
                {offer.description}
              </Text>
            </div>

            {/* Includes and Excludes */}
            <div className="space-y-6">
              {/* Includes */}
              <div className="flex flex-col gap-2">
                <Text variant="label1" color="dark" className="font-medium">
                  Nabídka obsahuje
                </Text>
                <div className="flex flex-col gap-1.5">
                  {offer.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
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
                      <X className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
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
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-4">
                {offer.availableDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                    <div>
                      <Text
                        variant="label2"
                        color="secondary"
                        className="text-xs"
                      >
                        Nabídka ceny pro konkrétní termín
                      </Text>
                      <Text variant="heading5" color="dark">
                        {offer.availableDate}
                      </Text>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <Text variant="heading5" color="primary">
                    {offer.price.toLocaleString("cs-CZ")} Kč
                  </Text>
                  <Text variant="label2" color="secondary">
                    {offer.duration}
                  </Text>
                </div>
              </div>

              <Button text="Objednat" version="primary" onClick={handleOrder} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200" />

        {/* Date, Price and Button */}
      </div>
    </ModalLayout>
  );
}
