"use client";

import React, { useState } from "react";
import { EmptyState } from "./empty-state";

type Filter = { label: string; value: string };

type Props = {
  filters?: Filter[];
  defaultFilter?: string;
  items: unknown[];
  filterFn?: (item: unknown, activeFilter: string) => boolean;
  renderItem: (item: unknown) => React.ReactNode;
  emptyState?: { text: string; subtext?: string };
};

export default function CardContainer({
  filters,
  defaultFilter,
  items,
  filterFn,
  renderItem,
  emptyState,
}: Props) {
  const [activeFilter, setActiveFilter] = useState(
    defaultFilter ?? filters?.[0]?.value ?? "all",
  );

  const filtered =
    filterFn && activeFilter !== "all"
      ? items.filter((item) => filterFn(item, activeFilter))
      : items;

  return (
    <>
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl w-fit mb-6">
          {filters.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeFilter === tab.value
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          text={emptyState?.text ?? "Žádné položky"}
          subtext={emptyState?.subtext ?? ""}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item, i) => (
            <React.Fragment key={i}>{renderItem(item)}</React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}
