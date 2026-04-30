import Text from "@/app/components/ui/atoms/text";
import React, { ElementType } from "react";
import * as lucideIcons from "lucide-react";
import { LucideIcons } from "@roo/common";

type Props = {
  heading: string;
  subheading?: string;
  icon: LucideIcons;
  iconColor: string;
  iconBgColor: string;
  headerRightComponent?: React.ReactElement;
};

export default function DashboardSectionHeader({
  heading,
  subheading,
  icon,
  iconColor,
  iconBgColor,
  headerRightComponent,
}: Props) {
  const Icon = lucideIcons[icon] as ElementType;

  return (
    <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-8 h-8 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex flex-col items-start">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            {heading}
          </Text>
          {subheading && (
            <Text variant="caption" color="secondary">
              {subheading}
            </Text>
          )}
        </div>
      </div>
      {headerRightComponent && headerRightComponent}
    </div>
  );
}
