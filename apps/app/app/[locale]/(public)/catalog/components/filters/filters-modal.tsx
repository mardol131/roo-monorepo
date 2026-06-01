"use client";

import { useEffect, useState } from "react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { FilterGroup } from "./filter-groups";
import { createEvents } from "@/app/functions/create-events";
import { useCatalogStore } from "@/app/store/catalog-store";

interface FiltersModalProps<TFilters> {
  onClose?: () => void;
  onApply?: (filters: TFilters) => void;
  groups: FilterGroup<TFilters>[];
  initialFilters: TFilters;
}

export default function FiltersModal<TFilters>({
  onClose,
  onApply,
  groups,
  initialFilters,
}: FiltersModalProps<TFilters>) {
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [activeGroupKey, setActiveGroupKey] = useState(groups[0].key);
  const { filtersModalOpen, setFiltersModalOpen } = useCatalogStore();

  useEffect(() => {
    if (filtersModalOpen) setFilters(initialFilters);
  }, [filtersModalOpen, initialFilters]);

  const totalActive = groups.reduce((sum, g) => sum + g.count(filters), 0);
  const activeGroup = groups.find((g) => g.key === activeGroupKey) ?? groups[0];
  const closeHandler = () => {
    onClose?.();
    setFiltersModalOpen(false);
  };
  const handleApply = () => {
    onApply?.(filters);
    closeHandler();
  };

  const header = (
    <div className="flex items-center gap-2">
      <Text variant="h4" color="textDark">
        Filtry
      </Text>
      {totalActive > 0 && (
        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-white text-xs font-semibold">
          {totalActive}
        </span>
      )}
    </div>
  );

  return (
    <ModalLayout
      header={header}
      onClose={closeHandler}
      isOpen={filtersModalOpen}
      maxWidth="max-w-3xl"
    >
      <div className="-mx-6 -my-6 flex flex-col">
        {/* Body */}
        <div className="flex h-[calc(100vh-350px)] min-h-64">
          {/* Left nav */}
          <div className="w-48 shrink-0 border-r border-zinc-200 py-3 flex flex-col gap-1 overflow-y-auto">
            {groups.map((group) => {
              const count = group.count(filters);
              const isActive = activeGroupKey === group.key;
              return (
                <button
                  key={group.key}
                  onClick={() => setActiveGroupKey(group.key)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors text-sm font-medium ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span>{group.label}</span>
                  {count > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-white text-xs font-semibold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right content */}
          <div className="flex-1 overflow-y-auto p-6">
            <activeGroup.Content filters={filters} onChange={setFilters} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200">
          <Button
            version="plain"
            text="Vymazat vše"
            size="sm"
            onClick={() => setFilters(initialFilters)}
            disabled={totalActive === 0}
          />
          <Button text="Zobrazit výsledky" size="sm" onClick={handleApply} />
        </div>
      </div>
    </ModalLayout>
  );
}
