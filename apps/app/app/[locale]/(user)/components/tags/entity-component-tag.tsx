import { LucideIcons } from "@roo/common";
import { LucideProps } from "lucide-react";
import React from "react";
import * as lucideIcons from "lucide-react";
type Props = {
  text?: string;
  bgColor: string;
  textColor: string;
  icon?: LucideIcons;
};

export default function EntityComponentTag({
  text,
  bgColor,
  textColor,
  icon,
}: Props) {
  const IconComponent = icon
    ? (lucideIcons[icon] as React.ComponentType<LucideProps>)
    : null;
  return (
    <span
      className={`${bgColor} ${textColor} ${text ? "px-2 py-1" : "p-1"} rounded-full text-xs font-semibold flex items-center gap-2`}
    >
      {IconComponent && (
        <IconComponent className={`w-3.5 h-3.5 ${text ? "mr-1" : ""}`} />
      )}
      {text && text}
    </span>
  );
}
