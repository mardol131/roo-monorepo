import React from "react";
import PageHeading from "../../../components/page-heading";
import NewCompanyForm from "./components/new-company-form";

type Props = {};

export default function page({}: Props) {
  return (
    <main className="w-full">
      <PageHeading
        heading="Nová firma"
        description="Vyplňte základní údaje a zaregistrujte svou firmu."
      />
      <NewCompanyForm />
    </main>
  );
}
