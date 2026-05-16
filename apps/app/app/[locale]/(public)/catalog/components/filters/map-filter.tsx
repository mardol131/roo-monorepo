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
import { IntlLink } from "@/app/i18n/navigation";
import {
  Bbox,
  Coordinates,
  buildOverlayGeoJSON,
} from "@/app/components/ui/atoms/inputs/map-point-input";
import { generateMediaUrl } from "@/app/functions/generate-media-url";

export type PinProps = {
  value?: Coordinates;
  onClick?: (coords: Coordinates) => void;
  data: {
    label: string;
    tags: string[];
    filename?: string;
    buttonUrl?: IntlLink;
  };
};

type Props = {
  pins: PinProps[];
  topRightButton?: ButtonProps;
  height?: string | number;
  externalBbox?: Bbox;
  onMapMove?: (bbox: Bbox) => void;
};

const CZ_BBOX: Bbox = [11.5, 48.0, 19.5, 51.7];
const OVERLAY_PADDING = 0.3;

const getPaddedBounds = (bbox: Bbox, padding: number = OVERLAY_PADDING) => {
  const width = bbox[2] - bbox[0];
  const height = bbox[3] - bbox[1];

  return [
    [bbox[0] - width * padding, bbox[1] - height * padding],
    [bbox[2] + width * padding, bbox[3] + height * padding],
  ] as [[number, number], [number, number]];
};

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
    mapRef.current?.getMap().setMaxBounds(bounds);

    if (bbox === CZ_BBOX) return;
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
          zoom: 6.5,
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
          if (!pin.value) return null;
          return (
            <Marker
              key={i}
              latitude={pin.value.latitude}
              longitude={pin.value.longitude}
              color="#e11d48"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setActiveIndex(i);
                pin.onClick?.(pin.value!);
              }}
            />
          );
        })}

        {activePin?.value && (
          <Popup
            latitude={activePin.value.latitude}
            longitude={activePin.value.longitude}
            onClose={() => setActiveIndex(null)}
            closeButton={false}
            offset={20}
            focusAfterOpen
            maxWidth="240px"
          >
            <div className="flex flex-col w-60 -m-3 overflow-hidden rounded-lg">
              {activePin.data.filename ? (
                <div className="relative w-full h-36 flex-shrink-0">
                  <Image
                    src={generateMediaUrl(activePin.data.filename)}
                    alt={activePin.data.label}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setActiveIndex(null)}
                    className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex justify-end px-3 pt-3">
                  <button
                    onClick={() => setActiveIndex(null)}
                    className="text-zinc-400 hover:text-zinc-700 text-sm leading-none"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-3 p-3">
                <Text variant="label-lg">{activePin.data.label}</Text>
                {activePin.data.buttonUrl && (
                  <Button
                    text="Otevřít listing"
                    iconLeft="ExternalLink"
                    size="sm"
                    version="primary"
                    link={activePin.data.buttonUrl}
                    linkTarget="_blank"
                    className="w-full justify-center"
                  />
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
