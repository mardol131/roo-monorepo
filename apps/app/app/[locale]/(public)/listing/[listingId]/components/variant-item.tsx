"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { formatVariantCapacity } from "@/app/functions/utils/variants";
import { Variant } from "@roo/common";
import { Clock, Users } from "lucide-react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import CardImageCarousel from "./card-image-carousel";
import { InfoRow } from "./listing-ui";
import { VariantIncludesExcludes } from "./variant-includes-excludes";

interface VariantItemProps {
  variant: Variant;
  type?: "default" | "review";
  onOrderButtonClick?: () => void;
  orderButtonText?: string;
}

const PRICING_UNIT_LABELS: Record<Variant["price"]["pricingUnit"], string> = {
  per_person: "/ os.",
  lump_sum: "/ událost",
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export default function VariantItem({
  variant,
  type = "default",
  onOrderButtonClick,
  orderButtonText,
}: VariantItemProps) {
  const includeItems = (variant.includes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i);

  const excludeItems = (variant.excludes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i);

  const capacityText = formatVariantCapacity(variant.capacity);

  return (
    <article className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr]">
        {/* Photo */}
        <div className="relative aspect-4/3 md:aspect-auto md:min-h-85 overflow-hidden bg-zinc-100 border-b md:border-b-0 md:border-r border-zinc-200">
          <CardImageCarousel
            images={[
              variant.images.coverImage,
              ...(variant.images.gallery ?? []),
            ]}
            altFallback={variant.name}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <Text variant="h3" color="textDark">
              {variant.name}
            </Text>
            <Text variant="body-sm" color="secondary">
              {variant.shortDescription}
            </Text>
          </div>

          {/* Meta */}
          {(capacityText || variant.durationMinutes) && (
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {capacityText && (
                <InfoRow
                  icon={<Users size={16} />}
                  label="Kapacita"
                  value={capacityText}
                />
              )}
              {!!variant.durationMinutes && (
                <InfoRow
                  icon={<Clock size={16} />}
                  label="Délka"
                  value={formatDuration(variant.durationMinutes)}
                />
              )}
            </div>
          )}

          {/* Includes / Excludes */}
          {(includeItems.length > 0 || excludeItems.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-zinc-100">
              {includeItems.length > 0 && (
                <VariantIncludesExcludes
                  icon={FaCircleCheck}
                  title="Varianta obsahuje"
                  items={includeItems}
                  colorClass="text-emerald-500"
                />
              )}
              {excludeItems.length > 0 && (
                <VariantIncludesExcludes
                  icon={FaCircleXmark}
                  title="Varianta neobsahuje"
                  items={excludeItems}
                  colorClass="text-red-500"
                />
              )}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-auto border-t border-zinc-100">
            <div className="flex items-baseline gap-1.5">
              <Text variant="h2" color="primary">
                {variant.price.base.toLocaleString("cs-CZ")} Kč
              </Text>
              <Text variant="label" color="secondary">
                {PRICING_UNIT_LABELS[variant.price.pricingUnit]}
              </Text>
            </div>
            {type === "default" && onOrderButtonClick && orderButtonText && (
              <Button
                text={orderButtonText}
                version="primary"
                onClick={onOrderButtonClick}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
