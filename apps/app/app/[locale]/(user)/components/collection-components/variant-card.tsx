import Text from "@/app/components/ui/atoms/text";
import { Link, IntlLink } from "@/app/i18n/navigation";
import { Variant } from "@roo/common";
import { ChevronRight, Clock, Package } from "lucide-react";

type Props = {
  variant: Variant;
  link: IntlLink;
};

export default function VariantCard({ variant, link }: Props) {
  return (
    <Link
      href={link}
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all px-6 py-5 flex items-center gap-5"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <Text
            variant="label1"
            color="dark"
            className="font-semibold truncate"
          >
            {variant.title}
          </Text>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 bg-emerald-50 text-emerald-600">
            {variant.price.toLocaleString("cs-CZ")} Kč
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            {variant.duration}
          </span>
          {variant.availableDate && (
            <span className="text-xs text-zinc-500">
              Dostupné od {variant.availableDate}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
    </Link>
  );
}
