"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageHeading from "../../../components/page-heading";
import CompanyForm from "./components/new-company-form";

export default function NewCompanyPage() {
  const router = useRouter();

  return (
    <main className="w-full">
      <PageHeading
        heading="Nová firma"
        description="Vyplňte základní údaje a zaregistrujte svou firmu."
      />
      <CompanyForm
        submitLabel="Vytvořit firmu"
        cancelLabel="Zrušit"
        onSubmit={() => router.push("/company-profile/companies")}
        onBackClick={() => router.back()}
      />
    </main>
  );
}
