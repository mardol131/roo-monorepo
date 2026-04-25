import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="flex-1">
      <div className="mb-8">
        <Text variant="h3" color="textDark" className="font-bold">
          Oblíení dodavatelé
        </Text>
        <Text variant="label" color="secondary" className="mt-1">
          Přehled vašich oblíbených dodavatelů.
        </Text>
      </div>
    </main>
  );
}
