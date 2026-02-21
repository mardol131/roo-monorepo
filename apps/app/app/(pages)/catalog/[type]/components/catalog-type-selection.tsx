"use client";

import Button from "@/app/components/ui/atoms/button";
import text from "@/app/components/ui/atoms/text";
import Text from "@/app/components/ui/atoms/text";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const catalogTypes = [
  {
    value: "gastro",
    label: "Gastro",
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    value: "misto",
    label: "Místo",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    value: "zabava",
    label: "Zábava",
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CatalogTypeSelection({}: Props) {
  return (
    <div className="max-w-content w-full grid grid-cols-3 gap-5">
      {catalogTypes.map((type) => (
        <NavigationCard
          key={type.value}
          title={type.label}
          value={type.value}
          imageSrc={type.imageUrl}
        />
      ))}
    </div>
  );
}

function NavigationCard({
  title,
  value,
  imageSrc,
}: {
  title: string;
  value: string;
  imageSrc: string;
}) {
  const type = useParams().type;
  const active = type === value;

  return (
    <Link href={`/katalog/${value}`}>
      <div
        style={{
          backgroundImage: `url('${imageSrc}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
        className="transition-all ease-in-out rounded-xl"
      >
        <div className="bg-linear-0 transition-all ease-in-out from-white/90 to-white/80 w-full h-full flex items-center justify-between p-3 px-5">
          <Text variant="heading4" color={active ? "primary" : "dark"}>
            {title}
          </Text>
          <Button
            version="plain"
            text={active ? "Aktivní" : "Zobrazit"}
            iconRight={active ? undefined : "ArrowRight"}
            disabled={active}
          />
        </div>
      </div>
    </Link>
  );
}
