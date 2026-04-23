import Text from "@/app/components/ui/atoms/text";
import { Check, X } from "lucide-react";
import SectionHeader from "./section-header";
import { Variant } from "@roo/common";

type Props = {
  variant: Variant;
};

export default function EventDashboardVariantSection({ variant }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <SectionHeader icon={Check} title="Nabídka dodavatele" />
      <div className="p-5 flex flex-col gap-4">
        <div>
          <Text variant="label-lg" color="textDark" className="font-semibold">
            {variant.name}
          </Text>
          <Text
            variant="caption"
            color="secondary"
            className="mt-1 leading-relaxed"
          >
            {variant.description}
          </Text>
        </div>

        <div className="flex items-baseline gap-1.5">
          <Text variant="h4" color="textDark" className="font-bold">
            {variant.price.generalPrice.toLocaleString("cs-CZ")} Kč
          </Text>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
          {variant.includes && variant.includes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Text
                variant="caption"
                color="secondary"
                className="font-medium uppercase tracking-wide"
              >
                Součástí
              </Text>
              {variant.includes.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-2 text-xs text-zinc-700"
                >
                  <Check
                    className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                    strokeWidth={2.5}
                  />
                  {item.item}
                </span>
              ))}
            </div>
          )}
          {variant.excludes && variant.excludes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Text
                variant="caption"
                color="secondary"
                className="font-medium uppercase tracking-wide"
              >
                Není součástí
              </Text>
              {variant.excludes.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-2 text-xs text-zinc-500"
                >
                  <X
                    className="w-3.5 h-3.5 text-red-400 shrink-0"
                    strokeWidth={2.5}
                  />
                  {item.item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
