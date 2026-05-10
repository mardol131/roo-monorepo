"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import PageHeading from "../../../components/page-heading";
import CompanyForm, {
  CreateCompanyFormInputs,
} from "../components/company-form";
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
        onSubmit={(data) => {
          const payload: CreateCompanyPayload = {
            name: data.name,
            ico: data.ico,
            description: data.description,
            email: data.email,
            phone: {
              countryCode: data.phone.countryCode,
              number: data.phone.number,
            },
            vatId: data.vatId,
            logo: data.logo || undefined,
            website: data.website,
            billingAddress: {
              street: data.billingAddress.street,
              city: data.billingAddress.city,
              postalCode: data.billingAddress.postalCode,
              country: data.billingAddress.country,
            },
          };
          createCompany(payload);
        }}
        onBackClick={() => router.back()}
      />
      {error && <p className="text-red-500">{error.message}</p>}
    </main>
  );
}
