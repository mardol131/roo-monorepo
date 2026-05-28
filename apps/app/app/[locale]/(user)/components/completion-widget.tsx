"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink } from "@/app/i18n/navigation";
import { ChevronDown } from "lucide-react";
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

export type CompletionGroup = {
  label: string;
  weight: number;
  fields: CompletionField[];
  bonus?: boolean;
};

type Props = {
  groups: CompletionGroup[];
  title?: string;
};

export function CompletionWidget({
  groups,
  title = "Dokončení profilu",
}: Props) {
  const [open, setOpen] = useState(false);

  const mainGroups = groups
    .filter((g) => !g.bonus)
    .map((g) => ({
      ...g,
      fields: g.fields.filter((f) => f.relevant !== false),
    }));

  const bonusGroups = groups
    .filter((g) => g.bonus)
    .map((g) => ({
      ...g,
      fields: g.fields.filter((f) => f.relevant !== false),
    }));

  const totalWeight = mainGroups.reduce((s, g) => s + g.weight, 0);

  const percent = Math.round(
    mainGroups.reduce((sum, g) => {
      const filled = g.fields.filter((f) => f.filled).length;
      const total = g.fields.length;
      if (total === 0) return sum;
      return sum + (filled / total) * (g.weight / totalWeight) * 100;
    }, 0),
  );

  const allFilled = mainGroups.every((g) => g.fields.every((f) => f.filled));
  if (allFilled) return null;

  return (
    <DashboardSection
      title={title}
      icon="ClipboardList"
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
        <div className="flex flex-col divide-y divide-zinc-100 pt-2">
          {mainGroups.map((group) => {
            const filledCount = group.fields.filter(
              (f: CompletionField) => f.filled,
            ).length;
            const groupPercent = Math.round(
              group.fields.length > 0
                ? (filledCount / group.fields.length) * 100
                : 0,
            );
            const missingFields = group.fields.filter(
              (f: CompletionField) => !f.filled,
            );
            if (missingFields.length === 0) return null;

            const RADIUS = 9;
            const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
            const offset = CIRCUMFERENCE * (1 - groupPercent / 100);
            const colorClass =
              groupPercent < 75 ? "text-warning" : "text-success";
            const bgClass =
              groupPercent < 75 ? "bg-warning-surface" : "bg-success-surface";

            return (
              <div key={group.label} className="flex flex-col gap-3 py-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 ${bgClass} ${colorClass}`}
                  >
                    <div className="relative w-5 h-5 shrink-0">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r={RADIUS}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="opacity-20"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r={RADIUS}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray={CIRCUMFERENCE}
                          strokeDashoffset={offset}
                        />
                      </svg>
                    </div>
                    <Text variant="caption" as="span" className="font-semibold">
                      {groupPercent} %
                    </Text>
                  </div>
                  <Text
                    variant="label-lg"
                    color="textDark"
                    className="font-semibold"
                  >
                    {group.label}
                  </Text>
                </div>
                <div className="flex flex-wrap gap-2 pl-1">
                  {missingFields.map((field: CompletionField) => (
                    <Button
                      key={field.label}
                      text={field.label}
                      size="xs"
                      version="plain"
                      iconLeft="Pencil"
                      link={field.editHref}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {bonusGroups.some((g) =>
            g.fields.some((f: CompletionField) => !f.filled),
          ) && (
            <div className="flex flex-col gap-1 py-4">
              <Text
                variant="label-lg"
                color="secondary"
                className="mb-2 font-semibold"
              >
                Bonusové položky
              </Text>
              {bonusGroups.map((group) => {
                const missingFields = group.fields.filter(
                  (f: CompletionField) => !f.filled,
                );
                if (missingFields.length === 0) return null;
                return (
                  <div key={group.label} className="flex flex-col gap-3 py-3">
                    <Text
                      variant="label"
                      color="secondary"
                      className="font-semibold"
                    >
                      {group.label}
                    </Text>
                    <div className="flex flex-wrap gap-2 pl-1">
                      {missingFields.map((field: CompletionField) => (
                        <Button
                          key={field.label}
                          text={field.label}
                          size="xs"
                          version="plain"
                          iconLeft="Pencil"
                          link={field.editHref}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DashboardSection>
  );
}
