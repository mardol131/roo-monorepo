"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Building2, UtensilsCrossed, Music } from "lucide-react";
import LocationFilter from "@/app/[locale]/(public)/catalog/components/filters/location-filter";
import DateFilter from "@/app/[locale]/(public)/catalog/components/filters/special/date-filter";
import GuestsFilter from "@/app/[locale]/(public)/catalog/components/filters/special/guests-filter";
import Text from "@/app/components/ui/atoms/text";
import {
  EMPTY_GENERAL_FILTERS,
  GeneralFilterState,
} from "@/app/[locale]/(public)/catalog/components/filters/filter-groups";
import { generalFiltersToParams } from "@/app/[locale]/(public)/catalog/components/filters/filter-params";

type CatalogType = "venue" | "gastro" | "entertainment";

const SEARCH_BUTTONS: {
  type: CatalogType;
  label: string;
  Icon: React.ElementType;
  className: string;
}[] = [
  {
    type: "venue",
    label: "Místa a prostory",
    Icon: Building2,
    className:
      "bg-space text-white hover:brightness-110",
  },
  {
    type: "gastro",
    label: "Gastro a catering",
    Icon: UtensilsCrossed,
    className:
      "bg-primary text-white hover:brightness-110",
  },
  {
    type: "entertainment",
    label: "Zábava a show",
    Icon: Music,
    className:
      "bg-event text-white hover:brightness-110",
  },
];

export default function HomepageSearchFilters() {
  const router = useRouter();
  const [filters, setFilters] = useState<GeneralFilterState>(EMPTY_GENERAL_FILTERS);

  const handleSearch = (type: CatalogType) => {
    const params = new URLSearchParams();
    generalFiltersToParams(filters, params);
    const query = params.toString();
    router.push(`/catalog/${type}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="w-full">
      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 flex max-md:flex-col divide-x max-md:divide-x-0 max-md:divide-y divide-zinc-100 overflow-visible">
        <FilterSlot icon={MapPin} label="Kde se akce koná">
          <LocationFilter
            value={{ city: filters.city, district: filters.district, region: filters.region }}
            onChange={({ city, district, region }) =>
              setFilters((f) => ({ ...f, city, district, region, bbox: [] }))
            }
          />
        </FilterSlot>

        <FilterSlot icon={Calendar} label="Kdy se akce koná">
          <DateFilter
            startValue={filters.dateFrom || undefined}
            endValue={filters.dateTo || undefined}
            onStartChange={(dateFrom) => setFilters((f) => ({ ...f, dateFrom }))}
            onEndChange={(dateTo) => setFilters((f) => ({ ...f, dateTo }))}
          />
        </FilterSlot>

        <FilterSlot icon={Users} label="Počet hostů">
          <GuestsFilter
            value={{
              adults: filters.adults,
              children: filters.children,
              accessibility: filters.accessibility,
              pets: filters.pets,
            }}
            onChange={(g) =>
              setFilters((f) => ({
                ...f,
                adults: g.adults,
                children: g.children,
                accessibility: g.accessibility,
                pets: g.pets,
              }))
            }
          />
        </FilterSlot>
      </div>

      {/* Search buttons */}
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3 mt-4">
        {SEARCH_BUTTONS.map(({ type, label, Icon, className }) => (
          <button
            key={type}
            onClick={() => handleSearch(type)}
            className={`${className} flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base transition-all hover:scale-[1.02] cursor-pointer`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSlot({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 px-6 py-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-rose-500 shrink-0" />
        <Text variant="label-sm" color="secondary">
          {label}
        </Text>
      </div>
      {children}
    </div>
  );
}
