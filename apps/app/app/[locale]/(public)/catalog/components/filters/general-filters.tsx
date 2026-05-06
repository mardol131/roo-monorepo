"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LocationFilter from "./location-filter";
import DateFilter from "./special/date-filter";
import GuestsFilter from "./special/guests-filter";
import { Calendar, MapPin, Users } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import {
  generalFiltersFromParams,
  generalFiltersToParams,
  GeneralFilterState,
} from "./filter-params";

export default function GeneralFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = generalFiltersFromParams(searchParams);

  const replaceParams = (
    updater: (f: GeneralFilterState) => GeneralFilterState,
  ) => {
    const next = updater(filters);
    const params = new URLSearchParams(searchParams.toString());
    generalFiltersToParams(next, params);
    router.replace(`?${params}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <FilterLabel icon={MapPin} text="Kde se akce koná" />
          <LocationFilter
            value={filters.city}
            onChange={(city) => replaceParams((f) => ({ ...f, city }))}
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <FilterLabel icon={Calendar} text="Kdy se akce koná" />
          <DateFilter
            startValue={filters.dateFrom || undefined}
            endValue={filters.dateTo || undefined}
            onStartChange={(dateFrom) =>
              replaceParams((f) => ({ ...f, dateFrom }))
            }
            onEndChange={(dateTo) => replaceParams((f) => ({ ...f, dateTo }))}
          />
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-5">
          <FilterLabel icon={Users} text="Počet hostů" />
          <GuestsFilter
            value={{
              adults: filters.adults,
              children: filters.children,
              accessibility: filters.accessibility,
              pets: filters.pets,
            }}
            onChange={(g) =>
              replaceParams((f) => ({
                ...f,
                adults: g.adults,
                children: g.children,
                accessibility: g.accessibility,
                pets: g.pets,
              }))
            }
          />
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
      <Text variant="h3" color="textDark">
        {text}
      </Text>
    </div>
  );
}
