import { MOCK_VARIANTS } from "@/app/[locale]/(user)/company-profile/_mock/mock";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";

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
          <EntityCard
            key={variant.id}
            link={{
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]",
              params: {
                companyId: resolvedParams.companyId,
                listingId: resolvedParams.listingId,
                variantId: variant.id,
              },
            }}
            icon="Package"
            iconColor="text-green-500"
            iconBackgroundColor="bg-green-50"
            label={variant.name}
            items={[
              {
                icon: "DollarSign",
                content: `${variant.price.generalPrice} Kč`,
              },
              { icon: "CheckCheck", content: variant.availability },
            ]}
          />
        ))}
      </div>
    </main>
  );
}
