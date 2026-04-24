import Text from "@/app/components/ui/atoms/text";
import React, { ElementType } from "react";

type Props = {
  heading: string;
  icon: ElementType;
  iconColor: string;
  iconBgColor: string;
};

export default function DashboardSectionHeader({
  heading,
  icon: Icon,
  iconColor,
  iconBgColor,
}: Props) {
  return (
    <div className="flex items-center gap-2 p-5 border-b border-zinc-200">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBgColor}`}
      >
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <Text variant="h4" color="textDark">
        {heading}
      </Text>
    </div>
  );
}
