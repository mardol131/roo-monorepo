"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, X, Search } from "lucide-react";
import InputLabel from "../input-label";
import ErrorText from "./error-text";

interface TimeInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  min?: string;
  max?: string;
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
  hideClearButton?: boolean;
}

function generateTimeOptions(min?: string, max?: string): string[] {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      if (min && time < min) continue;
      if (max && time > max) continue;
      options.push(time);
    }
  }
  return options;
}

export default function TimeInput({
  label,
  value,
  onChange,
  onClear,
  min,
  max,
  placeholder = "Vyberte čas",
  error,
  isRequired,
  hideClearButton,
}: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allOptions = generateTimeOptions(min, max);
  const filtered = searchQuery
    ? allOptions.filter((t) => t.startsWith(searchQuery))
    : allOptions;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (selectedRef.current && listRef.current) {
          const list = listRef.current;
          const item = selectedRef.current;
          list.scrollTop =
            item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2;
        }
      }, 0);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClear?.();
    onChange("");
  };

  return (
    <div className="flex flex-col">
      {label && <InputLabel label={label} isRequired={isRequired} />}

      <div className="relative" ref={containerRef}>
        <div
          onClick={() => {
            if (!isOpen && containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              setOpenUpward(rect.bottom + 280 > window.innerHeight);
            }
            setIsOpen(!isOpen);
          }}
          className={`w-full px-3 h-10 border ${error ? "border-rose-500" : "border-zinc-200"} rounded-lg text-sm bg-white text-left flex items-center justify-between cursor-pointer hover:border-zinc-300 transition-colors`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
            <span
              className={`text-sm ${value ? "text-zinc-900" : "text-zinc-400"}`}
            >
              {value ?? placeholder}
            </span>
          </div>
          {!hideClearButton && value ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="hover:bg-zinc-100 rounded p-0.5"
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
            {/* Search */}
            <div className="p-3 border-b border-zinc-100">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filtrovat čas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Options */}
            <div ref={listRef} className="max-h-60 overflow-y-auto py-1">
              {filtered.length > 0 ? (
                filtered.map((time) => (
                  <button
                    key={time}
                    ref={time === value ? selectedRef : undefined}
                    type="button"
                    onClick={() => handleSelect(time)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                      value === time
                        ? "bg-rose-50 text-rose-600 font-medium"
                        : "text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-zinc-500">
                  Žádný čas nenalezen
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <ErrorText error={error} />}
    </div>
  );
}
