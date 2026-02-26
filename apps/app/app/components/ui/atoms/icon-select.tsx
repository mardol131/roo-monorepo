import { LucideIcon } from "lucide-react";
import React from "react";
import * as lucideIcons from "lucide-react";
import Text from "./text";

type Props = {
  iconsOptions: LucideIcons[];
  label: string;
  defaultIcon: LucideIcons | undefined;
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
      <div className="borde flex content-start justify-start gap-5 p-3 rounded-lg border-zinc-200">
        {iconsOptions.map((iconName: LucideIcons) => {
          const IconComponent = lucideIcons[iconName] as LucideIcon;
          return (
            <div
              key={iconName}
              onClick={() => {
                if (selectedIcon === iconName) {
                  setSelectedIcon(undefined);
                  onSelect(undefined as any);
                  return;
                }
                setSelectedIcon(iconName);
                onSelect(iconName);
              }}
              className={`p-2 cursor-pointer transition-all  ease-in-out rounded-lg ${selectedIcon === iconName ? "bg-emerald-300" : "bg-zinc-100 hover:bg-emerald-100"}`}
            >
              <IconComponent className="w-6 h-6 " key={iconName} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
