import Text from "@/app/components/ui/atoms/text";
import { INQUIRY_STATUS } from "@/app/data/inquiry";
import { IntlLink, Link } from "@/app/i18n/navigation";
import { hasUnreadMessageForUser, Inquiry } from "@roo/common";
import { Calendar, ChevronRight, MapPin } from "lucide-react";

export function InquiryCard({
  inquiry,
  link,
}: {
  inquiry: Inquiry;
  link: IntlLink;
}) {
  const unread = hasUnreadMessageForUser(inquiry);
  const status = INQUIRY_STATUS[inquiry.status];
  const StatusIcon = status.icon;

  return (
    <Link
      href={link}
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all px-6 py-5 flex items-center gap-5"
    >
      {/* Icon */}
      <div className="relative w-11 h-11 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0">
        <StatusIcon className={`w-5 h-5 ${status.iconColor}`} />
        {unread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <Text
            variant="label1"
            color="dark"
            className="font-semibold truncate"
          >
            {inquiry.company.name}
          </Text>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            {inquiry.event.name} · {inquiry.event.date}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            {inquiry.company.location}
          </span>
        </div>
      </div>

      {/* Price */}
      <Text
        variant="label1"
        color="dark"
        className="font-semibold shrink-0 hidden sm:block"
      >
        {inquiry.offer.price.toLocaleString("cs-CZ")} Kč
      </Text>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
    </Link>
  );
}
