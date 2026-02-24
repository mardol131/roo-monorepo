"use client";

import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import React, { useState } from "react";
import { Calendar, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useOrderStore } from "@/app/store/order-store";
import { OfferIncludesExcludes } from "./offer-includes-excludes";

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  includes: string[];
  excludes: string[];
  idealFor: string[];
  images: string[];
  availableDate?: string;
}

interface OfferItemProps {
  offer: Offer;
  onOrderButtonClick: () => void;
  orderButtonText: string;
}

export default function OfferItem({
  offer,
  onOrderButtonClick,
  orderButtonText,
}: OfferItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { openOrderModal } = useOrderStore();

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? offer.images.length - 1 : currentImageIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === offer.images.length - 1 ? 0 : currentImageIndex + 1,
    );
  };

  return (
    <div className="border border-zinc-200 rounded-3xl p-10 flex flex-col gap-6 transition-all">
      <div className="grid grid-cols-[400px_1fr] gap-15">
        <div>
          {/* Carousel */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-zinc-100 mb-6">
            <Image
              src={offer.images[currentImageIndex]}
              alt={`${offer.title} - ${currentImageIndex + 1}`}
              className="object-cover aspect-square"
              width={1000}
              height={1000}
            />
            {offer.images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
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
          {/* Ideal for */}
          {offer.idealFor.length > 0 && (
            <div className="flex flex-col gap-3">
              <Text variant="label1" color="dark" className="font-medium">
                Ideální pro
              </Text>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-2">
                {offer.idealFor.map((category, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"></div>
                    <Text variant="label4" color="secondary">
                      {category}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full justify-between">
          <div className="flex flex-col gap-10">
            {/* Header */}
            <div>
              <Text variant="heading5" color="dark" className="mb-2">
                {offer.title}
              </Text>
              <Text variant="body4" color="secondary">
                {offer.description}
              </Text>
            </div>

            {/* Includes and Excludes */}
            <div className="grid grid-cols-2 gap-6">
              {/* Includes */}
              <OfferIncludesExcludes
                icon={FaCircleCheck}
                title="Nabídka obsahuje"
                items={offer.includes}
                colorClass="text-emerald-500"
              />
              {/* Excludes */}
              <OfferIncludesExcludes
                icon={FaCircleXmark}
                title="Nabídka neobsahuje"
                items={offer.excludes}
                colorClass="text-red-500"
              />
            </div>

            {/* Date and Price */}

            {/* Price and Button */}
          </div>
          <div>
            <div className="border border-zinc-300 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <Text variant="heading4" color="primary">
                  {offer.price.toLocaleString("cs-CZ")} Kč
                </Text>
                <Text variant="label2" color="secondary">
                  {offer.duration}
                </Text>
              </div>
              <Button
                text={orderButtonText}
                version="primary"
                onClick={onOrderButtonClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
