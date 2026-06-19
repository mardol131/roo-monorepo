"use client";

import Text from "@/app/components/ui/atoms/text";
import ListingCard from "@/app/components/ui/molecules/listing-card/listing-card";
import {
  useGeoSearchListings,
  useListingPinsByLocationId,
  useListings,
  useListingsAvailability,
} from "@/app/react-query/listings/hooks";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";

import Button from "@/app/components/ui/atoms/button";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { createListingsQuery } from "../functions/create-listings-query";
import CatalogTypeSelection from "./catalog-type-selection";
import ActiveFilterTags from "./filters/active-filter-tags";
import {
  ENTERTAINMENT_FULL_MODAL_GROUPS,
  EntertainmentFullFilterState,
  GASTRO_FULL_MODAL_GROUPS,
  GastroFullFilterState,
  VENUE_FULL_MODAL_GROUPS,
  VenueFullFilterState,
} from "./filters/filter-groups";
import {
  commonFiltersFromParams,
  commonFiltersToParams,
  entertainmentFiltersFromParams,
  entertainmentFiltersToParams,
  gastroFiltersFromParams,
  gastroFiltersToParams,
  generalFiltersFromParams,
  generalFiltersToParams,
  venueFiltersFromParams,
  venueFiltersToParams,
} from "./filters/filter-params";
import FiltersModal from "./filters/filters-modal";
import { useCatalogStore } from "@/app/store/catalog-store";
import MapFilter, { PinProps } from "./filters/map-filter";
import Pagination from "@/app/components/ui/molecules/pagination";

type Props = {
  type: "venue" | "gastro" | "entertainment";
};

const CATALOG_LIMIT = 12;

export default function Catalog({ type }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mapSegmentActive } = useCatalogStore();

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10) || 1;

  const {
    city: cityFilter,
    district: districtFilter,
    region: regionFilter,
    dateFrom,
    dateTo,
  } = generalFiltersFromParams(searchParams);

  const isGeoType = type === "gastro" || type === "entertainment";
  const hasLocation = !!(cityFilter || districtFilter || regionFilter);
  const useGeoSearch = isGeoType && hasLocation;

  const baseQuery = createListingsQuery({
    catalogType: type,
    params: searchParams,
    skipLocation: useGeoSearch,
  });

  const { data: standardListings } = useListings({
    options: {
      query: baseQuery,
      depth: 0,
      limit: CATALOG_LIMIT,
      page: currentPage,
    },
    enabled: !useGeoSearch,
  });

  const { data: geoListings } = useGeoSearchListings({
    type: type as "gastro" | "entertainment",
    city: cityFilter || undefined,
    district: districtFilter || undefined,
    region: regionFilter || undefined,
    page: currentPage,
    limit: CATALOG_LIMIT,
    where: baseQuery,
    enabled: useGeoSearch,
  });

  const listings = useGeoSearch ? geoListings : standardListings;

  const initialModalFilters = useMemo(() => {
    const general = generalFiltersFromParams(searchParams);
    const common = commonFiltersFromParams(searchParams);
    if (type === "gastro") {
      return {
        type: "gastro" as const,
        filters: {
          ...general,
          ...common,
          ...gastroFiltersFromParams(searchParams),
        } satisfies GastroFullFilterState,
      };
    }
    if (type === "venue") {
      return {
        type: "venue" as const,
        filters: {
          ...general,
          ...common,
          ...venueFiltersFromParams(searchParams),
        } satisfies VenueFullFilterState,
      };
    }
    return {
      type: "entertainment" as const,
      filters: {
        ...general,
        ...common,
        ...entertainmentFiltersFromParams(searchParams),
      } satisfies EntertainmentFullFilterState,
    };
  }, [searchParams, type]);

  const { data: cityData } = useCities({
    query: cityFilter ? { id: { equals: cityFilter } } : undefined,
    limit: 1,
    enabled: !!cityFilter,
  });
  const { data: districtData } = useDistricts({
    query: districtFilter ? { id: { equals: districtFilter } } : undefined,
    limit: 1,
    enabled: !!districtFilter,
  });
  const { data: regionData } = useRegions({
    query: regionFilter ? { id: { equals: regionFilter } } : undefined,
    limit: 1,
    enabled: !!regionFilter,
  });

  const locationBboxSource =
    cityData?.docs?.[0] ?? districtData?.docs?.[0] ?? regionData?.docs?.[0];
  const externalBbox: [number, number, number, number] | undefined =
    locationBboxSource
      ? [
          locationBboxSource.bboxMinLon,
          locationBboxSource.bboxMinLat,
          locationBboxSource.bboxMaxLon,
          locationBboxSource.bboxMaxLat,
        ]
      : undefined;

  const applyFilters = (
    applied:
      | GastroFullFilterState
      | VenueFullFilterState
      | EntertainmentFullFilterState,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    generalFiltersToParams(applied, params);
    commonFiltersToParams(
      {
        minPrice: applied.minPrice,
        maxPrice: applied.maxPrice,
        eventTypes: applied.eventTypes,
      },
      params,
    );
    if (type === "gastro")
      gastroFiltersToParams(applied as GastroFullFilterState, params);
    else if (type === "venue")
      venueFiltersToParams(applied as VenueFullFilterState, params);
    else
      entertainmentFiltersToParams(
        applied as EntertainmentFullFilterState,
        params,
      );
    params.delete("page");
    router.replace(`?${params}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: mapPins } = useListingPinsByLocationId(
    cityFilter ?? districtFilter ?? regionFilter ?? "",
    cityFilter
      ? "city"
      : districtFilter
        ? "district"
        : regionFilter
          ? "region"
          : "country",
  );

  const listingIds = useMemo(
    () => listings?.docs?.map((l) => l.id) ?? [],
    [listings?.docs],
  );

  const showAvailability = useMemo(
    () => !!dateFrom && !!dateTo && listingIds.length > 0,
    [dateFrom, dateTo, listingIds],
  );

  const { data: listingsAvailability } = useListingsAvailability({
    ids: listingIds,
    from: dateFrom,
    to: dateTo,
    enabled: showAvailability,
  });

  const formattedMapPins: PinProps[] = useMemo(() => {
    if (!mapPins) return [];
    const pins: PinProps[] = mapPins.data.map((pin) => ({
      data: {
        coordinates: { latitude: pin.latitude, longitude: pin.longitude },
        label: pin.name,
        tags: [],
        filename: pin.coverImage,
        listingUrl: {
          pathname: `/listing/[listingId]`,
          params: { listingId: pin.id },
        },
      },
    }));
    return pins;
  }, [mapPins]);

  const renderModal = () => {
    if (initialModalFilters.type === "gastro") {
      return (
        <FiltersModal
          groups={GASTRO_FULL_MODAL_GROUPS}
          initialFilters={initialModalFilters.filters}
          onApply={applyFilters}
        />
      );
    }
    if (initialModalFilters.type === "venue") {
      return (
        <FiltersModal
          groups={VENUE_FULL_MODAL_GROUPS}
          initialFilters={initialModalFilters.filters}
          onApply={applyFilters}
        />
      );
    }
    return (
      <FiltersModal
        groups={ENTERTAINMENT_FULL_MODAL_GROUPS}
        initialFilters={initialModalFilters.filters}
        onApply={applyFilters}
      />
    );
  };

  console.log("geoListings", geoListings);
  console.log("standardListings", standardListings);

  return (
    <>
      {renderModal()}

      <div className="flex min-h-screen content-start flex-col gap-10 items-center justify-start w-full px-6 py-10">
        <div
          className={`flex flex-col items-start w-full max-w-content  gap-6`}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <Text variant="body" color="textLight">
              Počet nalezených inzerátů: {listings?.totalDocs ?? 0}
            </Text>
            {!showAvailability && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-surface text-primary border border-primary">
                <Text variant="label-lg" color="primary">
                  Pro zobrazení dostupnosti zvolte datum události
                </Text>
              </div>
            )}
          </div>
          {listings?.docs?.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center gap-3 py-20">
              <Text variant="h3">Nic jsme nenašli</Text>
              <Text variant="body" color="textLight">
                Zkus upravit nebo odebrat některé filtry.
              </Text>
            </div>
          ) : (
            <div
              className={`w-full min-h-screen ${mapSegmentActive ? "grid gap-20 grid-cols-2" : ""}`}
            >
              <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] content-start gap-5">
                {listings?.docs?.map((listing) => {
                  let distance:
                    | { type: "geoDistance"; distanceKm: number }
                    | { type: "max"; distanceKm: number }
                    | undefined = undefined;

                  if (isGeoType) {
                    if (useGeoSearch) {
                      const km = geoListings?.distances?.[listing.id];
                      if (km !== undefined)
                        distance = { type: "geoDistance", distanceKm: km };
                    } else {
                      const { wholeCountry, maxTravelDistanceKm } =
                        listing.servicableArea;
                      if (!wholeCountry && maxTravelDistanceKm)
                        distance = {
                          type: "max",
                          distanceKm: maxTravelDistanceKm,
                        };
                    }
                  }

                  return (
                    <ListingCard
                      key={listing.id}
                      id={listing.id}
                      images={[
                        listing.images.coverImage.filename,
                        ...listing.images.gallery.map((img) => img.filename),
                      ]}
                      title={listing.name}
                      shortDescription={listing.shortDescription ?? undefined}
                      price={listing.minimumPricePerEvent}
                      linkTarget="_self"
                      showAvailability={showAvailability}
                      availability={
                        listingsAvailability?.data.find(
                          (a) => a.id === listing.id,
                        )?.status
                      }
                      distance={distance}
                    />
                  );
                })}
              </div>
              {mapSegmentActive && (
                <div>
                  <div className="sticky top-40">
                    <MapFilter
                      pins={formattedMapPins}
                      externalBbox={externalBbox}
                      height="h-120"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>{" "}
        {listings && (
          <Pagination
            totalPages={listings.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
