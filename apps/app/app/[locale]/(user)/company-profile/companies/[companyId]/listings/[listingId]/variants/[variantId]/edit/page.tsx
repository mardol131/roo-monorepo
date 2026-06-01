"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import EntertainmentVariantForm from "@/app/components/forms/variants/edit-forms/entertainment/entertainment-variant-form";
import GastroVariantForm from "@/app/components/forms/variants/edit-forms/gastro/gastro-variant-form";
import VenueVariantForm from "@/app/components/forms/variants/edit-forms/venue/venue-variant-form";
import { useVariant } from "@/app/react-query/variants/hooks";
import { useParams } from "next/navigation";

export default function EditVariantPage() {
  const { variantId } = useParams<{ variantId: string }>();
  const { data: variant } = useVariant(variantId);

  const blockType = variant?.details[0]?.blockType;

  return (
    <main className="w-full">
      <PageHeading
        heading="Upravit variantu"
        description="Zde můžete upravit základní informace o vaší variantě, jako jsou popis, cena nebo dostupnost."
      />

      {blockType === "venue" && <VenueVariantForm />}
      {blockType === "gastro" && <GastroVariantForm />}
      {blockType === "entertainment" && <EntertainmentVariantForm />}
    </main>
  );
}
