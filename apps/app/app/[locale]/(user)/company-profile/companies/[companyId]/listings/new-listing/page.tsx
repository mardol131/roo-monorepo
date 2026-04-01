import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Nová služba"
        description="Zde můžete vytvořit novou službu, kterou budete nabízet zákazníkům."
      />
    </main>
  );
}
