"use client";

import Text from "@/app/components/ui/atoms/text";
import ListingCard from "@/app/components/ui/molecules/listing-card";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/app/components/ui/atoms/button";
import HomepageSectionHeader from "./homepage-section-header";

export type CardItem = {
  imageUrl: string;
  title: string;
  price: number;
  id?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  listings: CardItem[];
};

export default function CardsSection({
  title = "Objevujte zážitky",
  subtitle = "Jedinečné akce a zážitky vybrané speciálně pro vás",
  listings,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -312 : 312,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <HomepageSectionHeader title={title} subtitle={subtitle} />
        <div className="flex items-center gap-3 shrink-0">
          <Button link="/catalog" text="Zobrazit vše" version="outlined" />
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
              aria-label="Předchozí"
            >
              <ChevronLeft size={20} className="text-zinc-700" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
              aria-label="Další"
            >
              <ChevronRight size={20} className="text-zinc-700" />
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollContainerRef} className="overflow-x-hidden">
        <div className="flex gap-5 pb-2">
          {listings.map((listing) => (
            <div key={listing.title} className="w-72 shrink-0">
              <ListingCard
                imageUrl={listing.imageUrl}
                title={listing.title}
                price={listing.price}
                id={listing.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
