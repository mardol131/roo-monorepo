"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import {
  useCalendarEvent,
  useCalendarEventsByListing,
} from "@/app/react-query/calendar-events/hooks";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

export default function page({}: Props) {
  const { listingId } = useParams<{ listingId: string }>();
  console.log(useCalendarEventsByListing(listingId).data);
  return (
    <main className="w-full">
      <PageHeading
        heading="Kalendář"
        description="Zde můžete spravovat kalendář související s vaší službou."
      />
    </main>
  );
}
