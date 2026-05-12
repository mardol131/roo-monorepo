import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import Text from "@/app/components/ui/atoms/text";
import type { Inquiry } from "@roo/common";
import { FileText } from "lucide-react";

type Props = {
  inquiry: Inquiry;
};

const PRICING_MODE_LABELS: Record<Inquiry["pricing"]["mode"], string> = {
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
          value={PRICING_MODE_LABELS[inquiry.pricing.mode]}
        />
        {inquiry.pricing.quotedPrice != null && (
          <Row
            label="Nabídnutá cena"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.pricing.quotedPrice} Kč
              </Text>
            }
          />
        )}
        {inquiry.pricing.agreedPrice != null && (
          <Row
            label="Dohodnutá cena"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.pricing.agreedPrice} Kč
              </Text>
            }
          />
        )}
        {inquiry.request?.note && (
          <Row
            label="Zpráva od zákazníka"
            value={
              <Text variant="body-sm" color="textDark">
                {inquiry.request.note}
              </Text>
            }
          />
        )}
        {(inquiry.request?.requirements ?? []).length > 0 && (
          <Row
            label="Požadavky"
            value={
              <ul className="flex flex-col gap-1">
                {inquiry.request.requirements!.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                    <Text variant="body-sm" color="textDark">
                      {req.text}
                    </Text>
                  </li>
                ))}
              </ul>
            }
          />
        )}
      </div>
    </DashboardSection>
  );
}
