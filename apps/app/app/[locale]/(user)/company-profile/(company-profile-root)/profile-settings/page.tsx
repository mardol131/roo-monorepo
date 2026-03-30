import React from "react";
import PageHeading from "../../../components/page-heading";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Nastavení profilu"
        description="Zde můžete upravit nastavení svého profilu a spravovat své informace."
      />
    </main>
  );
}
