import {
  COMMON_PARAM_KEYS,
  CommonFilterState,
  ENTERTAINMENT_PARAM_KEYS,
  EntertainmentFilterState,
  GASTRO_PARAM_KEYS,
  GastroFilterState,
  GENERAL_PARAM_KEYS,
  GeneralFilterState,
  VENUE_PARAM_KEYS,
  VenueFilterState,
} from "./filter-groups";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function writeArray(params: URLSearchParams, key: string, ids: string[]) {
  if (ids.length === 0) params.delete(key);
  else params.set(key, ids.join(","));
}

function readArray(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(",").filter(Boolean) ?? [];
}

function writePrice(params: URLSearchParams, min?: number, max?: number) {
  if (min && min > 0) params.set(COMMON_PARAM_KEYS.minPrice, String(min));
  else params.delete(COMMON_PARAM_KEYS.minPrice);
  if (max && max < 100000) params.set(COMMON_PARAM_KEYS.maxPrice, String(max));
  else params.delete(COMMON_PARAM_KEYS.maxPrice);
}

function writeString(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value);
  else params.delete(key);
}

function readString(params: URLSearchParams, key: string): string {
  return params.get(key) ?? "";
}

// ─── General ──────────────────────────────────────────────────────────────────

export function generalFiltersFromParams(
  p: URLSearchParams,
): GeneralFilterState {
  return {
    city: p.get(GENERAL_PARAM_KEYS.city) ?? "",
    district: p.get(GENERAL_PARAM_KEYS.district) ?? "",
    region: p.get(GENERAL_PARAM_KEYS.region) ?? "",
    dateFrom: p.get(GENERAL_PARAM_KEYS.dateFrom) ?? "",
    dateTo: p.get(GENERAL_PARAM_KEYS.dateTo) ?? "",
    adults: Number(p.get(GENERAL_PARAM_KEYS.adults)) || 1,
    children: Number(p.get(GENERAL_PARAM_KEYS.children)) || 0,
    accessibility: p.get(GENERAL_PARAM_KEYS.accessibility) === "1",
    pets: p.get(GENERAL_PARAM_KEYS.pets) === "1",
    bbox: readArray(p, GENERAL_PARAM_KEYS.bbox),
  };
}

export function generalFiltersToParams(
  f: GeneralFilterState,
  params: URLSearchParams,
) {
  if (f.city) params.set(GENERAL_PARAM_KEYS.city, f.city);
  else params.delete(GENERAL_PARAM_KEYS.city);
  if (f.district) params.set(GENERAL_PARAM_KEYS.district, f.district);
  else params.delete(GENERAL_PARAM_KEYS.district);
  if (f.region) params.set(GENERAL_PARAM_KEYS.region, f.region);
  else params.delete(GENERAL_PARAM_KEYS.region);
  if (f.dateFrom) params.set(GENERAL_PARAM_KEYS.dateFrom, f.dateFrom);
  else params.delete(GENERAL_PARAM_KEYS.dateFrom);
  if (f.dateTo) params.set(GENERAL_PARAM_KEYS.dateTo, f.dateTo);
  else params.delete(GENERAL_PARAM_KEYS.dateTo);
  if (f.adults !== 1) params.set(GENERAL_PARAM_KEYS.adults, String(f.adults));
  else params.delete(GENERAL_PARAM_KEYS.adults);
  if (f.children > 0)
    params.set(GENERAL_PARAM_KEYS.children, String(f.children));
  else params.delete(GENERAL_PARAM_KEYS.children);
  if (f.accessibility) params.set(GENERAL_PARAM_KEYS.accessibility, "1");
  else params.delete(GENERAL_PARAM_KEYS.accessibility);
  if (f.pets) params.set(GENERAL_PARAM_KEYS.pets, "1");
  else params.delete(GENERAL_PARAM_KEYS.pets);
  writeArray(params, GENERAL_PARAM_KEYS.bbox, f.bbox ?? []);
}

// ─── Gastro ─────────────────────────────────────────────────────────────────────

export function gastroFiltersToParams(
  f: GastroFilterState,
  params: URLSearchParams,
) {
  const functions: Record<
    keyof GastroFilterState,
    (params: URLSearchParams, value: any) => void
  > = {
    cuisines: (params, value) =>
      writeArray(params, GASTRO_PARAM_KEYS.cuisines, value),
    dishTypes: (params, value) =>
      writeArray(params, GASTRO_PARAM_KEYS.dishTypes, value),
    dietaryOptions: (params, value) =>
      writeArray(params, GASTRO_PARAM_KEYS.dietaryOptions, value),
    foodServiceStyles: (params, value) =>
      writeArray(params, GASTRO_PARAM_KEYS.foodServiceStyles, value),
  };
  Object.entries(functions).forEach(([key, fn]) => {
    const value = f[key as keyof GastroFilterState];
    fn(params, value);
  });
}

export function gastroFiltersFromParams(p: URLSearchParams): GastroFilterState {
  return {
    cuisines: readArray(p, GASTRO_PARAM_KEYS.cuisines),
    dishTypes: readArray(p, GASTRO_PARAM_KEYS.dishTypes),
    dietaryOptions: readArray(p, GASTRO_PARAM_KEYS.dietaryOptions),
    foodServiceStyles: readArray(p, GASTRO_PARAM_KEYS.foodServiceStyles),
  };
}

// ─── Venue ──────────────────────────────────────────────────────────────────────

export function venueFiltersToParams(
  f: VenueFilterState,
  params: URLSearchParams,
) {
  const functions: Record<
    keyof VenueFilterState,
    (params: URLSearchParams, value: any) => void
  > = {
    placeTypes: (params, value) =>
      writeArray(params, VENUE_PARAM_KEYS.placeTypes, value),
    amenities: (params, value) =>
      writeArray(params, VENUE_PARAM_KEYS.amenities, value),
    activities: (params, value) =>
      writeArray(params, VENUE_PARAM_KEYS.activities, value),
  };
  Object.entries(functions).forEach(([key, fn]) => {
    const value = f[key as keyof VenueFilterState];
    fn(params, value);
  });
}

export function venueFiltersFromParams(p: URLSearchParams): VenueFilterState {
  return {
    placeTypes: readArray(p, VENUE_PARAM_KEYS.placeTypes),
    amenities: readArray(p, VENUE_PARAM_KEYS.amenities),
    activities: readArray(p, VENUE_PARAM_KEYS.activities),
  };
}

// ─── Entertainment ───────────────────────────────────────────────────────────────

export function entertainmentFiltersToParams(
  f: EntertainmentFilterState,
  params: URLSearchParams,
) {
  const functions: Record<
    keyof EntertainmentFilterState,
    (params: URLSearchParams, value: any) => void
  > = {
    activities: (params, value) =>
      writeArray(params, ENTERTAINMENT_PARAM_KEYS.activities, value),
  };
  Object.entries(functions).forEach(([key, fn]) => {
    const value = f[key as keyof EntertainmentFilterState];
    fn(params, value);
  });
}

export function entertainmentFiltersFromParams(
  p: URLSearchParams,
): EntertainmentFilterState {
  return {
    activities: readArray(p, ENTERTAINMENT_PARAM_KEYS.activities),
  };
}

// ─── Common ─────────────────────────────────────────────────────────────────────

export function commonFiltersToParams(
  f: CommonFilterState,
  params: URLSearchParams,
) {
  const functions: Record<
    keyof CommonFilterState,
    (params: URLSearchParams, value: any) => void
  > = {
    minPrice: (params, value) => writePrice(params, value, f.maxPrice),
    maxPrice: (params, value) => writePrice(params, f.minPrice, value),
    eventTypes: (params, value) =>
      writeArray(params, COMMON_PARAM_KEYS.eventTypes, value),
  };

  Object.entries(functions).forEach(([key, fn]) => {
    const value = f[key as keyof CommonFilterState];
    fn(params, value);
  });
}

export function commonFiltersFromParams(p: URLSearchParams): CommonFilterState {
  return {
    minPrice: Number(p.get(COMMON_PARAM_KEYS.minPrice)) || undefined,
    maxPrice: Number(p.get(COMMON_PARAM_KEYS.maxPrice)) || undefined,
    eventTypes: readArray(p, COMMON_PARAM_KEYS.eventTypes),
  };
}
