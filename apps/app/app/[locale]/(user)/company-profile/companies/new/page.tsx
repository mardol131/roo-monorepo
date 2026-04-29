"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import PageHeading from "../../../components/page-heading";
import CompanyForm from "../components/company-form";
import { useCreateCompany } from "@/app/react-query/companies/hooks";
import { Company } from "@roo/common";
import { CreateCompanyPayload } from "@/app/react-query/companies/fetch";

export default function page() {
  const router = useRouter();

  const { mutate: createCompany, error } = useCreateCompany({
    onSuccess: () => {
      router.push(`/company-profile/companies`);
    },
  });

  return (
    <main className="w-full flex flex-col">
      <PageHeading
        heading="Nová firma"
        description="Vyplňte základní údaje a zaregistrujte svou firmu."
      />
      <CompanyForm
        submitLabel="Vytvořit firmu"
        cancelLabel="Zrušit"
        onSubmit={createCompany}
        onBackClick={() => router.back()}
      />
      {error && <p className="text-red-500">{error.message}</p>}
    </main>
  );
}
