"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import InputLabel from "@/app/components/ui/atoms/input-label";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import LocationInput from "@/app/components/ui/atoms/inputs/location-input";
import MapPointInput from "@/app/components/ui/atoms/inputs/map-point-input";
import MapRadiusInput from "@/app/components/ui/atoms/inputs/map-radius-input";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import SearchInput from "@/app/components/ui/atoms/inputs/search-input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import Switch from "@/app/components/ui/atoms/inputs/switch";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { LucideIcons, PricingUnits, TRAVEL_FEE_TYPE_ARRAY } from "@roo/common";
import { useTranslations } from "next-intl";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type CheckColor = string;

// ─── Basic Info ───────────────────────────────────────────────────────────────

type BasicInfoStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  namePlaceholder?: string;
  subTypeLabel: string;
  subTypeOptions: { id: string; name: string }[];
  subTypeSearch: string;
  onSubTypeSearchChange: (q: string) => void;
  icon?: LucideIcons;
};

export function BasicInfoStep<T extends FieldValues>({
  control,
  register,
  errors,
  namePlaceholder,
  subTypeLabel,
  subTypeOptions,
  subTypeSearch,
  onSubTypeSearchChange,
  icon = "Info",
}: BasicInfoStepProps<T>) {
  const e = errors as FieldErrors<{
    name: unknown;
    subType: unknown;
    shortDescription: unknown;
  }>;
  const filteredOptions = subTypeSearch
    ? subTypeOptions.filter((i) =>
        i.name.toLowerCase().includes(subTypeSearch.toLowerCase()),
      )
    : subTypeOptions;

  return (
    <FormSection
      title="Základní informace"
      icon={icon}
      surfaceColor="bg-listing-surface"
      color="text-listing"
      error={!!(e.name?.message || e.subType?.message)}
    >
      <Input
        label="Název"
        isRequired
        inputProps={{
          ...register("name" as Path<T>),
        }}
        placeholder={namePlaceholder}
        error={e.name?.message}
      />
      <Input
        label="Krátký popis"
        isRequired
        inputProps={{
          ...register("shortDescription" as Path<T>),
          placeholder: "Profesionální DJ na vaši akci.",
        }}
        error={e.shortDescription?.message}
      />
      <Controller
        control={control as Control<FieldValues>}
        name={"subType" as Path<T>}
        render={({ field }) => (
          <SearchInput
            label={subTypeLabel}
            isRequired
            options={filteredOptions}
            selectedOption={
              field.value
                ? (subTypeOptions.find((i) => i.id === field.value) ?? null)
                : null
            }
            onSelect={(option) => field.onChange(option.id)}
            onClear={() => field.onChange("")}
            onSearchQueryChange={onSubTypeSearchChange}
            error={e.subType?.message}
          />
        )}
      />
    </FormSection>
  );
}

// ─── Images ──────────────────────────────────────────────────────────────────

type ImagesStepProps<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
  checkColor?: CheckColor;
};

export function ImagesStep<T extends FieldValues>({
  control,
  errors,
}: ImagesStepProps<T>) {
  const e = errors as FieldErrors<{
    images: { coverImage: unknown; gallery: unknown };
  }>;
  return (
    <FormSection
      title="Obrázky"
      icon="Image"
      surfaceColor="bg-listing-surface"
      color="text-listing"
      error={!!(e.images?.coverImage?.message || e.images?.gallery?.message)}
    >
      <Controller
        control={control as Control<FieldValues>}
        name={"images.coverImage" as Path<T>}
        render={({ field }) => (
          <ImageInput
            label="Titulní obrázek"
            isRequired
            value={field.value}
            onChange={(f) => field.onChange(f ?? "")}
            onUpload={uploadFileToCloud}
            error={e.images?.coverImage?.message}
            containerRef={field.ref}
          />
        )}
      />
      <Controller
        control={control as Control<FieldValues>}
        name={"images.gallery" as Path<T>}
        render={({ field }) => (
          <GalleryInput
            label="Galerie"
            isRequired
            value={field.value}
            onChange={field.onChange}
            onUpload={uploadFileToCloud}
            maxImages={20}
            containerRef={field.ref}
            error={e.images?.gallery?.message}
          />
        )}
      />
    </FormSection>
  );
}

// ─── Price ───────────────────────────────────────────────────────────────────

type PriceStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  priceUnitOptions?: PricingUnits[];
};

export function PriceStep<T extends FieldValues>({
  control,
  register,
  watch,
  errors,
  priceUnitOptions,
}: PriceStepProps<T>) {
  const g = useTranslations("global");
  const e = errors as FieldErrors<{
    price: {
      base: unknown;
      minimumPricePerEvent: unknown;
      pricingUnit: unknown;
      travelFeeEnabled: unknown;
      travelFeePerKm: unknown;
      travelFeeStartsAtKm: unknown;
      travelFeeType: unknown;
    };
  }>;

  const travelFeeEnabled = (watch as UseFormWatch<FieldValues>)(
    "price.travelFeeEnabled",
  );

  return (
    <FormSection
      title="Cena"
      icon="Users"
      surfaceColor="bg-listing-surface"
      color="text-listing"
      error={!!e.price?.base?.message}
    >
      <Controller
        control={control as Control<FieldValues>}
        name={"price.pricingUnit" as Path<T>}
        render={({ field }) => (
          <PriceInput
            label="Cena pro výpočet poptávky (Kč) bez akcí a slev"
            isRequired
            amountProps={register("price.base" as Path<T>)}
            unitValue={field.value}
            onUnitChange={field.onChange}
            amountError={e.price?.base?.message}
            unitError={e.price?.pricingUnit?.message}
            options={priceUnitOptions}
          />
        )}
      />
      <Controller
        control={control as Control<FieldValues>}
        name={"price.travelFeeEnabled" as Path<T>}
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <InputLabel label="Cestovní poplatek" />
            <Switch
              checked={field.value ?? false}
              onEnable={() => field.onChange(true)}
              onDisable={() => field.onChange(false)}
            />
          </div>
        )}
      />
      {travelFeeEnabled && (
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Cena za km (Kč)"
            inputProps={{
              ...register("price.travelFeePerKm" as Path<T>),
              type: "number",
              min: 0,
              placeholder: "10",
            }}
            isRequired
            error={e.price?.travelFeePerKm?.message}
          />
          <Input
            label="Od vzdálenosti (km)"
            inputProps={{
              ...register("price.travelFeeStartsAtKm" as Path<T>),
              type: "number",
              min: 0,
              placeholder: "30",
            }}
            isRequired
            error={e.price?.travelFeeStartsAtKm?.message}
          />
          <Controller
            control={control as Control<FieldValues>}
            name={"price.travelFeeType" as Path<T>}
            render={({ field }) => (
              <SelectInput
                label="Typ cestovního poplatku"
                isRequired
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                items={TRAVEL_FEE_TYPE_ARRAY.map((v) => ({
                  value: v,
                  label: g(`pricing.travelFee.types.${v}`),
                }))}
                error={e.price?.travelFeeType?.message}
              />
            )}
          />
        </div>
      )}
    </FormSection>
  );
}

type SimplePriceStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  priceUnitOptions?: PricingUnits[];
};

export function SimplePriceStep<T extends FieldValues>({
  control,
  register,
  errors,
  priceUnitOptions,
}: SimplePriceStepProps<T>) {
  const e = errors as FieldErrors<{
    price: {
      base: unknown;
      pricingUnit: unknown;
    };
  }>;

  return (
    <FormSection
      title="Cena"
      icon="Users"
      surfaceColor="bg-listing-surface"
      color="text-listing"
      error={!!e.price?.base?.message}
    >
      <Controller
        control={control as Control<FieldValues>}
        name={"price.pricingUnit" as Path<T>}
        render={({ field }) => (
          <PriceInput
            label="Cena pro výpočet poptávky (Kč) bez akcí a slev"
            isRequired
            amountProps={register("price.base" as Path<T>)}
            unitValue={field.value}
            onUnitChange={field.onChange}
            amountError={e.price?.base?.message}
            unitError={e.price?.pricingUnit?.message}
            options={priceUnitOptions}
          />
        )}
      />
    </FormSection>
  );
}

// ─── Event Types ─────────────────────────────────────────────────────────────

type EventTypesStepProps<T extends FieldValues> = {
  control: Control<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  filteredEventTypes: { id: string; name: string }[];
  onSearchChange: (q: string) => void;
  onTriggerTypesValidation?: () => void;
  checkColor?: CheckColor;
};

export function EventTypesStep<T extends FieldValues>({
  control,
  watch,
  errors,
  filteredEventTypes,
  onSearchChange,
  onTriggerTypesValidation,
  checkColor = "text-listing",
}: EventTypesStepProps<T>) {
  const e = errors as FieldErrors<{
    eventTypeSelection: { servesAll: unknown; types: unknown };
  }>;
  const servesAll = (watch as UseFormWatch<FieldValues>)(
    "eventTypeSelection.servesAll",
  );

  return (
    <FormSection
      title="Typy akcí"
      icon="Calendar"
      surfaceColor="bg-listing-surface"
      color="text-listing"
      error={!!e.eventTypeSelection?.types?.message}
    >
      <Controller
        control={control as Control<FieldValues>}
        name={"eventTypeSelection.servesAll" as Path<T>}
        render={({ field }) => (
          <Checkbox
            title="Vyberte tuto možnost, pokud poskytujete služby pro všechny typy akcí."
            checked={field.value ?? false}
            onChange={(val) => {
              field.onChange(val);
              onTriggerTypesValidation?.();
            }}
            label="Poskytujeme služby pro všechny typy akcí"
            checkColor={checkColor}
          />
        )}
      />
      {!servesAll && (
        <Controller
          control={control as Control<FieldValues>}
          name={"eventTypeSelection.types" as Path<T>}
          render={({ field }) => (
            <CheckboxGroup
              isRequired
              label="Typy akcí"
              hideTags
              items={filteredEventTypes}
              value={field.value ?? []}
              onChange={field.onChange}
              checkColor={checkColor}
              onSearchChange={onSearchChange}
              searchable
              error={e.eventTypeSelection?.types?.message}
            />
          )}
        />
      )}
    </FormSection>
  );
}

// ─── Servicable Area ─────────────────────────────────────────────────────────

type ServicableAreaStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  selectedCity?: { id: string } | null;
  cityBbox?: [number, number, number, number];
  onCityBboxChange: (
    bbox: [number, number, number, number] | undefined,
  ) => void;
  checkColor?: CheckColor;
  locationTitle?: string;
  locationSubtitle?: string;
};

export function ServicableAreaStep<T extends FieldValues>({
  control,
  register,
  watch,
  errors,
  selectedCity,
  cityBbox,
  onCityBboxChange,
  checkColor = "text-listing",
  locationTitle = "Základna",
  locationSubtitle = "Zde vyberte místo, ze kterého vyjíždíte. Bude používáno pro přibližný výpočet ceny za cestu.",
}: ServicableAreaStepProps<T>) {
  const e = errors as FieldErrors<{
    location: { address: unknown; city: unknown; coordinates: unknown };
    servicableArea: { maxTravelDistanceKm: unknown };
  }>;
  const wholeCountry = (watch as UseFormWatch<FieldValues>)(
    "servicableArea.wholeCountry",
  );
  const coordinates = (watch as UseFormWatch<FieldValues>)(
    "location.coordinates",
  );

  return (
    <>
      <FormSection
        title={locationTitle}
        subtitle={locationSubtitle}
        icon="Home"
        surfaceColor="bg-listing-surface"
        color="text-listing"
        error={!!errors.location}
      >
        <Input
          label="Adresa"
          inputProps={{ ...register("location.address" as Path<T>) }}
          placeholder="Václavské náměstí 1"
          isRequired
          error={e.location?.address?.message}
        />
        <Controller
          control={control as Control<FieldValues>}
          name={"location.city" as Path<T>}
          render={({ field }) => (
            <LocationInput
              ref={field.ref}
              types={["cities"]}
              value={field.value ? { type: "city", ...field.value } : undefined}
              onBboxChange={onCityBboxChange}
              onChange={field.onChange}
              onBlur={field.onBlur}
              label="Město"
              isRequired
              error={e.location?.city?.message}
            />
          )}
        />
        <Controller
          control={control as Control<FieldValues>}
          name={"location.coordinates" as Path<T>}
          render={({ field }) => (
            <MapPointInput
              inputProps={{ ref: field.ref }}
              label="Kde přesně se Vaše základna nachází?"
              mapDisabled={!selectedCity?.id}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={e.location?.coordinates?.message}
              externalBbox={cityBbox}
              isRequired
              containerRef={field.ref}
            />
          )}
        />
      </FormSection>

      <FormSection
        title="Místo působení"
        icon="MapPin"
        surfaceColor="bg-listing-surface"
        color="text-listing"
        error={!!e.servicableArea?.maxTravelDistanceKm?.message}
      >
        <Controller
          control={control as Control<FieldValues>}
          name={"servicableArea.wholeCountry"}
          render={({ field }) => (
            <Checkbox
              title="Pokud obsluhujete celou Českou republiku, zaškrtněte tuto možnost."
              checked={field.value ?? false}
              onChange={field.onChange}
              label="Působíme po celé České republice"
              checkColor={checkColor}
            />
          )}
        />
        {!wholeCountry && (
          <Controller
            control={control as Control<FieldValues>}
            name={"servicableArea.maxTravelDistanceKm" as Path<T>}
            render={({ field }) => (
              <MapRadiusInput
                label="Maximální dojezdová vzdálenost"
                center={coordinates}
                value={field.value ?? 50}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={
                  (
                    e.servicableArea?.maxTravelDistanceKm as
                      | { message?: string }
                      | undefined
                  )?.message
                }
                isRequired
              />
            )}
          />
        )}
      </FormSection>
    </>
  );
}

// ─── Location (venue) ─────────────────────────────────────────────────────────

type LocationStepProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  selectedCity?: { id: string } | null;
  cityBbox?: [number, number, number, number];
  onCityBboxChange: (
    bbox: [number, number, number, number] | undefined,
  ) => void;
  title?: string;
  subtitle?: string;
};

export function LocationStep<T extends FieldValues>({
  control,
  register,
  errors,
  selectedCity,
  cityBbox,
  onCityBboxChange,
  title = "Lokalita",
  subtitle,
}: LocationStepProps<T>) {
  const e = errors as FieldErrors<{
    location: { address: unknown; city: unknown; coordinates: unknown };
  }>;

  return (
    <FormSection
      title={title}
      subtitle={subtitle}
      icon="MapPin"
      surfaceColor="bg-listing-surface"
      color="text-listing"
      error={!!errors.location}
    >
      <Input
        label="Adresa"
        inputProps={{ ...register("location.address" as Path<T>) }}
        placeholder="Václavské náměstí 1"
        isRequired
        error={e.location?.address?.message}
      />
      <Controller
        control={control as Control<FieldValues>}
        name={"location.city" as Path<T>}
        render={({ field }) => (
          <LocationInput
            ref={field.ref}
            types={["cities"]}
            value={field.value ? { type: "city", ...field.value } : undefined}
            onBboxChange={onCityBboxChange}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label="Město"
            isRequired
            error={e.location?.city?.message}
          />
        )}
      />
      <Controller
        control={control as Control<FieldValues>}
        name={"location.coordinates" as Path<T>}
        render={({ field }) => (
          <MapPointInput
            inputProps={{ ref: field.ref }}
            label="Kde přesně se nachází?"
            mapDisabled={!selectedCity?.id}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={e.location?.coordinates?.message}
            externalBbox={cityBbox}
            isRequired
            containerRef={field.ref}
          />
        )}
      />
    </FormSection>
  );
}
