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

export type PinProps = {
  value?: Coordinates;
  onClick?: (coords: Coordinates) => void;
  data: {
    label: string;
    tags: string[];
    imageUrl?: string;
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
        <div className="absolute top-3 right-3 z-10">
          <Button {...topRightButton} />
        </div>
      )}
      <Map
        ref={mapRef}
        style={{ height: "100%" }}
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
          >
            <div className="flex relative flex-col gap-1.5 min-w-40 max-w-56">
              {activePin.data.imageUrl && (
                <div className="relative w-full h-28 rounded overflow-hidden mb-1">
                  <Image
                    src={activePin.data.imageUrl}
                    alt={activePin.data.label}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Text variant="h4"> {activePin.data.label}</Text>
              {activePin.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {activePin.data.tags.map((tag) => (
                    <div key={tag} className="bg-zinc-100 p-1 rounded-md">
                      <Text variant="caption">{tag}</Text>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex absolute -top-[3%] left-[80%] justify-end">
                {activePin.data.buttonUrl && (
                  <Button
                    text=""
                    iconLeft="Link2"
                    size="sm"
                    link={activePin.data.buttonUrl}
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
