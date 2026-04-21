"use client";

import { useRef, useState } from "react";
import { Lock, Search, X } from "lucide-react";
import InputLabel from "../input-label";
import Checkbox from "./checkbox";

type Item = { id: string; name: string };

type Props = {
  items: Item[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  checkColor?: string;
  columns?: string;
  searchable?: boolean;
  defaultSearchValue?: string;
  onSearchChange?: (query: string) => void;
  disabled?: boolean;
  closed?: boolean;
  closedMessage?: string;
};

function toggleItem(arr: string[], id: string, checked: boolean) {
  return checked ? [...arr, id] : arr.filter((x) => x !== id);
}

export default function CheckboxGroup({
  items,
  value,
  onChange,
  label,
  checkColor = "text-primary",
  columns = "grid-cols-[repeat(auto-fit,minmax(130px,1fr))]",
  searchable = false,
  defaultSearchValue = "",
  onSearchChange,
  disabled = false,
  closed = false,
  closedMessage,
}: Props) {
  const [query, setQuery] = useState(defaultSearchValue);

  // Accumulate names for all items ever seen so selected tags remain
  // visible even when the parent filters items down.
  const seenNames = useRef<Record<string, string>>({});
  items.forEach((item) => {
    seenNames.current[item.id] = item.name;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center gap-1.5">
          <InputLabel label={label} />
          {closed && <Lock className="w-3 h-3 text-zinc-400" />}
        </div>
      )}

      {!closed && (
        <>
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Hledat..."
                disabled={disabled}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-300 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {value.length > 0 && (
            <div className="flex flex-wrap gap-1.5 py-2">
              {value.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange(toggleItem(value, id, false))}
                  disabled={disabled}
                  className="inline-flex items-center cursor-pointer gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {seenNames.current[id] ?? id}
                  <X className="w-3 h-3 shrink-0" />
                </button>
              ))}
            </div>
          )}

          <div
            className={
              searchable ? "min-h-52 max-h-52 overflow-y-auto pr-1" : ""
            }
          >
            <div
              className={`grid ${columns} gap-2 gap-x-4 ${disabled ? "opacity-40 pointer-events-none" : ""}`}
            >
              {items.map((item) => (
                <Checkbox
                  key={item.id}
                  checked={value.includes(item.id)}
                  onChange={(checked) =>
                    onChange(toggleItem(value, item.id, checked))
                  }
                  label={item.name}
                  checkColor={checkColor}
                />
              ))}
              {items.length === 0 && (
                <p className="col-span-full text-xs text-zinc-400 py-2">
                  Žádné výsledky
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {closed && closedMessage && (
        <p className="text-xs text-zinc-400">{closedMessage}</p>
      )}
    </div>
  );
}
