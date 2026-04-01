import { MOCK_VARIANTS } from "@/app/[locale]/(user)/company-profile/_mock/mock";
import VariantCard from "@/app/[locale]/(user)/components/collection-components/variant-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { Variant } from "@roo/common";

type Props = {
  params: Promise<{ companyId: string; listingId: string }>;
};

export default async function page({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main className="w-full">
      <PageHeading
        heading="Nabízené varianty"
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
      <div className="flex flex-col gap-3 mt-6">
        {MOCK_VARIANTS.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            link={{
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]",
              params: {
                companyId: resolvedParams.companyId,
                listingId: resolvedParams.listingId,
                variantId: variant.id,
              },
            }}
          />
        ))}
      </div>
    </main>
  );
}
