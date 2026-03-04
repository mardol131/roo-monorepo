import React, { useState, useMemo } from "react";
import Text from "@/app/components/ui/atoms/text";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  histogram?: number[];
  onPriceChange?: (min: number, max: number) => void;
}

// Default mock data - počet inzerátů v každém cenovém rozmezí
const DEFAULT_HISTOGRAM = [
  45, 52, 38, 61, 55, 72, 48, 84, 91, 78, 95, 87, 73, 62, 58, 51, 44, 39, 28,
  15,
];

const MIN_PRICE = 0;
const MAX_PRICE = 100000;
const HISTOGRAM_HEIGHT = 100;

export default function PriceFilter({
  minPrice = MIN_PRICE,
  maxPrice = MAX_PRICE,
  histogram = DEFAULT_HISTOGRAM,
  onPriceChange,
}: PriceFilterProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMaxPrice);
    setLocalMinPrice(newMin);
    onPriceChange?.(newMin, localMaxPrice);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMinPrice);
    setLocalMaxPrice(newMax);
    onPriceChange?.(localMinPrice, newMax);
  };

  const handleMinInputChange = (value: string) => {
    const num = value === "" ? 0 : parseInt(value, 10);
    if (!isNaN(num)) {
      handleMinChange(num);
    }
  };

  const handleMaxInputChange = (value: string) => {
    const num = value === "" ? MAX_PRICE : parseInt(value, 10);
    if (!isNaN(num)) {
      handleMaxChange(num);
    }
  };

  const maxDataValue = Math.max(...histogram);
  const pricePerBar = MAX_PRICE / histogram.length;
  const minBarIndex = Math.floor(localMinPrice / pricePerBar);
  const maxBarIndex = Math.ceil(localMaxPrice / pricePerBar);

  return (
    <div className="flex flex-col gap-4">
      <Text variant="label1" className="mb-3 block text-zinc-900 font-semibold">
        Cena
      </Text>

      {/* Histogram */}
      <div
        className="flex items-end justify-between gap-1 p-2  rounded-lg"
        style={{ height: `${HISTOGRAM_HEIGHT}px` }}
      >
        {histogram.map((value, index) => {
          const isInRange = index >= minBarIndex && index < maxBarIndex;
          const barHeight = (value / maxDataValue) * HISTOGRAM_HEIGHT;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div
                className={`w-full rounded-t transition-colors ${
                  isInRange ? "bg-rose-500" : "bg-zinc-300"
                }`}
                style={{ height: `${barHeight}px`, minHeight: "2px" }}
              />
            </div>
          );
        })}
      </div>

      {/* Range Slider */}
      <div className="relative w-full pt-2 pb-3">
        {/* Track background */}
        <div className="absolute top-1/2 w-full h-2 bg-zinc-200 rounded-lg -translate-y-1/2 pointer-events-none" />

        {/* Active range fill */}
        <div
          className="absolute h-2 bg-rose-500 rounded-lg top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${(localMinPrice / MAX_PRICE) * 100}%`,
            right: `${100 - (localMaxPrice / MAX_PRICE) * 100}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={localMinPrice}
          onChange={(e) => handleMinChange(parseInt(e.target.value))}
          className="range-slider range-slider-min"
        />

        {/* Max slider */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={localMaxPrice}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          className="range-slider range-slider-max"
        />
      </div>

      <style jsx>{`
        .range-slider {
          position: absolute;
          width: 100%;
          height: 20px;
          top: 0;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
          border: none;
          outline: none;
          z-index: 5;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #f43f5e;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
        }

        .range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #f43f5e;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
        }

        .range-slider-min {
          z-index: 5;
        }

        .range-slider-max {
          z-index: 6;
        }
      `}</style>

      {/* Input Fields */}
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <label className="text-xs text-zinc-600 mb-1 block">Od (Kč)</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={(e) => handleMinInputChange(e.target.value)}
            min={MIN_PRICE}
            max={localMaxPrice}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-zinc-600 mb-1 block">Do (Kč)</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={(e) => handleMaxInputChange(e.target.value)}
            min={localMinPrice}
            max={MAX_PRICE}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
}
