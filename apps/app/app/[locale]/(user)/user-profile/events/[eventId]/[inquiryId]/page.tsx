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
  useInquiry,
  useUpdateInquiry,
} from "@/app/react-query/inquiries/hooks";
import {
  aggregateInquiryStatus,
  getIdFromRelationshipField,
} from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check, Clock, Package, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { useChatMessagesByInquiry } from "@/app/react-query/chat-messages/hooks";
import { useEffect, useState } from "react";
import { PriceChangeModal } from "@/app/components/ui/molecules/modals/price-change-modal";
import { VariantVenueDetails } from "@/app/[locale]/(user)/components/variant-venue-details";
import { VariantGastroDetails } from "@/app/[locale]/(user)/components/variant-gastro-details";
import { VariantEntertainmentDetails } from "@/app/[locale]/(user)/components/variant-entertainment-details";
import InquiryDetails from "@/app/[locale]/(user)/components/inquiry-details";
import AlertInfoSections from "./components/alert-info-sections";

export default function page() {
  const { inquiryId } = useParams<{
    inquiryId: string;
  }>();

  const { data: inquiry, isPending } = useInquiry(inquiryId);
  const t = useTranslations();
  const { mutate: patchInquiry } = useUpdateInquiry({
    listingId: getIdFromRelationshipField(inquiry?.listing || ""),
  });

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

  const status = INQUIRY_STATUS[aggregateInquiryStatus(inquiry.status)];
  const listingName =
    typeof inquiry.listing === "string" ? "Poptávka" : inquiry.listing.name;
  const customerName =
    typeof inquiry.user !== "string"
      ? `${inquiry.user.firstName} ${inquiry.user.lastName}`
      : "Zákazník";

  function confirmInquiry() {
    patchInquiry({
      id: inquiryId,
      data: { status: { ...inquiry!.status, user: "confirmed" } },
    });
  }

  function cancelInquiry() {
    patchInquiry({
      id: inquiryId,
      data: { status: { ...inquiry!.status, user: "cancelled" } },
    });
  }

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
      <AlertInfoSections inquiry={inquiry} />
      <ControlSection
        rows={[
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
              onClick: () =>
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
                  onConfirmClick: async () => confirmInquiry(),
                }),
            },
          },
          {
            title: "Zrušit poptávku",
            text: "Zrušením poptávky informujete zákazníka, že nemůžete nabídnout své služby pro jeho požadavek.",
            icon: "X",
            iconColor: "text-danger",
            iconBgColor: "bg-danger-surface",
            button: {
              version: "dangerFull",
              text: "Zrušit",
              iconLeft: "X",
              size: "sm",
              onClick: () =>
                confirmActionModalEvents.emit("open", {
                  title: "Zrušit poptávku",
                  description:
                    "Dodavatel bude informován o vašem rozhodnutí a poptávka přejde do stavu 'Odmítnuto'. Tuto akci nelze vrátit zpět.",
                  Icon: X,
                  buttonText: "Zrušit poptávku",
                  buttonVersion: "dangerFull",
                  textColor: "text-danger",
                  whatIsGoingToHappenText:
                    "Opravdu chcete zrušit tuto poptávku?",
                  whatIsGoingToHappenTextColor: "danger",
                  whatIsGoingToHappenList: [
                    "Dodavatel bude informován o vašem rozhodnutí",
                    "Poptávka přejde do stavu 'Odmítnuto'",
                    "Tuto akci nelze vrátit zpět",
                  ],
                  borderColor: "border-danger",
                  bgColor: "bg-danger-surface",
                  onConfirmClick: async () => cancelInquiry(),
                }),
            },
          },
        ]}
      />
      <ChatWindow
        senderRole="user"
        inquiryId={inquiry.id}
        listingId={getIdFromRelationshipField(inquiry?.listing || "")}
      />
      <InquiryDetails inquiry={inquiry} />
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
