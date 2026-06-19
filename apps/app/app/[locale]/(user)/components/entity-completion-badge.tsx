import Text from "@/app/components/ui/atoms/text";
import { useId } from "react";
import { Tooltip } from "react-tooltip";

const RADIUS = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function EntityCompletionBadge({
  percentage,
  tooltipContent,
}: {
  percentage: number;
  tooltipContent?: string;
}) {
  const id = useId();
  const offset = CIRCUMFERENCE * (1 - percentage / 100);

  const colorClass =
    percentage === 0
      ? "text-danger"
      : percentage < 75
        ? "text-warning"
        : "text-success";

  const bgClass =
    percentage === 0
      ? "bg-danger-surface/60"
      : percentage < 75
        ? "bg-warning-surface"
        : "bg-success-surface";

  return (
    <>
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl shrink-0 ${bgClass} ${colorClass}`}
      data-tooltip-id={tooltipContent ? id : undefined}
    >
      <div className="relative w-6 h-6 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
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
      <Text variant="label" as="span" className="font-semibold">
        {percentage} %
      </Text>
    </div>
    {tooltipContent && <Tooltip id={id} content={tooltipContent} />}
    </>
  );
}
