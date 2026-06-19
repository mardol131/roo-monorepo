import { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { ElementType, ReactElement } from "react";
import DashboardSectionHeader from "./dashboard-section-header";
import { LucideIcons } from "@roo/common";

export function DashboardSection({
  id,
  title,
  icon,
  iconBg,
  iconColor,
  children,
  emptyText,
  headerRightComponent,
  subtitle,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  icon: LucideIcons;
  iconBg: string;
  iconColor: string;
  children?: React.ReactNode;
  emptyText?: string;
  headerRightComponent?: ReactElement;
}) {
  return (
    <div id={id} className="bg-white rounded-2xl border border-zinc-200">
      <DashboardSectionHeader
        subheading={subtitle}
        heading={title}
        icon={icon}
        iconBgColor={iconBg}
        iconColor={iconColor}
        headerRightComponent={headerRightComponent}
      />
      <div className="p-5">
        {children ? (
          children
        ) : (
          <EmptyDashboardSection text={emptyText || "Sekce je prázdná"} />
        )}
      </div>
    </div>
  );
}

const EmptyDashboardSection = ({ text }: { text: string }) => {
  return (
    <div className="bg-white rounded-2xl flex flex-col items-center justify-center text-center">
      <Text variant="label-lg" color="textDark" className="font-semibold mb-1">
        {text}
      </Text>
    </div>
  );
};
