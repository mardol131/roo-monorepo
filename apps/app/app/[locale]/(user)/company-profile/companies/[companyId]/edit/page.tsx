"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import React from "react";
import CompanyForm from "../../../(company-profile-root)/new-company/components/new-company-form";
import { useParams, useRouter } from "next/navigation";
import { COMPANIES } from "../../../_mock/mock";

export default function EditCompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = useParams();
  const router = useRouter();
  const company = COMPANIES.find((c) => c.id === companyId) ?? COMPANIES[0];

  return (
    <main className="w-full">
      <PageHeading
        heading="Správa firmy"
        description="Zde můžete upravit informace o vaší firmě, jako jsou kontaktní údaje, adresa nebo popis."
      />
      <CompanyForm
        submitLabel="Uložit změny"
        cancelLabel="Zrušit"
        onSubmit={() => router.push("/company-profile/companies")}
        onBackClick={() => router.back()}
        defaultValues={{
          name: company.name,
          ico: company.ico,
          description: company.description,
          email: company.email,
          phone: company.phone,
          website: company.website,
          city: company.city,
        }}
      />
    </main>
  );
}
