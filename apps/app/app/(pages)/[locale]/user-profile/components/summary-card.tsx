import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {};

export function SummaryCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  note,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  note?: string;
}) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col gap-3">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex flex-col">
        <Text variant="heading4" color="dark" className="font-bold">
          {value}
        </Text>
        <Text variant="label4" color="secondary">
          {label}
        </Text>
        {note && (
          <Text
            variant="label4"
            color="secondary"
            className="text-zinc-400 italic"
          >
            {note}
          </Text>
        )}
      </div>
    </div>
  );
}
