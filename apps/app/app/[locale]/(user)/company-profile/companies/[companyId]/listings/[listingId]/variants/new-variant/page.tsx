import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Přidat variantu"
        description="Zde můžete přidat novou variantu související s vaší službou."
      />
    </main>
  );
}
