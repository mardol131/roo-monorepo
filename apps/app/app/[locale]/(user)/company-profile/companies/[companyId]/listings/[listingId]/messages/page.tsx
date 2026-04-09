import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { getInquiries } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";
import { getIdFromRelationshipField } from "@roo/common";

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
            <EntityCard
              key={inquiry.id}
              label={
                typeof inquiry.listing.value !== "string"
                  ? inquiry.listing.value.name
                  : "Poptávka"
              }
              icon="MessageSquare"
              iconBackgroundColor="bg-rose-50"
              iconColor="text-rose-500"
              items={[]}
              link={{
                pathname: "/user-profile/my-events/[eventId]/[inquiryId]",
                params: {
                  eventId: getIdFromRelationshipField(inquiry.event),
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
