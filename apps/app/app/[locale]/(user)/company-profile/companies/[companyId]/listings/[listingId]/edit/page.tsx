"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import { useListing, useUpdateListing } from "@/app/react-query/listings/hooks";
import { useParams, useSearchParams } from "next/navigation";
import EditEntertainmentListingForm from "./components/edit-entertainment-listing-form";
import EditGastroListingForm from "./components/edit-gastro-listing-form";
import EditVenueListingForm from "./components/edit-venue-listing-form";
import { Listing } from "@roo/common";
import { useEffect } from "react";
import Loader from "@/app/[locale]/(user)/components/loader";

type Props = {};

export default function page({}: Props) {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const { data: listing, isPending } = useListing(listingId);
  const isVenue = listing?.details[0].blockType === "venue";
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sectionQuery = searchParams.get("section");
    if (!isPending && sectionQuery) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(sectionQuery);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    }
  }, [isPending, searchParams]);

  if (isPending) return <Loader text="Načítání" />;

  return (
    <main className="w-full pb-100">
      <PageHeading
        heading="Detailní nastavení"
        description="Zde můžeš upravit všechny detaily vaší služby. Nezapomeň změny uložit!"
      />

      {isVenue && <EditVenueListingForm onCancel={() => router.back()} />}
      {listing?.details[0].blockType === "gastro" && (
        <EditGastroListingForm onCancel={() => router.back()} />
      )}
      {listing?.details[0].blockType === "entertainment" && (
        <EditEntertainmentListingForm onCancel={() => router.back()} />
      )}
    </main>
  );
}
