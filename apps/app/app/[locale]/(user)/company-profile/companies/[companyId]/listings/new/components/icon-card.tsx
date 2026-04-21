import Text from "@/app/components/ui/atoms/text";
import { LucideIcons } from "@roo/common";
import React from "react";
import * as lucideIcons from "lucide-react";

type Props = {
  label: string;
  description: string;
  icon: LucideIcons;
  onClick: () => void;
  selected?: boolean;
};

export default function IconCard({ label, description, icon, onClick, selected }: Props) {
  const Icon = lucideIcons[icon] as unknown as React.FC<
    React.SVGProps<SVGSVGElement>
  >;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-start gap-3 p-6 rounded-2xl border transition-all text-left group ${
        selected
          ? "border-listing bg-listing-surface"
          : "border-zinc-200 bg-white hover:border-listing hover:bg-listing-surface"
      }`}
    >
      <div className={`p-3 rounded-xl transition-colors ${selected ? "bg-listing/10" : "bg-zinc-100 group-hover:bg-listing/10"}`}>
        <Icon className={`w-6 h-6 transition-colors ${selected ? "text-listing" : "text-zinc-500 group-hover:text-listing"}`} />
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="subheading2">{label}</Text>
        <Text variant="label2" color="light">
          {description}
        </Text>
      </div>
    </button>
  );
}
