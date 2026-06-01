"use client";

import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import ChatWindow from "@/app/[locale]/(user)/components/chat-window";
import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import InquiryTimeline from "@/app/[locale]/(user)/components/inquiry-timeline";
import Loader from "@/app/[locale]/(user)/components/loader";
import VariantSection from "@/app/[locale]/(user)/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/components/variant-section";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import {
  useInquiry,
  useUpdateInquiry,
} from "@/app/react-query/inquiries/hooks";
import {
  aggregateInquiryStatus,
  getIdFromRelationshipField,
} from "@roo/common";
import { Building, Check, Package, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import InquiryDetails from "@/app/[locale]/(user)/components/inquiry-details";
import { VariantEntertainmentDetails } from "@/app/[locale]/(user)/components/variant-entertainment-details";
import { VariantGastroDetails } from "@/app/[locale]/(user)/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/components/variant-gastro-details";
import { VariantVenueDetails } from "@/app/[locale]/(user)/company-profile/companies/[companyId]/listings/[listingId]/variants/[variantId]/components/variant-venue-details";
import { useEffect } from "react";
import AlertInfoSections from "./components/alert-info-sections";
import { useListing } from "@/app/react-query/listings/hooks";
import { useEvent, useUpdateEvent } from "@/app/react-query/events/hooks";

export default function page() {
  const { inquiryId } = useParams<{
    inquiryId: string;
  }>();

  const { data: inquiry, isPending } = useInquiry(inquiryId);
  const { data: listing } = useListing(
    getIdFromRelationshipField(inquiry?.listing || ""),
  );
  const { data: event } = useEvent(
    getIdFromRelationshipField(inquiry?.event || ""),
  );
  const t = useTranslations("global");
  const { mutate: patchInquiry } = useUpdateInquiry({
    listingId: getIdFromRelationshipField(inquiry?.listing || ""),
  });
  const { mutate: updateEvent } = useUpdateEvent({});

  useEffect(() => {
    if (!inquiry) return;
    patchInquiry({
      id: inquiryId,
      data: {
        activity: {
          lastUserSeenAt: new Date().toISOString(),
        },
      },
    });
  }, []);

  if (isPending) return <Loader text="Načítám poptávku..." />;
  if (!inquiry) return null;

  const aggregatedStatus = aggregateInquiryStatus(inquiry.status);

  const status = INQUIRY_STATUS[aggregatedStatus];
  const listingName =
    typeof inquiry.listing === "string" ? "Poptávka" : inquiry.listing.name;
  const customerName =
    typeof inquiry.user !== "string"
      ? `${inquiry.user.firstName} ${inquiry.user.lastName}`
      : "Zákazník";

  function cancelInquiry() {
    patchInquiry({
      id: inquiryId,
      data: { status: { ...inquiry!.status, user: "cancelled" } },
    });
  }

  const confirmAcceptInquiry = () => {
    patchInquiry({
      id: inquiryId,
      data: {
        status: {
          user: "confirmed",
        },
      },
    });
  };

  const acceptInquiryHandler = () => {
    confirmActionModalEvents.emit("open", {
      title: "Potvrdit poptávku",
      description:
        "Dodavatel bude informován o vašem rozhodnutí a poptávka přejde do stavu 'Potvrzeno'. Následně bude řada na dodavateli, aby objednávku finálně odsouhlasil.",
      Icon: Check,
      buttonText: "Potvrdit poptávku",
      buttonVersion: "successFull",
      textColor: "text-success",
      whatIsGoingToHappenText: "Jakmile tuto poptávku potvrdíte:",
      whatIsGoingToHappenTextColor: "success",
      whatIsGoingToHappenList: [
        "Dodavatel bude informován o vašem rozhodnutí",
        "Poptávka přejde do stavu 'Potvrzeno'",
        "Tuto akci nelze vrátit zpět",
      ],
      borderColor: "border-success",
      bgColor: "bg-success-surface",
      onConfirmClick: async () => confirmAcceptInquiry(),
    });
  };

  const cancelInquiryHandler = () => {
    confirmActionModalEvents.emit("open", {
      title: "Zrušit poptávku",
      description:
        "Dodavatel bude informován o vašem rozhodnutí a poptávka přejde do stavu 'Odmítnuto'. Tuto akci nelze vrátit zpět.",
      Icon: X,
      buttonText: "Zrušit poptávku",
      buttonVersion: "dangerFull",
      textColor: "text-danger",
      whatIsGoingToHappenText: "Opravdu chcete zrušit tuto poptávku?",
      whatIsGoingToHappenTextColor: "danger",
      whatIsGoingToHappenList: [
        "Dodavatel bude informován o vašem rozhodnutí",
        "Poptávka přejde do stavu 'Odmítnuto'",
        "Tuto akci nelze vrátit zpět",
      ],
      borderColor: "border-danger",
      bgColor: "bg-danger-surface",
      onConfirmClick: async () => cancelInquiry(),
    });
  };

  const setAsEventVenueHandler = () => {
    if (!event) return;
    updateEvent({
      id: event.id,
      data: {
        location: {
          ...event.location,
          venue: listing?.id || "",
        },
      },
    });
  };

  const confirmSetAsEventVenue = () => {
    confirmActionModalEvents.emit("open", {
      title: "Nastavit jako místo konání",
      description:
        "Tímto krokem nastavíte tuto službu jako místo konání pro tento event. Tuto akci nelze vrátit zpět.",
      Icon: Building,
      buttonText: "Nastavit jako místo konání",
      buttonVersion: "successFull",
      textColor: "text-success",
      whatIsGoingToHappenText:
        "Opravdu chcete nastavit tuto službu jako místo konání?",
      whatIsGoingToHappenTextColor: "success",
      whatIsGoingToHappenList: [],
      borderColor: "border-success",
      bgColor: "bg-success-surface",
      onConfirmClick: async () => setAsEventVenueHandler(),
    });
  };

  const listingCanBeSetAsEventVenue =
    listing?.type === "venue" &&
    !event?.location?.venue &&
    event?.location?.type === "venue" &&
    aggregateInquiryStatus(inquiry.status) === "confirmed";

  return (
    <main className="w-full flex flex-col gap-6">
      <Breadcrumbs />
      <DashboardHeader
        icon={Package}
        name={listingName}
        nameSideComponent={
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
        }
        infoItems={[
          { icon: "Tag", text: t(`listings.type.${inquiry.listingType}`) },

          { icon: "User", text: customerName },
        ]}
      />
      <div className="bg-white rounded-2xl border border-zinc-200 px-8 py-5">
        <InquiryTimeline status={inquiry.status} />
      </div>
      <AlertInfoSections
        inquiry={inquiry}
        acceptInquiryHandler={acceptInquiryHandler}
      />
      <InquiryDetails inquiry={inquiry} listing={listing} />
      <div
        className={`flex flex-col gap-6 w-full ${aggregatedStatus === "cancelled" ? "opacity-50 pointer-events-none cursor-default" : ""}`}
      >
        <ControlSection
          rows={[
            {
              disabled: !listingCanBeSetAsEventVenue,
              title: "Nastavit jako místo konání",
              text: "Tímto krokem nastavíte tuto službu jako místo konání pro tento event. Tuto akci nelze vrátit zpět.",
              icon: "Building",
              iconColor: "text-event",
              iconBgColor: "bg-event-surface",
              button: {
                version: "successFull",
                text: "Nastavit jako místo konání",
                iconLeft: "Building",
                size: "sm",
                onClick: confirmSetAsEventVenue,
              },
            },
            {
              disabled:
                inquiry.status.user === "confirmed" ||
                inquiry.status.company !== "confirmed",
              title: "Potvrdit poptávku",
              text: "Potvzením poptávky uzavíráte dohodu s firmou. Z vaší strany již budou podmínky neměnné",
              icon: "Check",
              iconColor: "text-success",
              iconBgColor: "bg-success-surface",
              button: {
                version: "successFull",
                text: "Potvrdit",
                iconLeft: "Check",
                size: "sm",
                onClick: acceptInquiryHandler,
              },
            },
            {
              title: "Zrušit poptávku",
              text: "Zrušením poptávky informujete zákazníka, že nemůžete nabídnout své služby pro jeho požadavek.",
              icon: "X",
              iconColor: "text-danger",
              iconBgColor: "bg-danger-surface",
              disabled:
                aggregateInquiryStatus(inquiry.status) === "cancelled" ||
                aggregateInquiryStatus(inquiry.status) === "confirmed",
              button: {
                version: "dangerFull",
                text: "Zrušit",
                iconLeft: "X",
                size: "sm",
                onClick: cancelInquiryHandler,
              },
            },
          ]}
        />
        <ChatWindow
          senderRole="user"
          inquiryId={inquiry.id}
          listingId={getIdFromRelationshipField(inquiry?.listing || "")}
        />
        {typeof inquiry.variant !== "string" && inquiry.variant && (
          <>
            <VariantSection
              variant={inquiry.variant}
              title="Vybraná varianta"
            />
            {inquiry.variant.details.map((block, i) => {
              if (block.blockType === "venue")
                return <VariantVenueDetails key={i} block={block} />;
              if (block.blockType === "gastro")
                return <VariantGastroDetails key={i} block={block} />;
              if (block.blockType === "entertainment")
                return <VariantEntertainmentDetails key={i} block={block} />;
              return null;
            })}
          </>
        )}
      </div>
    </main>
  );
}
