"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink } from "@/app/i18n/navigation";
import {
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { DashboardSection } from "./dashboard-section";

const SEGMENT_COLORS = [
  "bg-orange-500",
  "bg-orange-400",
  "bg-amber-500",
  "bg-amber-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-lime-500",
  "bg-green-400",
  "bg-green-500",
  "bg-emerald-500",
] as const;

export type CompletionField = {
  label: string;
  filled: boolean;
  editHref: IntlLink;
  relevant?: boolean;
};

type Props = {
  fields: CompletionField[];
  title?: string;
};

export function CompletionWidget({
  fields,
  title = "Dokončení profilu",
}: Props) {
  const [open, setOpen] = useState(false);
  const relevant = fields.filter((f) => f.relevant !== false);
  const filled = relevant.filter((f) => f.filled).length;
  const total = relevant.length;
  const percent = Math.round((filled / total) * 100);

  if (relevant.every((f) => f.filled)) return null;

  return (
    <DashboardSection
      title={title}
      icon={"ClipboardList"}
      iconBg="bg-success-surface"
      iconColor="text-success"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left pb-2"
      >
        <div className="flex gap-1 w-full">
          {SEGMENT_COLORS.map((color, i) => {
            const segmentThreshold = (i + 1) * 10;
            const active = percent >= segmentThreshold - 9;
            const partialFill = active
              ? Math.min(100, ((percent - (segmentThreshold - 10)) / 10) * 100)
              : 0;
            return (
              <div
                key={i}
                className="relative flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden"
              >
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${color}`}
                  style={{ width: `${partialFill}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <Text variant="caption" color="secondary">
            {percent} % vyplněno
          </Text>
          <div className="flex items-center gap-3">
            <Text variant="caption" color="secondary">
              {open ? "Skrýt detaily" : "Zobrazit chybějící"}
            </Text>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {open && (
        <div className="divide-y divide-zinc-100 pt-1">
          {relevant.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between py-2.5 rounded-lg"
            >
              <div className="flex items-center gap-2">
                {field.filled ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <Text
                  variant="label"
                  color={field.filled ? "success" : "textDark"}
                >
                  {field.label}
                </Text>
              </div>
              {!field.filled && (
                <Button
                  text="Vyplnit"
                  size="xs"
                  version="plain"
                  iconRight="Pencil"
                  link={field.editHref}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
