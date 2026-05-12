import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import Image from "next/image";
import React from "react";

interface Props {
  name: string;
  coverImage: string;
  gallery: string[];
}

export default function HeroImageSection({ name, coverImage, gallery }: Props) {
  const images = [coverImage, ...gallery].slice(0, 5);

  return (
    <div>
      <div className="relative grid grid-cols-4 gap-4">
        {images.map((filename, i) => (
          <Image
            key={filename}
            src={generateMediaUrl(filename)}
            alt={name}
            width={600}
            height={400}
            className={
              i === 0
                ? "rounded-lg row-span-2 col-span-2 aspect-square w-full object-cover"
                : "rounded-lg w-full h-full aspect-square object-cover"
            }
          />
        ))}
        <Button
          className="absolute right-3 bottom-3 bg-white p-2 rounded-md"
          text="Zobrazit více"
          version="white"
          iconRight="Image"
        />
      </div>
      <Text variant="h2" as="h1" className="mt-5">
        {name}
      </Text>
    </div>
  );
}
