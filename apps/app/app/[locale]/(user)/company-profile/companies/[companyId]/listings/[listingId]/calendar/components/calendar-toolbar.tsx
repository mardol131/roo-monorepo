"use client";

import Text from "@/app/components/ui/atoms/text";
import { addDays, format, isSameWeek } from "date-fns";
import { cs } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarToolbar({
  weekStart,
  onPrev,
  onNext,
  onToday,
}: Props) {
  const weekEnd = addDays(weekStart, 6);
  const isCurrentWeek = isSameWeek(weekStart, new Date(), { weekStartsOn: 1 });

  const label =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${format(weekStart, "d", { locale: cs })}–${format(weekEnd, "d. MMMM yyyy", { locale: cs })}`
      : `${format(weekStart, "d. MMM", { locale: cs })} – ${format(weekEnd, "d. MMM yyyy", { locale: cs })}`;

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
          aria-label="Předchozí týden"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
          aria-label="Následující týden"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <Text variant="label1" color="dark" as="span" className="ml-2 min-w-56">
          {label}
        </Text>
        {!isCurrentWeek && (
          <button
            onClick={onToday}
            className="ml-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Dnes
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3">
        <LegendItem color="bg-primary" label="Potvrzená poptávka" />
        <div className="w-px h-3 bg-zinc-200" />
        <LegendItem color="bg-calendar" label="Vlastní událost" />
        <LegendItem
          color="bg-calendar-surface border border-dashed border-calendar"
          label="V plánování"
        />
        <LegendItem color="bg-zinc-200" label="Zrušeno" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-sm shrink-0 ${color}`} />
      <Text variant="label4" color="muted" as="span">
        {label}
      </Text>
    </div>
  );
}
