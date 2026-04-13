"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";
import React from "react";

export default function page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();

  const { data: listing } = useListing(listingId);

  return (
    <main className="w-full">
      <PageHeading
        heading="Přehled služby"
        description="Zde najdete základní informace o vaší službě, jako jsou popis, cena nebo dostupnost."
      />
    </main>
  );
}
