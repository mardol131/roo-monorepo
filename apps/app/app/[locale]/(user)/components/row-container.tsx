import Text from "@/app/components/ui/atoms/text";
import React from "react";
import { EmptyState, EmptyStateProps } from "./empty-state";
import { ButtonProps } from "@/app/components/ui/atoms/button";
import DashboardSectionHeader from "./dashboard-section-header";
import { LucideIcons } from "@roo/common";

type Props = {
  icon: LucideIcons;
  iconColor: string;
  iconBgColor: string;
  label: string;
  subLabel?: string;
  headerRightComponent?: React.ReactElement;
  rowComponents: (React.ReactElement | null)[];
  className?: string;
  emptyState: EmptyStateProps;
};

export default function RowContainer({
  icon,
  iconColor,
  iconBgColor,
  label,
  headerRightComponent,
  rowComponents,
  className,
  subLabel,
  emptyState,
}: Props) {
  if (rowComponents.length === 0) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-200 overflow-hidden ${className}`}
    >
      <DashboardSectionHeader
        heading={label}
        subheading={subLabel}
        icon={icon}
        iconColor={iconColor}
        iconBgColor={iconBgColor}
        headerRightComponent={headerRightComponent}
      />
      <div className="divide-y divide-zinc-50 flex flex-col">
        {rowComponents.map((component, index) => (
          <React.Fragment key={index}>{component}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
