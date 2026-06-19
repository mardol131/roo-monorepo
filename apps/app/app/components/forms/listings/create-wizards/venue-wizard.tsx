"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import Input from "@/app/components/ui/atoms/inputs/input";
import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useRouter } from "@/app/i18n/navigation";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  useCreateListing,
  useCreateListingDetail,
} from "@/app/react-query/listings/hooks";
import { getPositiveNumber } from "@/app/validation/schema/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import z from "zod";
import {
  eventTypeSelectionSchema,
  fullLocationSchema,
  listingImagesSchema,
} from "../edit-forms/common-schema";
import {
  EventTypesStep,
  ImagesStep,
  LocationStep,
} from "./common";
import { createSpace } from "@/app/react-query/spaces/fetch";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import SelectInput from "@/app/components/ui/atoms/inputs/select-input";
import WizardLayout from "./wizard-layout";

const schema = z.object({
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z.string().min(1, "Krátký popis je povinný"),
  area: getPositiveNumber("Zadejte kladnou rozlohu"),
  eventTypeSelection: eventTypeSelectionSchema,
  location: fullLocationSchema,
  images: listingImagesSchema,
  space: z.object({
    name: z.string().min(1, "Název prostoru je povinný"),
    type: z.enum(["area", "building", "room"] as const),
    price: z.object({
      base: getPositiveNumber("Zadejte cenu prostoru"),
      pricingUnit: z.enum(["per_hour", "per_day"] as const),
    }),
    capacity: z.coerce.number().positive().optional(),
  }),
});

type FormInputs = z.infer<typeof schema>;

const STEPS = ["Základní info", "Prostory", "Typy akcí", "Místo působení", "Fotky"];

const STEP_FIELDS: (keyof FormInputs | string)[][] = [
  ["name", "area", "shortDescription"],
  ["space.name", "space.type", "space.price.base", "space.price.pricingUnit"],
  ["eventTypeSelection.types", "eventTypeSelection.servesAll"],
  [
    "servicableArea.regions",
    "location.address",
    "location.city",
    "location.coordinates",
  ],
  ["images.coverImage", "images.gallery"],
];

type Props = { onCancel: () => void };

export default function VenueWizard({ onCancel }: Props) {
  const { companyId } = useParams<{ companyId: string }>();
  const [step, setStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTypeSearch, setEventTypeSearch] = useState("");
  const [cityBbox, setCityBbox] = useState<
    [number, number, number, number] | undefined
  >();

  const debouncedEventTypeSearch = useDebouncedValue(eventTypeSearch);

  const { data: filters } = useFilterOptions();

  const filteredEventTypes = (filters?.eventTypes ?? []).filter(
    (i) =>
      !debouncedEventTypeSearch ||
      i.name.toLowerCase().includes(debouncedEventTypeSearch.toLowerCase()),
  );

  const { mutateAsync: createListingDetail } = useCreateListingDetail(
    "listing-venue-details",
  );
  const { mutateAsync: createListing } = useCreateListing();
  const router = useRouter();

  const {
    control,
    register,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema) as Resolver<FormInputs>,
    mode: "onChange",
    defaultValues: {
      eventTypeSelection: { servesAll: false, types: [] },

      location: { address: "" },
    },
  });

  const selectedCity = watch("location.city");

  async function handleNext() {
    const valid = await trigger(
      STEP_FIELDS[step] as Parameters<typeof trigger>[0],
    );
    if (!valid) return false;

    const next = step + 1;
    setStep(next);
    setMaxReachedStep((m) => Math.max(m, next));
    return true;
  }

  async function onSubmit(data: FormInputs) {
    setIsSubmitting(true);
    try {
      const { doc: detail } = await createListingDetail({
        filters: {
          eventTypes: data.eventTypeSelection.types.map((i) => i.id),
          allEventTypes: data.eventTypeSelection.servesAll,
        },
        options: {},
        spacesType: "area",
        area: data.area,
        breakfast: {
          breakfastIncluded: false,
        },
        catering: {},
        parking: {},
        propertyAccess: {},
        accomodation: {},
      });
      const newListing = await createListing({
        type: "venue",
        filters: {
          allEventTypes: data.eventTypeSelection.servesAll,
          eventTypes: data.eventTypeSelection.types.map((i) => i.id),
        },
        options: {},
        company: companyId,
        name: data.name,
        shortDescription: data.shortDescription,
        guests: {},
        images: {
          coverImage: data.images.coverImage,
          logo: data.images.logo,
          gallery: data.images.gallery,
        },
        minimumPricePerEvent: data.space.price.base,
        pricingUnit: data.space.price.pricingUnit,
        location: {
          address: data.location.address,
          city: data.location.city.id,
          point: [
            data.location.coordinates.longitude,
            data.location.coordinates.latitude,
          ],
          country: "cz",
        },
        servicableArea: {
          wholeCountry: false,
        },
        detail: {
          relationTo: "listing-venue-details",
          value: detail.id,
        },
      });
      await createSpace({
        name: data.space.name,
        type: data.space.type,
        price: {
          base: data.space.price.base,
          pricingUnit: data.space.price.pricingUnit,
        },
        listing: newListing.id,
        ...(data.space.capacity ? { capacity: data.space.capacity } : {}),
      });
      router.push({
        pathname: "/company-profile/companies/[companyId]/listings",
        params: { companyId },
      });
    } catch {
      alert("Nepodařilo se vytvořit inzerát, zkuste to prosím znovu.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <WizardLayout
        steps={STEPS}
        currentStep={step}
        maxReachedStep={maxReachedStep}
        onStepClick={setStep}
        onBack={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setStep((s) => s - 1);
        }}
        onNext={async () => {
          if (step === STEPS.length - 1) {
            handleSubmit(onSubmit)();
          } else {
            const res = await handleNext();
            if (res) window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        onCancel={onCancel}
        isLastStep={step === STEPS.length - 1}
        isSubmitting={isSubmitting}
      >
        {step === 0 && (
          <>
            <FormSection
              title="Základní informace"
              icon="House"
              surfaceColor="bg-listing-surface"
              color="text-listing"
              error={!!errors.area?.message}
            >
              <Input
                label="Best Venue Name Ever"
                isRequired
                inputProps={{
                  ...register("name"),
                  type: "text",
                }}
                placeholder="Best Venue Name Ever"
                error={errors.name?.message}
              />
              <Input
                label="Krátký popis"
                isRequired
                inputProps={{
                  ...register("shortDescription"),
                  placeholder: "Profesionální DJ na vaši akci.",
                }}
                error={errors.shortDescription?.message}
              />
              <Input
                label="Rozloha (m²)"
                isRequired
                inputProps={{
                  ...register("area"),
                  type: "number",
                  min: 0,
                  placeholder: "250",
                }}
                error={errors.area?.message}
              />
            </FormSection>
          </>
        )}
        {step === 1 && (
          <FormSection
            title="První prostor"
            icon="House"
            surfaceColor="bg-listing-surface"
            color="text-listing"
          >
            <Input
              label="Název prostoru"
              isRequired
              inputProps={{
                ...register("space.name"),
                type: "text",
                placeholder: "Velký sál",
              }}
              error={errors.space?.name?.message}
            />
            <Controller
              control={control}
              name="space.type"
              render={({ field }) => (
                <SelectInput
                  label="Typ prostoru"
                  isRequired
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  items={[
                    { value: "area", label: "Venkovní plocha" },
                    { value: "building", label: "Budova / areál" },
                    { value: "room", label: "Místnost / sál" },
                  ]}
                  error={errors.space?.type?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="space.price.pricingUnit"
              render={({ field }) => (
                <PriceInput
                  label="Cena prostoru (Kč)"
                  isRequired
                  amountProps={register("space.price.base")}
                  unitValue={field.value}
                  onUnitChange={field.onChange}
                  amountError={errors.space?.price?.base?.message}
                  unitError={errors.space?.price?.pricingUnit?.message}
                  options={["per_hour", "per_day"]}
                />
              )}
            />
            <Input
              label="Kapacita (osob)"
              inputProps={{
                ...register("space.capacity"),
                type: "number",
                min: 1,
                placeholder: "150",
              }}
              error={errors.space?.capacity?.message}
            />
          </FormSection>
        )}

        {step === 2 && (
          <EventTypesStep
            control={control}
            watch={watch}
            errors={errors}
            filteredEventTypes={filteredEventTypes}
            onSearchChange={setEventTypeSearch}
            onTriggerTypesValidation={() => trigger("eventTypeSelection.types")}
          />
        )}

        {step === 3 && (
          <LocationStep
            control={control}
            register={register}
            errors={errors}
            selectedCity={selectedCity}
            cityBbox={cityBbox}
            onCityBboxChange={setCityBbox}
          />
        )}

        {step === 4 && <ImagesStep control={control} errors={errors} />}
      </WizardLayout>
    </form>
  );
}
