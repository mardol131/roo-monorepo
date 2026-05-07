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
  city: "mesto",
  dateFrom: "datumOd",
  dateTo: "datumDo",
  adults: "dospeli",
  children: "deti",
  accessibility: "ztp",
  pets: "zvirata",
  bbox: "bbox",
};

export const GASTRO_PARAM_KEYS: Record<keyof GastroFilterState, string> = {
  cuisines: "kuchyne",
  dishTypes: "jidlo",
  dietaryOptions: "dieta",
  foodServiceStyles: "obsluha",
};

export const VENUE_PARAM_KEYS: Record<keyof VenueFilterState, string> = {
  placeTypes: "prostor",
  amenities: "vybaveni",
  activities: "aktivity",
};

export const ENTERTAINMENT_PARAM_KEYS: Record<
  keyof EntertainmentFilterState,
  string
> = {
  activities: "aktivity",
};

export const COMMON_PARAM_KEYS: Record<keyof CommonFilterState, string> = {
  minPrice: "priceFrom",
  maxPrice: "priceTo",
  eventTypes: "akce",
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
      const { data } = useActivities();
      console.log("Activities data:", data);
      return (
        <FilterSection
          title="Aktivity"
          options={data?.docs || []}
          selectedIds={filters.activities}
          onSelectionChange={(ids) => onChange({ ...filters, activities: ids })}
        />
      );
    },
  };
}
// ─── Gastro groups ──────────────────────────────────────────────────────────────
