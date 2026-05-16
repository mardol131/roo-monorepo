"use client";

import { useRef, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sliders } from "lucide-react";
import Text from "../../../../../components/ui/atoms/text";
import PriceFilter from "./special/price-filter";
import Button from "@/app/components/ui/atoms/button";
import FiltersModal from "./filters-modal";
import {
  GASTRO_SIDEBAR_GROUPS,
  VENUE_SIDEBAR_GROUPS,
  ENTERTAINMENT_SIDEBAR_GROUPS,
  GastroFilterState,
  VenueFilterState,
  EntertainmentFilterState,
  CommonFilterState,
  COMMON_SIDEBAR_GROUPS,
  GASTRO_GROUPS,
  VENUE_GROUPS,
  ENTERTAINMENT_GROUPS,
  GASTRO_MODAL_GROUPS,
  VENUE_MODAL_GROUPS,
  ENTERTAINMENT_MODAL_GROUPS,
  GENERAL_PARAM_KEYS,
} from "./filter-groups";
import {
  gastroFiltersFromParams,
  gastroFiltersToParams,
  venueFiltersFromParams,
  venueFiltersToParams,
  entertainmentFiltersFromParams,
  entertainmentFiltersToParams,
  generalFiltersFromParams,
  commonFiltersFromParams,
  commonFiltersToParams,
} from "./filter-params";
import { CatalogType } from "@/app/data/catalog";
import MapFilter, { PinProps } from "./map-filter";
import { useListings } from "@/app/react-query/listings/hooks";
import { useCities } from "@/app/react-query/cities/hooks";

interface CatalogFiltersProps {
  switchMapViewHandler?: () => void;
  mapViewIsActive?: boolean;
  type: CatalogType;
}

export default function CatalogSidebarFilters({
  switchMapViewHandler,
  mapViewIsActive,
  type,
}: CatalogFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const commonDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const params = useSearchParams();

  const { data: listings } = useListings();

  const replaceParams = (updater: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    router.replace(`?${params}`, { scroll: false });
  };

  const initialModalFilters = useMemo(() => {
    const common = commonFiltersFromParams(searchParams);

    if (type === "gastro") {
      return {
        type: "gastro" as const,
        filters: {
          ...common,
          ...gastroFiltersFromParams(searchParams),
          eventTypes: common.eventTypes ?? [],
        },
      };
    }
    if (type === "venue") {
      return {
        type: "venue" as const,
        filters: {
          ...common,
          ...venueFiltersFromParams(searchParams),
          eventTypes: common.eventTypes ?? [],
        },
      };
    }
    return {
      type: "entertainment" as const,
      filters: {
        ...common,
        ...entertainmentFiltersFromParams(searchParams),
        eventTypes: common.eventTypes ?? [],
      },
    };
  }, [searchParams, type]);

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

  const handleVenueFilterChange = (f: VenueFilterState) =>
    replaceParams((p) => venueFiltersToParams(f, p));

  const handleCommonFilterChange = (f: CommonFilterState) => {
    clearTimeout(commonDebounceRef.current);
    commonDebounceRef.current = setTimeout(() => {
      replaceParams((p) => commonFiltersToParams(f, p));
    }, 400);
  };

  const renderSidebarGroups = () => {
    const filtersArray = [];

    const commonFilters = commonFiltersFromParams(searchParams);
    filtersArray.push(
      ...COMMON_SIDEBAR_GROUPS.map((group) => {
        return (
          <group.Content
            key={group.key}
            filters={commonFilters}
            onChange={handleCommonFilterChange}
          />
        );
      }),
    );

    if (type === "gastro") {
      const filters = gastroFiltersFromParams(searchParams);
      const onChange = (f: GastroFilterState) =>
        replaceParams((p) => gastroFiltersToParams(f, p));
      filtersArray.push(
        ...GASTRO_SIDEBAR_GROUPS.map((group) => (
          <group.Content
            key={group.key}
            filters={filters}
            onChange={onChange}
          />
        )),
      );
    } else if (type === "venue") {
      const filters = venueFiltersFromParams(searchParams);
      filtersArray.push(
        ...VENUE_SIDEBAR_GROUPS.map((group) => (
          <group.Content
            key={group.key}
            filters={filters}
            onChange={handleVenueFilterChange}
          />
        )),
      );
    } else if (type === "entertainment") {
      const filters = entertainmentFiltersFromParams(searchParams);
      const onChange = (f: EntertainmentFilterState) =>
        replaceParams((p) => entertainmentFiltersToParams(f, p));
      filtersArray.push(
        ...ENTERTAINMENT_SIDEBAR_GROUPS.map((group) => (
          <group.Content
            key={group.key}
            filters={filters}
            onChange={onChange}
          />
        )),
      );
    }
    return filtersArray;
  };

  const cityFilter = generalFiltersFromParams(searchParams).city;
  const { data: cities } = useCities({
    limit: 1,
    query: cityFilter ? { id: { equals: cityFilter } } : undefined,
  });

  const city = cityFilter && cities?.docs?.[0] ? cities.docs[0] : undefined;

  const mapPins = useMemo((): PinProps[] => {
    if (!listings?.docs) return [];
    return listings.docs.flatMap((listing) => {
      const detail = listing.details.find((d) => d.blockType === "venue");
      if (!detail || detail.blockType !== "venue") return [];

      const data: PinProps = {
        value: {
          latitude: detail.location.latitude,
          longitude: detail.location.longitude,
        },
        data: {
          label: listing.name,
          tags:
            listing.eventTypes?.flatMap((e) =>
              typeof e === "object" ? [e.name] : [],
            ) ?? [],
          filename: listing.images.coverImage.filename,
          buttonUrl: {
            pathname: "/listing/[listingId]",
            params: { listingId: listing.id },
          },
        },
      };
      return [data];
    });
  }, [listings]);

  const handleGastroModalApply = (
    filters: GastroFilterState & CommonFilterState,
  ) => {
    replaceParams((p) => {
      commonFiltersToParams(
        {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          eventTypes: filters.eventTypes,
        },
        p,
      );
      gastroFiltersToParams(
        {
          cuisines: filters.cuisines,
          dishTypes: filters.dishTypes,
          dietaryOptions: filters.dietaryOptions,
          foodServiceStyles: filters.foodServiceStyles,
        },
        p,
      );
    });
  };

  const handleVenueModalApply = (
    filters: VenueFilterState & CommonFilterState,
  ) => {
    replaceParams((p) => {
      commonFiltersToParams(
        {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          eventTypes: filters.eventTypes,
        },
        p,
      );
      venueFiltersToParams(
        {
          amenities: filters.amenities,
          placeTypes: filters.placeTypes,
          activities: filters.activities,
        },
        p,
      );
    });
  };

  const handleEntertainmentModalApply = (
    filters: EntertainmentFilterState & CommonFilterState,
  ) => {
    replaceParams((p) => {
      commonFiltersToParams(
        {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          eventTypes: filters.eventTypes,
        },
        p,
      );
      entertainmentFiltersToParams(
        {
          activities: filters.activities,
        },
        p,
      );
    });
  };

  const renderGastroModal = () => {
    if (initialModalFilters.type !== "gastro") return null;
    return (
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        groups={GASTRO_MODAL_GROUPS}
        initialFilters={initialModalFilters.filters}
        onApply={handleGastroModalApply}
      />
    );
  };

  const renderVenueModal = () => {
    if (initialModalFilters.type !== "venue") return null;
    return (
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        groups={VENUE_MODAL_GROUPS}
        initialFilters={initialModalFilters.filters}
        onApply={handleVenueModalApply}
      />
    );
  };

  const renderEntertainmentModal = () => {
    if (initialModalFilters.type !== "entertainment") return null;
    return (
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        groups={ENTERTAINMENT_MODAL_GROUPS}
        initialFilters={initialModalFilters.filters}
        onApply={handleEntertainmentModalApply}
      />
    );
  };

  const onMapMove = (bbox: [number, number, number, number]) => {
    const searchParams = new URLSearchParams(params.toString());

    if (searchParams.get(GENERAL_PARAM_KEYS.city)) {
      if (searchParams.get(GENERAL_PARAM_KEYS.bbox)) {
        searchParams.delete(GENERAL_PARAM_KEYS.bbox);
        return router.replace(`?${searchParams.toString()}`, { scroll: false });
      }
      return;
    }
    const [west, south, east, north] = bbox;

    searchParams.set(
      GENERAL_PARAM_KEYS.bbox,
      `${west},${south},${east},${north}`,
    );
    router.replace(`?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <>
      {renderGastroModal()}
      {renderVenueModal()}
      {renderEntertainmentModal()}
      <div className="relative h-full flex flex-col">
        {/* Mapa */}
        <div
          className={`mb-6 rounded-xl overflow-hidden ${mapViewIsActive ? "h-130" : "h-100 bg-linear-to-br from-zinc-50 to-zinc-100 flex items-center justify-center border border-zinc-200"} transition-all ease-in-out`}
        >
          <MapFilter
            pins={mapPins}
            onMapMove={onMapMove}
            topRightButton={{
              text: mapViewIsActive ? "Zavřít" : "Otevřít",
              onClick: switchMapViewHandler,
              size: "sm",
            }}
            height={"h-full"}
            externalBbox={
              city
                ? [
                    city.bboxMinLon,
                    city.bboxMinLat,
                    city.bboxMaxLon,
                    city.bboxMaxLat,
                  ]
                : undefined
            }
          />
        </div>

        {/* Filtry */}
        <div className="bg-white relative pb-10 rounded-xl border border-zinc-200 p-5 overflow-y-auto flex-1">
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

          <div className="space-y-5">{renderSidebarGroups()}</div>
        </div>
      </div>
    </>
  );
}
