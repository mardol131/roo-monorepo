"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import Input from "@/app/components/ui/atoms/inputs/input";
import LocationInput, {
  Bbox,
} from "@/app/components/ui/atoms/inputs/location-input";
import MapPointInput from "@/app/components/ui/atoms/inputs/map-point-input";
import MapRadiusInput from "@/app/components/ui/atoms/inputs/map-radius-input";
import { useCity } from "@/app/react-query/cities/hooks";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FullLocalityData } from "../common-schema";

type Props = {
  form: UseFormReturn<FullLocalityData>;
  isActive: boolean;
  texts: Record<keyof FullLocalityData, TocSection>;
};

export function FullLocalityForm({ form, isActive, texts }: Props) {
  const [userBbox, setUserBbox] = useState<Bbox | undefined>();

  const wholeCountry = form.watch("servicableArea.wholeCountry");
  const selectedCity = form.watch("location.city");
  const coordinates = form.watch("location.coordinates");

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
        error={!!form.formState.errors.servicableArea?.maxTravelDistanceKm}
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
          <Controller
            control={form.control}
            name="servicableArea.maxTravelDistanceKm"
            render={({ field }) => (
              <MapRadiusInput
                label="Maximální dojezdová vzdálenost"
                center={coordinates}
                value={field.value ?? 50}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={form.formState.errors.servicableArea?.maxTravelDistanceKm?.message}
                isRequired
              />
            )}
          />
        )}
      </FormSection>
    </div>
  );
}
