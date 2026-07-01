"use client";

import { buildCircleGeoJSON } from "@/app/components/ui/atoms/inputs/map-radius-input";
import Text from "@/app/components/ui/atoms/text";
import { Listing } from "@roo/common";
import {
  Layer,
  Map,
  Marker,
  NavigationControl,
  Source,
} from "@vis.gl/react-maplibre";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const KM_PER_DEG_LAT = 111;

export default function ListingMap({ listing }: { listing: Listing }) {
  const loc = listing.location;
  const [longitude, latitude] = loc.point;
  const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

  const travelRadiusKm =
    (listing.type === "gastro" || listing.type === "entertainment") &&
    !listing.servicableArea.wholeCountry
      ? (listing.servicableArea.maxTravelDistanceKm ?? null)
      : null;

  const degLat = (travelRadiusKm ?? 0) / KM_PER_DEG_LAT;
  const degLon =
    (travelRadiusKm ?? 0) /
    (KM_PER_DEG_LAT * Math.cos((latitude * Math.PI) / 180));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-2xl h-100 overflow-hidden border border-zinc-200">
        <Map
          style={{ height: "100%" }}
          initialViewState={
            travelRadiusKm
              ? {
                  bounds: [
                    [longitude - degLon, latitude - degLat],
                    [longitude + degLon, latitude + degLat],
                  ],
                  fitBoundsOptions: { padding: 40 },
                }
              : {
                  latitude,
                  longitude,
                  zoom: 13,
                  bearing: 0,
                  pitch: 0,
                }
          }
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        >
          <NavigationControl position="top-left" />

          {travelRadiusKm && (
            <Source
              id="listing-map-travel-area"
              type="geojson"
              data={buildCircleGeoJSON(latitude, longitude, travelRadiusKm)}
            >
              <Layer
                id="listing-map-travel-area-fill"
                type="fill"
                paint={{ "fill-color": "#e11d48", "fill-opacity": 0.15 }}
              />
              <Layer
                id="listing-map-travel-area-outline"
                type="line"
                paint={{
                  "line-color": "#e11d48",
                  "line-width": 2,
                  "line-opacity": 0.7,
                }}
              />
            </Source>
          )}

          <Marker color="#e11d48" latitude={latitude} longitude={longitude} />
        </Map>
      </div>

      <Link
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
      >
        <ExternalLink size={14} className="text-primary" />
        <Text variant="label-sm" color="primary">
          Otevřít v Google Maps
        </Text>
      </Link>
    </div>
  );
}
