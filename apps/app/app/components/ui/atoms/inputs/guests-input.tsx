import React, { useState, useRef, useEffect } from "react";
import { Users, X } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import { useClickOutside } from "@/app/hooks/use-click-outside";
import { formatGuestsString, Guests } from "@roo/common";

interface GuestsFilterProps {
  value: Guests;
  onChange: (value: Guests) => void;
  label: string;
  error?: string;
}

export default function GuestsInput({
  value,
  onChange,
  label,
  error,
}: GuestsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Handle click outside
  useClickOutside(ref, () => setIsOpen(false));

  const handleAdultsChange = (newValue: number) => {
    onChange({ ...value, adults: Math.max(1, newValue) });
  };

  const handleChildrenChange = (newValue: number) => {
    onChange({ ...value, children: Math.max(0, newValue) });
  };

  const handleZtpChange = () => {
    onChange({ ...value, ztp: !value.ztp });
  };

  const handlePetsChange = () => {
    onChange({ ...value, pets: !value.pets });
  };

  const displayText = formatGuestsString(value);

  return (
    <div className="flex flex-col gap-2">
      <label className="block">
        <Text variant="label2" color="dark" className="font-semibold">
          {label}
        </Text>
      </label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between"
        >
          <span className="text-zinc-900">{displayText}</span>
          <Users className="w-4 h-4 text-zinc-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg z-10">
            {/* Adults */}
            <div className="p-4 border-b border-zinc-100">
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Dospělí
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdultsChange(value.adults - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  value={value.adults}
                  onChange={(e) =>
                    handleAdultsChange(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => handleAdultsChange(value.adults + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="p-4 border-b border-zinc-100">
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Děti
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleChildrenChange(value.children - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  −
                </button>
                <input
                  type="number"
                  value={value.children}
                  onChange={(e) =>
                    handleChildrenChange(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-center text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => handleChildrenChange(value.children + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Accessibility */}
            <div className="p-4 border-b border-zinc-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.ztp}
                  onChange={handleZtpChange}
                  className="w-4 h-4 rounded accent-rose-500"
                />
                <span className="text-sm font-medium text-zinc-900">
                  Potřebuji ZTP přístup
                </span>
              </label>
            </div>

            {/* Pets */}
            <div className="p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.pets}
                  onChange={handlePetsChange}
                  className="w-4 h-4 rounded accent-rose-500"
                />
                <span className="text-sm font-medium text-zinc-900">
                  Přivezu zvířata
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
      {error && (
        <Text variant="label4" color="secondary" className="text-red-500 mt-1">
          {error}
        </Text>
      )}
    </div>
  );
}
