import { InputHTMLAttributes, Ref, useEffect, useRef, useState } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Map,
  MapMouseEvent,
  MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
} from "@vis.gl/react-maplibre";
import InputLabel from "../input-label";
import ErrorText from "./error-text";
import Text from "../text";

export type Coordinates = { latitude: number; longitude: number };
export type Bbox = [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]

type Props = {
  value?: Coordinates;
  onChange?: (coords: Coordinates | undefined) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  innerSearch?: boolean;
  isRequired?: boolean;
  externalBbox?: Bbox;
  mapDisabled?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>;
  };
};

type GeocodeResult = {
  latitude: number;
  longitude: number;
  bbox: Bbox;
};

async function geocodeCity(query: string): Promise<GeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=cz`;
  const res = await fetch(url, { headers: { "Accept-Language": "cs" } });
  const data = await res.json();
  if (!data[0]) return null;
  const [minLat, maxLat, minLon, maxLon] = data[0].boundingbox.map(parseFloat);
  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    bbox: [minLon, minLat, maxLon, maxLat],
  };
}

const HOLE_PADDING = 0.01;

function buildRoundedHole(bbox: Bbox, steps = 10): number[][] {
  const [minLon, minLat, maxLon, maxLat] = [
    bbox[0] - HOLE_PADDING,
    bbox[1] - HOLE_PADDING,
    bbox[2] + HOLE_PADDING,
    bbox[3] + HOLE_PADDING,
  ];
  const r = Math.min(maxLon - minLon, maxLat - minLat) * 0.03;
  const pts: number[][] = [];

  function arc(cx: number, cy: number, from: number, to: number) {
    for (let i = 0; i <= steps; i++) {
      const angle = ((from + (to - from) * (i / steps)) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
  }

  arc(maxLon - r, minLat + r, 270, 360);
  arc(maxLon - r, maxLat - r, 0, 90);
  arc(minLon + r, maxLat - r, 90, 180);
  arc(minLon + r, minLat + r, 180, 270);
  pts.push(pts[0]);
  return pts;
}

export function buildOverlayGeoJSON(bbox: Bbox) {
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [-180, -90],
              [-180, 90],
              [180, 90],
              [180, -90],
              [-180, -90],
            ],
            buildRoundedHole(bbox),
          ],
        },
      },
    ],
  };
}

const OVERLAY_PADDING = 0.3;

export default function MapPointInput({
  value,
  onChange,
  onBlur,
  error,
  label,
  innerSearch,
  externalBbox,
  mapDisabled = false,
  inputProps,
  isRequired,
}: Props) {
  const mapRef = useRef<MapRef>(null);
  const [internalValue, setInternalValue] = useState<Coordinates | undefined>(
    value,
  );
  const [search, setSearch] = useState("");
  const [activeBbox, setActiveBbox] = useState<Bbox | null>(null);

  const coords = value ?? internalValue;

  const maxBounds: [[number, number], [number, number]] = activeBbox
    ? [
        [activeBbox[0] - OVERLAY_PADDING, activeBbox[1] - OVERLAY_PADDING],
        [activeBbox[2] + OVERLAY_PADDING, activeBbox[3] + OVERLAY_PADDING],
      ]
    : [
        [11.5, 48.0],
        [19.5, 51.7],
      ];

  function handleClick(e: MapMouseEvent) {
    const { lat, lng } = e.lngLat;
    if (activeBbox) {
      const [minLon, minLat, maxLon, maxLat] = activeBbox;
      if (lng < minLon || lng > maxLon || lat < minLat || lat > maxLat) return;
    }
    const next = { latitude: lat, longitude: lng };
    setInternalValue(next);
    onChange?.(next);
  }

  useEffect(() => {
    if (!externalBbox) return;
    const bounds: [[number, number], [number, number]] = [
      [externalBbox[0] - OVERLAY_PADDING, externalBbox[1] - OVERLAY_PADDING],
      [externalBbox[2] + OVERLAY_PADDING, externalBbox[3] + OVERLAY_PADDING],
    ];
    setActiveBbox(externalBbox);
    mapRef.current?.getMap().setMaxBounds(bounds);
    mapRef.current?.fitBounds(
      [
        [externalBbox[0], externalBbox[1]],
        [externalBbox[2], externalBbox[3]],
      ],
      { padding: 40 },
    );

    const current = value ?? internalValue;
    if (current) {
      const [minLon, minLat, maxLon, maxLat] = externalBbox;
      if (
        current.longitude < minLon ||
        current.longitude > maxLon ||
        current.latitude < minLat ||
        current.latitude > maxLat
      ) {
        setInternalValue(undefined);
        onChange?.(undefined);
      }
    }
  }, [externalBbox]);

  async function handleSearch() {
    if (!search.trim()) return;
    const result = await geocodeCity(search);
    if (!result) return;
    const bounds: [[number, number], [number, number]] = [
      [result.bbox[0] - OVERLAY_PADDING, result.bbox[1] - OVERLAY_PADDING],
      [result.bbox[2] + OVERLAY_PADDING, result.bbox[3] + OVERLAY_PADDING],
    ];
    setActiveBbox(result.bbox);
    mapRef.current?.getMap().setMaxBounds(bounds);
    mapRef.current?.fitBounds(
      [
        [result.bbox[0], result.bbox[1]],
        [result.bbox[2], result.bbox[3]],
      ],
      { padding: 40 },
    );
  }

  return (
    <div className="relative">
      <input
        aria-hidden
        tabIndex={-1}
        readOnly
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          height: 0,
          width: 0,
        }}
        {...inputProps}
        value={coords ? `${coords.latitude},${coords.longitude}` : ""}
      />
      {label && <InputLabel isRequired={isRequired} label={label} />}
      {innerSearch && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Hledat město..."
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            className="px-4 py-2 text-sm bg-zinc-100 rounded-lg hover:bg-zinc-200"
          >
            Hledat
          </button>
        </div>
      )}
      <div className="relative">
        {mapDisabled && (
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50">
            <Text variant="h4">Nejprve vyberte město</Text>
          </div>
        )}
        <div
          className={`relative rounded-md h-100 overflow-hidden border ${mapDisabled ? "opacity-50 pointer-events-none" : ""} ${error ? "border-red-500" : "border-zinc-200"}`}
          onBlur={onBlur}
        >
          <Map
            ref={mapRef}
            maxBounds={maxBounds}
            style={{ height: "100%" }}
            initialViewState={{
              latitude: 49.8,
              longitude: 15.5,
              zoom: 6.5,
              bearing: 0,
              pitch: 0,
            }}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            onClick={handleClick}
            cursor="crosshair"
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

            {activeBbox && (
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
            )}

            {coords && (
              <Marker
                color="#e11d48"
                latitude={coords.latitude}
                longitude={coords.longitude}
              />
            )}
          </Map>
        </div>
      </div>
      {error && <ErrorText error={error} />}
    </div>
  );
}
