import React from "react";
import Text from "@/app/components/ui/atoms/text";
import { InfoItem } from "./header-info-item";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";

type InfoItemDef = {
  icon: string;
  text: string;
};

type Props = {
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  name: string;
  nameSideComponent?: React.ReactNode;
  infoItems?: InfoItemDef[];
  button?: ButtonProps;
};

export default function DashboardHeader({
  icon: Icon,
  iconBg = "bg-rose-50",
  iconColor = "text-rose-500",
  name,
  nameSideComponent,
  infoItems,
  button,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <Text variant="h3" color="textDark" className="font-bold">
              {name}
            </Text>
            {nameSideComponent}
          </div>
          {infoItems && infoItems.length > 0 && (
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              {infoItems.map((item) => (
                <InfoItem
                  key={item.icon + item.text}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {button && <Button {...button} />}
    </div>
  );
}
