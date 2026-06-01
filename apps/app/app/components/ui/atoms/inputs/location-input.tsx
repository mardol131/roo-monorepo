"use client";

import SearchInput, {
  SearchOption,
} from "@/app/components/ui/atoms/inputs/search-input";
import { useCities, useCity } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { Ref, useState } from "react";

export type LocationType = "cities" | "districts" | "regions";

export type LocationSelection = {
  type: "city" | "district" | "region";
  id: string;
  name: string;
};

export type Bbox = [number, number, number, number];

type Props = {
  types: LocationType[];
  value?: LocationSelection;
  onChange?: (value: LocationSelection | undefined) => void;
  onBboxChange?: (bbox: Bbox | undefined) => void;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
};

export default function LocationInput({
  types,
  value,
  onChange,
  onBboxChange,
  onBlur,
  ref,
  label = "",
  placeholder,
  error,
  isRequired,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchEnabled = searchQuery.length >= 2;

  const searchRegions = types.includes("regions");
  const searchDistricts = types.includes("districts");
  const searchCities = types.includes("cities");
  const showInfo = types.length > 1;

  const { data: regionResults, isLoading: loadingRegions } = useRegions(
    searchEnabled && searchRegions ? { name: { contains: searchQuery } } : undefined,
    5,
    searchEnabled && searchRegions,
  );
  const { data: districtResults, isLoading: loadingDistricts } = useDistricts(
    searchEnabled && searchDistricts ? { name: { contains: searchQuery } } : undefined,
    5,
    searchEnabled && searchDistricts,
  );
  const { data: cityResults, isLoading: loadingCities } = useCities({
    query: searchEnabled && searchCities ? { name: { contains: searchQuery } } : undefined,
    limit: 5,
    enabled: searchEnabled && searchCities,
  });

  const cityDistrictIds = cityResults?.docs?.map((c) => c.district).filter(Boolean) ?? [];
  const { data: cityDistrictsLookup } = useDistricts(
    cityDistrictIds.length ? { id: { in: cityDistrictIds } } : undefined,
    cityDistrictIds.length,
    cityDistrictIds.length > 0,
  );

  const districtRegionIds = districtResults?.docs?.map((d) => d.region).filter(Boolean) ?? [];
  const { data: districtRegionsLookup } = useRegions(
    districtRegionIds.length ? { id: { in: districtRegionIds } } : undefined,
    districtRegionIds.length,
    districtRegionIds.length > 0,
  );

  // Parent lookups for the selected option (used when value comes from outside, e.g. form load)
  const { data: selectedCityData } = useCity(
    value?.type === "city" ? value.id : "",
    { enabled: value?.type === "city" },
  );
  const selectedCityDistrictId = selectedCityData?.district ?? "";
  const { data: selectedCityDistrictData } = useDistricts(
    selectedCityDistrictId ? { id: { in: [selectedCityDistrictId] } } : undefined,
    1,
    !!selectedCityDistrictId,
  );

  const { data: selectedDistrictData } = useDistricts(
    value?.type === "district" ? { id: { in: [value.id] } } : undefined,
    1,
    value?.type === "district",
  );
  const selectedDistrictRegionId = selectedDistrictData?.docs?.[0]?.region ?? "";
  const { data: selectedDistrictRegionData } = useRegions(
    selectedDistrictRegionId ? { id: { in: [selectedDistrictRegionId] } } : undefined,
    1,
    !!selectedDistrictRegionId,
  );

  const options: SearchOption[] = [
    ...(searchRegions
      ? (regionResults?.docs ?? []).map((r) => ({
          id: `region:${r.id}`,
          name: r.name,
          info: showInfo ? "Kraj" : undefined,
        }))
      : []),
    ...(searchDistricts
      ? (districtResults?.docs ?? []).map((d) => ({
          id: `district:${d.id}`,
          name: d.name,
          info: districtRegionsLookup?.docs?.find((r) => r.id === d.region)?.name ?? "Okres",
        }))
      : []),
    ...(searchCities
      ? (cityResults?.docs ?? []).map((c) => ({
          id: `city:${c.id}`,
          name: c.name,
          info: cityDistrictsLookup?.docs?.find((d) => d.id === c.district)?.name ?? "Město",
        }))
      : []),
  ];

  const selectedCityDistrictName = selectedCityDistrictData?.docs?.[0]?.name;
  const selectedDistrictRegionName = selectedDistrictRegionData?.docs?.[0]?.name;

  const selectedOption: SearchOption | undefined = value
    ? {
        id: `${value.type}:${value.id}`,
        name: value.name,
        info:
          value.type === "city"
            ? selectedCityDistrictName
            : value.type === "district"
              ? selectedDistrictRegionName
              : undefined,
      }
    : undefined;

  const handleSelect = (option: SearchOption) => {
    const colonIndex = option.id.indexOf(":");
    const type = option.id.slice(0, colonIndex) as LocationSelection["type"];
    const id = option.id.slice(colonIndex + 1);
    onChange?.({ type, id, name: option.name });
    if (onBboxChange) {
      const entity =
        type === "city"
          ? cityResults?.docs?.find((c) => c.id === id)
          : type === "district"
            ? districtResults?.docs?.find((d) => d.id === id)
            : regionResults?.docs?.find((r) => r.id === id);
      if (entity?.bboxMinLon && entity?.bboxMinLat && entity?.bboxMaxLon && entity?.bboxMaxLat) {
        onBboxChange([entity.bboxMinLon, entity.bboxMinLat, entity.bboxMaxLon, entity.bboxMaxLat]);
      } else {
        onBboxChange(undefined);
      }
    }
  };

  return (
    <SearchInput
      ref={ref}
      label={label}
      placeholder={placeholder ?? buildPlaceholder(types)}
      options={options}
      searching={loadingRegions || loadingDistricts || loadingCities}
      selectedOption={selectedOption ?? null}
      onSelect={handleSelect}
      onSearchQueryChange={setSearchQuery}
      onClear={() => { onChange?.(undefined); onBboxChange?.(undefined); }}
      onBlur={onBlur}
      error={error}
      isRequired={isRequired}
    />
  );
}

function buildPlaceholder(types: LocationType[]): string {
  if (types.length === 1) {
    if (types[0] === "cities") return "Hledat město...";
    if (types[0] === "districts") return "Hledat okres...";
    return "Hledat kraj...";
  }
  return "Hledat lokalitu...";
}
