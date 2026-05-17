"use client";

import BusinessProfile from "./components/business-profile";
import CustomSection from "./components/custom-section";
import FAQSection from "./components/faq-section";
import HeroImageSection from "./components/hero-image-section";
import ListingBasicsSection from "./components/detail/listing-basics-section";
import ListingDescriptionSection from "./components/detail/listing-description-section";
import ListingDetailSection from "./components/detail/listing-detail-section";
import ListingLocationSection from "./components/detail/listing-location-section";
import ListingHeader from "./components/listing-header";
import EmployeesSection from "./components/employees-section";
import ReferencesSection from "./components/references-section";
import OrderBox from "./components/order-box";
import SectionWrapper from "./components/section-wrapper";
import VariantsSection from "./components/variants-section";
import {
  useListing,
  useListingsByCompany,
} from "@/app/react-query/listings/hooks";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useParams } from "next/navigation";
import Loader from "@/app/[locale]/(user)/components/loader";
import {
  Company,
  Listing,
  DEFAULT_SECTION_ORDER,
  FIXED_SECTION_KEYS,
  FixedSectionKey,
} from "@roo/common";
import React from "react";

function isFixedSectionKey(k: string): k is FixedSectionKey {
  return FIXED_SECTION_KEYS.includes(k as FixedSectionKey);
}

function buildOrderedKeys(
  sectionOrder: Listing["sectionOrder"],
  customSections: Listing["customSections"],
): string[] {
  // accept both Payload block id and blockName as valid keys
  const validCustomKeys = new Set<string>();
  for (const s of customSections ?? []) {
    if (s.id) validCustomKeys.add(s.id);
    if (s.blockName) validCustomKeys.add(s.blockName);
  }

  if (!sectionOrder || sectionOrder.length === 0) {
    return [...DEFAULT_SECTION_ORDER];
  }

  const stored = sectionOrder.map((s) => s.key);
  const missingFixed = FIXED_SECTION_KEYS.filter((k) => !stored.includes(k));
  const valid = stored.filter((k) => isFixedSectionKey(k) || validCustomKeys.has(k));

  return [...valid, ...missingFixed];
}

export default function Page() {
  const { listingId } = useParams<{ listingId: string }>();

  const { data: listing, isLoading: isLoadingListing } = useListing(listingId);
  const { data: variants, isLoading: isLoadingVariants } = useVariantsByListing(
    listingId ?? "",
  );
  const company =
    typeof listing?.company !== "string"
      ? (listing?.company as Company | undefined)
      : undefined;

  if (isLoadingListing || isLoadingVariants)
    return <Loader text="Načítáme inzerát..." />;
  if (!listing) return null;

  const employees = listing.employees ?? [];
  const references = listing.references ?? [];
  const customSections = listing.customSections ?? [];
  const orderedKeys = buildOrderedKeys(listing.sectionOrder, listing.customSections);

  const sectionRenderers: Record<FixedSectionKey, () => React.ReactNode | null> = {
    description: () => <ListingDescriptionSection listing={listing} />,
    location: () => <ListingLocationSection listing={listing} />,
    basics: () => <ListingBasicsSection listing={listing} />,
    detail: () => <ListingDetailSection listing={listing} />,
    employees: () =>
      employees.length > 0 ? (
        <SectionWrapper title="Náš tým">
          <EmployeesSection employees={employees} />
        </SectionWrapper>
      ) : null,
    references: () =>
      references.length > 0 ? (
        <SectionWrapper title="Reference">
          <ReferencesSection references={references} />
        </SectionWrapper>
      ) : null,
    faq: () =>
      listing.faq?.some((f) => f.active !== false) ? (
        <SectionWrapper title="Časté otázky">
          <FAQSection faqs={listing.faq} />
        </SectionWrapper>
      ) : null,
    company: () =>
      company ? (
        <SectionWrapper>
          <BusinessProfile companyId={company.id} />
        </SectionWrapper>
      ) : null,
  };

  return (
    <div className="flex justify-center w-full px-6 py-10">
      <div className="w-full flex flex-col max-w-listing-page pb-20">
        <HeroImageSection
          coverImage={listing.images.coverImage.filename}
          gallery={listing.images.gallery.map((img) => img.filename)}
        />
        <ListingHeader listing={listing} />
        <div className="grid grid-cols-[1fr_400px] gap-6 mt-10">
          <div className="min-h-screen flex flex-col w-full gap-15">
            {orderedKeys.map((key) => {
              if (isFixedSectionKey(key)) {
                return (
                  <React.Fragment key={key}>
                    {sectionRenderers[key]()}
                  </React.Fragment>
                );
              }
              const custom = customSections.find((s) => s.id === key || s.blockName === key);
              if (!custom) return null;
              return (
                <SectionWrapper key={key} title={custom.title ?? undefined}>
                  <CustomSection section={custom} />
                </SectionWrapper>
              );
            })}
          </div>
          <div>
            <OrderBox startingPrice={listing.price.startsAt} />
          </div>
        </div>
        {variants?.docs && variants.docs.length > 0 && (
          <div className="mt-10">
            <VariantsSection />
          </div>
        )}
      </div>
    </div>
  );
}
