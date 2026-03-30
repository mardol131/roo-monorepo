import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Přehled varianty"
        description="Zde najdete základní informace o vaší variantě, jako jsou popis, cena nebo dostupnost."
      />
    </main>
  );
}
