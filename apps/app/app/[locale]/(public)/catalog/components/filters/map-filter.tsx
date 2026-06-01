"use client";

import {
  FullscreenControl,
  Layer,
  Map,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
  Source,
} from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink, Link } from "@/app/i18n/navigation";
import {
  Bbox,
  Coordinates,
  buildOverlayGeoJSON,
} from "@/app/components/ui/atoms/inputs/map-point-input";
import { generateMediaUrl } from "@/app/functions/generate-media-url";

export type PinPropsData = {
  coordinates: Coordinates;
  label: string;
  tags: string[];
  filename: string;
  listingUrl: IntlLink;
};

export type PinProps = {
  onClick?: (coords: Coordinates) => void;
  data: PinPropsData;
};

type Props = {
  pins: PinProps[];
  topRightButton?: ButtonProps;
  height?: string | number;
  externalBbox?: Bbox;
  onMapMove?: (bbox: Bbox) => void;
};

export const CZ_BBOX: Bbox = [11.5, 48.0, 19.5, 51.7];
const OVERLAY_PADDING = 0.3;
// ~10 km in degrees (1° lat ≈ 111 km, 1° lon ≈ 71 km at CZ latitude)
const KM10_DEG_LAT = 0.09;
const KM10_DEG_LON = 0.14;

const getPaddedBounds = (bbox: Bbox, padding: number = OVERLAY_PADDING) => {
  const width = bbox[2] - bbox[0];
  const height = bbox[3] - bbox[1];

  return [
    [bbox[0] - width * padding, bbox[1] - height * padding],
    [bbox[2] + width * padding, bbox[3] + height * padding],
  ] as [[number, number], [number, number]];
};

const getMaxBoundsWithKm10Padding = (bbox: Bbox) =>
  [
    [bbox[0] - KM10_DEG_LON, bbox[1] - KM10_DEG_LAT],
    [bbox[2] + KM10_DEG_LON, bbox[3] + KM10_DEG_LAT],
  ] as [[number, number], [number, number]];

export default function MapFilter({
  pins,
  topRightButton,
  height,
  externalBbox,
  onMapMove,
}: Props) {
  const [activeBbox, setActiveBbox] = useState<Bbox>(CZ_BBOX);
  const mapRef = useRef<MapRef>(null);
  const moveDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMoveEnd = useCallback(() => {
    if (!onMapMove) return;
    clearTimeout(moveDebounceRef.current);
    moveDebounceRef.current = setTimeout(() => {
      const bounds = mapRef.current?.getMap().getBounds();
      if (!bounds) return;
      onMapMove([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]);
    }, 400);
  }, [onMapMove]);
  const activePin = activeIndex !== null ? pins[activeIndex] : null;

  useEffect(() => {
    const bbox = externalBbox ?? CZ_BBOX;
    const bounds = getPaddedBounds(bbox);
    setActiveBbox(bbox);
    mapRef.current
      ?.getMap()
      .setMaxBounds(externalBbox ? getMaxBoundsWithKm10Padding(bbox) : bounds);
    mapRef.current?.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { padding: 10 },
    );
  }, [externalBbox]);

  return (
    <div
      className={`relative rounded-md ${height ? height : "h-100"} w-full overflow-hidden border border-zinc-200`}
    >
      {topRightButton && (
        <div className="absolute top-3 right-3 z-5">
          <Button {...topRightButton} />
        </div>
      )}
      <Map
        ref={mapRef}
        style={{ height: "100%", zIndex: 1 }}
        initialViewState={{
          latitude: (activeBbox[1] + activeBbox[3]) / 2,
          longitude: (activeBbox[0] + activeBbox[2]) / 2,
          zoom: 0,
          bearing: 0,
          pitch: 0,
        }}
        maxBounds={getPaddedBounds(CZ_BBOX)}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        onClick={() => setActiveIndex(null)}
        onMoveEnd={handleMoveEnd}
      >
        <Source
          id="overlay"
          type="geojson"
          data={buildOverlayGeoJSON(activeBbox)}
        >
          <Layer
            id="overlay-fill"
            type="fill"
            paint={{
              "fill-color": "#000000",
              "fill-opacity": 0.3,
            }}
          />
        </Source>

        {pins.map((pin, i) => {
          if (!pin.data.coordinates) return null;
          return (
            <Marker
              key={i}
              latitude={pin.data.coordinates.latitude}
              longitude={pin.data.coordinates.longitude}
              color="#e11d48"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setActiveIndex(i);
                pin.onClick?.(pin.data.coordinates);
              }}
            />
          );
        })}

        {activePin?.data.coordinates && (
          <Popup
            latitude={activePin.data.coordinates.latitude}
            longitude={activePin.data.coordinates.longitude}
            onClose={() => setActiveIndex(null)}
            closeButton={false}
            offset={20}
            focusAfterOpen
            maxWidth="240px"
          >
            <div className="flex flex-col w-60 -m-3 overflow-hidden rounded-lg">
              <div className="relative w-full h-36 shrink-0">
                <Link href={activePin.data.listingUrl} target="_blank">
                  <Image
                    src={generateMediaUrl(activePin.data.filename)}
                    alt={activePin.data.label}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="absolute bottom-2 mx-auto left-0 right-0 w-max px-2 py-0.5 bg-black/60 rounded">
                  <Text color="white" variant="label">
                    {activePin.data.label}
                  </Text>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(null);
                  }}
                  className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
