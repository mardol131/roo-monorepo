"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import InputLabel from "../input-label";
import ErrorText from "./error-text";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useClickOutside } from "@/app/hooks/use-click-outside";

export interface SearchOption {
  id: string;
  name: string;
  info?: string;
}

interface SearchInputProps {
  label: string;
  placeholder?: string;
  options: SearchOption[];
  selectedOption?: SearchOption | null;
  onSelect?: (option: SearchOption) => void;
  onClear?: () => void;
  onSearchQueryChange?: (query: string) => void;
  searching?: boolean;
  error?: string;
  type?: "dropdown" | "fixed";
  isRequired?: boolean;
}

export default function SearchInput({
  label,
  placeholder = "Vyhledávání...",
  options,
  selectedOption,
  onSelect,
  onClear,
  onSearchQueryChange,
  searching = false,
  error,
  isRequired,
  type = "dropdown",
  // rest = register() spread: name, ref, onChange, onBlur, value
  ...rest
}: SearchInputProps & Omit<React.ComponentPropsWithRef<"input">, "onSelect">) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive selected: from selectedOption prop (Controller) or from options by ID (register spread)
  const registerValue = typeof rest.value === "string" ? rest.value : undefined;
  const selectedFromOptions = registerValue
    ? options.find((o) => o.id === registerValue)
    : undefined;
  const selected: SearchOption | undefined =
    selectedOption ?? selectedFromOptions ?? undefined;

  useDebounce(
    () => {
      onSearchQueryChange?.(searchQuery);
    },
    [searchQuery],
    200,
  );

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (option: SearchOption) => {
    setSearchQuery("");
    setIsOpen(false);
    onSelect?.(option);
    // For register pattern: fire onChange with synthetic event
    rest.onChange?.({
      target: { value: option.id },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleClear = () => {
    onClear?.();
    rest.onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const optionsList = (
    <div
      className={`overflow-y-auto ${type === "fixed" ? "border border-zinc-200 rounded-lg h-50" : "max-h-60"}`}
    >
      {searching ? (
        <div className="p-4 text-center">
          <Text variant="label" color="secondary">
            Hledání...
          </Text>
        </div>
      ) : options.length > 0 ? (
        <div className="py-1">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2.5 text-left hover:bg-zinc-50 text-sm text-zinc-900 transition-colors"
            >
              {option.name}
              {option.info && (
                <span className="text-xs text-zinc-500 ml-2">
                  {option.info}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : searchQuery.trim() ? (
        <div className="p-4 text-center">
          <Text variant="label" color="secondary">
            Žádné výsledky
          </Text>
        </div>
      ) : (
        <div className="p-4 text-center">
          <Text variant="label" color="secondary">
            Začněte psát pro vyhledávání
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col">
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
        {...rest}
        value={selected?.id ?? ""}
      />
      {label && <InputLabel label={label} isRequired={isRequired} />}

      {type === "fixed" ? (
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            {selected && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 p-1 hover:bg-zinc-100 rounded"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>
          {selected && !searchQuery && (
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900">
              <div className="flex">
                <span className="flex-1">{selected.name}</span>
                {selected.info && (
                  <span className="text-xs text-zinc-500 ml-2">
                    {selected.info}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-zinc-200 rounded"
              >
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          )}
          {optionsList}
        </div>
      ) : (
        <div className="relative" ref={containerRef}>
          <div
            onClick={() => {
              if (!isOpen && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setOpenUpward(rect.bottom + 280 > window.innerHeight);
              }
              setIsOpen(!isOpen);
            }}
            className={`w-full px-3 py-2.5 border ${error ? "border-rose-500" : "border-zinc-200"} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between`}
          >
            <div className="flex items-center">
              <span
                className={`text-sm ${selected ? "text-zinc-900" : "text-zinc-400"}`}
              >
                {selected ? selected.name : placeholder}
              </span>
              {selected && selected.info && (
                <span className="text-xs text-zinc-500 ml-2">
                  {selected.info}
                </span>
              )}
            </div>
            {selected ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="hover:bg-zinc-100 rounded"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </div>

          {isOpen && (
            <div
              className={`absolute left-0 w-full bg-white border border-zinc-200 rounded-lg shadow-lg z-10 ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}`}
            >
              {onSearchQueryChange && (
                <div className="p-3 border-b border-zinc-100">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}
              {optionsList}
            </div>
          )}
        </div>
      )}

      {error && <ErrorText error={error} />}
    </div>
  );
}
