"use client";

import Text from "@/app/components/ui/atoms/text";
import { InquiryStatus } from "@roo/common";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { getInquiries } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";
import { InquiryCard } from "@/app/[locale]/(user)/components/collection-components/inquiry-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";
import { useParams } from "next/navigation";
import PageContent from "./components/content";

export default async function page({
  params,
}: {
  params: Promise<{ companyId: string; listingId: string }>;
}) {
  const { companyId, listingId } = await params;

  return (
    <main className="w-full">
      <PageHeading
        heading="Poptávky"
        description="Zde můžete spravovat poptávky související s vaší službou."
      />

      {/* Tabs */}
      <PageContent companyId={companyId} listingId={listingId} />
    </main>
  );
}
