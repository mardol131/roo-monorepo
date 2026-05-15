"use client";

import Breadcrumbs from "@/app/[locale]/(user)/components/breadcrumbs";
import ChatWindow from "@/app/[locale]/(user)/components/chat-window";
import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import DashboardHeader from "@/app/[locale]/(user)/components/dashboard-header";
import InquiryTimeline from "@/app/[locale]/(user)/components/inquiry-timeline";
import Loader from "@/app/[locale]/(user)/components/loader";
import VariantSection from "@/app/[locale]/(user)/components/variant-section";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import {
  useInquiriesByEvent,
  useInquiry,
  useUpdateInquiry,
} from "@/app/react-query/inquiries/hooks";
import {
  aggregateInquiryStatus,
  getIdFromRelationshipField,
} from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check, Coins, HandshakeIcon, Package, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import EventSharingCard from "./components/event-sharing-card";
import InquiryDetails from "../../../../../../../components/inquiry-details";
import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { useChatMessagesByInquiry } from "@/app/react-query/chat-messages/hooks";
import { useEffect, useState } from "react";
import { PriceChangeModal } from "@/app/components/ui/molecules/modals/price-change-modal";
import { VariantVenueDetails } from "@/app/[locale]/(user)/components/variant-venue-details";
import { VariantGastroDetails } from "@/app/[locale]/(user)/components/variant-gastro-details";
import { VariantEntertainmentDetails } from "@/app/[locale]/(user)/components/variant-entertainment-details";
import AlertsSectionGroup from "./components/alerts-section-group";

export default function page() {
  const { companyId, listingId, inquiryId } = useParams<{
    companyId: string;
    listingId: string;
    inquiryId: string;
  }>();

  const { data: inquiry, isPending } = useInquiry(inquiryId, {
    refetchInterval: 10_000,
  });
  const t = useTranslations();
  const [priceChangeModalOpen, setPriceChangeModalOpen] = useState(false);
  const { mutate: patchInquiry } = useUpdateInquiry({ listingId });
  const { data: inquiriesByEvent } = useInquiriesByEvent(
    getIdFromRelationshipField(inquiry?.event || ""),
    {
      query: {
        and: [
          { "status.company": { equals: "confirmed" } },
          { "status.user": { equals: "confirmed" } },
        ],
      },
      refetchInterval: 10_000,
    },
  );

  console.log("inquiriesByEvent", inquiriesByEvent);

  useEffect(() => {
    patchInquiry({
      id: inquiryId,
      data: {
        activity: {
          lastCompanySeenAt: new Date().toISOString(),
        },
      },
    });
  }, [inquiryId, patchInquiry]);

  if (isPending) return <Loader text="Načítám poptávku..." />;
  if (!inquiry) return null;

  const status = INQUIRY_STATUS[aggregateInquiryStatus(inquiry.status)];
  const listingName =
    typeof inquiry.listing === "string" ? "Poptávka" : inquiry.listing.name;
  const customerName =
    typeof inquiry.user !== "string"
      ? `${inquiry.user.firstName} ${inquiry.user.lastName}`
      : "Zákazník";

  const priceChangeModalStateHandler = () => {
    setPriceChangeModalOpen(!priceChangeModalOpen);
  };

  const confirmAcceptInquiry = () => {
    patchInquiry({
      id: inquiryId,
      data: {
        status: {
          company: "confirmed",
        },
      },
    });
  };

  const confirmCancelInquiryHandler = () => {
    patchInquiry({
      id: inquiryId,
      data: {
        status: {
          company: "cancelled",
        },
      },
    });
  };

  const acceptInquiryHandler = () => {
    confirmActionModalEvents.emit("open", {
      title: "Potvrdit poptávku",
      description:
        "Zákazník bude informován, že jeho poptávka byla potvrzena. Zákazník bude muset potvrdit svou stranu, aby poptávka přešla do stavu 'Závazně potvrzeno'.",
      Icon: Check,
      borderColor: "border-success",
      buttonText: "Potvrdit poptávku",
      buttonVersion: "successFull",
      textColor: "text-success",
      whatIsGoingToHappenText: "Opravdu chcete potvrdit tuto poptávku?",
      whatIsGoingToHappenTextColor: "success",
      whatIsGoingToHappenList: [
        "Zákazník obdrží oznámení o potvrzení",
        "Poptávka přejde do stavu 'Závazně potvrzeno'",
        "Tuto akci nelze vrátit zpět",
      ],
      bgColor: "bg-success-surface",
      onConfirmClick: async () => {
        confirmAcceptInquiry();
      },
    });
  };

  const cancelInquiryHandler = () => {
    confirmActionModalEvents.emit("open", {
      title: "Odmítnout poptávku",
      description: "Zákazník bude informován, že jeho poptávka byla odmítnuta.",
      Icon: X,
      buttonText: "Odmítnout poptávku",
      buttonVersion: "dangerFull",
      textColor: "text-danger",
      whatIsGoingToHappenText: "Opravdu chcete odmítnout tuto poptávku?",
      whatIsGoingToHappenTextColor: "danger",
      whatIsGoingToHappenList: [
        "Zákazník obdrží oznámení o odmítnutí",
        "Poptávka přejde do stavu 'Odmítnuto'",
        "Tuto akci nelze vrátit zpět",
      ],
      borderColor: "border-danger",
      bgColor: "bg-danger-surface",
      onConfirmClick: async () => confirmCancelInquiryHandler(),
    });
  };

  const fullEvent = typeof inquiry.event !== "string" ? inquiry.event : null;

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
      <AlertsSectionGroup
        inquiry={inquiry}
        acceptInquiryHandler={acceptInquiryHandler}
      />
      <InquiryDetails inquiry={inquiry} />
      <PriceChangeModal
        isOpen={priceChangeModalOpen}
        onClose={priceChangeModalStateHandler}
        inquiryId={inquiry.id}
        currentPrice={inquiry.pricing.quotedPrice || undefined}
      />
      <ControlSection
        rows={[
          ...(inquiry.status.user === "pending" &&
          inquiry.status.company === "pending"
            ? [
                {
                  title: "Potvrdit poptávku",
                  text: "Potvrzením poptávky informujete zákazníka, že jeho požadavek akceptujete. Zákazník bude muset potvrdit svou stranu, aby poptávka přešla do stavu 'Závazně potvrzeno'.",
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
                } as const,
              ]
            : []),
          ...(inquiry.status.company === "pending"
            ? [
                {
                  disabled: inquiry.status.user === "confirmed",
                  title: "Navrhnout novou cenu",
                  text: "Můžete přizpůsobit cenu poptávky a odeslat návrh zákazníkovi.",
                  icon: "Coins",
                  iconColor: "text-yellow-600",
                  iconBgColor: "bg-yellow-100",
                  button: {
                    version: "none",
                    className: "bg-yellow-500 text-white",
                    text: "Změnit cenu",
                    iconLeft: "Coins",
                    size: "sm",
                    onClick: () => priceChangeModalStateHandler(),
                  },
                } as const,
              ]
            : []),
          {
            title: "Odmítnout poptávku",
            text: "Odmítnutím poptávky informujete zákazníka, že nemůžete nabídnout své služby pro jeho požadavek.",
            icon: "X",
            iconColor: "text-danger",
            iconBgColor: "bg-danger-surface",
            button: {
              version: "dangerFull",
              text: "Odmítnout",
              iconLeft: "X",
              size: "sm",
              onClick: () => cancelInquiryHandler(),
            },
          },
        ]}
      />
      <ChatWindow
        senderRole="company"
        inquiryId={inquiry.id}
        listingId={listingId}
      />
      {fullEvent && (
        <EventSharingCard
          event={fullEvent}
          inquiries={inquiriesByEvent?.docs ?? []}
          contactUser={inquiry.user}
        />
      )}
      {typeof inquiry.variant !== "string" && inquiry.variant && (
        <>
          <VariantSection variant={inquiry.variant} title="Vybraná varianta" />
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
    </main>
  );
}
