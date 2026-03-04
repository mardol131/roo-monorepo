"use client";

import Text from "@/app/components/ui/atoms/text";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import React from "react";
import Button from "@/app/components/ui/atoms/button";

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  displayCount?: number;
}

export default function ReviewsSection({
  reviews,
  displayCount = 3,
}: ReviewsSectionProps) {
  const [showAll, setShowAll] = React.useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, displayCount);

  return (
    <section className="flex flex-col gap-6">
      <Text variant="heading5" color="dark">
        Recenze ({reviews.length})
      </Text>

      <div className="grid grid-cols-2 gap-6">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="p-4 bg-zinc-50 rounded-lg flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center items-start">
                <div className="flex flex-col gap-1">
                  <Text variant="label1" color="dark">
                    {review.author}
                  </Text>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-2 h-2 ${
                        i < review.rating ? "text-rose-500" : "text-zinc-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Text variant="body5" color="dark" className="leading-relaxed">
              {review.text}
            </Text>
          </div>
        ))}
      </div>

      {displayCount < reviews.length && (
        <div>
          <Button
            text={
              showAll
                ? "Skrýt recenze"
                : `Ukázat všech ${reviews.length} recenzí`
            }
            version="primary"
            iconRight={showAll ? "ChevronUp" : "ChevronDown"}
            onClick={() => setShowAll(!showAll)}
          />
        </div>
      )}
    </section>
  );
}
