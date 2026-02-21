import React, { useState } from "react";
import LocationFilter from "./location-filter";
import DateFilter from "./date-filter";
import GuestsFilter from "./guests-filter";
import { Calendar, MapPin, Users } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

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
    <div className="grid grid-cols-3 gap-4 w-full">
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <FilterLabel icon={MapPin} text="Kde se akce koná" />
          <LocationFilter
            value={filters.location}
            onChange={handleLocationChange}
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <FilterLabel icon={Calendar} text="Kdy se akce koná" />
          <DateFilter value={filters.date} onChange={handleDateChange} />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <FilterLabel icon={Users} text="Počet hostů" />
          <GuestsFilter value={filters.guests} onChange={handleGuestsChange} />
        </div>
      </div>
    </div>
  );
}

function FilterLabel({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Icon className="w-10 h-10 text-rose-500" />
      <Text variant="heading4" color="dark">
        {text}
      </Text>
    </div>
  );
}
