import PageHeading from "@/app/[locale]/(user)/components/page-heading";

type Props = {
  params: Promise<{ companyId: string; listingId: string }>;
};

export default async function page({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main className="w-full">
      <PageHeading
        heading="Varianty"
        description="Zde můžete spravovat varianty související s vaší službou."
        button={{
          text: "Přidat variantu",
          version: "primary",
          iconLeft: "Plus",
          link: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/variants/new-variant",
            params: {
              companyId: resolvedParams.companyId,
              listingId: resolvedParams.listingId,
            },
          },
        }}
      />
    </main>
  );
}
