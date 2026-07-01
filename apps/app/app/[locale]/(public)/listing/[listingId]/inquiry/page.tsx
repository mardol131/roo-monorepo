"use client";

import type { EventFormInputs } from "@/app/components/forms/events/new-event-form";
import { eventFormResolver } from "@/app/components/forms/events/new-event-form";
import { useAuth } from "@/app/context/auth/auth-context";
import { useCreateInquiry } from "@/app/react-query/inquiries/hooks";
import { useCreateEvent } from "@/app/react-query/events/hooks";
import { useListing, useListingDetail } from "@/app/react-query/listings/hooks";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useOrderStore, type OrderDraft } from "@/app/store/order-store";
import { getIdFromRelationshipField } from "@roo/common";
import { calculateEstimatedPrice } from "./utils/calculate-price";
import { zodResolver } from "@hookform/resolvers/zod";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import InquiryPreview from "./components/inquiry-preview";
import InquiryWizardLayout from "./components/inquiry-wizard-layout";
import ResumeDraftModal from "./components/resume-draft-modal";
import OrderStepFillCustomRequest, {
  customRequestFormSchema,
  type CustomRequestFormData,
} from "./components/order-steps/custom-request/order-step-fill-custom-request";
import OrderStepLogin from "./components/order-steps/login-step/order-step-login";
import OrderStepReviewConsents, {
  ConsentInputs,
  consentSchema,
} from "./components/order-steps/review/order-step-review-consents";
import OrderStepSelectEvent from "./components/order-steps/event-selection/order-step-select-event";
import OrderStepNewEventInline from "./components/order-steps/event-selection/order-step-new-event-inline";
import OrderStepSelectVariant from "./components/order-steps/variant-selection/order-step-select-variant";
import OrderStepSuccess from "./components/order-steps/success/order-step-success";

// ── Draft persistence ─────────────────────────────────────────────────────────

const DRAFT_KEY = "eventShaker_inquiry_draft";

function clearDraft() {
  if (typeof window !== "undefined") localStorage.removeItem(DRAFT_KEY);
}

// ── Step config ───────────────────────────────────────────────────────────────

type InquiryStep =
  | "event"
  | "event-basic"
  | "event-location"
  | "offer"
  | "review";

// Validation fields per new-event step
const NEW_EVENT_BASIC_FIELDS: (keyof EventFormInputs)[] = [
  "name",
  "eventType",
  "startDate",
  "endDate",
  "guests",
];
const NEW_EVENT_LOCATION_FIELDS = [
  "locationDistrict",
  "contactPerson.name",
  "contactPerson.email",
] as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const {
    isOrderStepActivated,
    inquiryMode,
    setInquiryMode,
    currentVariantId,
    eventData,
    eventVariant,
    customRequest,
    selectedAddons,
    selectedSpaces,
    accommodation,
    breakfast,
    parking,
    wantsCatering,
    serviceTime,
    resetIndices,
    setListingId,
    restoreDraft,
  } = useOrderStore();

  const params = useParams<{ listingId: string }>();
  const auth = useAuth();
  const { data: variants } = useVariantsByListing(params.listingId);
  const { data: listing } = useListing(params.listingId);
  const detailId = listing
    ? getIdFromRelationshipField(listing.detail.value)
    : undefined;
  const { data: detail } = useListingDetail(
    listing
      ? `listing-${listing.type}-details`
      : "listing-entertainment-details",
    detailId,
  );
  const { mutate: createInquiry } = useCreateInquiry();
  const { mutateAsync: createEventAsync } = useCreateEvent();

  const isOneTime =
    listing?.type !== "venue" &&
    (listing?.pricingUnit === "lump_sum" ||
      listing?.pricingUnit === "per_person");

  const hasNoVariants =
    variants !== undefined && (variants.docs?.length ?? 0) === 0;
  const isNewEventMode = eventVariant === "new-event";

  // Dynamic steps based on whether user is creating a new event. "event" is
  // always first, so a user partway through creating a new event can step
  // back to the choice between an existing event and a new one.
  const STEPS: { key: InquiryStep; label: string; icon?: string }[] = [
    { key: "event", label: "Událost" },
    ...(isNewEventMode
      ? [
          { key: "event-basic" as const, label: "Základní info", icon: "Info" },
          {
            key: "event-location" as const,
            label: "Místo a kontakt",
            icon: "MapPin",
          },
        ]
      : []),
    { key: "offer", label: "Poptávka" },
    { key: "review", label: "Přehled" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const hasHydratedRef = useRef(false);
  const prevEventVariantRef = useRef(eventVariant);
  // Draft found on mount, held back until the user explicitly chooses to
  // resume — nothing is applied to the store/forms until then.
  const pendingDraftRef = useRef<OrderDraft | null>(null);

  // Draft persistence: check stored draft on mount
  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    if (!raw) {
      setListingId(params.listingId);
      hasHydratedRef.current = true;
      return;
    }
    let draft: OrderDraft;
    try {
      draft = JSON.parse(raw) as OrderDraft;
    } catch {
      clearDraft();
      setListingId(params.listingId);
      hasHydratedRef.current = true;
      return;
    }
    if (draft.listingId !== params.listingId) {
      clearDraft();
      setListingId(params.listingId);
      hasHydratedRef.current = true;
      return;
    }
    const hasMeaningfulState =
      draft.eventVariant !== null ||
      draft.eventData !== undefined ||
      draft.inquiryMode !== null ||
      draft.currentVariantId !== undefined;
    if (hasMeaningfulState) {
      pendingDraftRef.current = draft;
      setShowResumeModal(true);
    } else {
      setListingId(params.listingId);
    }
    hasHydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset step position when the user genuinely switches between new-event and
  // select-event mode. A draft restore also changes `eventVariant` (from the
  // store's initial `null` straight to the restored value in one jump) — that
  // transition must NOT reset the step, or the restored wizardStep gets wiped
  // immediately after being set.
  useEffect(() => {
    const prev = prevEventVariantRef.current;
    prevEventVariantRef.current = eventVariant;
    if (prev === null || prev === eventVariant) return;
    setCurrentStep(0);
    setMaxReachedStep(0);
  }, [eventVariant]);

  // Persist the custom-request settings (and wizard position) as they change,
  // not just when advancing between steps. Skipped while a resume choice is
  // pending, since the store still holds blank defaults at that point.
  useEffect(() => {
    if (!hasHydratedRef.current || showResumeModal) return;
    saveDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    eventVariant,
    eventData,
    inquiryMode,
    currentVariantId,
    customRequest,
    selectedAddons,
    selectedSpaces,
    accommodation,
    breakfast,
    parking,
    wantsCatering,
    serviceTime,
    currentStep,
  ]);

  // Consent form — state managed here, passed down to review step
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentInputs>({
    defaultValues: { terms: false, gdprAndSharing: false, marketing: false },
    resolver: yupResolver(consentSchema),
  });

  // Custom request form — lifted here so trigger() can be called on "Další"
  const customRequestForm = useForm<CustomRequestFormData>({
    resolver: zodResolver(customRequestFormSchema),
    mode: "onTouched",
    defaultValues: {
      note: "",
      requirements: [],
      isOneTimeService: isOneTime,
      serviceTime: {},
    },
  });

  // Keep the schema's conditional time validation (arrival vs. from/to) in
  // sync with the listing type, which is only known once it has loaded.
  useEffect(() => {
    customRequestForm.setValue("isOneTimeService", isOneTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOneTime]);

  // New event form — deferred API call until final submit
  const newEventForm = useForm<EventFormInputs>({
    resolver: eventFormResolver,
    mode: "onChange",
    defaultValues: {
      icon: "Calendar",
      guests: { adults: 0, children: 0, ztp: false, pets: false },
      contactPerson: {
        name: "",
        email: "",
        phone: { countryCode: "420", number: "" },
      },
    },
  });

  function saveDraft() {
    const state = useOrderStore.getState();
    if (!state.listingId) return;
    const draft: OrderDraft = {
      listingId: state.listingId,
      eventVariant: state.eventVariant,
      eventData: state.eventData,
      inquiryMode: state.inquiryMode,
      currentVariantId: state.currentVariantId,
      customRequest: state.customRequest,
      selectedAddons: state.selectedAddons,
      selectedSpaces: state.selectedSpaces,
      accommodation: state.accommodation,
      breakfast: state.breakfast,
      parking: state.parking,
      wantsCatering: state.wantsCatering,
      serviceTime: state.serviceTime,
      wizardStep: currentStep,
      ...(state.eventVariant === "new-event"
        ? {
            newEventFormValues: newEventForm.getValues() as Record<
              string,
              unknown
            >,
          }
        : {}),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  const newEventFormProps = {
    control: newEventForm.control,
    errors: newEventForm.formState.errors,
    watch: newEventForm.watch,
    register: newEventForm.register,
    setValue: newEventForm.setValue,
  };

  // Auto-set custom mode when navigating to offer step with no variants
  useEffect(() => {
    const offerIndex = STEPS.findIndex((s) => s.key === "offer");
    if (currentStep === offerIndex && hasNoVariants && inquiryMode === null) {
      setInquiryMode("custom");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, hasNoVariants, inquiryMode, setInquiryMode]);

  // ── Navigation ──────────────────────────────────────────────────────────────

  function canAdvance(): boolean {
    const stepKey = STEPS[currentStep]?.key;
    if (stepKey === "event") {
      // New-event mode has no event data yet at this point — creation is
      // deferred until final submit — so choosing "new event" is enough to
      // proceed to the basic-info step.
      if (isNewEventMode) return true;
      return isOrderStepActivated(2);
    }
    if (stepKey === "offer") {
      if (isNewEventMode) {
        if (inquiryMode === "variant" && currentVariantId !== undefined)
          return true;
        if (inquiryMode === "custom" && !!customRequest?.note) return true;
        return false;
      }
      return isOrderStepActivated(3);
    }
    return false;
  }

  async function handleNext() {
    const isLastStep = currentStep === STEPS.length - 1;
    if (isLastStep) {
      handleSubmit(onConsentSubmit)();
      return;
    }

    const stepKey = STEPS[currentStep].key;

    if (stepKey === "event-basic") {
      const valid = await newEventForm.trigger(NEW_EVENT_BASIC_FIELDS);
      if (!valid) return;
      if (hasNoVariants) setInquiryMode("custom");
    } else if (stepKey === "event-location") {
      const valid = await newEventForm.trigger(
        NEW_EVENT_LOCATION_FIELDS as Parameters<typeof newEventForm.trigger>[0],
      );
      if (!valid) return;
    } else if (stepKey === "offer" && inquiryMode === "custom") {
      const valid = await customRequestForm.trigger(["note", "serviceTime"]);
      if (!valid) return;
    } else {
      if (!canAdvance()) return;
      if (stepKey === "event" && hasNoVariants) setInquiryMode("custom");
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    setMaxReachedStep(Math.max(maxReachedStep, next));
    saveDraft();
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  function handleStepClick(step: number) {
    if (step <= maxReachedStep) setCurrentStep(step);
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onConsentSubmit = async (_data: ConsentInputs) => {
    if (!listing) return;
    const isCustom = inquiryMode === "custom";
    if (!isCustom && !currentVariantId) return;

    setIsSubmitting(true);

    let finalEventId: string;

    if (isNewEventMode) {
      const formValues = newEventForm.getValues();
      try {
        const result = await createEventAsync({
          name: formValues.name,
          icon: formValues.icon ?? "Calendar",
          eventType: formValues.eventType.id,
          budget: formValues.budget,
          date: { start: formValues.startDate, end: formValues.endDate },
          guests: formValues.guests,
          contactPerson: {
            ...formValues.contactPerson,
            phone: {
              countryCode: formValues.contactPerson.phone.countryCode as "420",
              number: formValues.contactPerson.phone.number,
            },
          },
          sharing: {},
          location: {
            district: formValues.locationDistrict!.id,
            city: formValues.locationCity?.id,
            address: formValues.locationAddress,
            spaceType: formValues.locationSpaceType?.id,
            description: formValues.locationDescription,
          },
          status: "active",
        });
        finalEventId = result.doc.id;
      } catch {
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!eventData) return;
      finalEventId = eventData.id;
    }

    const price: number | null = isCustom
      ? null
      : (variants?.docs?.find((v) => v.id === currentVariantId)?.price.base ??
        null);

    const travelFeeAmount =
      calculateEstimatedPrice({
        detail: detail as Parameters<
          typeof calculateEstimatedPrice
        >[0]["detail"],
        eventData: isNewEventMode ? undefined : eventData,
        selectedAddons,
        selectedSpaces,
        accommodation,
        breakfast,
        parking,
        wantsCatering,
        serviceTime,
        listingLocation: listing.location.point,
      }).travelFeeEstimate || undefined;

    createInquiry(
      {
        listing: params.listingId,
        ...(isCustom ? {} : { variant: currentVariantId }),
        event: finalEventId,
        listingType: listing.type,
        serviceTime: serviceTime
          ? {
              ...(isOneTime
                ? { arrivalTime: serviceTime.arrivalTime }
                : {
                    startTime: serviceTime.startTime,
                    endTime: serviceTime.endTime,
                  }),
            }
          : undefined,
        travelFeeAmount,
        customRequest: isCustom
          ? {
              note: customRequest?.note,
              addons: selectedAddons.length > 0 ? selectedAddons : undefined,
              spaces: selectedSpaces.length > 0 ? selectedSpaces : undefined,
              customRequirements: customRequest?.requirements,
              accommodation: accommodation ?? undefined,
              breakfast: breakfast ?? undefined,
              parking: parking ?? undefined,
            }
          : { note: "" },
        status: {
          company: "pending",
          user: "pending",
          listing: "active",
          variant: "active",
        },
        pricing: { mode: "open", quotedPrice: price, agreedPrice: null },
        activity: {},
        user: "",
        snapshots: {},
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          resetIndices();
          clearDraft();
          setIsSuccess(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: () => setIsSubmitting(false),
      },
    );
  };

  // ── Step renderer ───────────────────────────────────────────────────────────

  function renderStep(step: InquiryStep): ReactNode {
    switch (step) {
      case "event":
        return <OrderStepSelectEvent />;

      case "event-basic":
        return (
          <OrderStepNewEventInline section="basic" {...newEventFormProps} />
        );

      case "event-location":
        return (
          <OrderStepNewEventInline
            section="location-contact"
            {...newEventFormProps}
          />
        );

      case "offer": {
        const isCustomMode = inquiryMode === "custom";
        const offerEventStart = isNewEventMode
          ? (newEventForm.watch("startDate") ?? undefined)
          : eventData?.date?.start;
        const offerEventEnd = isNewEventMode
          ? (newEventForm.watch("endDate") ?? undefined)
          : eventData?.date?.end;
        return (
          <div className="flex flex-col gap-4">
            {hasNoVariants ? (
              listing ? (
                <OrderStepFillCustomRequest
                  listing={listing}
                  control={customRequestForm.control}
                  register={customRequestForm.register}
                  setValue={customRequestForm.setValue}
                  errors={customRequestForm.formState.errors}
                  eventStart={offerEventStart}
                  eventEnd={offerEventEnd}
                  isOneTime={isOneTime}
                />
              ) : null
            ) : (
              <>
                <OrderStepSelectVariant
                  eventStart={offerEventStart}
                  eventEnd={offerEventEnd}
                  listingType={listing?.type}
                  control={customRequestForm.control}
                  setValue={customRequestForm.setValue}
                  errors={customRequestForm.formState.errors}
                />
                {isCustomMode && listing && (
                  <OrderStepFillCustomRequest
                    listing={listing}
                    control={customRequestForm.control}
                    register={customRequestForm.register}
                    setValue={customRequestForm.setValue}
                    errors={customRequestForm.formState.errors}
                    eventStart={offerEventStart}
                    eventEnd={offerEventEnd}
                    isOneTime={isOneTime}
                  />
                )}
              </>
            )}
          </div>
        );
      }

      case "review":
        return <OrderStepReviewConsents control={control} errors={errors} />;
    }
  }

  // ── Early exits ─────────────────────────────────────────────────────────────

  if (!auth.isAuthenticated) {
    return <OrderStepLogin />;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50/60 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <OrderStepSuccess />
        </div>
      </div>
    );
  }

  // ── Wizard ──────────────────────────────────────────────────────────────────

  return (
    <>
      <ResumeDraftModal
        isOpen={showResumeModal}
        onContinue={() => {
          const draft = pendingDraftRef.current;
          if (draft) {
            restoreDraft(draft);
            setCurrentStep(draft.wizardStep ?? 0);
            setMaxReachedStep(draft.wizardStep ?? 0);
            if (draft.newEventFormValues) {
              newEventForm.reset(draft.newEventFormValues as EventFormInputs);
            }
            customRequestForm.reset({
              note: draft.customRequest?.note ?? "",
              requirements: draft.customRequest?.requirements ?? [],
              isOneTimeService: isOneTime,
              serviceTime: draft.serviceTime ?? {},
            });
          }
          pendingDraftRef.current = null;
          setShowResumeModal(false);
        }}
        onStartFresh={() => {
          pendingDraftRef.current = null;
          resetIndices();
          clearDraft();
          setListingId(params.listingId);
          setCurrentStep(0);
          setMaxReachedStep(0);
          setShowResumeModal(false);
        }}
      />
      <InquiryWizardLayout
        steps={STEPS}
        currentStep={currentStep}
        maxReachedStep={maxReachedStep}
        onStepClick={handleStepClick}
        onBack={handleBack}
        onNext={handleNext}
        isLastStep={currentStep === STEPS.length - 1}
        isSubmitting={isSubmitting}
        preview={
          <InquiryPreview
            newEventControl={isNewEventMode ? newEventForm.control : undefined}
          />
        }
      >
        {renderStep(STEPS[currentStep].key)}
      </InquiryWizardLayout>
    </>
  );
}
