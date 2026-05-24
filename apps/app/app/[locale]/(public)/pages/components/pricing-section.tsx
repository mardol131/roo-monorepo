"use client";

import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { Check, Info, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type IntlLink } from "@/app/i18n/navigation";

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  payDescription?: string;
  planName: string;
  price: number;
  discountedPrice?: number;
  discountPercent?: number;
  currency?: string;
  period?: string;
  features: string[];
  payNote: string;
  cta: { text: string; href: IntlLink };
};

export default function PricingSection({
  badge,
  heading,
  subheading,
  payDescription,
  planName,
  price,
  discountedPrice,
  discountPercent,
  currency = "Kč",
  period = "měsíc",
  features,
  payNote,
  cta,
}: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayPrice = hasDiscount ? discountedPrice : price;

  return (
    <div ref={ref} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div
          className="flex flex-col gap-6 transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <div className="flex flex-col gap-3">
            {badge && (
              <span className="inline-flex w-fit items-center rounded-full bg-company-surface px-3 py-1 text-sm font-medium text-company">
                {badge}
              </span>
            )}
            <Text variant="display-2xl" color="textDark">
              {heading}
            </Text>
            {subheading && (
              <Text variant="body-lg" color="textLight">
                {subheading}
              </Text>
            )}
          </div>
          {payDescription && (
            <Text variant="body" color="textLight" className="leading-relaxed">
              {payDescription}
            </Text>
          )}
        </div>

        <div
          className="transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "150ms",
          }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50">
            {hasDiscount && discountPercent && (
              <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-company-surface px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-company" />
                <span className="text-xs font-bold text-company">
                  Sleva {discountPercent} %
                </span>
              </div>
            )}

            <div className="px-8 pt-8 pb-7 border-b border-zinc-100">
              <Text
                variant="label"
                color="textLight"
                className="uppercase tracking-widest text-xs"
              >
                {planName}
              </Text>

              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-black leading-none tabular-nums text-zinc-900">
                  {displayPrice.toLocaleString("cs-CZ")}
                </span>
                <div className="flex flex-col gap-0.5 pb-1">
                  <span className="text-sm font-semibold text-zinc-500">
                    {currency} / {period}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-zinc-400 line-through">
                      {price.toLocaleString("cs-CZ")} {currency}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-7 flex flex-col gap-6">
              <ul className="flex flex-col gap-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check
                        className="h-3 w-3 text-emerald-600"
                        strokeWidth={3}
                      />
                    </div>
                    <Text variant="body" color="textDark">
                      {feature}
                    </Text>
                  </li>
                ))}
              </ul>

              <div className="flex items-start gap-2.5 rounded-2xl bg-white border border-zinc-100 px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <Text variant="body-sm" color="textLight">
                  {payNote}
                </Text>
              </div>

              <Button
                text={cta.text}
                version="companyFull"
                size="xl"
                link={cta.href}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
