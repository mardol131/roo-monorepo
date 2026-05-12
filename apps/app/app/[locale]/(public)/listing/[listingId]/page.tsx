"use client";

import BusinessProfile from "./components/business-profile";
import DescriptionSection from "./components/description-section";
import FAQSection from "./components/faq-section";
import HeroImageSection from "./components/hero-image-section";
import ListingDetailSection from "./components/detail/listing-detail-section";
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
import { Company } from "@roo/common";

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

  const faqs = (listing.faq ?? [])
    .filter((f) => f.active !== false)
    .map(({ question, answer }) => ({ question, answer }));

  return (
    <div className="flex justify-center w-full px-6 py-10">
      <div className="w-full flex flex-col max-w-listing-page pb-20">
        <HeroImageSection
          name={listing.name}
          coverImage={listing.images.coverImage.filename}
          gallery={listing.images.gallery.map((img) => img.filename)}
        />
        <div className="grid grid-cols-[1fr_400px] gap-6 mt-10">
          <div className="min-h-screen flex flex-col w-full gap-15">
            {listing.description && (
              <SectionWrapper>
                <DescriptionSection description={listing.description} />
              </SectionWrapper>
            )}
            <ListingDetailSection listing={listing} />
            {company && (
              <SectionWrapper>
                <BusinessProfile companyId={company.id} />
              </SectionWrapper>
            )}
            {faqs.length > 0 && (
              <SectionWrapper>
                <FAQSection faqs={faqs} />
              </SectionWrapper>
            )}
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
