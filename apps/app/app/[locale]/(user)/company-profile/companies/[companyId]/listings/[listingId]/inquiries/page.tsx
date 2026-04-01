import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import PageContent from "./content";
import { getInquiries } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";
import { Inquiry } from "@roo/common";

export default async function page({
  params,
}: {
  params: Promise<{ companyId: string; listingId: string }>;
}) {
  const { companyId, listingId } = await params;
  const inquiries = getInquiries() as Inquiry[];

  return (
    <main className="w-full">
      <PageHeading
        heading="Poptávky"
        description="Zde můžete spravovat poptávky související s vaší službou."
      />

      {/* Tabs */}
      <PageContent
        companyId={companyId}
        listingId={listingId}
        items={inquiries}
      />
    </main>
  );
}
