"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import NewEventForm from "@/app/components/forms/new-event-form";
import { useEvent } from "@/app/react-query/events/hooks";
import { useInquiriesByEvent } from "@/app/react-query/inquiries/hooks";
import { useParams } from "next/navigation";

export default function page() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isFetching } = useEvent(eventId);
  const { data: inquiries } = useInquiriesByEvent(eventId);

  const hasConfirmedInquiries = !!inquiries?.docs?.some(
    (inquiry) => inquiry.status.company === "confirmed",
  );

  if (isFetching) return <Loader text="Formulář se načítá" />;

  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Upravit událost"
        description="Upravte detaily události a aktualizujte informace."
      />

      <NewEventForm
        type="edit"
        edditedEvent={event}
        hasConfirmedInquiries={true}
      />
    </main>
  );
}
