"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import Button from "../../../components/ui/atoms/button";
import Text from "../../../components/ui/atoms/text";

interface EventFiltersProps {
  onSearch?: (filters: FilterValues) => void;
  className?: string;
}

type FilterValues = {
  eventType: string;
  location: string;
  date: string;
  guestCount: string;
};

const eventTypes = [
  { value: "", label: "Vyberte typ eventu" },
  { value: "conference", label: "Konference" },
  { value: "workshop", label: "Workshop" },
  { value: "networking", label: "Networking" },
  { value: "product-launch", label: "Představení produktu" },
  { value: "corporate", label: "Firemní akce" },
];

const guestCounts = [
  { value: "", label: "Počet hostů" },
  { value: "1-10", label: "1-10 hostů" },
  { value: "11-50", label: "11-50 hostů" },
  { value: "51-100", label: "51-100 hostů" },
  { value: "101-500", label: "101-500 hostů" },
  { value: "500+", label: "500+ hostů" },
];

export default function EventFilters({
  onSearch,
  className = "",
}: EventFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    eventType: "",
    location: "",
    date: "",
    guestCount: "",
  });

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  return (
    <div
      className={`bg-white border border-zinc-200 rounded-2xl shadow-xl p-8 w-fullmx-auto ${className}`.trim()}
    >
      <div className="text-center mb-8">
        <Text variant="heading3" className="mb-2">
          Najděte perfektní event
        </Text>
        <Text variant="body2" color="secondary">
          Použijte filtry pro rychlé vyhledání eventů podle vašich potřeb
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Typ eventu */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <Text variant="label1" color="secondary">
              Typ eventu
            </Text>
          </div>
          <select
            value={filters.eventType}
            onChange={(e) => handleInputChange("eventType", e.target.value)}
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lokace */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-zinc-500" />
            <Text variant="label1" color="secondary">
              Místo konání
            </Text>
          </div>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Praha, Brno, online..."
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Datum */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-zinc-500" />
            <Text variant="label1" color="secondary">
              Kdy se koná
            </Text>
          </div>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Počet hostů */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-zinc-500" />
            <Text variant="label1" color="secondary">
              Počet hostů
            </Text>
          </div>
          <select
            value={filters.guestCount}
            onChange={(e) => handleInputChange("guestCount", e.target.value)}
            className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          >
            {guestCounts.map((count) => (
              <option key={count.value} value={count.value}>
                {count.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search tlačítko */}
      <div className="text-center">
        <Button
          version="primary"
          text="Vyhledat eventy"
          onClick={handleSearch}
          size="lg"
          className="px-8"
        />
      </div>
    </div>
  );
}
