"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { Variant } from "@roo/common";
import {
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { VariantIncludesExcludes } from "./variant-includes-excludes";

type VariantDetail = Variant["details"][number];

interface VariantItemProps {
  variant: Variant;
  type?: "default" | "review";
  onOrderButtonClick?: () => void;
  orderButtonText?: string;
}

function Chip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm font-medium whitespace-nowrap">
      {label}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-zinc-400 shrink-0">{icon}</div>
      <div className="flex items-baseline gap-2">
        <Text variant="label" color="secondary">
          {label}
        </Text>
        <Text variant="label-lg" color="textDark">
          {value}
        </Text>
      </div>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip key={item} label={item} />
      ))}
    </div>
  );
}

function VenueDetails({
  detail,
}: {
  detail: Extract<VariantDetail, { blockType: "venue" }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {detail.accommodation.included && (
        <InfoRow
          icon={<BedDouble size={16} />}
          label="Ubytování"
          value={
            detail.accommodation.capacity
              ? `${detail.accommodation.capacity} míst`
              : "v ceně"
          }
        />
      )}
      {detail.breakfast.included && (
        <InfoRow
          icon={<Coffee size={16} />}
          label="Snídaně"
          value={
            detail.breakfast.price
              ? `${detail.breakfast.price.toLocaleString("cs-CZ")} Kč/os.`
              : "v ceně"
          }
        />
      )}
    </div>
  );
}

function GastroDetails({
  detail,
}: {
  detail: Extract<VariantDetail, { blockType: "gastro" }>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {detail.alcoholIncluded && <Chip label="Alkohol v ceně" />}
        {detail.kidsMenu && <Chip label="Dětské menu" />}
        {detail.minimumOrderAmount != null && (
          <Chip
            label={`Min. objednávka ${detail.minimumOrderAmount.toLocaleString("cs-CZ")} Kč`}
          />
        )}
      </div>
    </div>
  );
}

function EntertainmentDetails({
  detail,
}: {
  detail: Extract<VariantDetail, { blockType: "entertainment" }>;
}) {
  const audienceLabels: Record<string, string> = {
    adults: "Dospělí",
    kids: "Děti",
    seniors: "Senioři",
  };

  return (
    <div className="flex flex-col gap-5">
      {detail.performance.numberOfSets != null && (
        <InfoRow
          icon={<Clock size={16} />}
          label="Počet setů"
          value={
            detail.performance.pauseBetweenSetsInMinutes != null
              ? `${detail.performance.numberOfSets} × přestávka ${detail.performance.pauseBetweenSetsInMinutes} min`
              : String(detail.performance.numberOfSets)
          }
        />
      )}
      {(detail.audience ?? []).length > 0 && (
        <div className="flex flex-col gap-2">
          <Text variant="label" color="secondary">
            Cílové publikum
          </Text>
          <ChipList
            items={(detail.audience ?? []).map((a) => audienceLabels[a] ?? a)}
          />
        </div>
      )}
    </div>
  );
}

function DetailSection({ detail }: { detail: VariantDetail }) {
  if (detail.blockType === "venue") return <VenueDetails detail={detail} />;
  if (detail.blockType === "gastro") return <GastroDetails detail={detail} />;
  return <EntertainmentDetails detail={detail} />;
}

export default function VariantItem({
  variant,
  type = "default",
  onOrderButtonClick,
  orderButtonText,
}: VariantItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [
    variant.images.coverImage,
    ...(variant.images.gallery ?? []),
  ].filter((img) => !!img?.filename);

  const currentImage = allImages[currentImageIndex];

  const goToPrevious = () =>
    setCurrentImageIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));

  const goToNext = () =>
    setCurrentImageIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));

  const includeItems = (variant.includes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i);

  const excludeItems = (variant.excludes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i);

  const detail = variant.details[0];

  const capacityValue = variant.capacity.min
    ? `${variant.capacity.min}–${variant.capacity.max} osob`
    : `až ${variant.capacity.max} osob`;

  return (
    <div className="border border-zinc-200 rounded-3xl overflow-hidden shadow-sm transition-shadow">
      <div className="grid grid-cols-[380px_1fr]">
        {/* Left column — image */}
        <div className="bg-zinc-50 p-6 flex flex-col gap-6 border-r border-zinc-200">
          {/* Carousel */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-200">
            {currentImage?.filename && (
              <img
                src={generateMediaUrl(currentImage.filename)}
                alt={currentImage.alt ?? variant.name}
                className="w-full h-full object-cover"
              />
            )}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white w-5"
                          : "bg-white/50 w-1.5 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right column — content */}
        <div className="p-8 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
              <Text variant="h4" color="textDark" className="mb-1">
                {variant.name}
              </Text>
              <Text variant="body" color="secondary">
                {variant.shortDescription}
              </Text>
            </div>

            {/* Capacity + detail-specific info */}
            <div className="flex flex-col gap-5">
              <InfoRow
                icon={<Users size={16} />}
                label="Kapacita"
                value={capacityValue}
              />
              {detail && <DetailSection detail={detail} />}
            </div>

            {/* Includes / Excludes */}
            {(includeItems.length > 0 || excludeItems.length > 0) && (
              <div className="grid grid-cols-2 gap-6 pt-2 border-t border-zinc-100">
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
          </div>

          {/* Price + CTA */}
          <div className="bg-zinc-50 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Text variant="h3" color="primary">
                {variant.price.base.toLocaleString("cs-CZ")} Kč
              </Text>
              {(variant.price.seasonalPrices ?? []).length > 0 && (
                <Text variant="caption" color="secondary">
                  Sezónní ceny k dispozici
                </Text>
              )}
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
    </div>
  );
}
