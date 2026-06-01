"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import Input from "@/app/components/ui/atoms/inputs/input";
import LocationInput, {
  Bbox,
} from "@/app/components/ui/atoms/inputs/location-input";
import MapPointInput from "@/app/components/ui/atoms/inputs/map-point-input";
import { useCity } from "@/app/react-query/cities/hooks";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { SimpleLocalityData } from "../common-schema";

type Props = {
  form: UseFormReturn<SimpleLocalityData>;
  isActive: boolean;
  texts: {
    location: TocSection;
  };
};

export function SimpleLocalityForm({ form, isActive, texts }: Props) {
  const [userBbox, setUserBbox] = useState<Bbox | undefined>();

  const selectedCity = form.watch("location.city");

  // Fetch bbox for the currently selected city (covers the form-load case)
  const { data: cityData } = useCity(selectedCity?.id ?? "", {
    enabled: !!selectedCity?.id,
  });
  const initBbox: Bbox | undefined =
    cityData?.bboxMinLon &&
    cityData?.bboxMinLat &&
    cityData?.bboxMaxLon &&
    cityData?.bboxMaxLat
      ? [
          cityData.bboxMinLon,
          cityData.bboxMinLat,
          cityData.bboxMaxLon,
          cityData.bboxMaxLat,
        ]
      : undefined;

  // userBbox takes priority — it's set when the user picks a new city
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
                  selection ? { id: selection.id, name: selection.name } : undefined,
                )
              }
              onBboxChange={(bbox) => {
                setUserBbox(bbox);
              }}
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
    </div>
  );
}
