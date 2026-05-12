"use client";

import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { useOrderStore } from "@/app/store/order-store";
import { Variant } from "@roo/common";
import { Calendar, Check, Clock, Users, X } from "lucide-react";
import Image from "next/image";

type Props = {
  variant: Variant;
  index: number;
};

const TYPE_LABEL: Record<Variant["type"], string> = {
  allYear: "Celý rok",
  seasonal: "Sezónní",
};

const AVAIL_LABEL: Record<Variant["availability"], string> = {
  allDay: "Celý den",
  selectedHours: "Vybrané hodiny",
};

export default function OrderVariantSummaryCard({ variant, index }: Props) {
  const { currentVariantId, setCurrentVariantId } = useOrderStore();
  const isSelected = variant.id === currentVariantId;

  const detail = variant.details?.[0];
  const capacity = detail?.capacity;

  const includeItems = (variant.includes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i);
  const excludeItems = (variant.excludes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i);

  const coverFilename = variant.images.coverImage.filename;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setCurrentVariantId(variant.id)}
      onKeyDown={(e) => e.key === "Enter" && setCurrentVariantId(variant.id)}
      className={`group relative flex text-left rounded-2xl border-2 transition-all overflow-hidden cursor-pointer ${
        isSelected
          ? "border-primary shadow-md"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      {/* Cover image */}
      <div className="relative w-40 min-h-50 sm:w-52 shrink-0 bg-zinc-100 self-stretch">
        {coverFilename ? (
          <Image
            width={800}
            height={800}
            src={generateMediaUrl(coverFilename)}
            alt={variant.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-100" />
        )}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary shadow-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Text
              variant="label-lg"
              color="textDark"
              className="font-semibold leading-snug"
            >
              {variant.name}
            </Text>
            <Text
              variant="caption"
              color="secondary"
              className="mt-0.5 line-clamp-2"
            >
              {variant.shortDescription}
            </Text>
          </div>
          <Text
            variant="h4"
            color="primary"
            className="font-bold whitespace-nowrap shrink-0"
          >
            {variant.price.generalPrice.toLocaleString("cs-CZ")} Kč
          </Text>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={Calendar} label={TYPE_LABEL[variant.type]} />
          <InfoBadge icon={Clock} label={AVAIL_LABEL[variant.availability]} />
          {capacity && (
            <InfoBadge
              icon={Users}
              label={
                capacity.min
                  ? `${capacity.min}–${capacity.max} osob`
                  : `max. ${capacity.max} osob`
              }
            />
          )}
        </div>

        {/* Includes / Excludes */}
        {(includeItems.length > 0 || excludeItems.length > 0) && (
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-zinc-100">
            {includeItems.length > 0 && (
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                {includeItems.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                    <Text
                      variant="caption"
                      color="secondary"
                      className="truncate"
                    >
                      {item}
                    </Text>
                  </div>
                ))}
                {includeItems.length > 4 && (
                  <Text
                    variant="caption"
                    color="secondary"
                    className="pl-[18px]"
                  >
                    +{includeItems.length - 4} dalších
                  </Text>
                )}
              </div>
            )}
            {excludeItems.length > 0 && (
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                {excludeItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <X className="w-3 h-3 text-zinc-400 shrink-0" />
                    <Text
                      variant="caption"
                      color="secondary"
                      className="truncate"
                    >
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBadge({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-zinc-100 rounded-full px-3 py-1">
      <Icon className="w-3 h-3 text-zinc-500 shrink-0" />
      <span className="text-xs text-zinc-600 font-medium">{label}</span>
    </div>
  );
}
