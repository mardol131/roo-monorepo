import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { Inquiry } from "@roo/common";
import { Check, HandshakeIcon, X } from "lucide-react";
import React from "react";

type Props = {
  inquiry: Inquiry;
  acceptInquiryHandler: () => void;
};

export default function AlertsSectionGroup({
  inquiry,
  acceptInquiryHandler,
}: Props) {
  return (
    <>
      {inquiry.status.user === "pending" &&
        inquiry.status.company === "pending" && (
          <AlertSection
            icon={Check}
            iconBg="bg-success-surface"
            iconColor="text-success"
            borderColor="border-zinc-200"
            title="Poptávající vytvořil poptávku"
            text="Zákazník vytvořil poptávku a čeká na vaši odpověď. Pokud poptávku potvrdíte, zákazník obdrží oznámení a bude muset odsouhlasit svou stranu."
            bgColor="bg-white"
            button={{
              text: "Potvrdit poptávku",
              version: "successFull",
              iconLeft: "Check",
              size: "sm",
              onClick: acceptInquiryHandler,
            }}
          />
        )}
      {inquiry.status.user === "confirmed" &&
        inquiry.status.company === "confirmed" && (
          <AlertSection
            icon={Check}
            iconBg="bg-success-surface"
            iconColor="text-success"
            borderColor="border-success"
            title="Poptávka je závazně potvrzená"
            text="Poptávka je závazně potvrzená. Můžete začít komunikovat se zákazníkem a připravovat realizaci objednávky."
            bgColor="bg-success-surface"
          />
        )}

      {inquiry.status.company === "confirmed" &&
        inquiry.status.user === "pending" && (
          <AlertSection
            icon={HandshakeIcon}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            borderColor="border-amber-400"
            title="Čeká se na potvrzení zákazníka"
            text="Poptávka byla přijata firmou a čeká se na potvrzení zákazníka. Jakmile zákazník potvrdí, poptávka bude závazně potvrzená."
            bgColor="bg-amber-50"
          />
        )}
      {inquiry.status.user === "cancelled" && (
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
    </>
  );
}
