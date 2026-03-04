import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import Image from "next/image";
import React from "react";

type Props = {};

export default function HeroImageSection({}: Props) {
  return (
    <div>
      <div className="relative grid grid-cols-4 gap-4">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg row-span-2 col-span-2 min-h-100 aspect-square w-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Button
          className="absolute right-3 bottom-3 bg-white p-2 rounded-md"
          text="Zobrazit více"
          version="white"
          iconRight="Image"
        />
      </div>
      <Text variant="heading3" as="h1" className="mt-5">
        Tady je název inzerátu
      </Text>
    </div>
  );
}
