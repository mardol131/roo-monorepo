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
import { toIds, toItem } from "../../utils";
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
import {
  GroupKey,
  hasDirtyFields,
  useListingEditFormsCommons,
} from "../common";
import { useListingEditFormToc } from "../toc";
import { PriceableOptionsForm } from "../common-forms/priceable-options-form";
import { FullLocalityForm } from "../common-forms/full-locality-form";
import { BaseForm } from "../common-forms/base-form";
import { FullPriceForm } from "../common-forms/full-price-form";
import {
  BaseData,
  baseSchema,
  FullLocalityData,
  fullLocalitySchema,
  FullPriceData,
  fullPriceSchema,
} from "../common-schema";
import { useCities } from "@/app/react-query/cities/hooks";

type Props = { onCancel?: () => void };

export default function GastroListingForm({ onCancel }: Props) {
  const {
    LISTING_FORM_TOCS,
    BASE_TOC_GROUP,
    FULL_PRICE_TOC_GROUP,
    FULL_LOCALITY_GROUPS,
  } = useListingEditFormToc();
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();

  const { data: listing } = useListing(listingId);
  const { data: gastroDetail } = useListingDetail(
    "listing-gastro-details",
    listing ? getIdFromRelationshipField(listing.detail.value) : undefined,
  );
  const { data: filters } = useFilterOptions();

  const { mutateAsync: updateListingAsync } = useUpdateListing(companyId);
  const { mutateAsync: updateDetailAsync } = useUpdateListingDetail(
    "listing-gastro-details",
  );
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

  const RECOMMENDED_GROUPS: readonly TocGroup[] = [
    { label: "Kapacita", sections: [LISTING_FORM_TOCS.capacity] },
    {
      label: "Prezentace",
      sections: [LISTING_FORM_TOCS.faq, LISTING_FORM_TOCS.employees],
    },
  ];

  const PRICEABLE_GROUPS: readonly TocGroup[] = [
    {
      label: "Nabídka",
      sections: [
        LISTING_FORM_TOCS.cuisines,
        LISTING_FORM_TOCS.personnel,
        LISTING_FORM_TOCS.services,
        LISTING_FORM_TOCS.foodPreparationStyles,
      ],
    },
  ];

  const SUPPLEMENTARY_GROUPS: readonly TocGroup[] = [
    {
      label: "Vybavení",
      sections: [LISTING_FORM_TOCS.personnel, LISTING_FORM_TOCS.necessities],
    },
    {
      label: "Ostatní",
      sections: [LISTING_FORM_TOCS.gastroRules, LISTING_FORM_TOCS.references],
    },
  ];

  const [activeGroup, setActiveGroup] = useState<GroupKey>("base");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { GROUP_TABS } = useListingEditFormsCommons();

  const activeTocGroups =
    activeGroup === "base"
      ? BASE_TOC_GROUP
      : activeGroup === "price"
        ? FULL_PRICE_TOC_GROUP
        : activeGroup === "locality"
          ? FULL_LOCALITY_GROUPS
          : activeGroup === "recommended"
            ? RECOMMENDED_GROUPS
            : activeGroup === "priceable"
              ? PRICEABLE_GROUPS
              : SUPPLEMENTARY_GROUPS;

  const baseForm = useForm<BaseData>({
    resolver: zodResolver(baseSchema) as Resolver<BaseData>,
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      subType: "",
      images: { coverImage: undefined, logo: undefined, gallery: [] },
      eventTypeSelection: { servesAll: false, types: [] },
    },
  });

  const priceForm = useForm<FullPriceData>({
    resolver: zodResolver(fullPriceSchema) as Resolver<FullPriceData>,
    defaultValues: {
      minimumPricePerEvent: undefined,
      price: {
        base: undefined,
        seasonalPrices: [],
        travelFeeEnabled: false,
        travelFeePerKm: undefined,
        travelFeeStartsAtKm: undefined,
        travelFeeType: undefined,
        pricingUnit: undefined,
      },
    },
  });

  const localityForm = useForm<FullLocalityData>({
    resolver: zodResolver(fullLocalitySchema) as Resolver<FullLocalityData>,
    defaultValues: {
      servicableArea: { regions: [], districts: [], cities: [] },
      location: undefined,
    },
  });

  const recommendedForm = useForm<RecommendedData>({
    resolver: zodResolver(recommendedSchema) as Resolver<RecommendedData>,
    defaultValues: {
      guests: { min: undefined, max: undefined, ztp: false, pets: false },
      faq: [],
      employees: [],
      alcohol: {
        servesAlcohol: false,
      },
    },
  });

  const priceableOptionsForm = useForm<PriceableData>({
    resolver: zodResolver(priceableSchema) as Resolver<PriceableData>,
    defaultValues: {
      cuisines: [],
      services: [],
      personnel: [],
      foodPreparationStyles: [],
    },
  });

  const supplementaryForm = useForm<SupplementaryData>({
    resolver: zodResolver(supplementarySchema) as Resolver<SupplementaryData>,
    defaultValues: {
      dishTypes: [],
      dietaryOptions: [],
      necessities: [],
      gastroRules: [],
      references: [],
    },
  });

  const anyDirty =
    hasDirtyFields(baseForm.formState.dirtyFields) ||
    hasDirtyFields(priceForm.formState.dirtyFields) ||
    hasDirtyFields(localityForm.formState.dirtyFields) ||
    hasDirtyFields(recommendedForm.formState.dirtyFields) ||
    hasDirtyFields(priceableOptionsForm.formState.dirtyFields) ||
    hasDirtyFields(supplementaryForm.formState.dirtyFields);

  const activeFormIsDirty =
    activeGroup === "base"
      ? hasDirtyFields(baseForm.formState.dirtyFields)
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

  const { reset: resetBase } = baseForm;
  const { reset: resetPrice } = priceForm;
  const { reset: resetLocality } = localityForm;
  const { reset: resetRecommended } = recommendedForm;
  const { reset: resetPriceable } = priceableOptionsForm;
  const { reset: resetSupplementary } = supplementaryForm;

  const resetAllForms = useCallback(() => {
    if (!listing || !gastroDetail) return;

    const baseResetData: BaseData = {
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

    const priceResetData: FullPriceData = {
      minimumPricePerEvent: listing.minimumPricePerEvent,
      price: {
        base: gastroDetail.price.base,
        seasonalPrices: gastroDetail.price.seasonalPrices ?? [],
        travelFeeEnabled: gastroDetail.price.travelFeeEnabled ?? false,
        travelFeePerKm: gastroDetail.price.travelFeePerKm ?? undefined,
        travelFeeStartsAtKm:
          gastroDetail.price.travelFeeStartsAtKm ?? undefined,
        travelFeeType: gastroDetail.price.travelFeeType ?? undefined,
        pricingUnit: gastroDetail.price.pricingUnit,
      },
    };
    const locality: FullLocalityData = {
      servicableArea: {
        wholeCountry: listing.servicableArea.wholeCountry ?? false,
        regions: listing.servicableArea.regions?.map(toItem) ?? [],
        districts: listing.servicableArea.districts?.map(toItem) ?? [],
        cities: listing.servicableArea.cities?.map(toItem) ?? [],
      },
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
        max: listing.guests?.max ?? 0,
        ztp: listing.guests?.ztp ?? false,
        pets: listing.guests?.pets ?? false,
      },
      faq:
        gastroDetail.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.group ?? "general",
        })) ?? [],
      employees:
        gastroDetail.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image,
        })) ?? [],
      alcohol: gastroDetail.alcohol,
      setupAndTearDown: {
        setupTime: gastroDetail.setupAndTearDown?.setupTime ?? undefined,
        tearDownTime: gastroDetail.setupAndTearDown?.tearDownTime ?? undefined,
      },
    };

    const priceableOptionsData: PriceableData = {
      cuisines:
        gastroDetail.options.cuisines?.map((p) => ({
          id: getIdFromRelationshipField(p.cuisine),
          name:
            filters?.cuisines?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.cuisine),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      foodPreparationStyles:
        gastroDetail.options.foodPreparationStyles?.map((p) => ({
          id: getIdFromRelationshipField(p.foodPreparationStyle),
          name:
            filters?.foodPreparationStyles?.find(
              (pr) =>
                pr.id === getIdFromRelationshipField(p.foodPreparationStyle),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      services:
        gastroDetail.options.services?.map((p) => ({
          id: getIdFromRelationshipField(p.service),
          name:
            filters?.services?.find(
              (pr) => pr.id === getIdFromRelationshipField(p.service),
            )?.name ?? "",
          pricingUnit: p.pricingUnit,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        })) ?? [],
      personnel:
        gastroDetail.options.personnel?.map((p) => ({
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

    const suplementaryData: SupplementaryData = {
      necessities: listing.filters.necessities?.map(toItem) ?? [],
      gastroRules: listing.filters.gastroRules?.map(toItem) ?? [],
      references:
        gastroDetail.references?.map((r) => ({
          image: r.image,
          eventName: r.eventName ?? undefined,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType ? toItem(r.eventType) : undefined,
        })) ?? [],
      dishTypes: listing.filters.dishTypes?.map(toItem) ?? [],
      dietaryOptions: listing.filters.dietaryOptions?.map(toItem) ?? [],
    };

    resetBase(baseResetData);
    resetPrice(priceResetData);
    resetLocality(locality);
    resetRecommended(recommendedData);
    resetPriceable(priceableOptionsData);
    resetSupplementary(suplementaryData);
  }, [
    listing,
    gastroDetail,
    cities,
    filters,
    resetBase,
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

  async function onSubmitBase(data: BaseData) {
    setIsSubmitting(true);
    try {
      await updateListingAsync({
        id: listingId,
        data: undefinedToNull({
          name: data.name,
          shortDescription: data.shortDescription,
          description: data.description,
          subType: data.subType,
          images: data.images,
          filters: {
            allEventTypes: data.eventTypeSelection.servesAll,
            eventTypes: data.eventTypeSelection.servesAll
              ? []
              : toIds(data.eventTypeSelection.types),
          },
        }),
      });
      resetBase(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitPrice(data: FullPriceData) {
    if (!gastroDetail) return;
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
          id: gastroDetail.id,
          data: undefinedToNull({ price: data.price }),
        }),
      ]);
      resetPrice(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitRecommended(data: z.infer<typeof recommendedSchema>) {
    if (!gastroDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({ guests: data.guests }),
        }),
        updateDetailAsync({
          id: gastroDetail.id,
          data: {
            faq: data.faq.map((f) => ({
              ...f,
              group: f.groupedBy,
              groupedBy: undefined,
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

  async function onSubmitLocality(data: FullLocalityData) {
    setIsSubmitting(true);
    try {
      await updateListingAsync({
        id: listingId,
        data: undefinedToNull({
          servicableArea: {
            wholeCountry: data.servicableArea.wholeCountry,
            regions: toIds(data.servicableArea.regions),
            districts: toIds(data.servicableArea.districts),
            cities: toIds(data.servicableArea.cities),
          },
          location: {
            address: data.location.address,
            latitude: data.location.coordinates.latitude,
            longitude: data.location.coordinates.longitude,
            city: data.location.city?.id,
          },
        }),
      });
      resetLocality(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitPriceable(data: z.infer<typeof priceableSchema>) {
    if (!gastroDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateDetailAsync({
          id: listingId,
          data: undefinedToNull({
            options: {
              personnel: data.personnel.map((p) => ({
                personnel: p.id,
                name: p.name,
                pricingUnit: p.pricingUnit,
                unitPrice: p.unitPrice,
                quantity: p.quantity,
              })),
              cuisines: data.cuisines.map((p) => ({
                cuisine: p.id,
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
              foodPreparationStyles: data.foodPreparationStyles.map((p) => ({
                foodPreparationStyle: p.id,
                name: p.name,
                pricingUnit: p.pricingUnit,
                unitPrice: p.unitPrice,
                quantity: p.quantity,
              })),
            },
          }),
        }),
      ]);
      resetPriceable(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitSupplementary(
    data: z.infer<typeof supplementarySchema>,
  ) {
    if (!gastroDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({
            filters: {
              necessities: toIds(data.necessities),
              gastroRules: toIds(data.gastroRules),
            },
          }),
        }),
        updateDetailAsync({
          id: gastroDetail.id,
          data: {
            references: data.references.map((r) => ({
              ...r,
              eventType: r.eventType?.id ?? null,
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
    base: baseForm.handleSubmit(onSubmitBase),
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

        <BaseForm
          form={baseForm}
          isActive={activeGroup === "base"}
          filters={filters}
          texts={{
            basic: LISTING_FORM_TOCS.basic,
            images: LISTING_FORM_TOCS.images,
            eventTypes: LISTING_FORM_TOCS.eventTypes,
          }}
        />
        <FullPriceForm
          form={priceForm}
          isActive={activeGroup === "price"}
          texts={{
            price: LISTING_FORM_TOCS.price,
            seasonalPrices: LISTING_FORM_TOCS.seasonalPrices,
          }}
        />
        <FullLocalityForm
          form={localityForm}
          isActive={activeGroup === "locality"}
          texts={{
            location: LISTING_FORM_TOCS.location,
            servicableArea: LISTING_FORM_TOCS.servicableArea,
          }}
        />
        <RecommendedForm
          form={recommendedForm}
          isActive={activeGroup === "recommended"}
          texts={{
            setupAndTearDown: LISTING_FORM_TOCS.setupAndTearDown,
            alcohol: LISTING_FORM_TOCS.alcohol,
            guests: LISTING_FORM_TOCS.guests,
            faq: LISTING_FORM_TOCS.faq,
            employees: LISTING_FORM_TOCS.employees,
          }}
        />
        <PriceableOptionsForm
          form={priceableOptionsForm}
          isActive={activeGroup === "priceable"}
          sections={[
            {
              toc: LISTING_FORM_TOCS.personnel,
              field: "personnel",
              items: filters?.personnel ?? [],
              label: "Personál",
            },
            {
              toc: LISTING_FORM_TOCS.cuisines,
              field: "cuisines",
              items: filters?.cuisines ?? [],
              label: "Kuchyně",
            },
            {
              toc: LISTING_FORM_TOCS.services,
              field: "services",
              items: filters?.services ?? [],
              label: "Služby",
            },
            {
              toc: LISTING_FORM_TOCS.foodPreparationStyles,
              field: "foodPreparationStyles",
              items: filters?.foodPreparationStyles ?? [],
              label: "Technologie",
            },
          ]}
        />
        <SupplementaryForm
          form={supplementaryForm}
          isActive={activeGroup === "supplementary"}
          filters={filters}
          texts={{
            references: LISTING_FORM_TOCS.references,
            dishTypes: LISTING_FORM_TOCS.dishTypes,
            necessities: LISTING_FORM_TOCS.necessities,
            dietaryOptions: LISTING_FORM_TOCS.dietaryOptions,
            gastroRules: LISTING_FORM_TOCS.gastroRules,
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
