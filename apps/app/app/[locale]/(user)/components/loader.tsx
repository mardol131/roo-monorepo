import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {
  text?: string;
};

export default function Loader({ text }: Props) {
  return (
    <div className="pt-20 flex items-center justify-center flex-col">
      {text && (
        <Text variant="h2" className="mb-4" color="textLight">
          {text}
        </Text>
      )}
      <div className="w-8 h-8 border-4 border-text-light border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
