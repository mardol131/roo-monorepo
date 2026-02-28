import { LucideIcon } from "lucide-react";
import React from "react";
import * as lucideIcons from "lucide-react";
import Text from "./text";

type Props = {
  iconsOptions: LucideIcons[];
  label: string;
  defaultIcon?: LucideIcons;
  onSelect: (icon: LucideIcons) => void;
};

export type LucideIcons = keyof typeof lucideIcons;

export default function IconSelect({
  iconsOptions,
  label,
  defaultIcon,
  onSelect,
}: Props) {
  const [selectedIcon, setSelectedIcon] = React.useState<
    LucideIcons | undefined
  >(defaultIcon);

  return (
    <div>
      <Text
        variant="label2"
        color="dark"
        className="font-semibold mb-1.5 block"
      >
        {label}
      </Text>
      <div className="flex flex-wrap gap-2">
        {iconsOptions.map((iconName: LucideIcons) => {
          const IconComponent = lucideIcons[iconName] as LucideIcon;
          const isSelected = selectedIcon === iconName;
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => {
                if (isSelected) {
                  setSelectedIcon(undefined);
                  onSelect(undefined as any);
                  return;
                }
                setSelectedIcon(iconName);
                onSelect(iconName);
              }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ease-in-out ${
                isSelected
                  ? "bg-primary shadow-sm"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 transition-colors ${
                  isSelected ? "text-white" : "text-zinc-600"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
