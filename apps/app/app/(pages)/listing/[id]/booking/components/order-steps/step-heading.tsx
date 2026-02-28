import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {
  title: string;
  description: string;
};

export default function StepHeading({ title, description }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="pb-6">
        <Text variant="heading4" color="primary" className="font-bold">
          {title}
        </Text>
        <Text variant="body3" color="secondary" className="mt-1">
          {description}
        </Text>
      </div>
    </div>
  );
}
