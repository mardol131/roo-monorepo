import Text from "@/app/components/ui/atoms/text";
import { getInquiries } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";
import { InquiryCard } from "@/app/[locale]/(user)/components/collection-components/inquiry-card";
import { MessageCircle } from "lucide-react";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";

export default async function page({
  params,
}: {
  params: Promise<{ companyId: string; listingId: string }>;
}) {
  const { companyId, listingId } = await params;
  const inquiries = getInquiries();

  return (
    <main className="w-full">
      <PageHeading
        heading="Zprávy"
        description="Poptávky s nepřečtenými zprávami."
      />

      {inquiries.length === 0 ? (
        <EmptyState
          text="Zatím žádné zprávy"
          subtext="Zprávy se zobrazí, jakmile zákazníci projeví zájem o vaši službu."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/inquiries/[inquiryId]",
                params: {
                  companyId,
                  listingId,
                  inquiryId: inquiry.id,
                },
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
