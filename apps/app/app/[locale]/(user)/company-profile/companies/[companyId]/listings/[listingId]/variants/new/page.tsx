"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import NewVariantForm from "./components/new-variant-form";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/i18n/navigation";

type Props = {};

export default function page({}: Props) {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const router = useRouter();

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
          params: {
            companyId,
            listingId,
          },
        }}
      />
      <NewVariantForm
        onSubmit={(data) => {
          console.log("submit", data);
        }}
        onCancel={() => router.back()}
      />
    </main>
  );
}
