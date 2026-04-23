"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";
import EditEntertainmentListingForm from "./components/edit-entertainment-listing-form";
import EditGastroListingForm from "./components/edit-gastro-listing-form";
import EditVenueListingForm from "./components/edit-venue-listing-form";

type Props = {};

export default function page({}: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: listing } = useListing(listingId);
  const isVenue = listing?.details[0].blockType === "venue";
  const router = useRouter();

  return (
    <main className="w-full">
      <PageHeading
        heading="Detailní nastavení"
        description="Zde můžeš upravit všechny detaily vaší služby. Nezapomeň změny uložit!"
      />

      {isVenue && (
        <EditVenueListingForm
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
      {listing?.details[0].blockType === "gastro" && (
        <EditGastroListingForm
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
      {listing?.details[0].blockType === "entertainment" && (
        <EditEntertainmentListingForm
          onSubmit={(data) => {
            console.log("submit", data);
          }}
          onCancel={() => router.back()}
        />
      )}
    </main>
  );
}
