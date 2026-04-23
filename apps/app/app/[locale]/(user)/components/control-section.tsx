import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { Cog } from "lucide-react";
import { ElementType } from "react";

export type ControlRow = {
  icon: ElementType;
  iconColor: string;
  iconBgColor: string;
  title: string;
  text: string;
  button: ButtonProps;
};

export function ControlSection({ rows }: { rows: ControlRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-zinc-100">
          <Cog className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        <Text variant="h4" color="textDark">
          Ovládání
        </Text>
      </div>
      <div className="flex flex-col divide-y divide-zinc-100">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
