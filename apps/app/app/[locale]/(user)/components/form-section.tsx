import Text from "@/app/components/ui/atoms/text";
import DashboardHeader from "./dashboard-header";
import DashboardSectionHeader from "./dashboard-section-header";
import { LucideIcons } from "@roo/common";

export function FormSection({
  id,
  icon,
  title,
  subtitle,
  children,
  surfaceColor = "bg-primary-surface",
  color = "text-primary",
  error,
  headerRightComponent,
}: {
  id?: string;
  icon: LucideIcons;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  surfaceColor?: string;
  color?: string;
  error?: boolean;
  headerRightComponent?: React.ReactElement;
}) {
  return (
    <div
      id={id}
      className={`bg-white rounded-2xl border ${error ? "border-red-500" : "border-zinc-200"} scroll-mt-6`}
    >
      <DashboardSectionHeader
        icon={icon}
        heading={title}
        subheading={subtitle}
        iconBgColor={surfaceColor}
        iconColor={color}
        headerRightComponent={headerRightComponent}
      />
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}
