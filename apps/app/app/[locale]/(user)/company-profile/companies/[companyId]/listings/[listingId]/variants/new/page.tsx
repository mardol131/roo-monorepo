"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import VariantCreateWizard from "@/app/components/forms/variants/create-wizards/variant-wizard";
import { useRouter } from "@/app/i18n/navigation";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";

export default function NewVariantPage() {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const router = useRouter();
  const { data: listing, isFetching } = useListing(listingId);

  if (isFetching || !listing) return <Loader text="Formulář se načítá" />;

  const blockType = listing.type as "venue" | "gastro" | "entertainment";

  return (
    <main className="w-full">
      <PageHeading
        heading="Nová varianta"
        description="Vytvořte novou variantu nabídky. Detaily lze doplnit po vytvoření."
      />
      <VariantCreateWizard
        blockType={blockType}
        listingId={listingId}
        companyId={companyId}
        onCancel={() => router.back()}
      />
    </main>
  );
}
