import Text from "@/app/components/ui/atoms/text";
import { ElementType } from "react";
import DashboardSectionHeader from "./dashboard-section-header";
import { DashboardSection } from "./dashboard-section";

type Props = {
  heading: string;
  items: string[];
  icon: ElementType;
  iconColor: string;
  iconBgColor: string;
};

export function ItemListCard({
  heading,
  items,
  icon: Icon,
  iconColor,
  iconBgColor,
}: Props) {
  return (
    <DashboardSection
      title={heading}
      icon={Icon}
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
