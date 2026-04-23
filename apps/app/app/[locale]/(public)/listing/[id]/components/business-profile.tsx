import Text from "@/app/components/ui/atoms/text";
import Image from "next/image";
import React from "react";

interface BusinessProfileProps {
  name: string;
  avatar: string;
  listingsCount: number;
}

export default function BusinessProfile({
  name,
  avatar,
  listingsCount,
}: BusinessProfileProps) {
  return (
    <div className="flex flex-col gap-6 rounded-lg">
      <Text variant="h4" color="textDark">
        O pronajímateli
      </Text>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            src={avatar}
            alt={name}
            width={80}
            height={80}
            className="rounded-full object-cover w-15 h-15"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="label-lg" as="p" color="textDark">
            {name}
          </Text>
          <Text variant="label" color="secondary">
            {listingsCount} inzerátů
          </Text>
        </div>
      </div>
    </div>
  );
}
