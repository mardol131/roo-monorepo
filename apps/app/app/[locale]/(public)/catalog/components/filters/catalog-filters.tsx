"use client";

import { useRef, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sliders } from "lucide-react";
import Text from "../../../../../components/ui/atoms/text";
import PriceFilter from "./special/price-filter";
import Button from "@/app/components/ui/atoms/button";
import FiltersModal from "./filters-modal";
import {
  GASTRO_GROUPS,
  GASTRO_SIDEBAR_GROUPS,
  VENUE_GROUPS,
  VENUE_SIDEBAR_GROUPS,
  ENTERTAINMENT_GROUPS,
  ENTERTAINMENT_SIDEBAR_GROUPS,
  GastroFilterState,
  VenueFilterState,
  EntertainmentFilterState,
} from "./filter-groups";
import {
  FILTER_PARAM_KEYS,
  gastroFiltersFromParams,
  gastroFiltersToParams,
  venueFiltersFromParams,
  venueFiltersToParams,
  entertainmentFiltersFromParams,
  entertainmentFiltersToParams,
} from "./filter-params";
import { CatalogType } from "@/app/data/catalog";

const K = FILTER_PARAM_KEYS;

interface CatalogFiltersProps {
  switchMapViewHandler?: () => void;
  mapViewIsActive?: boolean;
  type: CatalogType;
}

export default function CatalogFilters({
  switchMapViewHandler,
  mapViewIsActive,
  type,
}: CatalogFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const sidebarMinPrice = Number(searchParams.get(K.minPrice)) || 0;
  const sidebarMaxPrice = Number(searchParams.get(K.maxPrice)) || 100000;

  const replaceParams = (updater: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    router.replace(`?${params}`, { scroll: false });
  };

  const handlePriceChange = (min: number, max: number) => {
    clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      replaceParams((p) => {
        if (min > 0) p.set(K.minPrice, String(min));
        else p.delete(K.minPrice);
        if (max < 100000) p.set(K.maxPrice, String(max));
        else p.delete(K.maxPrice);
      });
    }, 400);
  };

  const initialModalFilters = useMemo(() => {
    if (type === "gastro") return gastroFiltersFromParams(searchParams);
    if (type === "venue") return venueFiltersFromParams(searchParams);
    return entertainmentFiltersFromParams(searchParams);
  }, [searchParams, type]);

  const handleModalApply = (
    filters: GastroFilterState | VenueFilterState | EntertainmentFilterState,
  ) => {
    replaceParams((p) => {
      if (type === "gastro")
        gastroFiltersToParams(filters as GastroFilterState, p);
      else if (type === "venue")
        venueFiltersToParams(filters as VenueFilterState, p);
      else entertainmentFiltersToParams(filters as EntertainmentFilterState, p);
    });
  };

  const activeFiltersCount = useMemo(() => {
    if (type === "gastro")
      return GASTRO_GROUPS.reduce(
        (sum, g) => sum + g.count(gastroFiltersFromParams(searchParams)),
        0,
      );
    if (type === "venue")
      return VENUE_GROUPS.reduce(
        (sum, g) => sum + g.count(venueFiltersFromParams(searchParams)),
        0,
      );
    return ENTERTAINMENT_GROUPS.reduce(
      (sum, g) => sum + g.count(entertainmentFiltersFromParams(searchParams)),
      0,
    );
  }, [searchParams, type]);

  const renderSidebarGroups = () => {
    if (type === "gastro") {
      const filters = gastroFiltersFromParams(searchParams);
      const onChange = (f: GastroFilterState) =>
        replaceParams((p) => gastroFiltersToParams(f, p));
      return GASTRO_SIDEBAR_GROUPS.map((group) => (
        <group.Content key={group.key} filters={filters} onChange={onChange} />
      ));
    }
    if (type === "venue") {
      const filters = venueFiltersFromParams(searchParams);
      const onChange = (f: VenueFilterState) =>
        replaceParams((p) => venueFiltersToParams(f, p));
      return VENUE_SIDEBAR_GROUPS.map((group) => (
        <group.Content key={group.key} filters={filters} onChange={onChange} />
      ));
    }
    const filters = entertainmentFiltersFromParams(searchParams);
    const onChange = (f: EntertainmentFilterState) =>
      replaceParams((p) => entertainmentFiltersToParams(f, p));
    return ENTERTAINMENT_SIDEBAR_GROUPS.map((group) => (
      <group.Content key={group.key} filters={filters} onChange={onChange} />
    ));
  };

  return (
    <>
      {type === "gastro" && (
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          groups={GASTRO_GROUPS}
          initialFilters={initialModalFilters as GastroFilterState}
          onApply={handleModalApply}
        />
      )}
      {type === "venue" && (
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          groups={VENUE_GROUPS}
          initialFilters={initialModalFilters as VenueFilterState}
          onApply={handleModalApply}
        />
      )}
      {type === "entertainment" && (
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          groups={ENTERTAINMENT_GROUPS}
          initialFilters={initialModalFilters as EntertainmentFilterState}
          onApply={handleModalApply}
        />
      )}

      <div className="relative h-full flex flex-col">
        {/* Mapa */}
        <div
          onClick={switchMapViewHandler}
          className={`mb-6 rounded-xl overflow-hidden bg-linear-to-br from-zinc-50 to-zinc-100 ${mapViewIsActive ? "h-80" : "h-40"} transition-all ease-in-out flex items-center justify-center border border-zinc-200 shadow-sm hover:shadow-md`}
        >
          {!mapViewIsActive && (
            <div className="text-center">
              <Button version="primary" size="sm" text="Zobrazit mapu" />
            </div>
          )}
        </div>

        {/* Filtry */}
        <div className="bg-white relative pb-10 rounded-xl border border-zinc-200 p-5 overflow-y-auto flex-1 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
            <Sliders className="h-5 w-5 text-rose-500" />
            <Text variant="h4" className="text-zinc-900">
              Filtry
            </Text>
            {activeFiltersCount > 0 && (
              <span className="ml-auto inline-flex items-center justify-center h-6 w-6 rounded-full bg-rose-500 text-white text-xs font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </div>

          <Button
            text="Všechny filtry"
            version="primary"
            size="sm"
            className="w-full mb-5"
            onClick={() => setIsFiltersModalOpen(true)}
          />

          <div className="space-y-5">
            <PriceFilter
              minPrice={sidebarMinPrice}
              maxPrice={sidebarMaxPrice}
              onPriceChange={handlePriceChange}
            />
            {renderSidebarGroups()}
          </div>
        </div>
      </div>
    </>
  );
}
