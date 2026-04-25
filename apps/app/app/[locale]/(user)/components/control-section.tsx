import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { LucideIcons } from "@roo/common";
import { Cog } from "lucide-react";
import { ElementType } from "react";
import * as lucideIcons from "lucide-react";
import { DashboardSection } from "./dashboard-section";

export type ControlRow = {
  icon: LucideIcons;
  iconColor: string;
  iconBgColor: string;
  title: string;
  text: string;
  button: ButtonProps;
  disabled?: boolean;
};

export function ControlSection({ rows }: { rows: ControlRow[] }) {
  return (
    <DashboardSection
      title="Ovládání"
      icon={Cog}
      iconBg="bg-zinc-100"
      iconColor="text-zinc-500"
    >
      <div className="flex flex-col divide-y divide-zinc-100">
        {rows.map((row, i) => {
          const Icon = lucideIcons[row.icon] as ElementType;
          return (
            <div
              key={i}
              className={`flex items-center justify-between py-3 first:pt-0 last:pb-0 ${row.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.iconBgColor}`}
                >
                  <Icon className={`w-4 h-4 ${row.iconColor}`} />
                </div>
                <div className="flex flex-col">
                  <Text variant="label-lg" color="textDark">
                    {row.title}
                  </Text>
                  <Text variant="caption" color="secondary" className="mt-0.5">
                    {row.text}
                  </Text>
                </div>
              </div>
              <Button
                {...row.button}
                className={`ml-4 shrink-0 ${row.button.className ?? ""}`}
                disabled={row.disabled}
              />
            </div>
          );
        })}
      </div>
    </DashboardSection>
  );
}
