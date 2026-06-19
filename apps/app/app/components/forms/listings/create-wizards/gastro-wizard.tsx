"use client";

import { useDebouncedValue } from "@/app/hooks/use-debounced-value";
import { useRouter } from "@/app/i18n/navigation";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  useCreateListing,
  useCreateListingDetail,
} from "@/app/react-query/listings/hooks";
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
  shortDescription: z.string().min(1, "Krátký popis je povinný"),
  eventTypeSelection: eventTypeSelectionSchema,
  servicableArea: servicableAreaSchema,
  location: fullLocationSchema,
  images: listingImagesSchema,
  price: priceWithTravelFeeSchema,
});

type FormInputs = z.infer<typeof schema>;

const STEPS = ["Základní info", "Cena", "Typy akcí", "Místo působení", "Fotky"];

const STEP_FIELDS: (keyof FormInputs | string)[][] = [
  ["name", "subType", "shortDescription"],
  [
    "price.base",
    "price.pricingUnit",
    "price.travelFeeEnabled",
    "price.travelFeePerKm",
    "price.travelFeeStartsAtKm",
    "price.travelFeeType",
  ],
  ["eventTypeSelection.types", "eventTypeSelection.servesAll"],
  [
    "servicableArea.maxTravelDistanceKm",
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
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema) as Resolver<FormInputs>,
    mode: "onChange",
    defaultValues: {
      subType: "",
      eventTypeSelection: { servesAll: false, types: [] },
      servicableArea: { wholeCountry: false },
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
        shortDescription: data.shortDescription,
        guests: {},
        images: {
          coverImage: data.images.coverImage,
          logo: data.images.logo,
          gallery: data.images.gallery,
        },
        minimumPricePerEvent: data.price.base,
        pricingUnit: data.price.pricingUnit,
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
          wholeCountry: data.servicableArea.wholeCountry,
          maxTravelDistanceKm: data.servicableArea.maxTravelDistanceKm,
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
