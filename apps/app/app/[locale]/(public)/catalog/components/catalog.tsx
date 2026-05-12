"use client";

import ListingCard from "@/app/components/ui/molecules/listing-card";
import { useListings } from "@/app/react-query/listings/hooks";
import {
  useRouter,
  useSearchParams,
} from "next/dist/client/components/navigation";
import React, { useCallback } from "react";
import { createListingsQuery } from "../functions/create-listings-query";
import CatalogTypeSelection from "./catalog-type-selection";
import ActiveFilterTags from "./filters/active-filter-tags";
import CatalogSidebarFilters from "./filters/catalog-sidebar-filters";
import GeneralFilters from "./filters/general-filters";
import { generateMediaUrl } from "@/app/functions/generate-media-url";

type Props = {
  type: "venue" | "gastro" | "entertainment";
};

export default function Catalog({ type }: Props) {
  const [mapView, setMapView] = React.useState(false);
  const params = useSearchParams();

  const switchMapViewHandler = useCallback(() => {
    setMapView(!mapView);
  }, [mapView]);

  const { data: listings } = useListings({
    options: {
      query: createListingsQuery({
        catalogType: type,
        params: params,
      }),
    },
  });

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full px-6 py-10">
      <div className="max-w-content w-full flex flex-col gap-10">
        <CatalogTypeSelection />
        <GeneralFilters />
        <ActiveFilterTags type={type} />
      </div>
      <div className={`flex items-start w-full max-w-content  gap-6`}>
        <div
          className={`${mapView ? "w-[35%]" : "w-80"} shrink-0 pb-40 relative transition-all ease-in-out`}
        >
          <CatalogSidebarFilters
            switchMapViewHandler={switchMapViewHandler}
            mapViewIsActive={mapView}
            type={type}
          />
        </div>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] content-start gap-5">
          {listings?.docs?.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              imageUrl={generateMediaUrl(listing.images.coverImage.filename)}
              title={listing.name}
              price={listing.price.startsAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
