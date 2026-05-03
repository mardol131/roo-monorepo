"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useRouter } from "@/app/i18n/navigation";
import {
  useCompany,
  useUpdateCompany,
} from "@/app/react-query/companies/hooks";
import { useParams } from "next/navigation";
import CompanyForm from "../../components/company-form";

export default function EditCompanyPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = useParams<{ companyId: string }>();
  const router = useRouter();
  const { data: company, isPending } = useCompany(companyId);
  const { mutate, error } = useUpdateCompany(companyId, {
    onSuccess: () =>
      router.push({
        pathname: "/company-profile/companies/[companyId]",
        params: { companyId: companyId },
      }),
  });

  if (isPending) {
    return <Loader text="Formulář se načítá..." />;
  }

  if (!company) {
    return router.back();
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Správa firmy"
        description="Zde můžete upravit informace o vaší firmě, jako jsou kontaktní údaje, adresa nebo popis."
      />
      <CompanyForm
        submitLabel="Uložit změny"
        cancelLabel="Zrušit"
        onSubmit={mutate}
        onBackClick={() => router.back()}
        defaultValues={{
          name: company.name,
          ico: company.ico,
          description: company.description ?? undefined,
          email: company.email,
          phone: company.phone,
          website: company.website ?? undefined,
          billingAddress: {
            street: company.billingAddress.street,
            city: company.billingAddress.city,
            postalCode: company.billingAddress.postalCode,
            country: company.billingAddress.country,
          },
          vatId: company.vatId ?? undefined,
          logo: company.logo ?? undefined,
        }}
      />
    </main>
  );
}
