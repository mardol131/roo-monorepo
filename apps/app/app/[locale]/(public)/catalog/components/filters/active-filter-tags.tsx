"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { CatalogType } from "@/app/data/catalog";
import {
  generalFiltersFromParams,
  generalFiltersToParams,
  gastroFiltersToParams,
  gastroFiltersFromParams,
  venueFiltersToParams,
  venueFiltersFromParams,
  entertainmentFiltersToParams,
  entertainmentFiltersFromParams,
} from "./filter-params";
import {
  GastroFilterState,
  VenueFilterState,
  EntertainmentFilterState,
  EMPTY_GASTRO_FILTERS,
  EMPTY_VENUE_FILTERS,
  EMPTY_ENTERTAINMENT_FILTERS,
} from "./filter-groups";
import { EMPTY_GENERAL_FILTERS } from "./filter-params";
import { useCities } from "@/app/react-query/cities/hooks";
import { useCuisines } from "@/app/react-query/filters/cuisines/hooks";
import { useDishTypes } from "@/app/react-query/filters/dish-types/hooks";
import { useDietaryOptions } from "@/app/react-query/filters/dietary-options/hooks";
import { useFoodServiceStyles } from "@/app/react-query/filters/food-service-styles/hooks";
import { usePlaceTypes } from "@/app/react-query/filters/place-types/hooks";
import { useEventTypes } from "@/app/react-query/filters/event-types/hooks";
import { useAmenities } from "@/app/react-query/filters/amenities/hooks";
import { useActivities } from "@/app/react-query/filters/activities/hooks";

// ─── Primitives ──────────────────────────────────────────────────────────────

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 hover:bg-rose-50 hover:text-rose-600 rounded-full text-xs text-zinc-700 transition-colors"
    >
      {label}
      <X className="w-3 h-3 shrink-0" />
    </button>
  );
}

function TagGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// ─── Generic ID → label tag group ────────────────────────────────────────────

function IdTagGroup({
  label,
  selectedIds,
  options,
  onRemove,
}: {
  label: string;
  selectedIds: string[];
  options: Array<{ id: string; name: string }>;
  onRemove: (id: string) => void;
}) {
  const selected = options.filter((o) => selectedIds.includes(o.id));
  if (selected.length === 0) return null;
  return (
    <TagGroup label={label}>
      {selected.map((o) => (
        <FilterTag key={o.id} label={o.name} onRemove={() => onRemove(o.id)} />
      ))}
    </TagGroup>
  );
}

// ─── Type-specific tag groups (each with its own hook) ───────────────────────

function CityTagGroup({
  label,
  ids,
  onRemove,
}: {
  label: string;
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const orClauses = ids.map((id) => ({ id: { equals: id } }));
  const { data } = useCities({
    limit: ids.length,
    query: { or: orClauses },
  });
  return (
    <IdTagGroup
      label={label}
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function CuisineTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useCuisines({ limit: 50 });
  return (
    <IdTagGroup
      label="Kuchyně"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function DishTypeTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useDishTypes({ limit: 50 });
  return (
    <IdTagGroup
      label="Typ jídla"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function DietaryOptionTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useDietaryOptions({ limit: 50 });
  return (
    <IdTagGroup
      label="Dietní možnosti"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function FoodServiceStyleTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useFoodServiceStyles({ limit: 50 });
  return (
    <IdTagGroup
      label="Styl obsluhy"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function PlaceTypeTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = usePlaceTypes({ limit: 50 });
  return (
    <IdTagGroup
      label="Typ prostoru"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function EventTypeTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useEventTypes({ limit: 50 });
  return (
    <IdTagGroup
      label="Typ akce"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function AmenityTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useAmenities({ limit: 50 });
  return (
    <IdTagGroup
      label="Vybavení"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function ActivityTagGroup({
  ids,
  onRemove,
}: {
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useActivities({ limit: 50 });
  return (
    <IdTagGroup
      label="Aktivity"
      selectedIds={ids}
      options={data?.docs ?? []}
      onRemove={onRemove}
    />
  );
}

function PriceTagGroup({
  minPrice,
  maxPrice,
  onRemove,
}: {
  minPrice?: number;
  maxPrice?: number;
  onRemove: () => void;
}) {
  const hasMin = (minPrice ?? 0) > 0;
  const hasMax = (maxPrice ?? 100000) < 100000;
  if (!hasMin && !hasMax) return null;

  const label =
    hasMin && hasMax
      ? `${minPrice?.toLocaleString("cs-CZ")} – ${maxPrice?.toLocaleString("cs-CZ")} Kč`
      : hasMin
        ? `Od ${minPrice?.toLocaleString("cs-CZ")} Kč`
        : `Do ${maxPrice?.toLocaleString("cs-CZ")} Kč`;

  return (
    <TagGroup label="Cena">
      <FilterTag label={label} onRemove={onRemove} />
    </TagGroup>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isFilterActive<T extends object>(current: T, empty: T): boolean {
  return (Object.keys(current) as (keyof T)[]).some((key) => {
    const val = current[key];
    const emptyVal = empty[key];
    if (Array.isArray(val)) return val.length > 0;
    return val !== emptyVal;
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("cs-CZ") +
    ", " +
    d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ActiveFilterTags({ type }: { type: CatalogType }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const replaceParams = (updater: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    router.replace(`?${params}`, { scroll: false });
  };

  const general = generalFiltersFromParams(searchParams);
  const gastro =
    type === "gastro" ? gastroFiltersFromParams(searchParams) : null;
  const venue = type === "venue" ? venueFiltersFromParams(searchParams) : null;
  const entertainment =
    type === "entertainment"
      ? entertainmentFiltersFromParams(searchParams)
      : null;

  const updateGeneral = (update: Partial<typeof general>) =>
    replaceParams((p) => generalFiltersToParams({ ...general, ...update }, p));

  const updateGastro = (update: Partial<GastroFilterState>) => {
    if (!gastro) return;
    replaceParams((p) => gastroFiltersToParams({ ...gastro, ...update }, p));
  };

  const updateVenue = (update: Partial<VenueFilterState>) => {
    if (!venue) return;
    replaceParams((p) => venueFiltersToParams({ ...venue, ...update }, p));
  };

  const updateEntertainment = (update: Partial<EntertainmentFilterState>) => {
    if (!entertainment) return;
    replaceParams((p) =>
      entertainmentFiltersToParams({ ...entertainment, ...update }, p),
    );
  };

  const hasAnyFilter =
    isFilterActive(general, EMPTY_GENERAL_FILTERS) ||
    (gastro && isFilterActive(gastro, EMPTY_GASTRO_FILTERS)) ||
    (venue && isFilterActive(venue, EMPTY_VENUE_FILTERS)) ||
    (entertainment && isFilterActive(entertainment, EMPTY_ENTERTAINMENT_FILTERS));

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {/* ── General ── */}
      {general.city && (
        <CityTagGroup
          label="Město"
          ids={[general.city]}
          onRemove={() => updateGeneral({ city: "" })}
        />
      )}

      {(general.dateFrom || general.dateTo) && (
        <TagGroup label="Datum konání">
          {general.dateFrom && (
            <FilterTag
              label={`Od: ${formatDateTime(general.dateFrom)}`}
              onRemove={() => updateGeneral({ dateFrom: "" })}
            />
          )}
          {general.dateTo && (
            <FilterTag
              label={`Do: ${formatDateTime(general.dateTo)}`}
              onRemove={() => updateGeneral({ dateTo: "" })}
            />
          )}
        </TagGroup>
      )}

      {(general.adults !== 1 ||
        general.children > 0 ||
        general.accessibility ||
        general.pets) && (
        <TagGroup label="Hosté">
          {general.adults !== 1 && (
            <FilterTag
              label={`${general.adults} dospělý${general.adults > 1 ? "ch" : ""}`}
              onRemove={() => updateGeneral({ adults: 1 })}
            />
          )}
          {general.children > 0 && (
            <FilterTag
              label={`${general.children} ${general.children === 1 ? "dítě" : "děti"}`}
              onRemove={() => updateGeneral({ children: 0 })}
            />
          )}
          {general.accessibility && (
            <FilterTag
              label="ZTP přístup"
              onRemove={() => updateGeneral({ accessibility: false })}
            />
          )}
          {general.pets && (
            <FilterTag
              label="Zvířata"
              onRemove={() => updateGeneral({ pets: false })}
            />
          )}
        </TagGroup>
      )}

      {/* ── Gastro ── */}
      {gastro && gastro.locations.length > 0 && (
        <CityTagGroup
          label="Místo konání"
          ids={gastro.locations}
          onRemove={(id) =>
            updateGastro({
              locations: gastro.locations.filter((l) => l !== id),
            })
          }
        />
      )}
      {gastro && gastro.cuisines.length > 0 && (
        <CuisineTagGroup
          ids={gastro.cuisines}
          onRemove={(id) =>
            updateGastro({ cuisines: gastro.cuisines.filter((c) => c !== id) })
          }
        />
      )}
      {gastro && gastro.dishTypes.length > 0 && (
        <DishTypeTagGroup
          ids={gastro.dishTypes}
          onRemove={(id) =>
            updateGastro({
              dishTypes: gastro.dishTypes.filter((d) => d !== id),
            })
          }
        />
      )}
      {gastro && gastro.dietaryOptions.length > 0 && (
        <DietaryOptionTagGroup
          ids={gastro.dietaryOptions}
          onRemove={(id) =>
            updateGastro({
              dietaryOptions: gastro.dietaryOptions.filter((d) => d !== id),
            })
          }
        />
      )}
      {gastro && gastro.foodServiceStyles.length > 0 && (
        <FoodServiceStyleTagGroup
          ids={gastro.foodServiceStyles}
          onRemove={(id) =>
            updateGastro({
              foodServiceStyles: gastro.foodServiceStyles.filter(
                (f) => f !== id,
              ),
            })
          }
        />
      )}
      {gastro && (
        <PriceTagGroup
          minPrice={gastro.minPrice}
          maxPrice={gastro.maxPrice}
          onRemove={() => updateGastro({ minPrice: 0, maxPrice: 100000 })}
        />
      )}

      {/* ── Venue ── */}
      {venue && venue.locations.length > 0 && (
        <CityTagGroup
          label="Místo konání"
          ids={venue.locations}
          onRemove={(id) =>
            updateVenue({ locations: venue.locations.filter((l) => l !== id) })
          }
        />
      )}
      {venue && venue.placeTypes.length > 0 && (
        <PlaceTypeTagGroup
          ids={venue.placeTypes}
          onRemove={(id) =>
            updateVenue({
              placeTypes: venue.placeTypes.filter((p) => p !== id),
            })
          }
        />
      )}
      {venue && venue.eventTypes.length > 0 && (
        <EventTypeTagGroup
          ids={venue.eventTypes}
          onRemove={(id) =>
            updateVenue({
              eventTypes: venue.eventTypes.filter((e) => e !== id),
            })
          }
        />
      )}
      {venue && venue.amenities.length > 0 && (
        <AmenityTagGroup
          ids={venue.amenities}
          onRemove={(id) =>
            updateVenue({ amenities: venue.amenities.filter((a) => a !== id) })
          }
        />
      )}
      {venue && (
        <PriceTagGroup
          minPrice={venue.minPrice}
          maxPrice={venue.maxPrice}
          onRemove={() => updateVenue({ minPrice: 0, maxPrice: 100000 })}
        />
      )}

      {/* ── Entertainment ── */}
      {entertainment && entertainment.locations.length > 0 && (
        <CityTagGroup
          label="Místo konání"
          ids={entertainment.locations}
          onRemove={(id) =>
            updateEntertainment({
              locations: entertainment.locations.filter((l) => l !== id),
            })
          }
        />
      )}
      {entertainment && entertainment.activities.length > 0 && (
        <ActivityTagGroup
          ids={entertainment.activities}
          onRemove={(id) =>
            updateEntertainment({
              activities: entertainment.activities.filter((a) => a !== id),
            })
          }
        />
      )}
      {entertainment && (
        <PriceTagGroup
          minPrice={entertainment.minPrice}
          maxPrice={entertainment.maxPrice}
          onRemove={() =>
            updateEntertainment({ minPrice: 0, maxPrice: 100000 })
          }
        />
      )}
    </div>
  );
}
