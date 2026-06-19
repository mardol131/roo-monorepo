"use client";

import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { globalToastEvents } from "@/app/components/ui/molecules/global-toast";
import {
  createActivateSubscriptionCheckoutSession,
  resumeListingSubscriptionPayments,
} from "@/app/functions/api/stripe";
import { hasListingRights } from "@/app/functions/utils/listings";
import { useUpdateListing } from "@/app/react-query/listings/hooks";
import { listingKeys } from "@/app/react-query/query-keys";
import { getIdFromRelationshipField, Listing } from "@roo/common";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, PauseCircle, XCircle } from "lucide-react";

type Props = {
  listing: Listing;
};

export default function ListingAlertsSectionGroup({ listing }: Props) {
  const { status, subscriptionStatus } = listing;

  const queryClient = useQueryClient();
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing(
    getIdFromRelationshipField(listing.company),
  );

  const activatePaymentsHandler = async () => {
    try {
      const url = await createActivateSubscriptionCheckoutSession({
        listingId: listing.id,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });
      window.location.href = url.url;
    } catch {
      globalToastEvents.emit("open", {
        type: "error",
        message:
          "Nepodařilo se aktivovat platby za službu. Zkuste to prosím znovu.",
      });
    }
  };

  const handleToggleStatus = async () => {
    updateListing({
      id: listing.id,
      data: { status: "active" },
    });
    globalToastEvents.emit("open", {
      type: "success",
      message: "Stav služby byl úspěšně změněn.",
    });
  };

  const resumePaymentsHandler = async () => {
    try {
      await resumeListingSubscriptionPayments({ listingId: listing.id });
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(listing.id) });
      globalToastEvents.emit("open", {
        type: "success",
        message: "Platby byly úspěšně obnoveny.",
      });
    } catch {
      globalToastEvents.emit("open", {
        type: "error",
        message:
          "Nepodařilo se obnovit platby za službu. Zkuste to prosím znovu.",
      });
    }
  };

  if (
    (subscriptionStatus === "paid" || subscriptionStatus === "cancelling") &&
    status !== "active"
  ) {
    return (
      <AlertSection
        icon={PauseCircle}
        iconBg="bg-warning-surface"
        iconColor="text-warning"
        borderColor="border-warning"
        bgColor="bg-warning-surface"
        title="Listing není aktivní v katalogu"
        text="Předplatné je zaplacené, ale listing není zobrazen v katalogu. Aktivujte listing, aby ho zákazníci mohli najít."
        button={{
          text: "Aktivovat listing",
          version: "warningFull",
          iconLeft: "Play",
          size: "sm",
          onClick: handleToggleStatus,
        }}
      />
    );
  }

  if (subscriptionStatus === "unpaid" || subscriptionStatus === "expired") {
    return (
      <AlertSection
        icon={XCircle}
        iconBg="bg-warning-surface"
        iconColor="text-warning"
        borderColor="border-warning"
        bgColor="bg-warning-surface"
        title="Předplatné není aktivní"
        text={
          subscriptionStatus === "expired"
            ? "Platnost předplatného vypršela. Listing není viditelný v katalogu. Obnovte předplatné, aby se listing znovu zobrazil zákazníkům."
            : "Předplatné nebylo zaplaceno. Listing není viditelný v katalogu. Dokončete platbu, aby se listing zobrazil zákazníkům."
        }
        button={{
          text: "Aktivovat předplatné",
          version: "warningFull",
          iconLeft: "CreditCard",
          size: "sm",
          onClick: activatePaymentsHandler,
        }}
      />
    );
  }

  if (subscriptionStatus === "cancelling") {
    return (
      <AlertSection
        icon={AlertTriangle}
        iconBg="bg-warning-surface"
        iconColor="text-warning"
        borderColor="border-warning"
        bgColor="bg-warning-surface"
        title="Předplatné se ruší"
        text="Listing je aktuálně aktivní v katalogu, ale předplatné bylo zrušeno a ke konci období přestane být zobrazován. Obnovte předplatné, pokud chcete pokračovat."
        button={{
          text: "Obnovit předplatné",
          version: "warningFull",
          iconLeft: "RefreshCw",
          size: "sm",
          onClick: resumePaymentsHandler,
        }}
      />
    );
  }

  return null;
}
