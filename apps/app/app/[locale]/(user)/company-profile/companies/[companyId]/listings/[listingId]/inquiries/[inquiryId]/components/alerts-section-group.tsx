import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { Inquiry } from "@roo/common";
import { Check, HandshakeIcon, X } from "lucide-react";
import React from "react";

type Props = {
  inquiry: Inquiry;
  acceptInquiryHandler: () => void;
  priceChangeModalHandler: () => void;
};

export default function AlertsSectionGroup({
  inquiry,
  acceptInquiryHandler,
  priceChangeModalHandler,
}: Props) {
  const content = () => {
    if (
      inquiry.status.user === "pending" &&
      inquiry.status.company === "pending" &&
      inquiry.pricing.quotedPrice
    ) {
      return (
        <AlertSection
          icon={Check}
          iconBg="bg-success-surface"
          iconColor="text-success"
          borderColor="border-zinc-200"
          title="Potvrzení poptávky"
          text="Poptávka teď čeká na potvrzení z vaší strany. Pokud poptávku potvrdíte, zákazník obdrží oznámení a bude muset odsouhlasit svou stranu."
          bgColor="bg-white"
          button={{
            text: "Potvrdit poptávku",
            version: "successFull",
            iconLeft: "Check",
            size: "sm",
            onClick: acceptInquiryHandler,
          }}
        />
      );
    }

    if (
      inquiry.status.user === "pending" &&
      inquiry.status.company === "pending" &&
      !inquiry.pricing.quotedPrice
    ) {
      return (
        <AlertSection
          icon={Check}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          borderColor="border-amber-400"
          title="Poptávka nemá určenou cenu"
          text="Abyste mohli poptávku potvrdit, musíte nejprve nastavit cenu. Klikněte na tlačítko níže a zadejte cenu, za kterou jste ochotni poptávku realizovat."
          bgColor="bg-yellow-50"
          button={{
            version: "none",
            className: "bg-yellow-500 text-white",
            text: "Změnit cenu",
            iconLeft: "Coins",
            size: "sm",
            onClick: () => priceChangeModalHandler(),
          }}
        />
      );
    }

    if (
      inquiry.status.user === "confirmed" &&
      inquiry.status.company === "confirmed"
    ) {
      return (
        <AlertSection
          icon={Check}
          iconBg="bg-success-surface"
          iconColor="text-success"
          borderColor="border-success"
          title="Poptávka je závazně potvrzená"
          text="Poptávka je závazně potvrzená. Můžete začít komunikovat se zákazníkem a připravovat realizaci objednávky."
          bgColor="bg-success-surface"
        />
      );
    }

    if (inquiry.status.user === "cancelled") {
      return (
        <AlertSection
          icon={X}
          iconBg="bg-danger-surface"
          iconColor="text-danger"
          borderColor="border-danger"
          title="Poptávající zrušil poptávku"
          text="Zákazník zrušil tuto poptávku."
          bgColor="bg-danger-surface"
        />
      );
    }

    if (
      inquiry.status.company === "confirmed" &&
      inquiry.status.user === "pending"
    ) {
      return (
        <AlertSection
          icon={HandshakeIcon}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          borderColor="border-amber-400"
          title="Čeká se na potvrzení zákazníka"
          text="Poptávka byla přijata firmou a čeká se na potvrzení zákazníka. Jakmile zákazník potvrdí, poptávka bude závazně potvrzená."
          bgColor="bg-amber-50"
        />
      );
    }
  };
  return <>{content()}</>;
}
