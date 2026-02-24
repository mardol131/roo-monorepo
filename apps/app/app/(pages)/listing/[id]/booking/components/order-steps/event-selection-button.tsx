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
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
        isActive
          ? "border-zinc-900 bg-zinc-50"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-zinc-900" />
      </div>
      <div className="flex flex-col">
        <Text variant="label1" color="dark" className="font-semibold">
          {heading}
        </Text>
        <Text variant="label3" color="secondary" className="mt-1">
          {text}
        </Text>
      </div>
    </button>
  );
}
