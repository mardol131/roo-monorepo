"use client";

import React, { useRef, useState, useEffect } from "react";
import Text from "./text";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string | number;
  label: string;
};

type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
  label: string;
  items: SelectOption[];
  placeholder?: string;
};

const SelectInput = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, items, placeholder, id, value, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedItem = items.find((item) => item.value === value);
    const displayValue =
      selectedItem?.label || placeholder || "Vyberte položku";

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
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    const handleSelect = (optionValue: string | number) => {
      const event = {
        target: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(event);
      setIsOpen(false);
    };

    return (
      <div ref={containerRef} className="relative">
        <label htmlFor={id} className="block mb-1.5">
          <Text variant="label2" color="dark" className="font-semibold">
            {label}
          </Text>
        </label>

        {/* Hidden select for form integration */}
        <select
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          className="hidden"
          {...props}
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
          className="w-full px-3 py-2.5 border bg-white border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent flex items-center justify-between text-left hover:border-zinc-400 transition-colors"
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
          <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-300 rounded-lg shadow-lg">
            {items.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-zinc-100 transition-colors ${
                        value === item.value
                          ? "bg-zinc-50 border-l-2 border-zinc-900"
                          : ""
                      }`}
                    >
                      <Text
                        variant="label2"
                        color={value === item.value ? "dark" : "secondary"}
                        className={value === item.value ? "font-semibold" : ""}
                      >
                        {item.label}
                      </Text>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-2.5">
                <Text variant="label2" color="secondary">
                  Žádné položky
                </Text>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
