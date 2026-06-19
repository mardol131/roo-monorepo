"use client";

import { Layer, Map, Marker, NavigationControl, ScaleControl, Source } from "@vis.gl/react-maplibre";
import { useEffect, useRef } from "react";
import type { MapRef } from "@vis.gl/react-maplibre";
import InputLabel from "../input-label";
import ErrorText from "./error-text";
import Text from "../text";
import type { Coordinates } from "./map-point-input";

type Props = {
  center?: Coordinates;
  value?: number;
  onChange?: (km: number) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  isRequired?: boolean;
};

const STEPS = 64;
const KM_PER_DEG_LAT = 111;

function buildCircleGeoJSON(lat: number, lon: number, radiusKm: number) {
  const degLat = radiusKm / KM_PER_DEG_LAT;
  const degLon = radiusKm / (KM_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180));
  const coords: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const angle = (i / STEPS) * 2 * Math.PI;
    coords.push([lon + degLon * Math.cos(angle), lat + degLat * Math.sin(angle)]);
  }
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "Polygon" as const,
          coordinates: [coords],
        },
      },
    ],
  };
}

export default function MapRadiusInput({
  center,
  value = 50,
  onChange,
  onBlur,
  label,
  error,
  min = 1,
  max = 500,
  step = 5,
  isRequired,
}: Props) {
  const mapRef = useRef<MapRef>(null);
  const disabled = !center;

  const radiusKm = value ?? min;

  useEffect(() => {
    if (!center || !mapRef.current) return;
    const degLat = radiusKm / KM_PER_DEG_LAT;
    const degLon = radiusKm / (KM_PER_DEG_LAT * Math.cos((center.latitude * Math.PI) / 180));
    mapRef.current.fitBounds(
      [
        [center.longitude - degLon, center.latitude - degLat],
        [center.longitude + degLon, center.latitude + degLat],
      ],
      { padding: 40, duration: 300 },
    );
  }, [center, radiusKm]);

  const circleData = center ? buildCircleGeoJSON(center.latitude, center.longitude, radiusKm) : null;

  return (
    <div className="flex flex-col gap-3" onBlur={onBlur}>
      {label && <InputLabel isRequired={isRequired} label={label} />}

      <div className="relative">
        {disabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/60">
            <Text variant="h4">Nejprve vyplňte základnu</Text>
          </div>
        )}
        <div
          className={`relative rounded-md overflow-hidden border h-80 ${error ? "border-danger" : "border-zinc-200"} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Map
            ref={mapRef}
            style={{ height: "100%" }}
            initialViewState={{
              latitude: center?.latitude ?? 49.8,
              longitude: center?.longitude ?? 15.5,
              zoom: center ? 8 : 6.5,
            }}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          >
            <NavigationControl position="top-left" />
            <ScaleControl />

            {circleData && (
              <Source id="radius-circle" type="geojson" data={circleData}>
                <Layer
                  id="radius-fill"
                  type="fill"
                  paint={{ "fill-color": "#e11d48", "fill-opacity": 0.15 }}
                />
                <Layer
                  id="radius-outline"
                  type="line"
                  paint={{ "line-color": "#e11d48", "line-width": 2, "line-opacity": 0.7 }}
                />
              </Source>
            )}

            {center && (
              <Marker color="#e11d48" latitude={center.latitude} longitude={center.longitude} />
            )}
          </Map>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Text variant="label-sm" color="secondary">
            Dojezdový okruh
          </Text>
          <Text variant="label-sm" className="font-semibold text-rose-600">
            {radiusKm} km
          </Text>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={radiusKm}
          disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full accent-rose-500 disabled:opacity-40"
        />
        <div className="flex justify-between">
          <Text variant="label-sm" color="secondary">{min} km</Text>
          <Text variant="label-sm" color="secondary">{max} km</Text>
        </div>
      </div>

      {error && <ErrorText error={error} />}
    </div>
  );
}
