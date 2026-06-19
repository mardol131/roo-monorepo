import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Switch from "@/app/components/ui/atoms/inputs/switch";
import Text from "@/app/components/ui/atoms/text";
import { LucideIcons } from "@roo/common";
import { ElementType } from "react";
import * as lucideIcons from "lucide-react";
import { DashboardSection } from "./dashboard-section";
import { Tooltip } from "react-tooltip";

export type ControlRow = {
  kind?: "button";
  icon: LucideIcons;
  iconColor: string;
  iconBgColor: string;
  title: string;
  text: string;
  button: ButtonProps;
  disabled?: boolean;
  tooltipText?: string;
};

export type SwitchRow = {
  kind: "switch";
  icon: LucideIcons;
  iconColor: string;
  iconBgColor: string;
  title: string;
  text: string;
  checked: boolean;
  onEnable: () => void;
  onDisable: () => void;
  disabled?: boolean;
  tooltipText?: string;
};

export type ControlItem = ControlRow | SwitchRow;

export function ControlSection({ rows }: { rows: ControlItem[] }) {
  return (
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
                <div className="flex items-center gap-1.5">
                  <Text variant="label-lg" color="textDark">
                    {row.title}
                  </Text>
                  {row.tooltipText && (
                    <>
                      <lucideIcons.Info
                        className="w-3.5 h-3.5 text-zinc-400 shrink-0 cursor-default"
                        data-tooltip-id={`tooltip-${i}`}
                      />
                      <Tooltip
                        className="max-w-xs rounded-2xl"
                        id={`tooltip-${i}`}
                        content={
                          <Text variant="label" color="white">
                            {row.tooltipText}
                          </Text>
                        }
                      />
                    </>
                  )}
                </div>
                <Text variant="caption" color="secondary" className="mt-0.5">
                  {row.text}
                </Text>
              </div>
            </div>
            {row.kind === "switch" ? (
              <Switch
                checked={row.checked}
                disabled={row.disabled}
                onEnable={row.onEnable}
                onDisable={row.onDisable}
              />
            ) : (
              <Button
                {...row.button}
                className={`ml-4 shrink-0 ${row.button.className ?? ""}`}
                disabled={row.disabled || row.button.disabled}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
