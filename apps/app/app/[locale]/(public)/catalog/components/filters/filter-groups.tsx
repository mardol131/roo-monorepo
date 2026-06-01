import React from "react";
import PriceFilter from "./special/price-filter";
import LocationFilter from "./location-filter";
import DateFilter from "./special/date-filter";
import GuestsFilter from "./special/guests-filter";
import { useCities } from "@/app/react-query/cities/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
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
  cuisines: string[];
  dishTypes: string[];
  dietaryOptions: string[];
  foodServiceStyles: string[];
}

export interface VenueFilterState {
  placeTypes: string[];
  amenities: string[];
  activities: string[];
}

export interface EntertainmentFilterState {
  activities: string[];
}

export interface CommonFilterState {
  minPrice?: number;
  maxPrice?: number;
  eventTypes: string[];
}

export interface GeneralFilterState {
  city: string;
  district: string;
  region: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  children: number;
  accessibility: boolean;
  pets: boolean;
  bbox?: string[];
}

// ─── Keys ─────────────────────────────────────────────────────────────

export const GENERAL_PARAM_KEYS: Record<keyof GeneralFilterState, string> = {
  city: "city",
  district: "district",
  region: "region",
  dateFrom: "dateFrom",
  dateTo: "dateTo",
  adults: "adults",
  children: "children",
  accessibility: "accessibility",
  pets: "pets",
  bbox: "bbox",
};

export const GASTRO_PARAM_KEYS: Record<keyof GastroFilterState, string> = {
  cuisines: "cuisines",
  dishTypes: "dishTypes",
  dietaryOptions: "dietaryOptions",
  foodServiceStyles: "foodServiceStyles",
};

export const VENUE_PARAM_KEYS: Record<keyof VenueFilterState, string> = {
  placeTypes: "placeTypes",
  amenities: "amenities",
  activities: "activities",
};

export const ENTERTAINMENT_PARAM_KEYS: Record<
  keyof EntertainmentFilterState,
  string
> = {
  activities: "activities",
};

export const COMMON_PARAM_KEYS: Record<keyof CommonFilterState, string> = {
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  eventTypes: "eventTypes",
};

// ─── Empty states ───────────────────────────────────────────────────────────────────

export const EMPTY_GENERAL_FILTERS: GeneralFilterState = {
  city: "",
  dateFrom: "",
  dateTo: "",
  adults: 1,
  children: 0,
  accessibility: false,
  pets: false,
  bbox: undefined,
  district: "",
  region: "",
};

export const EMPTY_GASTRO_FILTERS: GastroFilterState = {
  cuisines: [],
  dishTypes: [],
  dietaryOptions: [],
  foodServiceStyles: [],
};

export const EMPTY_VENUE_FILTERS: VenueFilterState = {
  placeTypes: [],
  amenities: [],
  activities: [],
};

export const EMPTY_ENTERTAINMENT_FILTERS: EntertainmentFilterState = {
  activities: [],
};

export const EMPTY_COMMON_FILTERS: CommonFilterState = {
  minPrice: 0,
  maxPrice: 100000,
  eventTypes: [],
};

// ─── Common groups ───────────────────────────────────────────────────────────────

export const COMMON_GROUPS: FilterGroup<CommonFilterState>[] = [
  createPriceGroup(),
  createEventTypesGroup(),
];

// ─── Gastro groups ───────────────────────────────────────────────────────────────

export const GASTRO_GROUPS: FilterGroup<GastroFilterState>[] = [
  createCuisinesGroup(),
  createDishTypesGroup(),
  createFoodServiceStylesGroup(),
];

// ─── Venue groups ───────────────────────────────────────────────────────────────

export const VENUE_GROUPS: FilterGroup<VenueFilterState>[] = [
  createPlaceTypesGroup(),
  createAmenitiesGroup(),
  createActivitiesGroup(),
];

// ─── Entertainment groups ───────────────────────────────────────────────────────

export const ENTERTAINMENT_GROUPS: FilterGroup<EntertainmentFilterState>[] = [
  createActivitiesGroup(),
];

// ─── Sidebar group subsets (exclude price — handled separately) ─────────────────

export const GASTRO_SIDEBAR_GROUPS = GASTRO_GROUPS;
export const VENUE_SIDEBAR_GROUPS = VENUE_GROUPS;
export const ENTERTAINMENT_SIDEBAR_GROUPS = ENTERTAINMENT_GROUPS;
export const COMMON_SIDEBAR_GROUPS = COMMON_GROUPS;

// ─── Modal groups (combined common + type-specific, typed for the merged state) ─

export const GASTRO_MODAL_GROUPS: FilterGroup<
  GastroFilterState & CommonFilterState
>[] = [
  createPriceGroup<GastroFilterState & CommonFilterState>(),
  createEventTypesGroup<GastroFilterState & CommonFilterState>(),
  createCuisinesGroup<GastroFilterState & CommonFilterState>(),
  createDishTypesGroup<GastroFilterState & CommonFilterState>(),
  createFoodServiceStylesGroup<GastroFilterState & CommonFilterState>(),
];

export const VENUE_MODAL_GROUPS: FilterGroup<
  VenueFilterState & CommonFilterState
>[] = [
  createPriceGroup<VenueFilterState & CommonFilterState>(),
  createEventTypesGroup<VenueFilterState & CommonFilterState>(),
  createPlaceTypesGroup<VenueFilterState & CommonFilterState>(),
  createAmenitiesGroup<VenueFilterState & CommonFilterState>(),
  createActivitiesGroup<VenueFilterState & CommonFilterState>(),
];

export const ENTERTAINMENT_MODAL_GROUPS: FilterGroup<
  EntertainmentFilterState & CommonFilterState
>[] = [
  createPriceGroup<EntertainmentFilterState & CommonFilterState>(),
  createEventTypesGroup<EntertainmentFilterState & CommonFilterState>(),
  createActivitiesGroup<EntertainmentFilterState & CommonFilterState>(),
];

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

export function createCuisinesGroup<
  TFilters extends { cuisines: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "cuisines",
    label: "Kuchyně",
    count: (f) => f.cuisines.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Kuchyně"
          options={filterOptions?.cuisines || []}
          selectedIds={filters.cuisines}
          onSelectionChange={(ids) => onChange({ ...filters, cuisines: ids })}
        />
      );
    },
  };
}

export function createDishTypesGroup<
  TFilters extends { dishTypes: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "dishTypes",
    label: "Typ jídla",
    count: (f) => f.dishTypes.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Typ jídla"
          options={filterOptions?.dishTypes || []}
          selectedIds={filters.dishTypes}
          onSelectionChange={(ids) => onChange({ ...filters, dishTypes: ids })}
        />
      );
    },
  };
}

export function createDietaryOptionsGroup<
  TFilters extends { dietaryOptions: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "dietaryOptions",
    label: "Dietní možnosti",
    count: (f) => f.dietaryOptions.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Dietní možnosti"
          options={filterOptions?.dietaryOptions || []}
          selectedIds={filters.dietaryOptions}
          onSelectionChange={(ids) =>
            onChange({ ...filters, dietaryOptions: ids })
          }
        />
      );
    },
  };
}

export function createFoodServiceStylesGroup<
  TFilters extends { foodServiceStyles: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "foodServiceStyles",
    label: "Styl obsluhy",
    count: (f) => f.foodServiceStyles.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Styl obsluhy"
          options={filterOptions?.foodServiceStyles || []}
          selectedIds={filters.foodServiceStyles}
          onSelectionChange={(ids) =>
            onChange({ ...filters, foodServiceStyles: ids })
          }
        />
      );
    },
  };
}

export function createPlaceTypesGroup<
  TFilters extends { placeTypes: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "placeTypes",
    label: "Typ prostoru",
    count: (f) => f.placeTypes.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Typ prostoru"
          options={filterOptions?.placeTypes || []}
          selectedIds={filters.placeTypes}
          onSelectionChange={(ids) => onChange({ ...filters, placeTypes: ids })}
        />
      );
    },
  };
}

export function createEventTypesGroup<
  TFilters extends { eventTypes: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "eventTypes",
    label: "Typ akce",
    count: (f) => f.eventTypes.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Typ akce"
          options={filterOptions?.eventTypes || []}
          selectedIds={filters.eventTypes}
          onSelectionChange={(ids) => onChange({ ...filters, eventTypes: ids })}
        />
      );
    },
  };
}

export function createAmenitiesGroup<
  TFilters extends { amenities: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "amenities",
    label: "Vybavení",
    count: (f) => f.amenities.length,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Vybavení"
          options={filterOptions?.amenities || []}
          selectedIds={filters.amenities}
          onSelectionChange={(ids) => onChange({ ...filters, amenities: ids })}
        />
      );
    },
  };
}

export function createActivitiesGroup<
  TFilters extends { activities: string[] },
>(): FilterGroup<TFilters> {
  return {
    key: "activities",
    label: "Aktivity",
    count: (f) => f.activities.length || 0,
    Content: ({ filters, onChange }) => {
      const { data: filterOptions } = useFilterOptions();
      return (
        <FilterSection
          title="Aktivity"
          options={filterOptions?.activities || []}
          selectedIds={filters.activities}
          onSelectionChange={(ids) => onChange({ ...filters, activities: ids })}
        />
      );
    },
  };
}

// ─── General filter group factories ────────────────────────────────────────────

export function createLocationGroup<
  TFilters extends GeneralFilterState,
>(): FilterGroup<TFilters> {
  return {
    key: "location",
    label: "Místo konání",
    count: (f) => (f.city || f.district || f.region ? 1 : 0),
    Content: ({ filters, onChange }) => (
      <LocationFilter
        value={{
          city: filters.city,
          district: filters.district,
          region: filters.region,
        }}
        onChange={({ city, district, region }) =>
          onChange({ ...filters, city, district, region, bbox: [] })
        }
      />
    ),
  };
}

export function createDateGroup<
  TFilters extends GeneralFilterState,
>(): FilterGroup<TFilters> {
  return {
    key: "date",
    label: "Termín",
    count: (f) => (f.dateFrom ? 1 : 0) + (f.dateTo ? 1 : 0),
    Content: ({ filters, onChange }) => (
      <DateFilter
        type="inline"
        startValue={filters.dateFrom || undefined}
        endValue={filters.dateTo || undefined}
        onStartChange={(dateFrom) => onChange({ ...filters, dateFrom })}
        onEndChange={(dateTo) => onChange({ ...filters, dateTo })}
      />
    ),
  };
}

export function createGuestsGroup<
  TFilters extends GeneralFilterState,
>(): FilterGroup<TFilters> {
  return {
    key: "guests",
    label: "Hosté",
    count: (f) =>
      (f.adults !== 1 ? 1 : 0) +
      (f.children > 0 ? 1 : 0) +
      (f.accessibility ? 1 : 0) +
      (f.pets ? 1 : 0),
    Content: ({ filters, onChange }) => (
      <GuestsFilter
        type="inline"
        value={{
          adults: filters.adults,
          children: filters.children,
          accessibility: filters.accessibility,
          pets: filters.pets,
        }}
        onChange={(g) => onChange({ ...filters, ...g })}
      />
    ),
  };
}

// ─── Combined full filter types ─────────────────────────────────────────────────

export type GastroFullFilterState = GeneralFilterState &
  CommonFilterState &
  GastroFilterState;
export type VenueFullFilterState = GeneralFilterState &
  CommonFilterState &
  VenueFilterState;
export type EntertainmentFullFilterState = GeneralFilterState &
  CommonFilterState &
  EntertainmentFilterState;

export const EMPTY_GASTRO_FULL_FILTERS: GastroFullFilterState = {
  ...EMPTY_GENERAL_FILTERS,
  ...EMPTY_COMMON_FILTERS,
  ...EMPTY_GASTRO_FILTERS,
};

export const EMPTY_VENUE_FULL_FILTERS: VenueFullFilterState = {
  ...EMPTY_GENERAL_FILTERS,
  ...EMPTY_COMMON_FILTERS,
  ...EMPTY_VENUE_FILTERS,
};

export const EMPTY_ENTERTAINMENT_FULL_FILTERS: EntertainmentFullFilterState = {
  ...EMPTY_GENERAL_FILTERS,
  ...EMPTY_COMMON_FILTERS,
  ...EMPTY_ENTERTAINMENT_FILTERS,
};

// ─── Full modal groups (general + common + type-specific) ───────────────────────

export const GASTRO_FULL_MODAL_GROUPS: FilterGroup<GastroFullFilterState>[] = [
  createLocationGroup(),
  createDateGroup(),
  createGuestsGroup(),
  createPriceGroup(),
  createEventTypesGroup(),
  createCuisinesGroup(),
  createDishTypesGroup(),
  createFoodServiceStylesGroup(),
];

export const VENUE_FULL_MODAL_GROUPS: FilterGroup<VenueFullFilterState>[] = [
  createLocationGroup(),
  createDateGroup(),
  createGuestsGroup(),
  createPriceGroup(),
  createEventTypesGroup(),
  createPlaceTypesGroup(),
  createAmenitiesGroup(),
  createActivitiesGroup(),
];

export const ENTERTAINMENT_FULL_MODAL_GROUPS: FilterGroup<EntertainmentFullFilterState>[] =
  [
    createLocationGroup(),
    createDateGroup(),
    createGuestsGroup(),
    createPriceGroup(),
    createEventTypesGroup(),
    createActivitiesGroup(),
  ];

// ─── Gastro groups ──────────────────────────────────────────────────────────────
