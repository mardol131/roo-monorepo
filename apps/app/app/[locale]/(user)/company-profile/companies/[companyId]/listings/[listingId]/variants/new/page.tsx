"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";
import NewVariantFormEntertainment from "./components/new-variant-form-entertainment";
import NewVariantFormGastro from "./components/new-variant-form-gastro";
import NewVariantFormVenue from "./components/new-variant-form-venue";

export default function page() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const router = useRouter();
  const { data: listing } = useListing(listingId);
  const blockType = listing?.details[0]?.blockType;

  return (
    <main className="w-full">
      <PageHeading
        heading="Nová varianta"
        description="Zde můžete vytvořit novou variantu služby, kterou budete nabízet zákazníkům."
      />
      <Button
        version="plain"
        iconLeft="ArrowLeft"
        className="mb-4"
        text="Zpět"
        size="sm"
        link={{
          pathname:
            "/company-profile/companies/[companyId]/listings/[listingId]/variants",
          params: { companyId, listingId },
        }}
      />
      {blockType === "venue" && (
        <NewVariantFormVenue onCancel={() => router.back()} />
      )}
      {blockType === "gastro" && (
        <NewVariantFormGastro onCancel={() => router.back()} />
      )}
      {blockType === "entertainment" && (
        <NewVariantFormEntertainment onCancel={() => router.back()} />
      )}
    </main>
  );
}
