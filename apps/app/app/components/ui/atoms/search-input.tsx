"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

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
  value: {
    id: string;
    label: string;
  };
  onSelect?: (option: SearchOption) => void;
  onSearchQueryChange?: (query: string) => void;
}

export default function SearchInput({
  label,
  placeholder = "Vyhledávání...",
  options,
  isLoading = false,
  nameInputProps,
  idInputProps,
  value,
  onSelect,
  onSearchQueryChange,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<SearchOption | null>(
    value ? { id: value.id, label: value.label } : null,
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement>(null);

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
      if (ref.current && !ref.current.contains(event.target as Node)) {
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
    setSelected(null);
    setSearchQuery("");
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="block">
        <Text variant="label2" color="dark" className="font-semibold">
          {label}
        </Text>
      </label>

      <div className="relative" ref={ref}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-left flex items-center justify-between"
        >
          <span className="text-zinc-900">
            {selected ? selected.label : placeholder}
          </span>
          {selected ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-zinc-100 rounded"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-zinc-200 rounded-lg shadow-lg z-10">
            {/* Search input */}
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

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Text variant="label3" color="secondary">
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
                  <Text variant="label3" color="secondary">
                    Žádné výsledky
                  </Text>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Text variant="label3" color="secondary">
                    Začněte psát pro vyhledávání
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden inputs for form integration */}
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
    </div>
  );
}
