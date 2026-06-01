"use client";

import Text from "@/app/components/ui/atoms/text";
import { DashboardSection } from "./dashboard-section";
import DashboardSectionHeader from "./dashboard-section-header";

export type CompletionField = {
  label: string;
};

export type CompletionFullResult = {
  percentage: number;
  fieldsToComplete: CompletionField[];
};

type Props = {
  data: CompletionFullResult;
  title?: string;
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CompletionCircle({ percentage }: { percentage: number }) {
  const offset = CIRCUMFERENCE * (1 - percentage / 100);

  const colorClass =
    percentage === 0
      ? "text-danger"
      : percentage < 75
        ? "text-warning"
        : "text-success";

  const bgClass =
    percentage === 0
      ? "bg-danger-surface/40"
      : percentage < 75
        ? "bg-warning-surface/60"
        : "bg-success-surface/60";

  return (
    <div
      className={`relative h-15 w-15 shrink-0 rounded-full ${bgClass} ${colorClass}`}
    >
      <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="opacity-15"
        />
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <Text variant="label-lg" as="span" className="font-bold leading-none">
          {percentage}%
        </Text>
      </div>
    </div>
  );
}

export function CompletionWidget({
  data,
  title = "Dokončení varianty",
}: Props) {
  if (!data) return null;

  const isCompleted = data.percentage === 100;

  if (isCompleted) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200">
        <DashboardSectionHeader
          subheading="To nejdůležitější již máte vyplněné"
          heading="Dobrá práce!"
          icon="ClipboardList"
          iconBgColor="bg-success-surface"
          iconColor="text-success"
          headerRightComponent={
            <CompletionCircle percentage={data.percentage} />
          }
        />
      </div>
    );
  }

  return (
    <DashboardSection
      title={"Ještě doporučujeme vyplnit"}
      subtitle={"Doporučujeme vyplnit následující pole"}
      icon="ClipboardList"
      iconBg="bg-success-surface"
      iconColor="text-success"
      headerRightComponent={<CompletionCircle percentage={data.percentage} />}
    >
      {isCompleted ? null : (
        <div className="flex items-start justify-between gap-6">
          <div>
            {" "}
            <div className="flex flex-wrap items-start gap-2">
              {data.fieldsToComplete.map((field) => (
                <div
                  key={field.label}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 shrink-0" />
                  <Text variant="label" color="secondary">
                    {field.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
