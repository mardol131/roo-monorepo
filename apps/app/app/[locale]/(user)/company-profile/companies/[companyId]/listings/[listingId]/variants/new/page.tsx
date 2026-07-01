"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import VariantForm from "@/app/components/forms/variants/variant-form";
import { useRouter } from "@/app/i18n/navigation";
import { useParams } from "next/navigation";

export default function NewVariantPage() {
  const { listingId, companyId } = useParams<{
    listingId: string;
    companyId: string;
  }>();
  const router = useRouter();

  function goToVariantsList() {
    router.push({
      pathname:
        "/company-profile/companies/[companyId]/listings/[listingId]/variants",
      params: { companyId, listingId },
    });
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Nová varianta"
        description="Vytvořte novou variantu nabídky."
      />
      <VariantForm
        listingId={listingId}
        onSuccess={goToVariantsList}
        onCancel={() => router.back()}
      />
    </main>
  );
}
