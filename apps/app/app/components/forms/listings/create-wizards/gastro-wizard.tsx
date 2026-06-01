"use client";

import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useRouter } from "@/app/i18n/navigation";
import { useCities } from "@/app/react-query/cities/hooks";
import { useDistricts } from "@/app/react-query/districts/hooks";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  useCreateListing,
  useCreateListingDetail,
} from "@/app/react-query/listings/hooks";
import { useRegions } from "@/app/react-query/regions/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import z from "zod";
import {
  eventTypeSelectionSchema,
  fullLocationSchema,
  listingImagesSchema,
  priceWithTravelFeeSchema,
  servicableAreaSchema,
} from "../edit-forms/common-schema";
import { toIds } from "../utils";
import {
  BasicInfoStep,
  EventTypesStep,
  ImagesStep,
  PriceStep,
  ServicableAreaStep,
} from "./common";
import WizardLayout from "./wizard-layout";
import { getPositiveNumber } from "@/app/validation/schema/utils";

const schema = z.object({
  name: z.string().min(1, "Název je povinný"),
  subType: z.string().min(1, "Vyberte typ zábavy"),
  eventTypeSelection: eventTypeSelectionSchema,
  servicableArea: servicableAreaSchema,
  location: fullLocationSchema,
  images: listingImagesSchema,
  price: priceWithTravelFeeSchema.extend({
    minimumPricePerEvent: getPositiveNumber(
      "Zadejte minimální cenu, za kterou přijímáte poptávku",
    ),
  }),
});

type FormInputs = z.infer<typeof schema>;

const STEPS = ["Základní info", "Cena", "Typy akcí", "Místo působení", "Fotky"];

const STEP_FIELDS: (keyof FormInputs | string)[][] = [
  ["name", "subType"],
  [
    "price.base",
    "price.pricingUnit",
    "price.travelFeeEnabled",
    "price.travelFeePerKm",
    "price.travelFeeStartsAtKm",
    "price.travelFeeType",
    "price.minimumPricePerEvent",
  ],
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

export default function GastroWizard({ onCancel }: Props) {
  const { companyId } = useParams<{ companyId: string }>();
  const [step, setStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subTypeSearch, setSubTypeSearch] = useState("");
  const [eventTypeSearch, setEventTypeSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cityBbox, setCityBbox] = useState<
    [number, number, number, number] | undefined
  >();

  const debouncedEventTypeSearch = useDebouncedValue(eventTypeSearch);
  const debouncedRegionSearch = useDebouncedValue(regionSearch);
  const debouncedDistrictSearch = useDebouncedValue(districtSearch);
  const debouncedCitySearch = useDebouncedValue(citySearch);

  const { data: filters } = useFilterOptions();
  const { data: regionsData } = useRegions(undefined, 9000);

  const filteredEventTypes = (filters?.eventTypes ?? []).filter(
    (i) =>
      !debouncedEventTypeSearch ||
      i.name.toLowerCase().includes(debouncedEventTypeSearch.toLowerCase()),
  );

  const { mutateAsync: createListingDetail } = useCreateListingDetail(
    "listing-gastro-details",
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
      subType: "",
      eventTypeSelection: { servesAll: false, types: [] },
      servicableArea: {
        wholeCountry: false,
        regions: [],
        districts: [],
        cities: [],
      },
      location: { address: "" },
    },
  });

  const regionsValue = watch("servicableArea.regions");
  const districtsValue = watch("servicableArea.districts");
  const selectedCity = watch("location.city");

  const regionIds = regionsValue?.map((r) => r.id) ?? [];
  const districtIds = districtsValue?.map((d) => d.id) ?? [];

  const { data: districtsData } = useDistricts(
    regionsValue.length
      ? { region: { in: regionsValue.map((r) => r.id) } }
      : undefined,
    9000,
    regionsValue.length > 0,
  );

  const { data: citiesData } = useCities({
    query: districtsValue.length
      ? { district: { in: districtsValue.map((d) => d.id) } }
      : undefined,
    limit: 9000,
    enabled: districtsValue.length > 0,
  });

  const filteredRegions = (regionsData?.docs ?? []).filter(
    (r) =>
      !debouncedRegionSearch ||
      r.name.toLowerCase().includes(debouncedRegionSearch.toLowerCase()),
  );

  const filteredDistricts = (districtsData?.docs ?? []).filter(
    (d) =>
      !debouncedDistrictSearch ||
      d.name.toLowerCase().includes(debouncedDistrictSearch.toLowerCase()),
  );

  const filteredCities = (citiesData?.docs ?? []).filter(
    (c) =>
      !debouncedCitySearch ||
      c.name.toLowerCase().includes(debouncedCitySearch.toLowerCase()),
  );

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

  console.log("errors", errors);

  async function onSubmit(data: FormInputs) {
    setIsSubmitting(true);
    try {
      const { doc: detail } = await createListingDetail({
        alcohol: {
          servesAlcohol: false,
          pricingUnit: "per_person",
        },
        filters: {
          eventTypes: data.eventTypeSelection.types.map((i) => i.id),
          allEventTypes: data.eventTypeSelection.servesAll,
        },
        options: {},
        price: data.price,
        setupAndTearDown: {},
      });
      await createListing({
        type: "gastro",
        subType: data.subType,
        filters: {
          allEventTypes: data.eventTypeSelection.servesAll,
          eventTypes: data.eventTypeSelection.types.map((i) => i.id),
        },
        options: {},
        company: companyId,
        name: data.name,
        guests: {},
        images: {
          coverImage: data.images.coverImage,
          logo: data.images.logo,
          gallery: data.images.gallery,
        },
        minimumPricePerEvent: data.price.minimumPricePerEvent,
        location: {
          address: data.location.address,
          city: data.location.city.id,
          latitude: data.location.coordinates.latitude,
          longitude: data.location.coordinates.longitude,
        },
        servicableArea: {
          wholeCountry: data.servicableArea.wholeCountry,
          regions: toIds(data.servicableArea.regions),
          districts: toIds(data.servicableArea.districts),
          cities: toIds(data.servicableArea.cities),
        },
        detail: {
          relationTo: "listing-gastro-details",
          value: detail.id,
        },
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
          <BasicInfoStep
            control={control}
            register={register}
            errors={errors}
            icon="Music"
            namePlaceholder="Itano - Nejlepší italský catering"
            subTypeLabel="Typ služby"
            subTypeOptions={filters?.foodServiceTypes ?? []}
            subTypeSearch={subTypeSearch}
            onSubTypeSearchChange={setSubTypeSearch}
          />
        )}
        {step === 1 && (
          <PriceStep
            control={control}
            register={register}
            watch={watch}
            errors={errors}
          />
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
          <ServicableAreaStep
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            filteredRegions={filteredRegions}
            filteredDistricts={filteredDistricts}
            filteredCities={filteredCities}
            regionIds={regionIds}
            districtIds={districtIds}
            selectedCity={selectedCity}
            cityBbox={cityBbox}
            onCityBboxChange={setCityBbox}
            onRegionSearchChange={setRegionSearch}
            onDistrictSearchChange={setDistrictSearch}
            onCitySearchChange={setCitySearch}
            onTriggerRegionsValidation={() => trigger("servicableArea.regions")}
          />
        )}

        {step === 4 && <ImagesStep control={control} errors={errors} />}
      </WizardLayout>
    </form>
  );
}
