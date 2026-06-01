"use client";

import React, { useRef, useState, useEffect } from "react";
import Text from "./../text";
import { ChevronDown, Search } from "lucide-react";
import InputLabel from "../input-label";
import ErrorText from "./error-text";

export type SelectOption = {
  value: string | number;
  label: string;
};

type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  sublabel?: string;
  items: SelectOption[];
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  isRequired?: boolean;
};

const SelectInput = React.forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      items,
      placeholder,
      id,
      value,
      onChange,
      error,
      searchable,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredItems =
      searchable && searchQuery
        ? items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : items;

    const selectedItem = items.find((item) => item.value === value);
    const displayValue = selectedItem?.label || placeholder || "Vyberte...";

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          setSearchQuery("");
        };
      }
    }, [isOpen]);

    const handleSelect = (optionValue: string | number) => {
      const event = {
        target: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(event);
      setIsOpen(false);
    };

    const { isRequired, ...rest } = props;

    return (
      <div ref={containerRef} className="relative">
        {label && (
          <InputLabel
            label={label}
            sublabel={props.sublabel}
            isRequired={props.isRequired}
          />
        )}

        {/* Hidden select for form integration */}
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          className="hidden"
          {...rest}
        >
          <option value="">{placeholder}</option>
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2.5 text-sm border bg-white ${error ? "border-danger" : "border-zinc-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent flex items-center justify-between text-left hover:border-zinc-400 transition-colors`}
        >
          <span className={value ? "text-zinc-900" : "text-zinc-500"}>
            {displayValue}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-zinc-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-md p-1">
            {searchable && (
              <div className="relative flex items-center mb-1 px-1 pt-1">
                <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  placeholder="Hledat..."
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}
            {filteredItems.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto flex flex-col gap-0.5">
                {filteredItems.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      className={`w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                        value === item.value
                          ? "bg-zinc-100 text-zinc-900 font-medium"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-2 text-xs text-zinc-400">
                {searchable && searchQuery ? "Žádné výsledky" : "Žádné položky"}
              </p>
            )}
          </div>
        )}
        {error && <ErrorText error={error} />}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
