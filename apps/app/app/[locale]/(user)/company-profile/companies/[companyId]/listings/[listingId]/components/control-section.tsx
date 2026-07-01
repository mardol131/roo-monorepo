"use client";

import {
  ControlItem,
  ControlSection,
} from "@/app/[locale]/(user)/components/control-section";
import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import { globalToastEvents } from "@/app/components/ui/molecules/global-toast";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import {
  cancelListingSubscription,
  createActivateSubscriptionCheckoutSession,
  resumeListingSubscriptionPayments,
} from "@/app/functions/api/stripe";
import { hasListingRights } from "@/app/functions/utils/listings";
import { useRouter } from "@/app/i18n/navigation";
import { useCompany } from "@/app/react-query/companies/hooks";
import { useUpdateListing } from "@/app/react-query/listings/hooks";
import { listingKeys } from "@/app/react-query/query-keys";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { Company, Listing } from "@roo/common";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

export function ListingControlSection({
  company,
  listing,
}: {
  company: Company;
  listing: Listing;
}) {
  const { user } = useAuth();

  const router = useRouter();

  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing(
    company.id,
  );

  const { data: spaces } = useSpacesByListing(listing.id);

  const queryClient = useQueryClient();

  const isActive = listing.status === "active";
  const paidStatus = listing.subscriptionStatus;

  const handleToggleStatus = async () => {
    updateListing({
      id: listing.id,
      data: { status: isActive ? "inactive" : "active" },
    });
    globalToastEvents.emit("open", {
      type: "success",
      message: "Stav služby byl úspěšně změněn.",
    });
  };

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

  const deactivatePaymentsHandler = async () => {
    try {
      await cancelListingSubscription({ listingId: listing.id });
      queryClient.invalidateQueries({ queryKey: listingKeys.byId(listing.id) });
      globalToastEvents.emit("open", {
        type: "success",
        message: "Platby byly úspěšně zrušeny.",
      });
    } catch {
      globalToastEvents.emit("open", {
        type: "error",
        message:
          "Nepodařilo se deaktivovat platby za službu. Zkuste to prosím znovu.",
      });
    }
  };

  const openDeactivatePaymentsModal = () =>
    confirmActionModalEvents.emit("open", {
      title: "Ukončit platby za službu",
      description:
        "Tato akce je nevratná a trvale odstraní tuto službu z platformy.",
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
      onConfirmClick: async () => {
        await deactivatePaymentsHandler();
      },
    });

  const handleDeleteConfirm = () => {
    updateListing(
      {
        id: listing.id,
        data: { status: "archived" },
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  const openDeleteConfirmModal = () =>
    confirmActionModalEvents.emit("open", {
      title: "Smazat službu",
      description:
        "Tato akce je nevratná a trvale odstraní tuto službu z platformy.",
      Icon: Trash2,
      buttonText: "Smazat službu",
      buttonVersion: "dangerFull",
      confirmPhrase: listing.name,
      whatIsGoingToHappenText: "Opravdu chcete smazat tuto službu?",
      whatIsGoingToHappenTextColor: "danger",
      whatIsGoingToHappenList: [
        "Služba zmizí z katalogu a nebude dohledatelná",
        "Veškerá data, fotografie a nastavení budou trvale odstraněna",
        "Platby za tuto službu se přestanou strhávat",
      ],
      bgColor: "bg-danger-surface",
      onConfirmClick: async () => {
        handleDeleteConfirm();
      },
    });

  const subscriptionRow: Record<Listing["subscriptionStatus"], ControlItem> = {
    paid: {
      icon: "Banknote",
      iconColor: "text-success",
      iconBgColor: "bg-success-surface",
      title: "Zrušit pravidelné platby za službu",
      text: "Po vypršení platebního období se služba přestane zobrazovat v katalogu.",
      button: {
        text: "Ukončit platby",
        version: "warningFull",
        iconLeft: "Banknote",
        size: "sm",
        disabled: isUpdating,
        onClick: openDeactivatePaymentsModal,
      },
    },
    cancelling: {
      icon: "Banknote",
      iconColor: "text-amber-500",
      iconBgColor: "bg-amber-50",
      title: "Platby jsou zrušeny",
      text: "Službu je možné zobrazovat v katalogu do konce zaplaceného období, poté se přestane zobrazovat.",
      button: {
        text: "Obnovit platby",
        version: "successFull",
        iconLeft: "Banknote",
        size: "sm",
        disabled: isUpdating,
        onClick: resumePaymentsHandler,
      },
      tooltipText:
        "Platby za tuto službu byly zrušeny. Služba se přestane zobrazovat v katalogu po vypršení zaplaceného období.",
    },
    expired: {
      icon: "Banknote",
      iconColor: "text-danger",
      iconBgColor: "bg-danger-surface",
      title: "Předplatné vypršelo",
      text: "Služba není zobrazována v katalogu. Obnovte předplatné pro opětovné zobrazení.",
      button: {
        text: "Obnovit předplatné",
        version: "successFull",
        iconLeft: "Banknote",
        size: "sm",
        disabled: isUpdating,
        onClick: activatePaymentsHandler,
      },
    },
    unpaid: {
      icon: "Banknote",
      iconColor: "text-success",
      iconBgColor: "bg-success-surface",
      title: "Přejít do platební brány a aktivovat službu",
      text: "Po aktivaci budete přesměrováni do platební brány. Služba se zobrazí v katalogu po úspěšné platbě.",
      button: {
        text: "Přejít do platební brány",
        version: "successFull",
        iconLeft: "Banknote",
        size: "sm",
        disabled: isUpdating,
        onClick: activatePaymentsHandler,
      },
    },
  };

  console.log(listing);

  const activeSubscriptionRow: ControlItem =
    subscriptionRow[paidStatus ?? "unpaid"] ?? subscriptionRow.unpaid;

  return (
    <>
      {hasListingRights({
        allowedRoles: ["owner", "admin", "manager"],
        company,
        userId: user?.id,
      }) && (
        <DashboardSection
          title="Ovládání"
          icon={"Cog"}
          iconBg="bg-zinc-100"
          iconColor="text-zinc-500"
        >
          <ControlSection
            rows={[
              activeSubscriptionRow,
              {
                icon: isActive ? "Play" : "Play",
                iconColor: isActive ? "text-amber-500" : "text-success",
                iconBgColor: isActive ? "bg-amber-50" : "bg-success-surface",
                disabled:
                  listing.type === "venue" && spaces?.docs?.length === 0,
                title: isActive ? "Skrýt v katalogu" : "Zobrazit v katalogu",
                text: isActive
                  ? "Služba přestane být zobrazována v katalogu. Zobrazování lze kdykoliv zapnout zpět."
                  : "Služba se začne zobrazovat v katalogu. Zobrazování lze kdykoliv vypnout.",
                button: {
                  text: isActive ? "Skrýt v katalogu" : "Zobrazit v katalogu",
                  version: isActive ? "warningFull" : "successFull",
                  iconLeft: isActive ? "Play" : "Play",
                  size: "sm",
                  disabled: isUpdating,
                  onClick: handleToggleStatus,
                },
              },
              {
                icon: "Trash2",
                iconColor: "text-danger",
                iconBgColor: "bg-danger-surface",
                title: "Smazat službu",
                text: "Trvalé smazání nelze vrátit zpět. Všechna data budou odstraněna.",
                button: {
                  text: "Smazat službu",
                  version: "dangerFull",
                  iconLeft: "Trash2",
                  size: "sm",
                  onClick: openDeleteConfirmModal,
                },
              },
            ]}
          />
        </DashboardSection>
      )}
    </>
  );
}
