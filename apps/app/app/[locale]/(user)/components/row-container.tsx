import Text from "@/app/components/ui/atoms/text";
import React from "react";
import { EmptyState, EmptyStateProps } from "./empty-state";
import { ButtonProps } from "@/app/components/ui/atoms/button";

type Props = {
  icon: React.ReactElement;
  label: string;
  subLabel?: string;
  headerRightComponent?: React.ReactElement;
  rowComponents: (React.ReactElement | null)[];

  className?: string;
  emptyState: EmptyStateProps;
};

export default function RowContainer({
  icon,
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
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="flex flex-col items-start">
            <Text variant="label-lg" color="textDark" className="font-semibold">
              {label}
            </Text>
            <Text variant="caption" color="secondary">
              {subLabel}
            </Text>
          </div>
        </div>
        {headerRightComponent && headerRightComponent}
      </div>
      <div className="divide-y divide-zinc-50 flex flex-col">
        {rowComponents.map((component, index) => (
          <React.Fragment key={index}>{component}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
