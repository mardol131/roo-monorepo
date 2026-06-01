"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import Input from "@/app/components/ui/atoms/inputs/input";
import LocationInput, {
  Bbox,
} from "@/app/components/ui/atoms/inputs/location-input";
import MapPointInput from "@/app/components/ui/atoms/inputs/map-point-input";
import { useCities, useCity } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FullLocalityData } from "../common-schema";

type Props = {
  form: UseFormReturn<FullLocalityData>;
  isActive: boolean;
  texts: Record<keyof FullLocalityData, TocSection>;
};

export function FullLocalityForm({ form, isActive, texts }: Props) {
  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [userBbox, setUserBbox] = useState<Bbox | undefined>();

  const regionsValue = form.watch("servicableArea.regions");
  const districtsValue = form.watch("servicableArea.districts");
  const wholeCountry = form.watch("servicableArea.wholeCountry");
  const selectedCity = form.watch("location.city");

  const { data: regionsData } = useRegions(undefined, 20);
  const { data: districtsData } = useDistricts(
    regionsValue?.length || districtSearch
      ? {
          ...(regionsValue?.length
            ? { region: { in: regionsValue.map((i) => i.id) } }
            : {}),
          ...(districtSearch ? { name: { contains: districtSearch } } : {}),
        }
      : undefined,
  );
  const { data: citiesData } = useCities({
    query:
      districtsValue?.length || citySearch
        ? {
            ...(districtsValue?.length
              ? { district: { in: districtsValue.map((i) => i.id) } }
              : {}),
            ...(citySearch ? { name: { contains: citySearch } } : {}),
          }
        : undefined,
  });

  // Fetch bbox for the currently selected city (covers the form-load case)
  const { data: selectedCityData } = useCity(selectedCity?.id ?? "", {
    enabled: !!selectedCity?.id,
  });
  const initBbox: Bbox | undefined =
    selectedCityData?.bboxMinLon &&
    selectedCityData?.bboxMinLat &&
    selectedCityData?.bboxMaxLon &&
    selectedCityData?.bboxMaxLat
      ? [
          selectedCityData.bboxMinLon,
          selectedCityData.bboxMinLat,
          selectedCityData.bboxMaxLon,
          selectedCityData.bboxMaxLat,
        ]
      : undefined;

  const externalBbox = userBbox ?? initBbox;

  return (
    <div className={!isActive ? "hidden" : "flex flex-col gap-4"}>
      <FormSection
        id={texts.location.id}
        icon={texts.location.icon}
        title={texts.location.title}
        subtitle={texts.location.subTitle}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.location}
      >
        <Input
          label="Adresa"
          inputProps={{
            ...form.register("location.address"),
            placeholder: "Václavské náměstí 1",
          }}
          isRequired
          error={form.formState.errors.location?.address?.message}
        />
        <Controller
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <LocationInput
              ref={field.ref}
              label="Město"
              types={["cities"]}
              isRequired
              value={
                field.value
                  ? { type: "city", id: field.value.id, name: field.value.name }
                  : undefined
              }
              onChange={(selection) =>
                field.onChange(
                  selection
                    ? { id: selection.id, name: selection.name }
                    : undefined,
                )
              }
              onBboxChange={setUserBbox}
              onBlur={field.onBlur}
              error={form.formState.errors.location?.city?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="location.coordinates"
          render={({ field }) => (
            <MapPointInput
              inputProps={{ ref: field.ref }}
              label="Kde přesně se Vaše základna nachází?"
              mapDisabled={!selectedCity?.id}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={form.formState.errors.location?.coordinates?.message}
              externalBbox={externalBbox}
              isRequired
              containerRef={field.ref}
            />
          )}
        />
      </FormSection>

      <FormSection
        id={texts.servicableArea.id}
        icon={texts.servicableArea.icon}
        title={texts.servicableArea.title}
        subtitle={texts.servicableArea.subTitle}
        color="text-listing"
        surfaceColor="bg-listing-surface"
        error={!!form.formState.errors.servicableArea?.regions}
      >
        <Controller
          control={form.control}
          name="servicableArea.wholeCountry"
          render={({ field }) => (
            <Checkbox
              title="Pokud obsluhujete celou Českou republiku, zaškrtněte tuto možnost."
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Působíme po celé České republice"
              checkColor="text-listing"
            />
          )}
        />
        {!wholeCountry && (
          <>
            <Controller
              control={form.control}
              name="servicableArea.regions"
              render={({ field }) => (
                <CheckboxGroup
                  label="Kraj"
                  hideTags
                  items={regionsData?.docs ?? []}
                  value={field.value ?? []}
                  onChange={(val) => {
                    field.onChange(val);
                    form.setValue("servicableArea.districts", []);
                    form.setValue("servicableArea.cities", []);
                  }}
                  checkColor="text-listing"
                  searchable
                  isRequired
                  error={form.formState.errors.servicableArea?.regions?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="servicableArea.districts"
              render={({ field }) => (
                <CheckboxGroup
                  label="Okres"
                  hideTags
                  items={districtsData?.docs ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                  onSearchChange={setDistrictSearch}
                  closed={!regionsValue?.length}
                  closedMessage="Nejprve vyplňte předchozí pole"
                />
              )}
            />
            <Controller
              control={form.control}
              name="servicableArea.cities"
              render={({ field }) => (
                <CheckboxGroup
                  label="Město"
                  hideTags
                  items={citiesData?.docs ?? []}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  checkColor="text-listing"
                  searchable
                  onSearchChange={setCitySearch}
                  closed={!districtsValue?.length}
                  closedMessage="Nejprve vyplňte předchozí pole"
                />
              )}
            />
          </>
        )}
      </FormSection>
    </div>
  );
}
