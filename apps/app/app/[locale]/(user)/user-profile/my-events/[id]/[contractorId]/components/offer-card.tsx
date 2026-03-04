import Text from "@/app/components/ui/atoms/text";
import { Check, X } from "lucide-react";
import type { Inquiry } from "../types";
import SectionHeader from "./section-header";

type Props = {
  offer: Inquiry["offer"];
};

export default function OfferCard({ offer }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <SectionHeader icon={Check} title="Nabídka dodavatele" />
      <div className="p-5 flex flex-col gap-4">
        <div>
          <Text variant="label1" color="dark" className="font-semibold">
            {offer.title}
          </Text>
          <Text
            variant="label4"
            color="secondary"
            className="mt-1 leading-relaxed"
          >
            {offer.description}
          </Text>
        </div>

        <div className="flex items-baseline gap-1.5">
          <Text variant="heading5" color="dark" className="font-bold">
            {offer.price.toLocaleString("cs-CZ")} Kč
          </Text>
          <Text variant="label4" color="secondary">
            {offer.duration}
          </Text>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
          {offer.includes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Text
                variant="label4"
                color="secondary"
                className="font-medium uppercase tracking-wide"
              >
                Součástí
              </Text>
              {offer.includes.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-xs text-zinc-700"
                >
                  <Check
                    className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                    strokeWidth={2.5}
                  />
                  {item}
                </span>
              ))}
            </div>
          )}
          {offer.excludes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Text
                variant="label4"
                color="secondary"
                className="font-medium uppercase tracking-wide"
              >
                Není součástí
              </Text>
              {offer.excludes.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-xs text-zinc-500"
                >
                  <X
                    className="w-3.5 h-3.5 text-red-400 shrink-0"
                    strokeWidth={2.5}
                  />
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
