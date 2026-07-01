"use client";

import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import { formatVariantCapacity } from "@/app/functions/utils/variants";
import { Variant } from "@roo/common";
import { Users } from "lucide-react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

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
    <div className="flex items-center gap-2">
      <div className="text-zinc-400 shrink-0">{icon}</div>
      <Text variant="caption" color="secondary">
        {label}
      </Text>
      <Text variant="caption" color="textDark" className="font-medium">
        {value}
      </Text>
    </div>
  );
}

export default function FormVariantSummary({ variant }: { variant: Variant }) {
  const coverImage = variant.images.coverImage;
  const capacityText = formatVariantCapacity(variant.capacity);

  const includeItems = (variant.includes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i)
    .slice(0, 4);

  const excludeItems = (variant.excludes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i)
    .slice(0, 4);

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden">
      {/* Header row: thumbnail + name + price */}
      <div className="flex items-start gap-4 p-4">
        {coverImage?.filename && (
          <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-zinc-200">
            <img
              src={generateMediaUrl(coverImage.filename)}
              alt={coverImage.alt ?? variant.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <Text variant="label-lg" color="textDark" className="font-semibold leading-tight">
            {variant.name}
          </Text>
          {variant.shortDescription && (
            <Text variant="caption" color="secondary" className="line-clamp-2">
              {variant.shortDescription}
            </Text>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-0.5">
          <Text variant="label-lg" color="primary" className="font-bold">
            {variant.price.base.toLocaleString("cs-CZ")} Kč
          </Text>
        </div>
      </div>

      {/* Capacity */}
      {capacityText && (
        <div className="px-4 pb-4">
          <InfoRow icon={<Users size={13} />} label="Kapacita" value={capacityText} />
        </div>
      )}

      {/* Includes / Excludes */}
      {(includeItems.length > 0 || excludeItems.length > 0) && (
        <div className="border-t border-zinc-200 px-4 py-3 flex gap-6">
          {includeItems.length > 0 && (
            <div className="flex flex-col gap-1.5 flex-1">
              {includeItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <FaCircleCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                  <Text variant="caption" color="textDark">
                    {item}
                  </Text>
                </div>
              ))}
            </div>
          )}
          {excludeItems.length > 0 && (
            <div className="flex flex-col gap-1.5 flex-1">
              {excludeItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <FaCircleXmark className="w-3 h-3 text-red-400 shrink-0" />
                  <Text variant="caption" color="secondary">
                    {item}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
