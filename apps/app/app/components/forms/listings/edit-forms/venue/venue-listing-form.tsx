"use client";

import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import TabFilter from "@/app/[locale]/(user)/components/tab-filter";
import Button from "@/app/components/ui/atoms/button";
import { useUnsavedChangesWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import {
  useListing,
  useListingDetail,
  useUpdateListing,
  useUpdateListingDetail,
} from "@/app/react-query/listings/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { getIdFromRelationshipField, undefinedToNull } from "@roo/common";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { toItem } from "../../utils";
import {
  GroupKey,
  hasDirtyFields,
  useListingEditFormsCommons,
} from "../common";
import { RecommendedForm } from "./recommended-form";
import {
  PriceableData,
  RecommendedData,
  SupplementaryData,
  priceableSchema,
  recommendedSchema,
  supplementarySchema,
} from "./schemas";
import { SupplementaryForm } from "./supplementary-form";
import { useListingEditFormToc } from "../toc";
import {
  BaseData,
  baseSchema,
  SimpleBaseData,
  simpleBaseSchema,
  SimpleLocalityData,
  simpleLocalitySchema,
  SimplePriceData,
  simplePriceSchema,
} from "../common-schema";
import { useCities } from "@/app/react-query/cities/hooks";
import { BaseForm } from "../common-forms/base-form";
import { SimplePriceForm } from "../common-forms/simple-price-form";
import { SimpleLocalityForm } from "../common-forms/simple-locality-form";
import { PriceableOptionsForm } from "../common-forms/priceable-options-form";
import { SimpleBaseForm } from "../common-forms/simple-base-form";

type Props = { onCancel?: () => void };

export default function VenueListingForm({ onCancel }: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();

  const { data: listing } = useListing(listingId);
  const { data: venueDetail } = useListingDetail(
    "listing-venue-details",
    getIdFromRelationshipField(listing?.detail.value || "") || "",
  );
  const {
    LISTING_FORM_TOCS,
    BASE_TOC_GROUP,
    SIMPLE_PRICE_TOC_GROUP,
    SIMPLE_LOCALITY_GROUPS,
  } = useListingEditFormToc();
  const { data: filters } = useFilterOptions();

  const { mutateAsync: updateListingAsync } = useUpdateListing(companyId);
  const { mutateAsync: updateDetailAsync } = useUpdateListingDetail(
    "listing-venue-details",
  );
  const { GROUP_TABS } = useListingEditFormsCommons();

  const { data: cities } = useCities({
    query: {
      id: {
        in: [
          listing?.location.city
            ? getIdFromRelationshipField(listing.location.city)
            : "",
        ],
      },
    },
  });
  const [activeGroup, setActiveGroup] = useState<GroupKey>("base");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const RECOMMENDED_GROUPS: readonly TocGroup[] = [
    {
      label: "Prostor",
      sections: [LISTING_FORM_TOCS.capacity, LISTING_FORM_TOCS.placeTypes],
    },
    {
      label: "Prezentace",
      sections: [LISTING_FORM_TOCS.faq, LISTING_FORM_TOCS.employees],
    },
  ];

  const PRICEABLE_GROUPS: readonly TocGroup[] = [
    {
      label: "Aktivity a vybavení",
      sections: [
        LISTING_FORM_TOCS.activities,
        LISTING_FORM_TOCS.services,
        LISTING_FORM_TOCS.amenities,
        LISTING_FORM_TOCS.technology,
        LISTING_FORM_TOCS.personnel,
      ],
    },
  ];

  const SUPPLEMENTARY_GROUPS: readonly TocGroup[] = [
    {
      label: "Logistika",
      sections: [
        LISTING_FORM_TOCS.storage,
        LISTING_FORM_TOCS.rules,
        LISTING_FORM_TOCS.access,
        LISTING_FORM_TOCS.parking,
        LISTING_FORM_TOCS.breakfast,
      ],
    },
    { label: "Ostatní", sections: [LISTING_FORM_TOCS.references] },
  ];

  const activeTocGroups =
    activeGroup === "base"
      ? BASE_TOC_GROUP
      : activeGroup === "price"
        ? SIMPLE_PRICE_TOC_GROUP
        : activeGroup === "locality"
          ? SIMPLE_LOCALITY_GROUPS
          : activeGroup === "recommended"
            ? RECOMMENDED_GROUPS
            : activeGroup === "priceable"
              ? PRICEABLE_GROUPS
              : SUPPLEMENTARY_GROUPS;

  const simpleBaseForm = useForm<SimpleBaseData>({
    resolver: zodResolver(simpleBaseSchema) as Resolver<SimpleBaseData>,
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      images: { coverImage: undefined, logo: undefined, gallery: [] },
      eventTypeSelection: { servesAll: false, types: [] },
    },
  });

  const priceForm = useForm<SimplePriceData>({
    resolver: zodResolver(simplePriceSchema) as Resolver<SimplePriceData>,
    defaultValues: {
      minimumPricePerEvent: undefined,
      price: { base: undefined, pricingUnit: undefined, seasonalPrices: [] },
    },
  });

  const localityForm = useForm<SimpleLocalityData>({
    resolver: zodResolver(simpleLocalitySchema) as Resolver<SimpleLocalityData>,
    defaultValues: {
      location: undefined,
    },
  });

  const recommendedForm = useForm<RecommendedData>({
    resolver: zodResolver(recommendedSchema) as Resolver<RecommendedData>,
    defaultValues: {
      guests: { min: undefined, max: undefined, ztp: false, pets: false },
      canBeBookedAsWhole: false,
      hasAccommodation: false,
      placeTypes: [],
      faq: [],
      employees: [],
    },
  });

  const priceableOptionsForm = useForm<PriceableData>({
    resolver: zodResolver(priceableSchema) as Resolver<PriceableData>,
    defaultValues: {
      activities: [],
      services: [],
      amenities: [],
      technologies: [],
      personnel: [],
    },
  });

  const supplementaryForm = useForm<SupplementaryData>({
    resolver: zodResolver(supplementarySchema) as Resolver<SupplementaryData>,
    defaultValues: {
      necessities: [],
      venueRules: [],
      placeTypes: [],
      storage: [],
      access: {
        vehicleTypes: [],
        loadingRamp: false,
        loadingElevator: false,
        serviceAccess: false,
        serviceArea: false,
      },
      parking: { hasParking: false, parkingIsIncludedInPrice: false },
      breakfast: {
        included: false,
        allowAccommodationWithoutBreakfast: false,
        allowMoreBreakfastsThanAccommodation: false,
        breakfastIsIncludedInPrice: false,
      },
      references: [],
    },
  });

  const anyDirty =
    hasDirtyFields(simpleBaseForm.formState.dirtyFields) ||
    hasDirtyFields(priceForm.formState.dirtyFields) ||
    hasDirtyFields(localityForm.formState.dirtyFields) ||
    hasDirtyFields(recommendedForm.formState.dirtyFields) ||
    hasDirtyFields(priceableOptionsForm.formState.dirtyFields) ||
    hasDirtyFields(supplementaryForm.formState.dirtyFields);

  const activeFormIsDirty =
    activeGroup === "base"
      ? hasDirtyFields(simpleBaseForm.formState.dirtyFields)
      : activeGroup === "price"
        ? hasDirtyFields(priceForm.formState.dirtyFields)
        : activeGroup === "locality"
          ? hasDirtyFields(localityForm.formState.dirtyFields)
          : activeGroup === "recommended"
            ? hasDirtyFields(recommendedForm.formState.dirtyFields)
            : activeGroup === "priceable"
              ? hasDirtyFields(priceableOptionsForm.formState.dirtyFields)
              : hasDirtyFields(supplementaryForm.formState.dirtyFields);

  useUnsavedChangesWarning(anyDirty);

  function handleTabChange(newTab: GroupKey) {
    if (
      activeFormIsDirty &&
      !window.confirm("Máte neuložené změny. Chcete pokračovat bez uložení?")
    )
      return;
    setActiveGroup(newTab);
  }

  const { reset: resetSimpleBase } = simpleBaseForm;
  const { reset: resetPrice } = priceForm;
  const { reset: resetLocality } = localityForm;
  const { reset: resetRecommended } = recommendedForm;
  const { reset: resetPriceable } = priceableOptionsForm;
  const { reset: resetSupplementary } = supplementaryForm;

  const resetAllForms = useCallback(() => {
    if (!listing || !venueDetail) return;

    const baseData: BaseData = {
      name: listing.name,
      shortDescription: listing.shortDescription ?? "",
      description: listing.description ?? "",
      subType: listing.subType ?? "",
      eventTypeSelection: {
        servesAll: listing.filters.allEventTypes ?? false,
        types: listing.filters.eventTypes?.map(toItem) ?? [],
      },
      images: listing.images,
    };

    const priceData: SimplePriceData = {
      minimumPricePerEvent: listing.minimumPricePerEvent,
      price: {
        base: venueDetail.price.base,
        pricingUnit: venueDetail.price.pricingUnit,
        seasonalPrices: venueDetail.price.seasonalPrices ?? [],
      },
    };

    const locality: SimpleLocalityData = {
      location: {
        address: listing.location.address ?? "",
        city: listing.location.city
          ? {
              id: getIdFromRelationshipField(listing.location.city),
              name:
                cities?.docs?.find(
                  (c) =>
                    c.id ===
                    getIdFromRelationshipField(listing.location.city as any),
                )?.name ?? "",
            }
          : { id: "", name: "" },
        coordinates: {
          latitude: listing.location.latitude,
          longitude: listing.location.longitude,
        },
      },
    };

    const recommendedData: RecommendedData = {
      guests: {
        min: listing.guests?.min ?? undefined,
        max: listing.guests?.max ?? undefined,
        ztp: listing.guests?.ztp ?? false,
        pets: listing.guests?.pets ?? false,
      },
      area: venueDetail.area,
      spacesType: venueDetail.spacesType,
      canBeBookedAsWhole: venueDetail.canBeBookedAsWhole ?? false,
      hasAccommodation: venueDetail.accomodation.hasAccommodation ?? false,
      accommodationCapacity:
        venueDetail.accomodation.accommodationCapacity ?? undefined,
      placeTypes: listing.filters.placeTypes?.map(toItem) ?? [],
      faq:
        venueDetail.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.group ?? "general",
        })) ?? [],
      employees:
        venueDetail.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image,
        })) ?? [],
    };

    const priceableData: PriceableData = {
      activities:
        venueDetail?.options.activities?.map((p) => ({
          id: getIdFromRelationshipField(p.activity),
          name:
            filters?.activities?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.activity),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      services:
        venueDetail?.options.services?.map((p) => ({
          id: getIdFromRelationshipField(p.service),
          name:
            filters?.services?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.service),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      amenities:
        venueDetail?.options.amenities?.map((p) => ({
          id: getIdFromRelationshipField(p.amenity),
          name:
            filters?.amenities?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.amenity),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      technologies:
        venueDetail?.options.technologies?.map((p) => ({
          id: getIdFromRelationshipField(p.technology),
          name:
            filters?.technologies?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.technology),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      personnel:
        venueDetail?.options.personnel?.map((p) => ({
          id: getIdFromRelationshipField(p.personnel),
          name:
            filters?.personnel?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.personnel),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
    };

    const supplementaryData: SupplementaryData = {
      necessities: listing.filters.necessities?.map(toItem) ?? [],
      venueRules: listing.filters.venueRules?.map(toItem) ?? [],
      placeTypes: listing.filters.placeTypes?.map(toItem) ?? [],
      storage:
        venueDetail.storage?.map((s) => ({ name: s.name, area: s.area })) ?? [],
      access: {
        vehicleTypes: (venueDetail.propertyAccess?.vehicleTypes ??
          []) as string[],
        loadingRamp: venueDetail.propertyAccess?.loadingRamp ?? false,
        loadingElevator: venueDetail.propertyAccess?.loadingElevator ?? false,
        serviceAccess: venueDetail.propertyAccess?.serviceAccess ?? false,
        serviceArea: venueDetail.propertyAccess?.serviceArea ?? false,
      },
      parking: {
        hasParking: venueDetail.parking?.hasParking ?? false,
        parkingCapacity: venueDetail.parking?.parkingCapacity ?? undefined,
        parkingIsIncludedInPrice:
          venueDetail.parking?.parkingIsIncludedInPrice ?? false,
        parkingPrice: venueDetail.parking?.parkingPrice ?? undefined,
      },
      breakfast: {
        included: venueDetail.breakfast?.breakfastIncluded ?? false,
        allowAccommodationWithoutBreakfast:
          venueDetail.breakfast?.allowAccommodationWithoutBreakfast ?? false,
        allowMoreBreakfastsThanAccommodation:
          venueDetail.breakfast?.allowMoreBreakfastsThanAccommodation ?? false,
        breakfastIsIncludedInPrice:
          venueDetail.breakfast?.breakfastIsIncludedInPrice ?? false,
        price: venueDetail.breakfast?.price ?? undefined,
        pricePer: venueDetail.breakfast?.priceUnit ?? undefined,
        timeFrom: venueDetail.breakfast?.timeFrom ?? undefined,
        timeTo: venueDetail.breakfast?.timeTo ?? undefined,
      },
      references:
        venueDetail.references?.map((r) => ({
          image: r.image,
          eventName: r.eventName,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType
            ? toItem(r.eventType as string | { id: string; name: string })
            : undefined,
        })) ?? [],
    };

    resetSimpleBase(baseData);
    resetPrice(priceData);
    resetLocality(locality);

    resetRecommended(recommendedData);

    resetPriceable(priceableData);

    resetSupplementary(supplementaryData);
  }, [
    listing,
    venueDetail,
    resetSimpleBase,
    resetPrice,
    resetLocality,
    resetRecommended,
    resetPriceable,
    resetSupplementary,
  ]);

  useEffect(() => {
    resetAllForms();
  }, [resetAllForms]);

  const cancelHandler = useCallback(() => {
    resetAllForms();
    onCancel && onCancel();
  }, [resetAllForms, onCancel]);

  async function onSubmitSimpleBase(data: SimpleBaseData) {
    setIsSubmitting(true);
    try {
      await updateListingAsync({
        id: listingId,
        data: undefinedToNull({
          name: data.name,
          shortDescription: data.shortDescription,
          description: data.description,
          images: data.images,
          filters: {
            allEventTypes: data.eventTypeSelection.servesAll,
            eventTypes: data.eventTypeSelection.servesAll
              ? []
              : data.eventTypeSelection.types.map((i) => i.id),
          },
        }),
      });
      resetSimpleBase(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitPrice(data: SimplePriceData) {
    if (!venueDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({
            minimumPricePerEvent: data.minimumPricePerEvent,
          }),
        }),
        updateDetailAsync({
          id: venueDetail.id,
          data: undefinedToNull({ price: data.price }),
        }),
      ]);
      resetPrice(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitLocality(data: z.infer<typeof simpleLocalitySchema>) {
    setIsSubmitting(true);
    try {
      await updateListingAsync({
        id: listingId,
        data: undefinedToNull({
          location: {
            type: "exact",
            address: data.location.address,
            city: data.location.city.id,
            latitude: data.location.coordinates.latitude,
            longitude: data.location.coordinates.longitude,
            country: "cz",
          },
        }),
      });
      resetLocality(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitRecommended(data: z.infer<typeof recommendedSchema>) {
    if (!venueDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({
            guests: data.guests,
            filters: { placeTypes: data.placeTypes.map((i) => i.id) },
          }),
        }),
        updateDetailAsync({
          id: venueDetail.id,
          data: {
            spacesType: data.spacesType,
            area: data.area,
            canBeBookedAsWhole: data.canBeBookedAsWhole,
            accomodation: {
              hasAccommodation: data.hasAccommodation,
              accommodationCapacity: data.accommodationCapacity,
            },
            faq: data.faq.map((f) => ({
              active: f.active,
              question: f.question,
              answer: f.answer,
              group: f.groupedBy,
            })),
            employees: data.employees,
          },
        }),
      ]);
      resetRecommended(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitPriceable(data: z.infer<typeof priceableSchema>) {
    if (!venueDetail) return;
    setIsSubmitting(true);
    try {
      await updateDetailAsync({
        id: venueDetail.id,
        data: {
          options: {
            activities: data.activities.map((p) => ({
              activity: p.id,
              name: p.name,
              pricingUnit: p.pricingUnit,
              unitPrice: p.unitPrice,
              quantity: p.quantity,
            })),
            services: data.services.map((p) => ({
              service: p.id,
              name: p.name,
              pricingUnit: p.pricingUnit,
              unitPrice: p.unitPrice,
              quantity: p.quantity,
            })),
            amenities: data.amenities.map((p) => ({
              amenity: p.id,
              name: p.name,
              pricingUnit: p.pricingUnit,
              unitPrice: p.unitPrice,
              quantity: p.quantity,
            })),
            technologies: data.technologies.map((p) => ({
              technology: p.id,
              name: p.name,
              pricingUnit: p.pricingUnit,
              unitPrice: p.unitPrice,
              quantity: p.quantity,
            })),
            personnel: data.personnel.map((p) => ({
              personnel: p.id,
              name: p.name,
              pricingUnit: p.pricingUnit,
              unitPrice: p.unitPrice,
              quantity: p.quantity,
            })),
          },
        },
      });
      resetPriceable(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitSupplementary(
    data: z.infer<typeof supplementarySchema>,
  ) {
    if (!venueDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({
            filters: {
              necessities: data.necessities.map((i) => i.id),
              venueRules: data.venueRules.map((i) => i.id),
              placeTypes: data.placeTypes.map((i) => i.id),
            },
          }),
        }),
        updateDetailAsync({
          id: venueDetail.id,
          data: {
            storage: data.storage,
            propertyAccess: data.access
              ? {
                  ...data.access,
                  vehicleTypes: data.access.vehicleTypes as (
                    | "car"
                    | "truck"
                    | "van"
                    | "bus"
                  )[],
                }
              : {},
            parking: data.parking ?? {},
            breakfast: data.breakfast
              ? {
                  breakfastIncluded: data.breakfast.included,
                  allowAccommodationWithoutBreakfast:
                    data.breakfast.allowAccommodationWithoutBreakfast,
                  allowMoreBreakfastsThanAccommodation:
                    data.breakfast.allowMoreBreakfastsThanAccommodation,
                  breakfastIsIncludedInPrice:
                    data.breakfast.breakfastIsIncludedInPrice,
                  price: data.breakfast.price,
                  priceUnit: data.breakfast.pricePer,
                  timeFrom: data.breakfast.timeFrom,
                  timeTo: data.breakfast.timeTo,
                }
              : {},
            references: data.references.map((r) => ({
              ...r,
              eventType: r.eventType ? r.eventType.id : undefined,
            })),
          },
        }),
      ]);
      resetSupplementary(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitConfig = {
    base: simpleBaseForm.handleSubmit(onSubmitSimpleBase),
    price: priceForm.handleSubmit(onSubmitPrice),
    locality: localityForm.handleSubmit(onSubmitLocality),
    recommended: recommendedForm.handleSubmit(onSubmitRecommended),
    priceable: priceableOptionsForm.handleSubmit(onSubmitPriceable),
    supplementary: supplementaryForm.handleSubmit(onSubmitSupplementary),
  };

  return (
    <form
      onSubmit={submitConfig[activeGroup]}
      className="flex gap-6"
      noValidate
    >
      <div className="flex w-full flex-col gap-4">
        <TabFilter
          tabs={GROUP_TABS}
          activeTab={activeGroup}
          onChange={handleTabChange}
        />

        <SimpleBaseForm
          form={simpleBaseForm}
          isActive={activeGroup === "base"}
          filters={filters}
          texts={{
            basic: LISTING_FORM_TOCS.basic,
            images: LISTING_FORM_TOCS.images,
            eventTypes: LISTING_FORM_TOCS.eventTypes,
          }}
        />
        <SimplePriceForm
          form={priceForm}
          isActive={activeGroup === "price"}
          texts={{
            price: LISTING_FORM_TOCS.price,
            seasonalPrices: LISTING_FORM_TOCS.seasonalPrices,
          }}
        />
        <SimpleLocalityForm
          form={localityForm}
          isActive={activeGroup === "locality"}
          texts={{
            location: LISTING_FORM_TOCS.location,
          }}
        />
        <RecommendedForm
          form={recommendedForm}
          isActive={activeGroup === "recommended"}
          filters={filters}
          texts={{
            capacity: LISTING_FORM_TOCS.capacity,
            placeTypes: LISTING_FORM_TOCS.placeTypes,
            faq: LISTING_FORM_TOCS.faq,
            employees: LISTING_FORM_TOCS.employees,
          }}
        />
        <PriceableOptionsForm
          form={priceableOptionsForm}
          isActive={activeGroup === "priceable"}
          sections={[
            {
              toc: LISTING_FORM_TOCS.activities,
              field: "activities",
              items: filters?.activities ?? [],
              label: "Aktivity",
            },
            {
              toc: LISTING_FORM_TOCS.services,
              field: "services",
              items: filters?.services ?? [],
              label: "Služby",
            },
            {
              toc: LISTING_FORM_TOCS.amenities,
              field: "amenities",
              items: filters?.amenities ?? [],
              label: "Vybavení",
            },
            {
              toc: LISTING_FORM_TOCS.technology,
              field: "technologies",
              items: filters?.technologies ?? [],
              label: "Technologie",
            },
            {
              toc: LISTING_FORM_TOCS.personnel,
              field: "personnel",
              items: filters?.personnel ?? [],
              label: "Personál",
            },
          ]}
        />
        <SupplementaryForm
          form={supplementaryForm}
          isActive={activeGroup === "supplementary"}
          filters={filters}
          texts={{
            access: LISTING_FORM_TOCS.access,
            parking: LISTING_FORM_TOCS.parking,
            breakfast: LISTING_FORM_TOCS.breakfast,
            references: LISTING_FORM_TOCS.references,
            storage: LISTING_FORM_TOCS.storage,
            rules: LISTING_FORM_TOCS.rules,
          }}
        />

        <div className="flex justify-end gap-3 pt-2">
          {activeFormIsDirty && (
            <>
              <Button
                htmlType="button"
                text="Zrušit"
                onClick={cancelHandler}
                version="plainFull"
              />
              <Button
                text="Uložit"
                version="listingFull"
                htmlType="submit"
                disabled={isSubmitting}
              />
            </>
          )}
        </div>
      </div>

      <FormToc
        textColor="text-listing"
        dotColor="text-listing"
        surfaceColor="bg-listing-surface"
        groups={activeTocGroups}
        sticky={true}
        buttonVersion="listingFull"
        buttonText="Uložit"
        showControlButtons={activeFormIsDirty}
        onCancelButtonClick={cancelHandler}
      />
    </form>
  );
}
