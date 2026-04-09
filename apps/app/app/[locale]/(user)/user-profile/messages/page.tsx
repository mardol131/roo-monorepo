import Text from "@/app/components/ui/atoms/text";
import { getInquiries } from "../_mock/mock-data";
import { MessageCircle } from "lucide-react";
import PageHeading from "../../components/page-heading";
import { getIdFromRelationshipField } from "../../../../../../../packages/common/dist/functions/get-id-from-relationship-field";
import EntityRow from "../../components/entity-row";
import EntityCard from "../../components/entity-card";

export default function MessagesPage() {
  const inquiries = getInquiries();

  return (
    <main className="flex-1">
      <PageHeading
        heading="Zprávy"
        description="Poptávky s nepřečtenými zprávami."
      />

      {inquiries.length === 0 ? (
        <EmptyState />
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

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
        <MessageCircle className="w-6 h-6 text-zinc-400" />
      </div>
      <Text variant="label1" color="dark" className="font-semibold mb-1">
        Žádné nepřečtené zprávy
      </Text>
      <Text variant="label4" color="secondary" className="max-w-xs">
        Všechny zprávy jsou přečtené.
      </Text>
    </div>
  );
}
