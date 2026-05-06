"use client";

import SearchInput, {
  SearchOption,
} from "@/app/components/ui/atoms/inputs/search-input";
import { useCities } from "@/app/react-query/cities/hooks";
import { useState } from "react";

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationFilter({
  value,
  onChange,
}: LocationFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const orClauses = [
    ...(searchQuery ? [{ name: { contains: searchQuery } }] : []),
    ...(value ? [{ id: { equals: value } }] : []),
  ];

  const { data: cities, isLoading } = useCities({
    limit: 50,
    query: orClauses.length > 0 ? { or: orClauses } : undefined,
  });

  const selectedOption = cities?.docs?.find((o) => o.id === value) ?? null;

  return (
    <SearchInput
      label=""
      placeholder="Hledat město..."
      options={
        cities?.docs?.map((city) => ({
          id: city.id,
          name: city.name,
          info:
            typeof city.district === "string" ? undefined : city.district?.name,
        })) ?? []
      }
      isLoading={isLoading}
      selectedOption={
        selectedOption
          ? {
              id: selectedOption.id,
              name: selectedOption.name,
              info:
                typeof selectedOption.district === "string"
                  ? undefined
                  : selectedOption.district?.name,
            }
          : null
      }
      onSelect={(option) => onChange((option as SearchOption).id)}
      onSearchQueryChange={setSearchQuery}
      onClear={() => onChange("")}
    />
  );
}
