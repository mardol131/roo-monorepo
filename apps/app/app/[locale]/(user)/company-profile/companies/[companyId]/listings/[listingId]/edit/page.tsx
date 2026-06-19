"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import EntertainmentListingForm from "../../../../../../../../components/forms/listings/edit-forms/entertainment/entertainment-listing-form";
import GastroListingForm from "../../../../../../../../components/forms/listings/edit-forms/gastro/gastro-listing-form";
import VenueListingForm from "../../../../../../../../components/forms/listings/edit-forms/venue/venue-listing-form";

type Props = {};

export default function page({}: Props) {
  const { listingId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const { data: listing, isPending } = useListing(listingId);
  const isVenue = listing?.type === "venue";
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
        button={{
          text: "Opustit formulář",
          version: "plain",
          size: "sm",
          iconLeft: "ArrowLeft",
          onClick: router.back,
        }}
      />

      {isVenue && <VenueListingForm />}
      {listing?.type === "gastro" && <GastroListingForm />}
      {listing?.type === "entertainment" && <EntertainmentListingForm />}
    </main>
  );
}
