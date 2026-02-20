"use client";

import Text from "@/app/components/ui/atoms/text";
import ListingCard from "@/app/components/ui/molecules/listing-card";
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/app/components/ui/atoms/button";

type Props = {};

export const mockListings = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    title: "Letní festival v Praze",
    price: "350",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Koncert pod širým nebem",
    price: "490",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    title: "Divadelní představení",
    price: "250",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80",
    title: "Jazz večer v jazzklubu",
    price: "420",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80",
    title: "Openair kino",
    price: "180",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7f419344ca51?auto=format&fit=crop&w=400&q=80",
    title: "Stand-up comedy show",
    price: "280",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1501612780289-11201ef255cb?auto=format&fit=crop&w=400&q=80",
    title: "Hudební festival",
    price: "650",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
    title: "Klasický koncert",
    price: "380",
  },
];

export default function CardsSection({}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 240 + 24; // card width (w-64) + gap (gap-6)
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-5 items-center">
          <div>
            <Text variant="heading4" color="dark">
              Objevujte zážitky v Praze
            </Text>
            <Text variant="body4" color="light">
              Jedinečné akce a zážitky vybrané speciálně pro vás
            </Text>
          </div>
          <Button link="/" text="Zobrazit" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
            aria-label="Předchozí"
          >
            <ChevronLeft size={24} className="text-zinc-900" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
            aria-label="Další"
          >
            <ChevronRight size={24} className="text-zinc-900" />
          </button>
        </div>
      </div>
      <div ref={scrollContainerRef} className="overflow-x-hidden">
        <div className="flex gap-6 pb-4">
          {mockListings.map((listing) => (
            <ListingCard
              key={listing.title}
              imageUrl={listing.imageUrl}
              title={listing.title}
              price={listing.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
