import Text from "@/app/components/ui/atoms/text";
import React from "react";

interface Props {
  description: string;
}

export default function DescriptionSection({ description }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <Text variant="h4" color="textDark">
        O tomto inzerátu
      </Text>
      <Text variant="body" color="secondary" className="leading-relaxed">
        {description}
      </Text>
    </section>
  );
}
