"use client";

import FormToc, { TocGroup } from "@/app/[locale]/(user)/components/form-toc";
import TabFilter from "@/app/[locale]/(user)/components/tab-filter";
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
import { PriceableOptionsForm } from "../common-forms/priceable-options-form";
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
import Button from "@/app/components/ui/atoms/button";
import {
  GroupKey,
  hasDirtyFields,
  useListingEditFormsCommons,
} from "../common";
import { useCities } from "@/app/react-query/cities/hooks";
import {
  BaseData,
  baseSchema,
  FullLocalityData,
  fullLocalitySchema,
  FullPriceData,
  fullPriceSchema,
} from "../common-schema";
import { BaseForm } from "../common-forms/base-form";
import { FullPriceForm } from "../common-forms/full-price-form";
import { FullLocalityForm } from "../common-forms/full-locality-form";

type Props = { onCancel?: () => void };

export default function EntertainmentListingForm({ onCancel }: Props) {
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
  const { data: entertainmentDetail } = useListingDetail(
    "listing-entertainment-details",
    listing ? getIdFromRelationshipField(listing.detail.value) : undefined,
  );
  const { data: filters } = useFilterOptions();

  const { mutateAsync: updateListingAsync } = useUpdateListing(companyId);
  const { mutateAsync: updateDetailAsync } = useUpdateListingDetail(
    "listing-entertainment-details",
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

  const ENTERTAINMENT_RECOMMENDED_GROUPS: readonly TocGroup[] = [
    {
      label: "Vystoupení",
      sections: [
        LISTING_FORM_TOCS.capacity,
        LISTING_FORM_TOCS.audience,
        LISTING_FORM_TOCS.logistics,
      ],
    },
    {
      label: "Prezentace",
      sections: [LISTING_FORM_TOCS.faq, LISTING_FORM_TOCS.employees],
    },
  ];

  const PRICEABLE_GROUPS: readonly TocGroup[] = [
    {
      label: "Personál",
      sections: [
        LISTING_FORM_TOCS.personnel,
        LISTING_FORM_TOCS.services,
        LISTING_FORM_TOCS.technologies,
        LISTING_FORM_TOCS.activities,
      ],
    },
  ];

  const SUPPLEMENTARY_GROUPS: readonly TocGroup[] = [
    { label: "Vybavení", sections: [LISTING_FORM_TOCS.necessities] },
    {
      label: "Ostatní",
      sections: [LISTING_FORM_TOCS.rules, LISTING_FORM_TOCS.references],
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
            ? ENTERTAINMENT_RECOMMENDED_GROUPS
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
      audience: [],
      setupAndTearDown: { setupTime: undefined, tearDownTime: undefined },
      faq: [],
      employees: [],
    },
  });

  const priceableOptionsForm = useForm<PriceableData>({
    resolver: zodResolver(priceableSchema) as Resolver<PriceableData>,
    defaultValues: { technologies: [], services: [] },
  });

  const supplementaryForm = useForm<SupplementaryData>({
    resolver: zodResolver(supplementarySchema) as Resolver<SupplementaryData>,
    defaultValues: {
      necessities: [],
      entertainmentRules: [],
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
    if (!listing || !entertainmentDetail) return;

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
        base: entertainmentDetail.price.base,
        seasonalPrices: entertainmentDetail.price.seasonalPrices ?? [],
        travelFeeEnabled: entertainmentDetail.price.travelFeeEnabled ?? false,
        travelFeePerKm: entertainmentDetail.price.travelFeePerKm ?? undefined,
        travelFeeStartsAtKm:
          entertainmentDetail.price.travelFeeStartsAtKm ?? undefined,
        travelFeeType: entertainmentDetail.price.travelFeeType ?? undefined,
        pricingUnit: entertainmentDetail.price.pricingUnit,
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
        max: listing.guests?.max ?? undefined,
        ztp: listing.guests?.ztp ?? false,
        pets: listing.guests?.pets ?? false,
      },
      audience: (entertainmentDetail.audience ?? []) as (
        | "adults"
        | "kids"
        | "seniors"
      )[],
      setupAndTearDown: {
        setupTime: entertainmentDetail.setupAndTearDown?.setupTime ?? undefined,
        tearDownTime:
          entertainmentDetail.setupAndTearDown?.tearDownTime ?? undefined,
      },
      employees:
        entertainmentDetail.employees?.map((e) => ({
          name: e.name,
          role: e.role,
          description: e.description ?? undefined,
          image: e.image,
        })) ?? [],
      faq:
        entertainmentDetail.faq?.map((f) => ({
          active: f.active ?? true,
          question: f.question,
          answer: f.answer,
          groupedBy: f.group ?? "general",
        })) ?? [],
    };
    const priceableData: PriceableData = {
      technologies:
        entertainmentDetail?.options.technologies?.map((t) => ({
          id: getIdFromRelationshipField(t.technology),
          name:
            filters?.technologies?.find(
              (tr) => tr.id === getIdFromRelationshipField(t.technology),
            )?.name ?? "",
          pricingUnit: t.pricingUnit,
          unitPrice: t.unitPrice,
          quantity: t.quantity,
        })) ?? [],

      services:
        entertainmentDetail?.options.services?.map((s) => ({
          id: getIdFromRelationshipField(s.service),
          name:
            filters?.services?.find(
              (sr) => sr.id === getIdFromRelationshipField(s.service),
            )?.name ?? "",
          pricingUnit: s.pricingUnit,
          unitPrice: s.unitPrice,
          quantity: s.quantity,
        })) ?? [],
    };
    const supplementaryData: SupplementaryData = {
      necessities: listing.filters.necessities?.map(toItem) ?? [],
      musicGenres: listing.filters.musicGenres?.map(toItem) ?? [],
      entertainmentRules: listing.filters.entertainmentRules?.map(toItem) ?? [],
      references:
        entertainmentDetail.references?.map((r) => ({
          image: r.image,
          eventName: r.eventName ?? undefined,
          description: r.description ?? undefined,
          clientName: r.clientName ?? undefined,
          eventType: r.eventType ? toItem(r.eventType) : undefined,
        })) ?? [],
    };

    resetBase(baseResetData);
    resetPrice(priceResetData);
    resetLocality(locality);
    resetRecommended(recommendedData);
    resetPriceable(priceableData);
    resetSupplementary(supplementaryData);
  }, [
    listing,
    entertainmentDetail,
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
    if (!entertainmentDetail) return;
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
          id: entertainmentDetail.id,
          data: undefinedToNull({ price: data.price }),
        }),
      ]);
      resetPrice(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitRecommended(data: z.infer<typeof recommendedSchema>) {
    if (!entertainmentDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({
            guests: data.guests,
          }),
        }),
        updateDetailAsync({
          id: entertainmentDetail.id,
          data: {
            audience: data.audience,
            setupAndTearDown: data.setupAndTearDown,
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

  async function onSubmitPriceable(data: z.infer<typeof priceableSchema>) {
    setIsSubmitting(true);
    try {
      await updateDetailAsync({
        id: entertainmentDetail?.id ?? "",
        data: {
          options: {
            technologies: data.technologies.map((p) => ({
              technology: p.id,
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
    if (!entertainmentDetail) return;
    setIsSubmitting(true);
    try {
      await Promise.all([
        updateListingAsync({
          id: listingId,
          data: undefinedToNull({
            filters: {
              necessities: toIds(data.necessities),
              entertainmentRules: toIds(data.entertainmentRules),
            },
          }),
        }),
        updateDetailAsync({
          id: entertainmentDetail.id,
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
            capacity: LISTING_FORM_TOCS.capacity,
            audience: LISTING_FORM_TOCS.audience,
            logistics: LISTING_FORM_TOCS.logistics,
            faq: LISTING_FORM_TOCS.faq,
            employees: LISTING_FORM_TOCS.employees,
          }}
        />
        <PriceableOptionsForm
          form={priceableOptionsForm}
          isActive={activeGroup === "priceable"}
          sections={[
            {
              toc: LISTING_FORM_TOCS.services,
              field: "services",
              items: filters?.services ?? [],
              label: "Služby",
            },
            {
              toc: LISTING_FORM_TOCS.technologies,
              field: "technologies",
              items: filters?.technologies ?? [],
              label: "Technologie",
            },
          ]}
        />
        <SupplementaryForm
          form={supplementaryForm}
          isActive={activeGroup === "supplementary"}
          filters={filters}
          texts={{
            necessities: LISTING_FORM_TOCS.necessities,
            rules: LISTING_FORM_TOCS.rules,
            references: LISTING_FORM_TOCS.references,
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
