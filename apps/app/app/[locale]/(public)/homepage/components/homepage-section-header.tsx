import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {
  title: string;
  subtitle: string;
};

export default function HomepageSectionHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-12">
      <Text variant="display-xl" className="mb-3">
        {title}
      </Text>
      <Text variant="body-lg" className="text-zinc-600">
        {subtitle}
      </Text>
    </div>
  );
}
