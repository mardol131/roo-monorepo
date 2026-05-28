"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import Button from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";
import { useListing, useListingDetail } from "@/app/react-query/listings/hooks";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import {
  Company,
  DEFAULT_SECTION_ORDER,
  FIXED_SECTION_KEYS,
  FixedSectionKey,
  ListingVenueDetail,
  User,
  getIdFromRelationshipField,
} from "@roo/common";
import { useParams } from "next/navigation";
import React, { useCallback } from "react";
import BusinessProfile from "./components/business-profile";
import CustomSection from "./components/custom-section";
import ListingBasicsSection from "./components/detail/listing-basics-section";
import ListingDescriptionSection from "./components/detail/listing-description-section";
import ListingDetailSection from "./components/detail/listing-detail-section";
import ListingLocationSection from "./components/detail/listing-location-section";
import EmployeesSection from "./components/employees-section";
import FAQSection from "./components/faq-section";
import HeroImageSection from "./components/hero-image-section";
import ListingAdminSection from "./components/listing-admin-section";
import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { EyeOff } from "lucide-react";
import ListingHeader from "./components/listing-header";
import OrderBox from "./components/order-box";
import ReferencesSection from "./components/references-section";
import SectionWrapper from "./components/section-wrapper";
import VariantsSection from "./components/variants-section";
import { useAuth } from "@/app/context/auth/auth-context";
import { useCompany } from "@/app/react-query/companies/hooks";

function isFixedSectionKey(k: string): k is FixedSectionKey {
  return FIXED_SECTION_KEYS.includes(k as FixedSectionKey);
}

function buildOrderedKeys(
  sectionOrder: ListingVenueDetail["sectionOrder"],
  customSections: ListingVenueDetail["customSections"],
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
  const valid = stored.filter(
    (k) => isFixedSectionKey(k) || validCustomKeys.has(k),
  );

  return [...valid, ...missingFixed];
}

function hasListingRights(
  user: User | null,
  company: Company | undefined,
): boolean {
  if (!user || !company || !company.owner) return false;

  const ownerId =
    typeof company.owner === "string" ? company.owner : company.owner.id;
  if (ownerId === user.id) return true;

  return (company.members ?? []).some((c) => {
    const collaboratorId = typeof c.user === "string" ? c.user : c.user.id;
    return collaboratorId === user.id;
  });
}

export default function Page() {
  const { listingId } = useParams<{ listingId: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const { data: listing, isLoading: isLoadingListing } = useListing(listingId);
  const { data: company } = useCompany(
    listing ? getIdFromRelationshipField(listing.company) : undefined,
  );
  const { data: variants, isLoading: isLoadingVariants } = useVariantsByListing(
    listingId ?? "",
  );
  const { data: detail } = useListingDetail(
    listing?.type === "entertainment"
      ? "listing-entertainment-details"
      : listing?.type === "gastro"
        ? "listing-gastro-details"
        : "listing-venue-details",
    getIdFromRelationshipField(listing?.detail?.value ?? ""),
  );

  const companyId = getIdFromRelationshipField(listing?.company ?? "");
  const showAdminSection = useCallback(() => {
    if (!isAuthenticated || !hasListingRights(user, company)) return false;
    return true;
  }, []);
  if (isLoadingListing || isLoadingVariants || !detail)
    return <Loader text="Načítáme inzerát..." />;
  if (!listing) return router.back();

  const employees = detail.employees ?? [];
  const references = detail.references ?? [];
  const customSections = detail.customSections ?? [];
  const orderedKeys = buildOrderedKeys(
    detail.sectionOrder,
    detail.customSections,
  );

  const sectionRenderers: Record<
    FixedSectionKey,
    () => React.ReactNode | null
  > = {
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
      detail.faq?.some((f) => f.active !== false) ? (
        <SectionWrapper title="Časté otázky">
          <FAQSection faqs={detail.faq} />
        </SectionWrapper>
      ) : null,
    company: () =>
      companyId ? (
        <SectionWrapper>
          <BusinessProfile companyId={companyId} />
        </SectionWrapper>
      ) : null,
  };

  return (
    <div className="flex justify-center w-full px-6 py-10">
      <div className="w-full flex flex-col max-w-listing-page pb-20">
        <div className="mb-5 flex flex-col items-start gap-5">
          <div>
            <Button
              text="Zpět"
              iconLeft="ArrowLeft"
              version="plain"
              onClick={() => {
                router.back();
              }}
            />
          </div>
          {showAdminSection() && (
            <div className="w-full">
              <ListingAdminSection listing={listing} companyId={companyId} />
            </div>
          )}
          {listing.status === "inactive" && (
            <div className="w-full">
              {" "}
              <AlertSection
                icon={EyeOff}
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                borderColor="border-amber-200"
                bgColor="bg-amber-50/50"
                title="Inzerát není aktivní"
                text="Tento inzerát není momentálně viditelný pro veřejnost."
              />
            </div>
          )}
        </div>

        <HeroImageSection
          coverImage={listing.images.coverImage.filename}
          gallery={listing.images.gallery.map((img) => img.filename)}
        />
        <ListingHeader listing={listing} />
        <div className="grid grid-cols-[1fr_400px] gap-6 mt-5">
          <div className="min-h-screen flex flex-col w-full gap-10">
            {orderedKeys.map((key) => {
              if (isFixedSectionKey(key)) {
                return (
                  <React.Fragment key={key}>
                    {sectionRenderers[key]()}
                  </React.Fragment>
                );
              }
              const custom = customSections.find(
                (s) => s.id === key || s.blockName === key,
              );
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
