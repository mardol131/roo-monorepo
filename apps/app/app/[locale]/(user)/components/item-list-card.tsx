import Text from "@/app/components/ui/atoms/text";
import { ElementType } from "react";
import DashboardSectionHeader from "./dashboard-section-header";
import { DashboardSection } from "./dashboard-section";
import { LucideIcons } from "@roo/common";
import * as lucideIcons from "lucide-react";
type Props = {
  heading: string;
  items: string[];
  icon: LucideIcons;
  iconColor: string;
  iconBgColor: string;
};

export function ItemListCard({
  heading,
  items,
  icon,
  iconColor,
  iconBgColor,
}: Props) {
  const Icon = lucideIcons[icon] as ElementType;

  return (
    <DashboardSection
      title={heading}
      icon={icon}
      iconColor={iconColor}
      iconBg={iconBgColor}
    >
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
            <Text variant="body-sm" color="textDark">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
