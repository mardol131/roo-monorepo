"use client";

import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";

export type CarouselImage = {
  filename?: string | null;
  alt?: string | null;
};

export default function CardImageCarousel({
  images,
  altFallback,
}: {
  images: CarouselImage[];
  altFallback: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = images.filter((img) => !!img?.filename);
  const currentImage = allImages[currentImageIndex];

  const goToPrevious = () =>
    setCurrentImageIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));

  const goToNext = () =>
    setCurrentImageIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <>
      {currentImage?.filename ? (
        <img
          src={generateMediaUrl(currentImage.filename)}
          alt={currentImage.alt ?? altFallback}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
          <ImageIcon className="w-10 h-10" />
        </div>
      )}

      {allImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Předchozí fotka"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-zinc-700 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Další fotka"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-zinc-700 p-2 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Text variant="label-sm" color="white">
              {currentImageIndex + 1} / {allImages.length}
            </Text>
          </div>

          <div className="absolute bottom-3 p-2 bg-black/50 rounded-lg left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Fotka ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-1.5"
                    : "bg-white/50 w-1.5 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
