import Text from "@/app/components/ui/atoms/text";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, XCircle } from "lucide-react";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import { Inquiry } from "@roo/common";

export function InquiryRow({
  inquiry,
  eventId,
}: {
  inquiry: Inquiry;
  eventId: string;
}) {
  const status = INQUIRY_STATUS[inquiry.status];
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/user-profile/my-events/${eventId}/${inquiry.id}`}
      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group"
    >
      <StatusIcon className={`w-5 h-5 shrink-0 ${status.iconColor}`} />

      <div className="flex-1 flex flex-col min-w-0">
        <Text variant="label1" color="dark" className="font-medium truncate">
          {inquiry.supplier.name}
        </Text>
        <Text variant="label4" color="secondary">
          {inquiry.supplier.category} · odesláno {inquiry.sentAt}
        </Text>
      </div>

      <Text
        variant="label1"
        color="dark"
        className="font-semibold shrink-0 hidden sm:block"
      >
        {inquiry.offer.price.toLocaleString("cs-CZ")} Kč
      </Text>

      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.className}`}
      >
        {status.label}
      </span>

      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </Link>
  );
}
