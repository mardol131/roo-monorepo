"use client";

import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import React, { useState } from "react";

export interface Item {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ItemsSectionProps {
  title: string;
  items: Item[];
  displayCount?: number;
  buttonText?: string;
  columns?: 1 | 2 | 3 | 4;
}

export default function ItemsSection({
  title,
  items,
  displayCount = 10,
  buttonText,
  columns = 2,
}: ItemsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? items : items.slice(0, displayCount);
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns];

  return (
    <section className="flex flex-col gap-6">
      <Text variant="heading5" color="dark">
        {title}
      </Text>

      <div className={`grid ${colsClass} gap-6`}>
        {displayedItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex-shrink-0 text-primary mt-1">{item.icon}</div>
            <Text variant="label1" color="dark">
              {item.label}
            </Text>
          </div>
        ))}
      </div>

      {displayCount < items.length && (
        <div>
          <Button
            text={
              showAll
                ? "Skrýt položky"
                : buttonText || `Ukázat všech ${items.length} položek`
            }
            version="primary"
            iconRight={showAll ? "ChevronUp" : "ChevronDown"}
            onClick={() => setShowAll(!showAll)}
          />
        </div>
      )}
    </section>
  );
}
