import { AlertSection } from "@/app/components/ui/molecules/alert-section";
import { Inquiry } from "@roo/common";
import { Check, Clock, X } from "lucide-react";
import { ComponentProps } from "react";

type AlertConfig = ComponentProps<typeof AlertSection> & {
  condition: (status: Inquiry["status"]) => boolean;
};

const ALERT_CONFIG: AlertConfig[] = [
  {
    condition: (s: Inquiry["status"]) =>
      s.company !== "confirmed" &&
      s.user !== "confirmed" &&
      s.company !== "cancelled" &&
      s.user !== "cancelled",
    icon: Clock,
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-500",
    borderColor: "border-zinc-200",
    title: "Čekáme na vyjádření firmy",
    text: "Poptávka byla odeslána. Nyní čekáme, až ji firma posoudí a potvrdí. Poté budete vyzváni k finálnímu odsouhlasení. V tuto chvíli je stále možné měnit podmínky poptávky, případně ji zrušit.",
    bgColor: "bg-white",
  },
  {
    condition: (s: Inquiry["status"]) => s.company === "confirmed" && s.user !== "confirmed" && s.user !== "cancelled",
    icon: Check,
    iconBg: "bg-success-surface",
    iconColor: "text-success",
    borderColor: "border-success",
    title: "Firma potvrdila poptávku",
    text: "Firma potvrdila poptávku dle nastavených podmínek, které můžete vidět níže. Nyní je řada na vás — potvrďte poptávku, aby mohla být uzavřena.",
    bgColor: "bg-success-surface",
  },
  {
    condition: (s: Inquiry["status"]) => s.user === "confirmed" && s.company === "confirmed",
    icon: Check,
    iconBg: "bg-success-surface",
    iconColor: "text-success",
    borderColor: "border-success",
    title: "Poptávka je potvrzena oběma stranami",
    text: "Vy i firma jste poptávku potvrdili. Vše je připraveno.",
    bgColor: "bg-success-surface",
  },
  {
    condition: (s: Inquiry["status"]) => s.user === "confirmed" && s.company !== "confirmed" && s.company !== "cancelled",
    icon: Check,
    iconBg: "bg-success-surface",
    iconColor: "text-success",
    borderColor: "border-success",
    title: "Teď je řada na firmě",
    text: "Z vaší strany je vše připraveno. Teď je třeba ještě počkat na finální potvrzení od dodavatele.",
    bgColor: "bg-success-surface",
  },
  {
    condition: (s: Inquiry["status"]) => s.user === "cancelled",
    icon: X,
    iconBg: "bg-danger-surface",
    iconColor: "text-danger",
    borderColor: "border-danger",
    title: "Poptávající zrušil poptávku",
    text: "Zákazník zrušil tuto poptávku.",
    bgColor: "bg-danger-surface",
  },
  {
    condition: (s: Inquiry["status"]) => s.company === "cancelled",
    icon: X,
    iconBg: "bg-danger-surface",
    iconColor: "text-danger",
    borderColor: "border-danger",
    title: "Firma zrušila poptávku",
    text: "Firma odmítla tuto poptávku.",
    bgColor: "bg-danger-surface",
  },
];

type Props = {
  inquiry: Inquiry;
};

export default function AlertInfoSections({ inquiry }: Props) {
  const active = ALERT_CONFIG.filter((a) => a.condition(inquiry.status));

  return (
    <>
      {active.map(({ condition: _condition, ...props }, i) => (
        <AlertSection key={i} {...props} />
      ))}
    </>
  );
}
