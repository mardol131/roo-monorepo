import Text from "@/app/components/ui/atoms/text";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Inquiry, InquiryStatus } from "../types";

const INQUIRY_STATUS: Record<
  InquiryStatus,
  { label: string; badge: string }
> = {
  pending: { label: "Čeká na odpověď", badge: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Potvrzeno", badge: "bg-emerald-100 text-emerald-700" },
  declined: { label: "Odmítnuto", badge: "bg-red-100 text-red-600" },
};

type Props = {
  eventId: string;
  inquiry: Pick<Inquiry, "status" | "sentAt" | "supplier" | "event">;
};

export default function InquiryHeader({ eventId, inquiry }: Props) {
  const statusCfg = INQUIRY_STATUS[inquiry.status];

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Text variant="heading4" color="dark" className="font-bold">
            {inquiry.supplier.name}
          </Text>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.badge}`}
          >
            {statusCfg.label}
          </span>
        </div>
        <Text variant="label2" color="secondary">
          Poptávka pro událost{" "}
          <Link
            href={`/user-profile/my-events/${eventId}`}
            className="text-rose-500 hover:underline"
          >
            {inquiry.event.name}
          </Link>{" "}
          · odesláno {inquiry.sentAt}
        </Text>
      </div>
      <Link
        href={`/listing/${inquiry.supplier.slug}`}
        target="_blank"
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors shrink-0"
      >
        <ExternalLink className="w-4 h-4" />
        Profil dodavatele
      </Link>
    </div>
  );
}
