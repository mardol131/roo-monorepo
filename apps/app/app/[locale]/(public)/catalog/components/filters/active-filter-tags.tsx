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
  commonFiltersFromParams,
  commonFiltersToParams,
} from "./filter-params";
import {
  GastroFilterState,
  VenueFilterState,
  EntertainmentFilterState,
  EMPTY_GASTRO_FILTERS,
  EMPTY_VENUE_FILTERS,
  EMPTY_ENTERTAINMENT_FILTERS,
  EMPTY_GENERAL_FILTERS,
} from "./filter-groups";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import Text from "@/app/components/ui/atoms/text";

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
      <Text variant="caption">{label}</Text>
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
      <Text variant="h4">{label}</Text>
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

// ─── Locality tag groups (need dynamic query by ID) ──────────────────────────

function CityTagGroup({
  label,
  ids,
  onRemove,
}: {
  label: string;
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const { data } = useCities({
    limit: ids.length,
    query: { or: ids.map((id) => ({ id: { equals: id } })) },
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

function DistrictTagGroup({
  id,
  onRemove,
}: {
  id: string;
  onRemove: () => void;
}) {
  const { data } = useDistricts({
    query: { id: { equals: id } },
    limit: 1,
    enabled: !!id,
  });
  const name = data?.docs?.[0]?.name;
  if (!name) return null;
  return (
    <TagGroup label="Okres">
      <FilterTag label={name} onRemove={onRemove} />
    </TagGroup>
  );
}

function RegionTagGroup({
  id,
  onRemove,
}: {
  id: string;
  onRemove: () => void;
}) {
  const { data } = useRegions({
    query: { id: { equals: id } },
    limit: 1,
    enabled: !!id,
  });
  const name = data?.docs?.[0]?.name;
  if (!name) return null;
  return (
    <TagGroup label="Kraj">
      <FilterTag label={name} onRemove={onRemove} />
    </TagGroup>
  );
}

// ─── Price ───────────────────────────────────────────────────────────────────

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
    if (Array.isArray(val)) return val.length > 0;
    return val !== empty[key];
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
  const { data: filters } = useFilterOptions();

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
  const common = commonFiltersFromParams(searchParams);

  const updateGeneral = (update: Partial<typeof general>) =>
    replaceParams((p) => generalFiltersToParams({ ...general, ...update }, p));

  const updateCommon = (update: Partial<typeof common>) =>
    replaceParams((p) => commonFiltersToParams({ ...common, ...update }, p));

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
    (entertainment &&
      isFilterActive(entertainment, EMPTY_ENTERTAINMENT_FILTERS));

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {/* ── General ── */}
      {general.city && (
        <CityTagGroup
          label="Město"
          ids={[general.city]}
          onRemove={() =>
            updateGeneral({ city: "", district: "", region: "", bbox: [] })
          }
        />
      )}
      {!general.city && general.district && (
        <DistrictTagGroup
          id={general.district}
          onRemove={() => updateGeneral({ district: "", region: "", bbox: [] })}
        />
      )}
      {!general.city && !general.district && general.region && (
        <RegionTagGroup
          id={general.region}
          onRemove={() => updateGeneral({ region: "", bbox: [] })}
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

      {general.bbox && general.bbox.length === 4 && (
        <TagGroup label="Podle mapy">
          <FilterTag
            label="Aktivní"
            onRemove={() => updateGeneral({ bbox: undefined })}
          />
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

      {/* ── Common ── */}

      {(common.minPrice !== undefined || common.maxPrice !== undefined) && (
        <PriceTagGroup
          minPrice={common.minPrice}
          maxPrice={common.maxPrice}
          onRemove={() =>
            updateCommon({ minPrice: undefined, maxPrice: undefined })
          }
        />
      )}

      {common.eventTypes.length > 0 && (
        <IdTagGroup
          label="Typ akce"
          selectedIds={common.eventTypes}
          options={filters?.eventTypes ?? []}
          onRemove={(id) =>
            updateCommon({
              eventTypes: common.eventTypes.filter((e) => e !== id),
            })
          }
        />
      )}

      {/* ── Gastro ── */}

      {gastro && gastro.cuisines.length > 0 && (
        <IdTagGroup
          label="Kuchyně"
          selectedIds={gastro.cuisines}
          options={filters?.cuisines ?? []}
          onRemove={(id) =>
            updateGastro({ cuisines: gastro.cuisines.filter((c) => c !== id) })
          }
        />
      )}

      {gastro && gastro.dishTypes.length > 0 && (
        <IdTagGroup
          label="Typ jídla"
          selectedIds={gastro.dishTypes}
          options={filters?.dishTypes ?? []}
          onRemove={(id) =>
            updateGastro({
              dishTypes: gastro.dishTypes.filter((d) => d !== id),
            })
          }
        />
      )}

      {gastro && gastro.dietaryOptions.length > 0 && (
        <IdTagGroup
          label="Dietní možnosti"
          selectedIds={gastro.dietaryOptions}
          options={filters?.dietaryOptions ?? []}
          onRemove={(id) =>
            updateGastro({
              dietaryOptions: gastro.dietaryOptions.filter((d) => d !== id),
            })
          }
        />
      )}

      {gastro && gastro.foodServiceStyles.length > 0 && (
        <IdTagGroup
          label="Styl obsluhy"
          selectedIds={gastro.foodServiceStyles}
          options={filters?.foodPreparationStyles ?? []}
          onRemove={(id) =>
            updateGastro({
              foodServiceStyles: gastro.foodServiceStyles.filter(
                (f) => f !== id,
              ),
            })
          }
        />
      )}

      {/* ── Venue ── */}

      {venue && venue.placeTypes.length > 0 && (
        <IdTagGroup
          label="Typ prostoru"
          selectedIds={venue.placeTypes}
          options={filters?.placeTypes ?? []}
          onRemove={(id) =>
            updateVenue({
              placeTypes: venue.placeTypes.filter((p) => p !== id),
            })
          }
        />
      )}

      {venue && venue.amenities.length > 0 && (
        <IdTagGroup
          label="Vybavení"
          selectedIds={venue.amenities}
          options={filters?.amenities ?? []}
          onRemove={(id) =>
            updateVenue({ amenities: venue.amenities.filter((a) => a !== id) })
          }
        />
      )}

      {/* ── Entertainment ── */}

      {entertainment && entertainment.activities.length > 0 && (
        <IdTagGroup
          label="Aktivity"
          selectedIds={entertainment.activities}
          options={filters?.activities ?? []}
          onRemove={(id) =>
            updateEntertainment({
              activities: entertainment.activities.filter((a) => a !== id),
            })
          }
        />
      )}
    </div>
  );
}
