"use client";

import React, { useState } from "react";
import { EmptyState, EmptyStateProps } from "./empty-state";
import TabFilter from "./tab-filter";
import Text from "@/app/components/ui/atoms/text";

type Filter = { label: string; value: string };

type Props = {
  filters?: Filter[];
  defaultFilter?: string;
  items: unknown[];
  filterFn?: (item: unknown, activeFilter: string) => boolean;
  renderItem: (item: unknown) => React.ReactNode;
  emptyState: EmptyStateProps;
  title?: string;
  subtitle?: string;
};

export default function CardContainer({
  filters,
  defaultFilter,
  items,
  filterFn,
  renderItem,
  emptyState,
  title,
  subtitle,
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
      {title && subtitle && (
        <div className="max-w-user-profile-content mb-4">
          <Text variant="h4" color="textDark" className="font-bold">
            {title}
          </Text>
          <Text variant="label-lg" color="secondary" className="mt-3">
            {subtitle}
          </Text>
        </div>
      )}
      {filters && filters.length > 0 && (
        <TabFilter
          tabs={filters}
          activeTab={activeFilter}
          onChange={setActiveFilter}
          className="mb-6"
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState {...emptyState} />
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
