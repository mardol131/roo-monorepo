"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useParams, useRouter } from "next/dist/client/components/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/app/hooks/use-click-outside";

type Props = {};

const catalogTypes = [
  {
    value: "gastro",
    label: "Gastro",
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    value: "misto",
    label: "Místo",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    value: "zabava",
    label: "Zábavu",
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CatalogTypeSelection({}: Props) {
  const params = useParams();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentType = params.type as string;
  const currentLabel =
    catalogTypes.find((t) => t.value === currentType)?.label || "Vyberte";

  const handleTypeSelect = (value: string) => {
    router.push(`/katalog/${value}`);
    setIsDropdownOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false), isDropdownOpen);

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Header with type selector */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <Text variant="heading1" color="dark" className="text-4xl">
            Hledám
          </Text>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 border-b-2 border-rose-500 hover:opacity-80 transition-opacity"
            >
              <Text variant="heading1" color="primary" className="text-4xl">
                {currentLabel}
              </Text>
              <ChevronDown
                className={`w-8 h-8 text-rose-500 -mb-2 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 mt-2 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 min-w-40"
              >
                {catalogTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors ${
                      currentType === type.value
                        ? "bg-rose-50 text-rose-600 font-medium"
                        : "text-zinc-900"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
