"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import ImageGallery from "@/app/components/ui/molecules/image-gallery";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  coverImage: string;
  gallery: string[];
}

export default function HeroImageSection({ coverImage, gallery }: Props) {
  const images = [coverImage, ...gallery].slice(0, 5);
  const allImageUrls = [coverImage, ...gallery].map((image) =>
    generateMediaUrl(image),
  );

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openAt = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <div>
      <div className="relative grid grid-cols-4 gap-4">
        {images.map((filename, i) => (
          <button
            key={filename + i}
            onClick={() => openAt(i)}
            className={`cursor-pointer overflow-hidden rounded-lg ${
              i === 0 ? "row-span-2 col-span-2" : ""
            }`}
          >
            <Image
              src={generateMediaUrl(filename)}
              alt={`Image ${i + 1}`}
              width={600}
              height={400}
              className="w-full h-full aspect-square object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
        <Button
          className="absolute right-3 bottom-3 p-2 rounded-md shadow-xl"
          text="Zobrazit více"
          version="secondary"
          iconRight="Image"
          onClick={() => openAt(0)}
        />
      </div>

      <ImageGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={allImageUrls}
        initialIndex={galleryIndex}
      />
    </div>
  );
}
