import {
  GastroFilterState,
  VenueFilterState,
  EntertainmentFilterState,
  EMPTY_GASTRO_FILTERS,
  EMPTY_VENUE_FILTERS,
  EMPTY_ENTERTAINMENT_FILTERS,
} from "./filter-groups";

export const GENERAL_PARAM_KEYS = {
  city: "lokace",
  dateFrom: "datumOd",
  dateTo: "datumDo",
  adults: "dospeli",
  children: "deti",
  accessibility: "ztp",
  pets: "zvirata",
} as const;

export interface GeneralFilterState {
  city: string;
  dateFrom: string;
  dateTo: string;
  adults: number;
  children: number;
  accessibility: boolean;
  pets: boolean;
}

const G = GENERAL_PARAM_KEYS;

export const EMPTY_GENERAL_FILTERS: GeneralFilterState = {
  city: "",
  dateFrom: "",
  dateTo: "",
  adults: 1,
  children: 0,
  accessibility: false,
  pets: false,
};

export function generalFiltersFromParams(p: URLSearchParams): GeneralFilterState {
  return {
    city: p.get(G.city) ?? "",
    dateFrom: p.get(G.dateFrom) ?? "",
    dateTo: p.get(G.dateTo) ?? "",
    adults: Number(p.get(G.adults)) || 1,
    children: Number(p.get(G.children)) || 0,
    accessibility: p.get(G.accessibility) === "1",
    pets: p.get(G.pets) === "1",
  };
}

export function generalFiltersToParams(
  f: GeneralFilterState,
  params: URLSearchParams,
) {
  if (f.city) params.set(G.city, f.city);
  else params.delete(G.city);
  if (f.dateFrom) params.set(G.dateFrom, f.dateFrom);
  else params.delete(G.dateFrom);
  if (f.dateTo) params.set(G.dateTo, f.dateTo);
  else params.delete(G.dateTo);
  if (f.adults !== 1) params.set(G.adults, String(f.adults));
  else params.delete(G.adults);
  if (f.children > 0) params.set(G.children, String(f.children));
  else params.delete(G.children);
  if (f.accessibility) params.set(G.accessibility, "1");
  else params.delete(G.accessibility);
  if (f.pets) params.set(G.pets, "1");
  else params.delete(G.pets);
}

export const FILTER_PARAM_KEYS = {
  locations: "misto",
  cuisines: "kuchyne",
  dishTypes: "jidlo",
  dietaryOptions: "dieta",
  foodServiceStyles: "obsluha",
  placeTypes: "prostor",
  eventTypes: "akce",
  amenities: "vybaveni",
  activities: "aktivita",
  minPrice: "cenaOd",
  maxPrice: "cenaDo",
} as const;

const K = FILTER_PARAM_KEYS;

// ─── Helpers ────────────────────────────────────────────────────────────────────

function writeArray(params: URLSearchParams, key: string, ids: string[]) {
  if (ids.length === 0) params.delete(key);
  else params.set(key, ids.join(","));
}

function readArray(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(",").filter(Boolean) ?? [];
}

function writePrice(params: URLSearchParams, min?: number, max?: number) {
  if (min && min > 0) params.set(K.minPrice, String(min));
  else params.delete(K.minPrice);
  if (max && max < 100000) params.set(K.maxPrice, String(max));
  else params.delete(K.maxPrice);
}

// ─── Gastro ─────────────────────────────────────────────────────────────────────

export function gastroFiltersToParams(
  f: GastroFilterState,
  params: URLSearchParams,
) {
  writeArray(params, K.locations, f.locations);
  writeArray(params, K.cuisines, f.cuisines);
  writeArray(params, K.dishTypes, f.dishTypes);
  writeArray(params, K.dietaryOptions, f.dietaryOptions);
  writeArray(params, K.foodServiceStyles, f.foodServiceStyles);
  writePrice(params, f.minPrice, f.maxPrice);
}

export function gastroFiltersFromParams(p: URLSearchParams): GastroFilterState {
  return {
    locations: readArray(p, K.locations),
    cuisines: readArray(p, K.cuisines),
    dishTypes: readArray(p, K.dishTypes),
    dietaryOptions: readArray(p, K.dietaryOptions),
    foodServiceStyles: readArray(p, K.foodServiceStyles),
    minPrice: Number(p.get(K.minPrice)) || EMPTY_GASTRO_FILTERS.minPrice,
    maxPrice: Number(p.get(K.maxPrice)) || EMPTY_GASTRO_FILTERS.maxPrice,
  };
}

// ─── Venue ──────────────────────────────────────────────────────────────────────

export function venueFiltersToParams(
  f: VenueFilterState,
  params: URLSearchParams,
) {
  writeArray(params, K.locations, f.locations);
  writeArray(params, K.placeTypes, f.placeTypes);
  writeArray(params, K.eventTypes, f.eventTypes);
  writeArray(params, K.amenities, f.amenities);
  writePrice(params, f.minPrice, f.maxPrice);
}

export function venueFiltersFromParams(p: URLSearchParams): VenueFilterState {
  return {
    locations: readArray(p, K.locations),
    placeTypes: readArray(p, K.placeTypes),
    eventTypes: readArray(p, K.eventTypes),
    amenities: readArray(p, K.amenities),
    minPrice: Number(p.get(K.minPrice)) || EMPTY_VENUE_FILTERS.minPrice,
    maxPrice: Number(p.get(K.maxPrice)) || EMPTY_VENUE_FILTERS.maxPrice,
  };
}

// ─── Entertainment ───────────────────────────────────────────────────────────────

export function entertainmentFiltersToParams(
  f: EntertainmentFilterState,
  params: URLSearchParams,
) {
  writeArray(params, K.locations, f.locations);
  writeArray(params, K.activities, f.activities);
  writePrice(params, f.minPrice, f.maxPrice);
}

export function entertainmentFiltersFromParams(
  p: URLSearchParams,
): EntertainmentFilterState {
  return {
    locations: readArray(p, K.locations),
    activities: readArray(p, K.activities),
    minPrice: Number(p.get(K.minPrice)) || EMPTY_ENTERTAINMENT_FILTERS.minPrice,
    maxPrice: Number(p.get(K.maxPrice)) || EMPTY_ENTERTAINMENT_FILTERS.maxPrice,
  };
}
