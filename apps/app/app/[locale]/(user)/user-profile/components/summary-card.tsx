import Text from "@/app/components/ui/atoms/text";
import React from "react";

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
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex flex-col gap-0.5">
        <Text variant="h2" color="textDark">
          {value}
        </Text>
        <Text variant="label" color="secondary">
          {label}
        </Text>
        {note && (
          <Text variant="caption" color="textLight" className="mt-1">
            {note}
          </Text>
        )}
      </div>
    </div>
  );
}
