"use client";

import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import Text from "@/app/components/ui/atoms/text";
import { globalToastEvents } from "@/app/components/ui/molecules/global-toast";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import {
  cancelListingSubscription,
  createActivateSubscriptionCheckoutSession,
  resumeListingSubscriptionPayments,
} from "@/app/functions/api/stripe";
import { usePaymentHistory } from "@/app/react-query/listing-subscriptions/hooks";
import { listingSubscriptionKeys } from "@/app/react-query/query-keys";
import {
  getIdFromRelationshipField,
  Listing,
  ListingSubscription,
} from "@roo/common";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import Button from "@/app/components/ui/atoms/button";

export function SubscriptionControlSection({
  subscription,
}: {
  subscription: ListingSubscription;
}) {
  const queryClient = useQueryClient();
  const listing = subscription.listing as Listing;
  const listingId = getIdFromRelationshipField(subscription.listing);
  const companyId = getIdFromRelationshipField(subscription.company);

  const [historyOpen, setHistoryOpen] = useState(false);
  const { data: historyData, isFetching: isLoadingHistory } = usePaymentHistory(
    historyOpen ? subscription.id : undefined,
  );

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: listingSubscriptionKeys.byCompany(companyId ?? ""),
    });

  const activateHandler = async () => {
    try {
      const url = await createActivateSubscriptionCheckoutSession({
        listingId,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });
      window.location.href = url.url;
    } catch {
      globalToastEvents.emit("open", {
        type: "error",
        message: "Nepodařilo se aktivovat platby. Zkuste to prosím znovu.",
      });
    }
  };

  const cancelHandler = async () => {
    try {
      await cancelListingSubscription({ listingId });
      await invalidate();
      globalToastEvents.emit("open", {
        type: "success",
        message: "Platby byly úspěšně zrušeny.",
      });
    } catch {
      globalToastEvents.emit("open", {
        type: "error",
        message: "Nepodařilo se zrušit platby. Zkuste to prosím znovu.",
      });
    }
  };

  const resumeHandler = async () => {
    try {
      await resumeListingSubscriptionPayments({ listingId });
      await invalidate();
      globalToastEvents.emit("open", {
        type: "success",
        message: "Platby byly úspěšně obnoveny.",
      });
    } catch {
      globalToastEvents.emit("open", {
        type: "error",
        message: "Nepodařilo se obnovit platby. Zkuste to prosím znovu.",
      });
    }
  };

  const openCancelModal = () =>
    confirmActionModalEvents.emit("open", {
      title: "Ukončit platby za službu",
      description: listing?.name ?? "",
      Icon: Trash2,
      buttonText: "Ukončit platby",
      buttonVersion: "dangerFull",
      whatIsGoingToHappenText: "Opravdu chcete ukončit platby za tuto službu?",
      whatIsGoingToHappenTextColor: "danger",
      whatIsGoingToHappenList: [
        "Služba bude v katalogu vidět až do konce platebního období, poté se přestane zobrazovat",
        "Platby za tuto službu se přestanou strhávat",
      ],
      bgColor: "bg-danger-surface",
      onConfirmClick: cancelHandler,
    });

  const validUntilText = subscription.validUntil
    ? format(new Date(subscription.validUntil), "d. M. yyyy")
    : undefined;

  const rows = {
    pending: [
      {
        icon: "Banknote" as const,
        iconColor: "text-zinc-400",
        iconBgColor: "bg-zinc-100",
        title: "Čeká na platbu",
        text: "Předplatné nebylo dosud zaplaceno.",
        button: {
          text: "Přejít do platební brány",
          version: "successFull" as const,
          iconLeft: "Banknote" as const,
          size: "sm" as const,
          onClick: activateHandler,
        },
      },
    ],
    paid: [
      {
        icon: "Banknote" as const,
        iconColor: "text-success",
        iconBgColor: "bg-success-surface",
        title: "Předplatné aktivní",
        text: validUntilText
          ? `Platné do ${validUntilText}`
          : "Pravidelné platby jsou aktivní.",
        button: {
          text: "Ukončit platby",
          version: "warningFull" as const,
          iconLeft: "Banknote" as const,
          size: "sm" as const,
          onClick: openCancelModal,
        },
      },
    ],
    cancelling: [
      {
        icon: "Banknote" as const,
        iconColor: "text-amber-500",
        iconBgColor: "bg-amber-50",
        title: "Platby jsou zrušeny",
        text: validUntilText
          ? `Služba bude zobrazována do ${validUntilText}.`
          : "Služba bude zobrazována do konce zaplaceného období.",
        button: {
          text: "Obnovit platby",
          version: "successFull" as const,
          iconLeft: "Banknote" as const,
          size: "sm" as const,
          onClick: resumeHandler,
        },
      },
    ],
    expired: [
      {
        icon: "Banknote" as const,
        iconColor: "text-danger",
        iconBgColor: "bg-danger-surface",
        title: "Předplatné vypršelo",
        text: "Služba není zobrazována v katalogu.",
        button: {
          text: "Obnovit předplatné",
          version: "successFull" as const,
          iconLeft: "Banknote" as const,
          size: "sm" as const,
          onClick: activateHandler,
        },
      },
    ],
  };

  return (
    <DashboardSection
      title={listing?.name ?? "Služba"}
      icon="Banknote"
      iconBg="bg-zinc-100"
      iconColor="text-zinc-500"
      subtitle={`${subscription.amount} Kč / rok · tarif ${subscription.tariff}`}
      headerRightComponent={
        <Button
          text="Zobrazit"
          iconLeft="Link"
          version="plain"
          size="sm"
          link={{
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]",
            params: {
              companyId,
              listingId,
            },
          }}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <ControlSection rows={rows[subscription.status]} />

        <button
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors w-fit"
          onClick={() => setHistoryOpen((v) => !v)}
        >
          <Text variant="caption" color="secondary">
            Historie plateb
          </Text>
          {historyOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {historyOpen && (
          <div className="flex flex-col divide-y divide-zinc-100">
            {isLoadingHistory ? (
              <Text variant="caption" color="secondary">
                Načítám...
              </Text>
            ) : !historyData?.invoices.length ? (
              <Text variant="caption" color="secondary">
                Žádné platby k zobrazení.
              </Text>
            ) : (
              historyData.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <Text variant="label" color="textDark">
                      {invoice.amount.toLocaleString("cs-CZ")}{" "}
                      {invoice.currency.toUpperCase()}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {invoice.paidAt
                        ? format(new Date(invoice.paidAt), "d. M. yyyy")
                        : "—"}
                    </Text>
                  </div>
                  {invoice.invoiceUrl && (
                    <a
                      href={invoice.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                    >
                      Faktura
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardSection>
  );
}
