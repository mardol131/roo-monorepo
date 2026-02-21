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
      <Text variant="heading5" color="dark">
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
          <Text variant="label1" as="p" color="dark">
            {name}
          </Text>
          <Text variant="label2" color="secondary">
            {listingsCount} inzerátů
          </Text>
        </div>
      </div>
    </div>
  );
}
