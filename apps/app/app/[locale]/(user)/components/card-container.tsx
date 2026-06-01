"use client";

import React, { useState } from "react";
import { EmptyState, EmptyStateProps } from "./empty-state";
import TabFilter from "./tab-filter";
import Text from "@/app/components/ui/atoms/text";

type Filter = { label: string; value: string };

type Props = {
  items: React.ReactNode[] | undefined;
  emptyState: EmptyStateProps;
  title?: string;
  subtitle?: string;
  filterComponent?: React.ReactNode;
};

export default function CardContainer({
  items,
  emptyState,
  title,
  subtitle,
  filterComponent,
}: Props) {
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
      {filterComponent && <div className="mb-6">{filterComponent}</div>}

      {!items || items?.length === 0 ? (
        <EmptyState {...emptyState} />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <React.Fragment key={i}>{item}</React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}
