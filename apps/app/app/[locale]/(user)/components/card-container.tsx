"use client";

import React, { useState } from "react";
import { EmptyState } from "./empty-state";
import TabFilter from "./tab-filter";

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
        <TabFilter
          tabs={filters}
          activeTab={activeFilter}
          onChange={setActiveFilter}
          className="mb-6"
        />
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
