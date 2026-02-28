import React from "react";
import { LucideIcon } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

type Props = {
  icon: LucideIcon;
  onClick: () => void;
  isActive: boolean;
  heading: string;
  text: string;
};

export default function EventSelectionButton({
  icon: Icon,
  onClick,
  isActive,
  heading,
  text,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col gap-4 p-5 rounded-2xl border transition-all text-left w-full ${
        isActive
          ? "border-primary border shadow-sm"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          isActive ? "bg-primary" : "bg-zinc-100 group-hover:bg-zinc-200"
        }`}
      >
        <Icon
          className={`w-5 h-5 transition-colors ${
            isActive ? "text-white" : "text-zinc-600"
          }`}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Text variant="heading5" color="dark" className="font-semibold">
          {heading}
        </Text>
        <Text variant="label3" color="secondary">
          {text}
        </Text>
      </div>
    </button>
  );
}
