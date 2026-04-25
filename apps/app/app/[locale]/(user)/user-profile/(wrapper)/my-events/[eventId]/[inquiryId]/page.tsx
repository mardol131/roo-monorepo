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
import { useInquiry } from "@/app/react-query/inquiries/hooks";
import { aggregateInquiryStatus } from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check, Coins, Package, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { AlertSection } from "@/app/[locale]/(user)/components/alert-section";
import { useChatMessagesByInquiry } from "@/app/react-query/chat-messages/hooks";
import { useState } from "react";
import { PriceChangeModal } from "@/app/components/ui/molecules/modals/price-change-modal";
import { VariantVenueDetails } from "@/app/[locale]/(user)/components/variant-venue-details";
import { VariantGastroDetails } from "@/app/[locale]/(user)/components/variant-gastro-details";
import { VariantEntertainmentDetails } from "@/app/[locale]/(user)/components/variant-entertainment-details";
import InquiryDetails from "@/app/[locale]/(user)/components/inquiry-details";

export default function page() {
  const { companyId, listingId, inquiryId } = useParams<{
    companyId: string;
    listingId: string;
    inquiryId: string;
  }>();

  const { data: inquiry, isPending } = useInquiry(inquiryId);
  const { data: chatMessages } = useChatMessagesByInquiry(inquiryId);
  const t = useTranslations();
  const [priceChangeModalOpen, setPriceChangeModalOpen] = useState(false);

  if (isPending) return <Loader text="Načítám poptávku..." />;
  if (!inquiry) return null;

  const status = INQUIRY_STATUS[aggregateInquiryStatus(inquiry)];
  const listingName =
    typeof inquiry.listing.value === "string"
      ? "Poptávka"
      : inquiry.listing.value.name;
  const customerName =
    typeof inquiry.user !== "string"
      ? `${inquiry.user.firstName} ${inquiry.user.lastName}`
      : "Zákazník";

  const priceChangeModalStateHandler = () => {
    setPriceChangeModalOpen(!priceChangeModalOpen);
  };
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
          {
            icon: "Clock",
            text: `Odesláno ${format(new Date(inquiry.sentAt), "d. M. yyyy", { locale: cs })}`,
          },
          { icon: "User", text: customerName },
        ]}
      />
      <div className="bg-white rounded-2xl border border-zinc-200 px-8 py-5">
        <InquiryTimeline
          userStatus={inquiry.userStatus}
          companyStatus={inquiry.companyStatus}
        />
      </div>
      {inquiry.userStatus === "confirmed" &&
        inquiry.companyStatus === "confirmed" && (
          <AlertSection
            icon={Check}
            iconBg="bg-success-surface"
            iconColor="text-success"
            borderColor="border-success"
            title="Firma potvrdila poptávku"
            text="Firma potvrdila poptávku dle nastavených podmínek, které můžete vidět níže."
            bgColor="bg-success-surface"
          />
        )}
      {inquiry.userStatus === "confirmed" && (
        <AlertSection
          icon={Check}
          iconBg="bg-success-surface"
          iconColor="text-success"
          borderColor="border-success"
          title="Teď je řada na firmě"
          text="Z vaší strany je vše připraveno. Teď je třeba ještě počkat na finální potvrzení od dodavatele."
          bgColor="bg-linear-to-r from-success-surface to-white"
        />
      )}
      {inquiry.userStatus === "cancelled" && (
        <AlertSection
          icon={X}
          iconBg="bg-danger-surface"
          iconColor="text-danger"
          borderColor="border-danger"
          title="Poptávající zrušil poptávku"
          text="Zákazník zrušil tuto poptávku."
          bgColor="bg-danger-surface"
        />
      )}
      <InquiryDetails inquiry={inquiry} />
      <PriceChangeModal
        isOpen={priceChangeModalOpen}
        onClose={priceChangeModalStateHandler}
        inquiryId={inquiry.id}
        currentPrice={inquiry.quotedPrice || undefined}
      />
      <ControlSection
        rows={[
          {
            disabled: inquiry.userStatus === "confirmed",
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
              onClick: () => priceChangeModalStateHandler(),
            },
          },
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
              onClick: () =>
                confirmActionModalEvents.emit("open", {
                  title: "Odmítnout poptávku",
                  description:
                    "Zákazník bude informován, že jeho poptávka byla odmítnuta.",
                  Icon: X,
                  buttonText: "Odmítnout poptávku",
                  buttonVersion: "dangerFull",
                  textColor: "text-danger",
                  whatIsGoingToHappenText:
                    "Opravdu chcete odmítnout tuto poptávku?",
                  whatIsGoingToHappenTextColor: "danger",
                  whatIsGoingToHappenList: [
                    "Zákazník obdrží oznámení o odmítnutí",
                    "Poptávka přejde do stavu 'Odmítnuto'",
                    "Tuto akci nelze vrátit zpět",
                  ],
                  borderColor: "border-danger",
                  bgColor: "bg-danger-surface",
                  onConfirmClick: async () => {
                    // TODO: reject inquiry mutation
                  },
                }),
            },
          },
        ]}
      />
      <ChatWindow
        initialMessages={chatMessages || []}
        senderRole="user"
        inquiryId={inquiry.id}
      />
      {typeof inquiry.variant?.value !== "string" && inquiry.variant?.value && (
        <>
          <VariantSection
            variant={inquiry.variant.value}
            title="Vybraná varianta"
          />
          {inquiry.variant.value.details.map((block, i) => {
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
