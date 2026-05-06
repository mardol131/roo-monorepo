import React from "react";
import PriceFilter from "./special/price-filter";
import { useCities } from "@/app/react-query/cities/hooks";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";
import { useCuisines } from "@/app/react-query/filters/cuisines/hooks";
import { useDishTypes } from "@/app/react-query/filters/dish-types/hooks";
import { useDietaryOptions } from "@/app/react-query/filters/dietary-options/hooks";
import { useFoodServiceStyles } from "@/app/react-query/filters/food-service-styles/hooks";
import { usePlaceTypes } from "@/app/react-query/filters/place-types/hooks";
import { useAmenities } from "@/app/react-query/filters/amenities/hooks";
import { useActivities } from "@/app/react-query/filters/activities/hooks";
import FilterSection from "./filter-section";

// ─── Core types ────────────────────────────────────────────────────────────────

export interface FilterGroup<TFilters> {
  key: string;
  label: string;
  count: (filters: TFilters) => number;
  Content: React.ComponentType<{
    filters: TFilters;
    onChange: (filters: TFilters) => void;
  }>;
}

// ─── Filter states ──────────────────────────────────────────────────────────────

export interface GastroFilterState {
  locations: string[];
  cuisines: string[];
  dishTypes: string[];
  dietaryOptions: string[];
  foodServiceStyles: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface VenueFilterState {
  locations: string[];
  placeTypes: string[];
  eventTypes: string[];
  amenities: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface EntertainmentFilterState {
  locations: string[];
  activities: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const EMPTY_GASTRO_FILTERS: GastroFilterState = {
  locations: [],
  cuisines: [],
  dishTypes: [],
  dietaryOptions: [],
  foodServiceStyles: [],
  minPrice: 0,
  maxPrice: 100000,
};

export const EMPTY_VENUE_FILTERS: VenueFilterState = {
  locations: [],
  placeTypes: [],
  eventTypes: [],
  amenities: [],
  minPrice: 0,
  maxPrice: 100000,
};

export const EMPTY_ENTERTAINMENT_FILTERS: EntertainmentFilterState = {
  locations: [],
  activities: [],
  minPrice: 0,
  maxPrice: 100000,
};

// ─── Shared group factories ─────────────────────────────────────────────────────

export function createLocationsGroup<
  TFilters extends { locations: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "locations",
    label: "Místo konání",
    count: (f) => f.locations.length,
    Content: ({ filters, onChange }) => {
      const { data } = useCities({ limit: 50 });
      return (
        <FilterSection
          title="Místo konání"
          options={data?.docs || []}
          selectedIds={filters.locations}
          onSelectionChange={(ids) => onChange({ ...filters, locations: ids })}
        />
      );
    },
  };
}

export function createPriceGroup<
  TFilters extends { minPrice?: number; maxPrice?: number },
>(): FilterGroup<TFilters> {
  return {
    key: "price",
    label: "Cena",
    count: (f) =>
      (f.minPrice !== undefined && f.minPrice > 0 ? 1 : 0) +
      (f.maxPrice !== undefined && f.maxPrice < 100000 ? 1 : 0),
    Content: ({ filters, onChange }) => (
      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onPriceChange={(min, max) =>
          onChange({ ...filters, minPrice: min, maxPrice: max })
        }
      />
    ),
  };
}

// ─── Gastro groups ──────────────────────────────────────────────────────────────

export const GASTRO_GROUPS: FilterGroup<GastroFilterState>[] = [
  createLocationsGroup(),
  createPriceGroup(),
  {
    key: "cuisines",
    label: "Kuchyně",
    count: (f) => f.cuisines.length,
    Content: ({ filters, onChange }) => {
      const { data } = useCuisines({ limit: 50 });
      return (
        <FilterSection
          title="Kuchyně"
          options={data?.docs || []}
          selectedIds={filters.cuisines}
          onSelectionChange={(ids) => onChange({ ...filters, cuisines: ids })}
        />
      );
    },
  },
  {
    key: "dishTypes",
    label: "Typ jídla",
    count: (f) => f.dishTypes.length,
    Content: ({ filters, onChange }) => {
      const { data } = useDishTypes({ limit: 50 });
      return (
        <FilterSection
          title="Typ jídla"
          options={data?.docs || []}
          selectedIds={filters.dishTypes}
          onSelectionChange={(ids) => onChange({ ...filters, dishTypes: ids })}
        />
      );
    },
  },
  {
    key: "dietaryOptions",
    label: "Dietní možnosti",
    count: (f) => f.dietaryOptions.length,
    Content: ({ filters, onChange }) => {
      const { data } = useDietaryOptions({ limit: 50 });
      return (
        <FilterSection
          title="Dietní možnosti"
          options={data?.docs || []}
          selectedIds={filters.dietaryOptions}
          onSelectionChange={(ids) =>
            onChange({ ...filters, dietaryOptions: ids })
          }
        />
      );
    },
  },
  {
    key: "foodServiceStyles",
    label: "Styl obsluhy",
    count: (f) => f.foodServiceStyles.length,
    Content: ({ filters, onChange }) => {
      const { data } = useFoodServiceStyles({ limit: 50 });
      return (
        <FilterSection
          title="Styl obsluhy"
          options={data?.docs || []}
          selectedIds={filters.foodServiceStyles}
          onSelectionChange={(ids) =>
            onChange({ ...filters, foodServiceStyles: ids })
          }
        />
      );
    },
  },
];

// ─── Venue groups ───────────────────────────────────────────────────────────────

export const VENUE_GROUPS: FilterGroup<VenueFilterState>[] = [
  createLocationsGroup(),
  createPriceGroup(),
  {
    key: "placeTypes",
    label: "Typ prostoru",
    count: (f) => f.placeTypes.length,
    Content: ({ filters, onChange }) => {
      const { data } = usePlaceTypes({ limit: 50 });
      return (
        <FilterSection
          title="Typ prostoru"
          options={data?.docs || []}
          selectedIds={filters.placeTypes}
          onSelectionChange={(ids) => onChange({ ...filters, placeTypes: ids })}
        />
      );
    },
  },
  {
    key: "eventTypes",
    label: "Typ akce",
    count: (f) => f.eventTypes.length,
    Content: ({ filters, onChange }) => {
      const { data } = useEventTypes({ limit: 50 });
      return (
        <FilterSection
          title="Typ akce"
          options={data?.docs || []}
          selectedIds={filters.eventTypes}
          onSelectionChange={(ids) => onChange({ ...filters, eventTypes: ids })}
        />
      );
    },
  },
  {
    key: "amenities",
    label: "Vybavení",
    count: (f) => f.amenities.length,
    Content: ({ filters, onChange }) => {
      const { data } = useAmenities({ limit: 50 });
      return (
        <FilterSection
          title="Vybavení"
          options={data?.docs || []}
          selectedIds={filters.amenities}
          onSelectionChange={(ids) => onChange({ ...filters, amenities: ids })}
        />
      );
    },
  },
];

// ─── Entertainment groups ───────────────────────────────────────────────────────

export const ENTERTAINMENT_GROUPS: FilterGroup<EntertainmentFilterState>[] = [
  createLocationsGroup(),
  createPriceGroup(),
  {
    key: "activities",
    label: "Aktivity",
    count: (f) => f.activities.length,
    Content: ({ filters, onChange }) => {
      const { data } = useActivities({ limit: 50 });
      return (
        <FilterSection
          title="Aktivity"
          options={data?.docs || []}
          selectedIds={filters.activities}
          onSelectionChange={(ids) => onChange({ ...filters, activities: ids })}
        />
      );
    },
  },
];

// ─── Sidebar group subsets (exclude price — handled separately) ─────────────────

const SIDEBAR_KEYS: {
  gastro: (keyof GastroFilterState)[];
  venue: (keyof VenueFilterState)[];
  entertainment: (keyof EntertainmentFilterState)[];
} = {
  gastro: ["cuisines", "dishTypes", "foodServiceStyles"],
  venue: ["locations", "eventTypes"],
  entertainment: ["locations", "activities"],
} as const;

export const GASTRO_SIDEBAR_GROUPS = GASTRO_GROUPS.filter(
  (g: FilterGroup<GastroFilterState>) =>
    SIDEBAR_KEYS.gastro.some((k) => k === g.key),
);
export const VENUE_SIDEBAR_GROUPS = VENUE_GROUPS.filter(
  (g: FilterGroup<VenueFilterState>) =>
    SIDEBAR_KEYS.venue.some((k) => k === g.key),
);
export const ENTERTAINMENT_SIDEBAR_GROUPS = ENTERTAINMENT_GROUPS.filter(
  (g: FilterGroup<EntertainmentFilterState>) =>
    SIDEBAR_KEYS.entertainment.some((k) => k === g.key),
);
