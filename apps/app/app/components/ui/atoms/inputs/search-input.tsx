"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import InputLabel from "../input-label";
import ErrorText from "./error-text";

interface SearchOption {
  id: string;
  label: string;
}

interface SearchInputProps {
  label: string;
  placeholder?: string;
  options: SearchOption[];
  isLoading?: boolean;
  nameInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  idInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  value?: {
    id: string;
    label: string;
  };
  onSelect?: (option: SearchOption) => void;
  onClear?: () => void;
  onSearchQueryChange?: (query: string) => void;
  error?: string;
  type?: "dropdown" | "fixed";
  isRequired?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      label,
      placeholder = "Vyhledávání...",
      options,
      isLoading = false,
      nameInputProps,
      idInputProps,
      value,
      onSelect,
      onClear,
      onSearchQueryChange,
      error,
      isRequired,
      type = "dropdown",
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState<SearchOption | undefined>(value);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSelected(value);
    }, [value?.id]);

    // Handle debounced search
    useEffect(() => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!searchQuery.trim()) {
        return;
      }

      debounceTimeoutRef.current = setTimeout(() => {
        onSearchQueryChange?.(searchQuery);
      }, 2000);

      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, [searchQuery, onSearchQueryChange]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: SearchOption) => {
      setSelected(option);
      setSearchQuery("");
      setIsOpen(false);
      onSelect?.(option);
    };

    const handleClear = () => {
      setSelected(undefined);
      setSearchQuery("");
      onClear?.();
    };

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const optionsList = (
      <div
        className={`overflow-y-auto ${type === "fixed" ? "border border-zinc-200 rounded-lg h-50" : "max-h-60"}`}
      >
        {isLoading ? (
          <div className="p-4 text-center">
            <Text variant="label" color="secondary">
              Hledání...
            </Text>
          </div>
        ) : filteredOptions.length > 0 ? (
          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2.5 text-left hover:bg-zinc-50 text-sm text-zinc-900 transition-colors"
              >
                {option.label}
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
        <input ref={ref} type="text" aria-hidden tabIndex={-1} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }} readOnly />
        <InputLabel label={label} isRequired={isRequired} />

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
                <span className="flex-1">{selected.label}</span>
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
              <span className="text-zinc-900 text-sm">
                {selected ? selected.label : placeholder}
              </span>
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
              <div className={`absolute left-0 w-full bg-white border border-zinc-200 rounded-lg shadow-lg z-10 ${openUpward ? "bottom-full mb-2" : "top-full mt-2"}`}>
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
                {optionsList}
              </div>
            )}
          </div>
        )}

        <input
          type="hidden"
          value={selected?.label || ""}
          {...nameInputProps}
          onChange={() => {}}
          ref={(el) => {
            if (el && nameInputProps?.onChange) {
              el.onchange = nameInputProps.onChange as any;
            }
          }}
        />
        <input
          type="hidden"
          value={selected?.id || ""}
          {...idInputProps}
          onChange={() => {}}
          ref={(el) => {
            if (el && idInputProps?.onChange) {
              el.onchange = idInputProps.onChange as any;
            }
          }}
        />
        {error && <ErrorText error={error} />}
      </div>
    );
  },
);

export default SearchInput;
