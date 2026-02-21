import React, { useState } from "react";
import LocationFilter from "./location-filter";
import DateFilter from "./date-filter";
import GuestsFilter from "./guests-filter";

interface GuestsFilterState {
  adults: number;
  children: number;
  accessibility: boolean;
  pets: boolean;
}

interface GeneralFiltersState {
  location: string;
  date: string;
  guests: GuestsFilterState;
}

interface GeneralFiltersProps {
  onFiltersChange?: (filters: GeneralFiltersState) => void;
}

export default function GeneralFilters({
  onFiltersChange,
}: GeneralFiltersProps) {
  const [filters, setFilters] = useState<GeneralFiltersState>({
    location: "",
    date: "",
    guests: {
      adults: 1,
      children: 0,
      accessibility: false,
      pets: false,
    },
  });

  const handleLocationChange = (value: string) => {
    const updatedFilters = { ...filters, location: value };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleDateChange = (value: string) => {
    const updatedFilters = { ...filters, date: value };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleGuestsChange = (value: GuestsFilterState) => {
    const updatedFilters = { ...filters, guests: value };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full border rounded-xl p-5 border-zinc-200 shadow-lg">
      <LocationFilter
        value={filters.location}
        onChange={handleLocationChange}
      />
      <DateFilter value={filters.date} onChange={handleDateChange} />
      <GuestsFilter value={filters.guests} onChange={handleGuestsChange} />
    </div>
  );
}
