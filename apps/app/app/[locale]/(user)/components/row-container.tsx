import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {
  icon: React.ReactElement;
  label: string;
  subLabel?: string;
  headerRightComponent?: React.ReactElement;
  rowComponents: React.ReactElement[];
  emptyHeading?: string;
  emptyText?: string;
  className?: string;
};

export default function RowContainer({
  icon,
  label,
  headerRightComponent,
  emptyHeading,
  emptyText,
  rowComponents,
  className,
  subLabel,
}: Props) {
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
            <Text variant="label1" color="dark" className="font-semibold">
              {label}
            </Text>
            <Text variant="label4" color="secondary">
              {subLabel}
            </Text>
          </div>
        </div>
        {headerRightComponent && headerRightComponent}
      </div>

      {rowComponents.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <Text variant="label1" color="secondary" className="mb-1">
            {emptyHeading}
          </Text>
          <Text variant="label4" color="secondary">
            {emptyText}
          </Text>
        </div>
      ) : (
        <div className="divide-y divide-zinc-50 flex flex-col">
          {rowComponents.map((component, index) => (
            <React.Fragment key={index}>{component}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
