import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Nová varianta"
        description="Zde můžete vytvořit novou variantu služby, kterou budete nabízet zákazníkům."
      />
    </main>
  );
}
