"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/app/i18n/navigation";
import Text from "@/app/components/ui/atoms/text";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import HomepageSectionHeader from "./homepage-section-header";

const MAX_VISIBLE = 8;

const GROUPS = [
  {
    label: "Typ akce",
    key: "eventTypes" as const,
    catalog: "/catalog/venue" as const,
    from: [244, 63, 94] as const, // rose-500
    to: [251, 207, 232] as const, // rose-200
  },
  {
    label: "Typ místa",
    key: "placeTypes" as const,
    catalog: "/catalog/venue" as const,
    from: [5, 150, 105] as const, // emerald-600
    to: [110, 231, 183] as const, // emerald-300
  },
  {
    label: "Entertainment",
    key: "entertainmentTypes" as const,
    catalog: "/catalog/entertainment" as const,
    from: [124, 58, 237] as const, // violet-600
    to: [196, 181, 253] as const, // violet-300
  },
  {
    label: "Kuchyně",
    key: "cuisines" as const,
    catalog: "/catalog/gastro" as const,
    from: [217, 119, 6] as const, // amber-600
    to: [252, 211, 77] as const, // amber-300
  },
] as const;

function tagColor(
  from: readonly [number, number, number],
  to: readonly [number, number, number],
  index: number,
  total: number,
): string {
  const t = total > 1 ? index / (total - 1) : 0;
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function TagSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-8 rounded-lg bg-zinc-100 animate-pulse"
          style={{ width: `${60 + (i % 3) * 24}px` }}
        />
      ))}
    </div>
  );
}

export default function FilterTagsSection() {
  const { data: filters } = useFilterOptions();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <HomepageSectionHeader
        title="Jakou akci plánujete?"
        subtitle="Vyberte typ a zobrazíme vám odpovídající nabídku

"
      />

      <div className="flex flex-col gap-6">
        {GROUPS.map((group, gi) => (
          <div key={group.key}>
            <Text
              variant="label"
              color="textLight"
              className="uppercase tracking-wider mb-2.5"
            >
              {group.label}
            </Text>
            {!filters ? (
              <TagSkeleton />
            ) : (
              (() => {
                const all = filters[group.key] as {
                  id: string;
                  name: string;
                  slug: string;
                }[];
                const visible = all.slice(0, MAX_VISIBLE);
                const hasMore = all.length > MAX_VISIBLE;
                return (
                  <div className="flex flex-wrap gap-2">
                    {visible.map((item, ii) => (
                      <Link
                        key={item.id}
                        href={{
                          pathname: group.catalog,
                          query: { [group.key]: item.id },
                        }}
                      >
                        <span
                          className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:opacity-80 cursor-pointer"
                          style={{
                            backgroundColor: tagColor(
                              group.from,
                              group.to,
                              ii,
                              100,
                            ),
                          }}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ))}
                    {hasMore && (
                      <Link href={{ pathname: group.catalog }}>
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition-all duration-200 cursor-pointer">
                          Zobrazit více
                        </span>
                      </Link>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
