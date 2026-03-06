import React from "react";
import PageHeading from "../../components/page-heading";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Celkový přehled"
        description="Vyplňte základní údaje a zaregistrujte svou firmu."
      />
    </main>
  );
}
