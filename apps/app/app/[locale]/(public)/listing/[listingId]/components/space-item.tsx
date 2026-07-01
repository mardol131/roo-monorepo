"use client";

import Text from "@/app/components/ui/atoms/text";
import { Space } from "@roo/common";
import { BedDouble, Maximize2, Users } from "lucide-react";
import CardImageCarousel from "./card-image-carousel";
import { InfoRow } from "./listing-ui";

const TYPE_LABELS: Record<Space["type"], string> = {
  building: "Budova",
  room: "Místnost",
  area: "Areál",
};

const PRICING_UNIT_LABELS: Record<Space["price"]["pricingUnit"], string> = {
  per_day: "/ den",
  per_person: "/ os.",
  per_hour: "/ hod.",
  lump_sum: "/ událost",
};

export default function SpaceItem({ space }: { space: Space }) {
  return (
    <article className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr]">
        {/* Photo */}
        <div className="relative aspect-4/3 md:aspect-auto md:min-h-85 overflow-hidden bg-zinc-100 border-b md:border-b-0 md:border-r border-zinc-200">
          <CardImageCarousel
            images={[space.images.coverImage, ...(space.images.gallery ?? [])]}
            altFallback={space.name}
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <Text
              as="span"
              variant="caption"
              color="textLight"
              className="uppercase tracking-widest font-semibold"
            >
              {TYPE_LABELS[space.type]}
            </Text>
            <Text variant="h3" color="textDark">
              {space.name}
            </Text>
            {space.description && (
              <Text variant="body-sm" color="secondary">
                {space.description}
              </Text>
            )}
          </div>

          {/* Meta */}
          {(space.capacity != null ||
            space.area != null ||
            (space.hasAccommodation && space.accommodationCapacity != null)) && (
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {space.capacity != null && (
                <InfoRow
                  icon={<Users size={16} />}
                  label="Kapacita"
                  value={`${space.capacity} osob`}
                />
              )}
              {space.area != null && (
                <InfoRow
                  icon={<Maximize2 size={16} />}
                  label="Plocha"
                  value={`${space.area} m²`}
                />
              )}
              {space.hasAccommodation &&
                space.accommodationCapacity != null && (
                  <InfoRow
                    icon={<BedDouble size={16} />}
                    label="Ubytování"
                    value={`${space.accommodationCapacity} lůžek`}
                  />
                )}
            </div>
          )}

          {/* Price */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-auto border-t border-zinc-100">
            <div className="flex items-baseline gap-1.5">
              <Text variant="h2" color="primary">
                {space.price.base.toLocaleString("cs-CZ")} Kč
              </Text>
              <Text variant="label" color="secondary">
                {PRICING_UNIT_LABELS[space.price.pricingUnit]}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
