"use client";

import { useClickOutside } from "@/app/hooks/use-click-outside";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Balloon,
  Banknote,
  Calendar,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  UtensilsCrossed,
  Users,
  X,
  Map,
} from "lucide-react";
import LocationFilter from "./location-filter";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import DateFilter from "./special/date-filter";
import GuestsFilter from "./special/guests-filter";
import Text from "@/app/components/ui/atoms/text";
import Input from "@/app/components/ui/atoms/inputs/input";
import {
  generalFiltersFromParams,
  generalFiltersToParams,
  commonFiltersFromParams,
  commonFiltersToParams,
} from "./filter-params";
import {
  GeneralFilterState,
  CommonFilterState,
  GASTRO_FULL_MODAL_GROUPS,
  VENUE_FULL_MODAL_GROUPS,
  ENTERTAINMENT_FULL_MODAL_GROUPS,
} from "./filter-groups";
import {
  gastroFiltersFromParams,
  venueFiltersFromParams,
  entertainmentFiltersFromParams,
} from "./filter-params";
import { CatalogType } from "@/app/data/catalog";
import React from "react";
import { useCatalogStore } from "@/app/store/catalog-store";

const MAX_PRICE = 100000;

type ActiveSegment = "type" | "location" | "date" | "guests" | "price" | null;

const CATALOG_TYPES = [
  { value: "venue" as CatalogType, label: "Místo", icon: MapPin },
  { value: "gastro" as CatalogType, label: "Gastro", icon: UtensilsCrossed },
  { value: "entertainment" as CatalogType, label: "Zábava", icon: Balloon },
];

type Props = { type?: CatalogType };

export default function GeneralFilters({ type: typeProp }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveSegment>(null);
  const {
    mapSegmentActive,
    setMapSegmentActive,
    filtersModalOpen,
    setFiltersModalOpen,
  } = useCatalogStore();

  const routeType: CatalogType = pathname?.includes("gastro")
    ? "gastro"
    : pathname?.includes("entertainment")
      ? "entertainment"
      : "venue";
  const currentType = typeProp ?? routeType;
  const currentTypeData = CATALOG_TYPES.find((t) => t.value === currentType)!;

  const filters = generalFiltersFromParams(searchParams);
  const commonFilters = commonFiltersFromParams(searchParams);

  const [minInput, setMinInput] = useState(
    commonFilters.minPrice != null && commonFilters.minPrice > 0
      ? String(commonFilters.minPrice)
      : "",
  );
  const [maxInput, setMaxInput] = useState(
    commonFilters.maxPrice != null && commonFilters.maxPrice < MAX_PRICE
      ? String(commonFilters.maxPrice)
      : "",
  );

  useEffect(() => {
    setMinInput(
      commonFilters.minPrice != null && commonFilters.minPrice > 0
        ? String(commonFilters.minPrice)
        : "",
    );
    setMaxInput(
      commonFilters.maxPrice != null && commonFilters.maxPrice < MAX_PRICE
        ? String(commonFilters.maxPrice)
        : "",
    );
  }, [commonFilters.minPrice, commonFilters.maxPrice]);

  useClickOutside(barRef, () => setActive(null), active !== null);

  const replaceParams = (
    updater: (f: GeneralFilterState) => GeneralFilterState,
  ) => {
    const next = updater(filters);
    const params = new URLSearchParams(searchParams.toString());
    generalFiltersToParams(next, params);
    router.replace(`?${params}` as never, { scroll: false } as never);
  };

  const replaceCommonParams = (
    updater: (f: CommonFilterState) => CommonFilterState,
  ) => {
    const next = updater(commonFilters);
    const params = new URLSearchParams(searchParams.toString());
    commonFiltersToParams(next, params);
    router.replace(`?${params}` as never, { scroll: false } as never);
  };

  const commitPrice = (rawMin: string, rawMax: string) => {
    const min = rawMin === "" ? undefined : Math.max(0, parseInt(rawMin, 10));
    const max =
      rawMax === "" ? undefined : Math.min(MAX_PRICE, parseInt(rawMax, 10));
    const safeMin =
      min !== undefined && max !== undefined && min > max ? max : min;
    const safeMax =
      max !== undefined && min !== undefined && max < min ? min : max;
    replaceCommonParams((f) => ({
      ...f,
      minPrice: isNaN(safeMin ?? NaN) ? undefined : safeMin,
      maxPrice: isNaN(safeMax ?? NaN) ? undefined : safeMax,
    }));
  };

  const toggle = (seg: ActiveSegment) =>
    setActive((prev) => (prev === seg ? null : seg));

  const typeFilters =
    currentType === "gastro"
      ? gastroFiltersFromParams(searchParams)
      : currentType === "venue"
        ? venueFiltersFromParams(searchParams)
        : entertainmentFiltersFromParams(searchParams);

  const modalGroups =
    currentType === "gastro"
      ? GASTRO_FULL_MODAL_GROUPS
      : currentType === "venue"
        ? VENUE_FULL_MODAL_GROUPS
        : ENTERTAINMENT_FULL_MODAL_GROUPS;

  const fullFilters = { ...filters, ...commonFilters, ...typeFilters };

  const activeFilterCount = modalGroups.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sum, group) => sum + group.count(fullFilters as any),
    0,
  );

  const clearFilters = () => {
    router.push({ pathname: `/catalog/${currentType}` });
  };

  const { data: selectedCity } = useCities({
    query: filters.city ? { id: { equals: filters.city } } : undefined,
    limit: 1,
    enabled: !!filters.city,
  });
  const { data: selectedDistrict } = useDistricts(
    filters.district ? { id: { equals: filters.district } } : undefined,
    1,
    !!filters.district,
  );
  const { data: selectedRegion } = useRegions(
    filters.region ? { id: { equals: filters.region } } : undefined,
    1,
    !!filters.region,
  );

  const locationText =
    selectedCity?.docs?.[0]?.name ??
    selectedDistrict?.docs?.[0]?.name ??
    selectedRegion?.docs?.[0]?.name ??
    (filters.city || filters.district || filters.region
      ? "Načítám…"
      : "Celá ČR");

  const dateText =
    filters.dateFrom && filters.dateTo
      ? `${new Date(filters.dateFrom).toLocaleDateString("cs-CZ")} – ${new Date(filters.dateTo).toLocaleDateString("cs-CZ")}`
      : filters.dateFrom
        ? `Od ${new Date(filters.dateFrom).toLocaleDateString("cs-CZ")}`
        : "Vyberte termín";

  const guestsText = `${filters.adults} dosp., ${filters.children} dětí`;

  const priceText =
    minInput && maxInput
      ? `${Number(minInput).toLocaleString("cs-CZ")} – ${Number(maxInput).toLocaleString("cs-CZ")} Kč`
      : minInput
        ? `Od ${Number(minInput).toLocaleString("cs-CZ")} Kč`
        : maxInput
          ? `Do ${Number(maxInput).toLocaleString("cs-CZ")} Kč`
          : "Libovolná";

  return (
    <div ref={barRef} className="relative w-full">
      <div className="flex rounded-full border border-zinc-200 bg-white shadow-sm w-full overflow-hidden">
        {/* Catalog type */}
        <button
          type="button"
          onClick={() => toggle("type")}
          className={`flex items-center gap-2 pl-4 pr-3 py-2.5 transition-colors shrink-0 ${
            active === "type" ? "bg-zinc-100" : "hover:bg-zinc-50"
          }`}
        >
          <currentTypeData.icon className="w-4 h-4 text-rose-500 shrink-0" />
          <div className="flex flex-col items-start">
            <Text variant="label-sm" color="textLight">
              Hledám
            </Text>
            <Text variant="label" color="textDark">
              {currentTypeData.label}
            </Text>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${active === "type" ? "rotate-180" : ""}`}
          />
        </button>

        <div className="w-px bg-zinc-200 self-stretch" />

        <PillSegment
          icon={MapPin}
          label="Kde se akce koná"
          value={locationText}
          active={active === "location"}
          onClick={() => toggle("location")}
        />
        <div className="w-px bg-zinc-200 self-stretch" />
        <PillSegment
          icon={Calendar}
          label="Kdy se akce koná"
          value={dateText}
          active={active === "date"}
          onClick={() => toggle("date")}
        />
        <div className="w-px bg-zinc-200 self-stretch" />
        <PillSegment
          icon={Users}
          label="Počet hostů"
          value={guestsText}
          active={active === "guests"}
          onClick={() => toggle("guests")}
        />
        <div className="w-px bg-zinc-200 self-stretch" />
        <PillSegment
          icon={Banknote}
          label="Cena (Kč)"
          value={priceText}
          active={active === "price"}
          onClick={() => toggle("price")}
        />

        <div className="w-px bg-zinc-200 self-stretch" />

        <button
          type="button"
          onClick={() => setFiltersModalOpen(true)}
          className="relative flex items-center justify-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors shrink-0"
          title="Podrobné filtry"
        >
          <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
          <Text variant="label" color="textDark" className="truncate">
            Filtry
          </Text>
          {activeFilterCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-0.5 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <>
            <div className="w-px bg-zinc-200 self-stretch" />
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center px-3 py-2.5 hover:bg-zinc-50 transition-colors shrink-0"
              title="Smazat filtry"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </>
        )}
        <div className="w-px bg-zinc-200 self-stretch" />

        <button
          type="button"
          onClick={() => setMapSegmentActive(!mapSegmentActive)}
          className={`relative ${mapSegmentActive ? "bg-primary-surface" : "hover:bg-zinc-50"} flex items-center justify-center gap-3 px-4 py-2.5  transition-colors shrink-0`}
          title="Podrobné filtry"
        >
          <Map className="w-4 h-4 text-zinc-500" />
          <Text variant="label" color="textDark" className="truncate">
            Mapa
          </Text>
        </button>
      </div>

      {active === "type" && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-zinc-200 rounded-2xl shadow-lg z-20 min-w-40 overflow-hidden">
          {CATALOG_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                router.push({ pathname: `/catalog/${value}` });
                setActive(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors ${
                currentType === value ? "bg-rose-50" : ""
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <Text
                variant="label-lg"
                color={currentType === value ? "primary" : "textDark"}
              >
                {label}
              </Text>
            </button>
          ))}
        </div>
      )}

      {active === "location" && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-zinc-200 rounded-2xl shadow-lg z-20 p-4">
          <LocationFilter
            value={{
              city: filters.city,
              district: filters.district,
              region: filters.region,
            }}
            onChange={({ city, district, region }) =>
              replaceParams((f) => ({ ...f, city, district, region, bbox: [] }))
            }
          />
        </div>
      )}

      {active === "date" && (
        <div className="absolute top-full mt-2 left-1/4 bg-white border border-zinc-200 rounded-2xl shadow-lg z-20">
          <DateFilter
            type="inline"
            startValue={filters.dateFrom || undefined}
            endValue={filters.dateTo || undefined}
            onStartChange={(dateFrom) =>
              replaceParams((f) => ({ ...f, dateFrom }))
            }
            onEndChange={(dateTo) => replaceParams((f) => ({ ...f, dateTo }))}
          />
        </div>
      )}

      {active === "guests" && (
        <div className="absolute top-full mt-2 left-1/2 bg-white border border-zinc-200 rounded-2xl shadow-lg z-20">
          <GuestsFilter
            type="inline"
            value={{
              adults: filters.adults,
              children: filters.children,
              accessibility: filters.accessibility,
              pets: filters.pets,
            }}
            onChange={(g) => replaceParams((f) => ({ ...f, ...g }))}
          />
        </div>
      )}

      {active === "price" && (
        <div className="absolute top-full mt-2 right-10 w-72 bg-white border border-zinc-200 rounded-2xl shadow-lg z-20 p-4">
          <div className="flex gap-3 items-start">
            <Input
              inputProps={{
                type: "number",
                min: 0,
                max: maxInput !== "" ? Number(maxInput) : MAX_PRICE,
                value: minInput,
                onChange: (e) => setMinInput(e.target.value),
                onBlur: () => commitPrice(minInput, maxInput),
              }}
              placeholder="Od"
            />
            <Input
              inputProps={{
                type: "number",
                min: minInput !== "" ? Number(minInput) : 0,
                max: MAX_PRICE,
                value: maxInput,
                onChange: (e) => setMaxInput(e.target.value),
                onBlur: () => commitPrice(minInput, maxInput),
              }}
              placeholder="Do"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PillSegment({
  icon: Icon,
  label,
  value,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-2 px-4 py-2.5 text-left transition-colors min-w-0 ${
        active ? "bg-zinc-100" : "hover:bg-zinc-50"
      }`}
    >
      <Icon className="w-4 h-4 text-rose-500 shrink-0" />
      <div className="flex flex-col min-w-0">
        <Text variant="label-sm" color="textLight">
          {label}
        </Text>
        <Text variant="label" color="textDark" className="truncate">
          {value}
        </Text>
      </div>
    </button>
  );
}
