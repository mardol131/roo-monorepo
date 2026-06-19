"use client";

import SearchInput, {
  SearchOption,
} from "@/app/components/ui/atoms/inputs/search-input";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { useState } from "react";

export type LocationValue = { city: string; district: string; region: string };

export const EMPTY_LOCATION: LocationValue = {
  city: "",
  district: "",
  region: "",
};

interface LocationFilterProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}

export default function LocationFilter({
  value,
  onChange,
}: LocationFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchEnabled = searchQuery.length >= 2;

  const { data: regionResults, isLoading: loadingRegions } = useRegions({
    query: searchEnabled ? { name: { contains: searchQuery } } : undefined,
    limit: 3,
    enabled: searchEnabled,
  });
  const { data: districtResults, isLoading: loadingDistricts } = useDistricts({
    query: searchEnabled ? { name: { contains: searchQuery } } : undefined,
    limit: 3,
    enabled: searchEnabled,
  });
  const { data: cityResults, isLoading: loadingCities } = useCities({
    query: searchEnabled ? { name: { contains: searchQuery } } : undefined,
    limit: 5,
    enabled: searchEnabled,
  });

  const { data: selectedCityData } = useCities({
    query: value.city ? { id: { equals: value.city } } : undefined,
    limit: 1,
    enabled: !!value.city,
  });
  const { data: selectedDistrictData } = useDistricts({
    query: value.district ? { id: { equals: value.district } } : undefined,
    limit: 1,
    enabled: !!value.district,
  });
  const { data: selectedRegionData } = useRegions({
    query: value.region ? { id: { equals: value.region } } : undefined,
    limit: 1,
    enabled: !!value.region,
  });

  const options: SearchOption[] = [
    ...(regionResults?.docs ?? []).map((r) => ({
      id: `region:${r.id}`,
      name: r.name,
      info: "Kraj",
    })),
    ...(districtResults?.docs ?? []).map((d) => ({
      id: `district:${d.id}`,
      name: d.name,
      info: "Okres",
    })),
    ...(cityResults?.docs ?? []).map((c) => ({
      id: `city:${c.id}`,
      name: c.name,
      info: "Město",
    })),
  ];

  const selectedOption: SearchOption | null =
    value.city && selectedCityData?.docs?.[0]
      ? {
          id: `city:${value.city}`,
          name: selectedCityData.docs[0].name,
          info: "Město",
        }
      : value.district && selectedDistrictData?.docs?.[0]
        ? {
            id: `district:${value.district}`,
            name: selectedDistrictData.docs[0].name,
            info: "Okres",
          }
        : value.region && selectedRegionData?.docs?.[0]
          ? {
              id: `region:${value.region}`,
              name: selectedRegionData.docs[0].name,
              info: "Kraj",
            }
          : null;

  const handleSelect = (option: SearchOption) => {
    const colonIndex = option.id.indexOf(":");
    const type = option.id.slice(0, colonIndex);
    const id = option.id.slice(colonIndex + 1);
    if (type === "city") onChange({ ...EMPTY_LOCATION, city: id });
    else if (type === "district") onChange({ ...EMPTY_LOCATION, district: id });
    else if (type === "region") onChange({ ...EMPTY_LOCATION, region: id });
  };

  return (
    <SearchInput
      label=""
      placeholder="Hledat kraj, okres nebo město..."
      options={options}
      searching={loadingRegions || loadingDistricts || loadingCities}
      selectedOption={selectedOption}
      onSelect={handleSelect}
      onSearchQueryChange={setSearchQuery}
      onClear={() => onChange(EMPTY_LOCATION)}
    />
  );
}
