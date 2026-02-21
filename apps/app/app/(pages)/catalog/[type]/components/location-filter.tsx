import React, { useState, useRef, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

const LOCATIONS = [
  { id: "prague", label: "Praha" },
  { id: "brno", label: "Brno" },
  { id: "ostrava", label: "Ostrava" },
  { id: "plzen", label: "Plzeň" },
  { id: "online", label: "Online" },
];

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationFilter({
  value,
  onChange,
}: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = LOCATIONS.filter((location) =>
    location.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const selectedLocation = LOCATIONS.find((loc) => loc.id === value);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative" ref={ref}>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearch("");
            }
          }}
          className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between"
        >
          <span
            className={selectedLocation ? "text-zinc-900" : "text-zinc-500"}
          >
            {selectedLocation ? selectedLocation.label : "Vyberte místo"}
          </span>
          <MapPin className="w-4 h-4 text-zinc-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg z-10">
            {/* Search input */}
            <div className="p-3 border-b border-zinc-100 sticky top-0 bg-white rounded-t-lg">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 rounded-lg">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Hledat místo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  autoFocus
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelect(location.id)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-zinc-50 transition-colors text-sm ${
                      value === location.id
                        ? "bg-rose-50 text-rose-600 font-medium"
                        : "text-zinc-900"
                    }`}
                  >
                    {location.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-zinc-500">
                  Žádná místa nenalezena
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
