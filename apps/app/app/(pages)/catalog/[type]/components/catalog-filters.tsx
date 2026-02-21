"use client";

import React, { useState } from "react";
import { Sliders } from "lucide-react";
import Text from "../../../../components/ui/atoms/text";
import FilterSection from "./filter-section";
import PriceFilter from "./price-filter";
import Button from "@/app/components/ui/atoms/button";

interface FilterState {
  eventTypes: string[];
  locations: string[];
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
}

const EVENT_TYPES = [
  { id: "conference", label: "Konference" },
  { id: "workshop", label: "Workshop" },
  { id: "networking", label: "Networking" },
  { id: "product-launch", label: "Představení produktu" },
  { id: "corporate", label: "Firemní akce" },
  { id: "training", label: "Školení" },
];

const LOCATIONS = [
  { id: "prague", label: "Praha" },
  { id: "brno", label: "Brno" },
  { id: "ostrava", label: "Ostrava" },
  { id: "plzen", label: "Plzeň" },
  { id: "online", label: "Online" },
];

const CATEGORIES = [
  { id: "it", label: "IT a technologie" },
  { id: "business", label: "Podnikání" },
  { id: "marketing", label: "Marketing" },
  { id: "design", label: "Design" },
  { id: "education", label: "Vzdělání" },
];

interface CatalogFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export default function CatalogFilters({
  onFilterChange,
}: CatalogFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    eventTypes: [],
    locations: [],
    categories: [],
    minPrice: 0,
    maxPrice: 100000,
  });

  const handleFilterChange = (
    filterKey: keyof FilterState,
    selectedIds: string[] | number,
  ) => {
    const updatedFilters = { ...filters, [filterKey]: selectedIds };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handlePriceChange = (min: number, max: number) => {
    const updatedFilters = { ...filters, minPrice: min, maxPrice: max };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const activeFiltersCount =
    filters.eventTypes.length +
    filters.locations.length +
    filters.categories.length;

  return (
    <div className="relative h-full flex flex-col">
      {/* Mapa */}
      <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 aspect-square flex items-center justify-center border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <Text variant="heading5" color="secondary" className="mb-2">
            Mapa
          </Text>
          <Text variant="body5" color="secondary">
            Mockup mapy bude zde
          </Text>
        </div>
      </div>

      {/* Filtry */}
      <div className="bg-white relative pb-10 rounded-xl border border-zinc-200 p-5 overflow-y-auto flex-1 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
          <Sliders className="h-5 w-5 text-rose-500" />
          <Text variant="heading5" className="text-zinc-900">
            Filtry
          </Text>

          {activeFiltersCount > 0 && (
            <span className="ml-auto inline-flex items-center justify-center h-6 w-6 rounded-full bg-rose-500 text-white text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Button
          text="Všechny filtry"
          version="outlined"
          size="sm"
          className="w-full mb-5"
        />

        <div className="space-y-5">
          <PriceFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onPriceChange={handlePriceChange}
          />
          <FilterSection
            title="Typ akce"
            options={EVENT_TYPES}
            selectedIds={filters.eventTypes}
            onSelectionChange={(ids) => handleFilterChange("eventTypes", ids)}
          />

          <FilterSection
            title="Místo konání"
            options={LOCATIONS}
            selectedIds={filters.locations}
            onSelectionChange={(ids) => handleFilterChange("locations", ids)}
          />

          <FilterSection
            title="Kategorie"
            options={CATEGORIES}
            selectedIds={filters.categories}
            onSelectionChange={(ids) => handleFilterChange("categories", ids)}
          />
        </div>
      </div>
      <div className="w-full sticky bottom-10 px-5 mt-4">
        <Button
          text="Vyhledat"
          size="md"
          className="shadow-lg w-full"
          iconRight="Search"
        />
      </div>
    </div>
  );
}
