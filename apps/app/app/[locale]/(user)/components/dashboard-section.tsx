import Text from "@/app/components/ui/atoms/text";
import { ElementType } from "react";

export function DashboardSection({
  title,
  icon: Icon,
  iconBg,
  iconColor,
  children,
}: {
  title: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <Text variant="h4" color="textDark">
          {title}
        </Text>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
