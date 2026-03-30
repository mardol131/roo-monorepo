import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Kalendář"
        description="Zde můžete spravovat kalendář související s vaší službou."
      />
    </main>
  );
}
