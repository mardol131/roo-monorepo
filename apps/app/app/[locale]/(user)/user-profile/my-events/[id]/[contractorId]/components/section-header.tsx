import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {
  icon: React.ElementType;
  title: string;
};

export default function SectionHeader({ icon: Icon, title }: Props) {
  return (
    <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-zinc-500" />
      </div>
      <Text variant="label1" color="dark" className="font-semibold">
        {title}
      </Text>
    </div>
  );
}
