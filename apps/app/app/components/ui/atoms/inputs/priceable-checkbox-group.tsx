"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import Checkbox from "./checkbox";
import ErrorText from "./error-text";
import Input from "./input";
import SelectInput from "./select-input";
import InputLabel from "../input-label";
import { PricingUnits } from "@roo/common";
import { useTranslations } from "next-intl";

export type BaseItem = { id: string; name: string };

export type PriceableItem = BaseItem & {
  pricingUnit: PricingUnits;
  unitPrice: number;
  quantity: number;
};

type Props = {
  items: BaseItem[];
  value: PriceableItem[];
  onChange: (value: PriceableItem[]) => void;
  onSearchChange?: (query: string) => void;
  label?: string;
  checkColor?: string;
  searchable?: boolean;
  isRequired?: boolean;
  error?: string;
};

export default function PriceableCheckboxGroup({
  items,
  value,
  onChange,
  onSearchChange,
  label,
  checkColor = "text-primary",
  searchable = false,
  isRequired,
  error,
}: Props) {
  const [query, setQuery] = useState("");

  const g = useTranslations("global.pricing.units");

  const PRICE_TYPE_OPTIONS: { value: PricingUnits; label: string }[] = [
    { value: "lump_sum", label: g("lump_sum") },
    { value: "per_person", label: g("per_person") },
    { value: "per_hour", label: g("per_hour") },
    { value: "per_day", label: g("per_day") },
  ];

  const selectedIds = value.map((v) => v.id);

  const filteredItems = query
    ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    : items;

  function handleToggle(item: BaseItem, checked: boolean) {
    if (checked) {
      onChange([
        ...value,
        {
          id: item.id,
          name: item.name,
          pricingUnit: "lump_sum",
          unitPrice: 0,
          quantity: 1,
        },
      ]);
    } else {
      onChange(value.filter((v) => v.id !== item.id));
    }
  }

  function updateItem(
    id: string,
    patch: Partial<Omit<PriceableItem, "id" | "name">>,
  ) {
    onChange(value.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }

  return (
    <div className="flex flex-col gap-3">
      {label && <InputLabel label={label} isRequired={isRequired} />}

      {/* Checkbox list */}
      <div className="flex flex-col gap-2">
        {searchable && (
          <div className="relative mb-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={
                onSearchChange
                  ? (e) => onSearchChange(e.target.value)
                  : (e) => setQuery(e.target.value)
              }
              placeholder="Hledat..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-zinc-200 rounded-lg bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:border-zinc-300"
            />
          </div>
        )}

        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] content-start gap-y-2 gap-x-4 ${searchable ? "min-h-52 max-h-52 overflow-y-auto pr-1" : ""}`}
        >
          {filteredItems.map((item) => (
            <Checkbox
              key={item.id}
              size="sm"
              checked={selectedIds.includes(item.id)}
              onChange={(checked) => handleToggle(item, checked)}
              label={item.name}
              checkColor={checkColor}
            />
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full text-xs text-zinc-400 py-2">
              Žádné výsledky
            </p>
          )}
        </div>
      </div>

      {/* Detail rows for selected items */}
      {value.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <div className="grid grid-cols-[1fr_140px_100px_80px_auto] gap-2 px-3 py-1">
            <span className="text-xs font-medium text-zinc-500">Položka</span>
            <span className="text-xs font-medium text-zinc-500">Typ ceny</span>
            <span className="text-xs font-medium text-zinc-500">Cena (Kč)</span>
            <span className="text-xs font-medium text-zinc-500">Počet</span>
            <span />
          </div>
          {value.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_140px_100px_80px_auto] gap-2 items-center bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2"
            >
              <span className="text-sm text-zinc-800 font-medium truncate">
                {item.name}
              </span>

              <SelectInput
                value={item.pricingUnit}
                onChange={(e) =>
                  updateItem(item.id, {
                    pricingUnit: e.target.value as PricingUnits,
                  })
                }
                items={PRICE_TYPE_OPTIONS}
              />

              <Input
                inputProps={{
                  type: "number",
                  min: 0,
                  value: item.unitPrice === 0 ? "" : item.unitPrice,
                  placeholder: "0",
                  onChange: (e) =>
                    updateItem(item.id, {
                      unitPrice:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    }),
                }}
              />

              <Input
                inputProps={{
                  type: "number",
                  min: 1,
                  value: item.quantity,
                  onChange: (e) =>
                    updateItem(item.id, {
                      quantity: Math.max(1, Number(e.target.value) || 1),
                    }),
                }}
              />

              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v.id !== item.id))}
                className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <ErrorText error={error} />}
    </div>
  );
}
