"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { useListingSubscriptionsByCompany } from "@/app/react-query/listing-subscriptions/hooks";
import { useParams } from "next/navigation";
import { SubscriptionControlSection } from "./components/subscription-control-section";
import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";

export default function Page() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: listingSubscriptions } =
    useListingSubscriptionsByCompany(companyId);

  return (
    <main className="w-full">
      <PageHeading
        heading="Platby"
        description="Přehled předplatných pro vaše služby."
      />
      <div className="w-full flex flex-col gap-4">
        {listingSubscriptions?.docs.length &&
        listingSubscriptions?.docs.length > 0 ? (
          listingSubscriptions?.docs.map((subscription) => (
            <SubscriptionControlSection
              key={subscription.id}
              subscription={subscription}
            />
          ))
        ) : (
          <EmptyState
            text="Žádná předplatná k zobrazení."
            subtext="Zatím nemáte žádná aktivní předplatná."
          />
        )}
      </div>
    </main>
  );
}
