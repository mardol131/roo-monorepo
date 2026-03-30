import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Úprava služby"
        description="Zde můžete upravit informace o vaší službě, jako jsou popis, cena nebo dostupnost."
      />
    </main>
  );
}
