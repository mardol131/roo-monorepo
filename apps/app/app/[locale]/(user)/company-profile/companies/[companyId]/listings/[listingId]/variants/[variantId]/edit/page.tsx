"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import VariantForm from "@/app/components/forms/variants/variant-form";
import { useParams } from "next/navigation";

export default function EditVariantPage() {
  const { variantId } = useParams<{ variantId: string }>();

  return (
    <main className="w-full">
      <PageHeading
        heading="Upravit variantu"
        description="Zde můžete upravit základní informace o vaší variantě, jako jsou popis, cena nebo dostupnost."
      />
      <VariantForm variantId={variantId} />
    </main>
  );
}
