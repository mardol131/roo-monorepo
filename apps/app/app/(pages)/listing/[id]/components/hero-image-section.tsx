import Text from "@/app/components/ui/atoms/text";
import Image from "next/image";
import React from "react";

type Props = {};

export default function HeroImageSection({}: Props) {
  return (
    <div>
      <Text variant="heading3" as="h1" className="mb-5">
        Tady je název inzerátu
      </Text>
      <div className="grid grid-cols-4 gap-4">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg row-span-2 col-span-2 min-h-100 aspect-square w-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Obrázek inzerátu"
          width={600}
          height={400}
          className="rounded-lg w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
