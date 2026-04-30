import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import Text from "@/app/components/ui/atoms/text";
import type { Inquiry } from "@roo/common";
import { FileText } from "lucide-react";

type Props = {
  inquiry: Inquiry;
};

const PRICING_MODE_LABELS: Record<Inquiry["pricingMode"], string> = {
  fixed: "Pevná cena",
  open: "Otevřená cena",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm text-zinc-500 w-40 shrink-0 pt-px">{label}</span>
      <span className="text-sm font-medium text-zinc-900">{value}</span>
    </div>
  );
}

export default function InquiryDetails({ inquiry }: Props) {
  return (
    <DashboardSection
      title="Detail poptávky"
      icon={"FileText"}
      iconBg="bg-zinc-100"
      iconColor="text-zinc-500"
    >
      <div className="flex flex-col gap-3">
        <Row
          label="Režim ceny"
          value={PRICING_MODE_LABELS[inquiry.pricingMode]}
        />
        {inquiry.quotedPrice != null && (
          <Row
            label="Nabídnutá cena"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.quotedPrice} Kč
              </Text>
            }
          />
        )}
        {inquiry.agreedPrice != null && (
          <Row
            label="Dohodnutá cena"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.agreedPrice} Kč
              </Text>
            }
          />
        )}
        {inquiry.customRequest && (
          <Row
            label="Zpráva od zákazníka"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.customRequest}
              </Text>
            }
          />
        )}
      </div>
    </DashboardSection>
  );
}
