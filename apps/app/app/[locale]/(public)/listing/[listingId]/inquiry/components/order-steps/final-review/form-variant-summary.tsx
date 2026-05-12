"use client";

import Text from "@/app/components/ui/atoms/text";
import { generateMediaUrl } from "@/app/functions/generate-media-url";
import {
  Amenity,
  Cuisine,
  DietaryOption,
  DishType,
  FoodServiceStyle,
  Necessity,
  Service,
  Technology,
  Variant,
} from "@roo/common";
import { BedDouble, Car, Clock, Coffee, Users } from "lucide-react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

type VariantDetail = Variant["details"][number];

function Chip({ label }: { label: string }) {
  return (
    <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium whitespace-nowrap">
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

function VenueStats({
  detail,
}: {
  detail: Extract<VariantDetail, { blockType: "venue" }>;
}) {
  const amenities = (detail.amenities ?? [])
    .filter((a): a is Amenity => typeof a !== "string")
    .map((a) => a.name);
  const services = (detail.services ?? [])
    .filter((s): s is Service => typeof s !== "string")
    .map((s) => s.name);
  const technology = (detail.technology ?? [])
    .filter((t): t is Technology => typeof t !== "string")
    .map((t) => t.name);
  const allChips = [...amenities, ...services, ...technology].slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <InfoRow
          icon={<Users size={13} />}
          label="Kapacita"
          value={
            detail.capacity.min
              ? `${detail.capacity.min}–${detail.capacity.max} osob`
              : `až ${detail.capacity.max} osob`
          }
        />
        {detail.accommodation.included && (
          <InfoRow
            icon={<BedDouble size={13} />}
            label="Ubytování"
            value={
              detail.accommodation.capacity
                ? `${detail.accommodation.capacity} míst`
                : "v ceně"
            }
          />
        )}
        {detail.parking.included && (
          <InfoRow
            icon={<Car size={13} />}
            label="Parkování"
            value={detail.parking.spots ? `${detail.parking.spots} míst` : "v ceně"}
          />
        )}
        {detail.breakfast.included && (
          <InfoRow icon={<Coffee size={13} />} label="Snídaně" value="v ceně" />
        )}
      </div>
      {allChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allChips.map((chip) => (
            <Chip key={chip} label={chip} />
          ))}
        </div>
      )}
    </div>
  );
}

function GastroStats({
  detail,
}: {
  detail: Extract<VariantDetail, { blockType: "gastro" }>;
}) {
  const cuisines = (detail.cuisines ?? [])
    .filter((c): c is Cuisine => typeof c !== "string")
    .map((c) => c.name);
  const dishTypes = (detail.dishTypes ?? [])
    .filter((d): d is DishType => typeof d !== "string")
    .map((d) => d.name);
  const dietary = (detail.dietaryOptions ?? [])
    .filter((d): d is DietaryOption => typeof d !== "string")
    .map((d) => d.name);
  const styles = (detail.foodServiceStyle ?? [])
    .filter((s): s is FoodServiceStyle => typeof s !== "string")
    .map((s) => s.name);
  const allChips = [...cuisines, ...dishTypes, ...dietary, ...styles].slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <InfoRow
          icon={<Users size={13} />}
          label="Kapacita"
          value={
            detail.capacity.min
              ? `${detail.capacity.min}–${detail.capacity.max} osob`
              : `až ${detail.capacity.max} osob`
          }
        />
        {detail.pricePerPerson != null && (
          <InfoRow
            icon={<Users size={13} />}
            label="Na osobu"
            value={`${detail.pricePerPerson.toLocaleString("cs-CZ")} Kč`}
          />
        )}
      </div>
      {allChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allChips.map((chip) => (
            <Chip key={chip} label={chip} />
          ))}
        </div>
      )}
    </div>
  );
}

function EntertainmentStats({
  detail,
}: {
  detail: Extract<VariantDetail, { blockType: "entertainment" }>;
}) {
  const necessities = (detail.necessities ?? [])
    .filter((n): n is Necessity => typeof n !== "string")
    .map((n) => n.name)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <InfoRow
          icon={<Users size={13} />}
          label="Kapacita"
          value={
            detail.capacity.min
              ? `${detail.capacity.min}–${detail.capacity.max} osob`
              : `až ${detail.capacity.max} osob`
          }
        />
        {detail.performanceDuration != null && (
          <InfoRow
            icon={<Clock size={13} />}
            label="Délka"
            value={`${detail.performanceDuration} min`}
          />
        )}
      </div>
      {necessities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {necessities.map((n) => (
            <Chip key={n} label={n} />
          ))}
        </div>
      )}
    </div>
  );
}

function DetailStats({ detail }: { detail: VariantDetail }) {
  if (detail.blockType === "venue") return <VenueStats detail={detail} />;
  if (detail.blockType === "gastro") return <GastroStats detail={detail} />;
  return <EntertainmentStats detail={detail} />;
}

export default function FormVariantSummary({ variant }: { variant: Variant }) {
  const coverImage = variant.images.coverImage;

  const includeItems = (variant.includes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i)
    .slice(0, 4);

  const excludeItems = (variant.excludes ?? [])
    .map((i) => i.item)
    .filter((i): i is string => !!i)
    .slice(0, 4);

  const detail = variant.details[0];

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
            {variant.price.generalPrice.toLocaleString("cs-CZ")} Kč
          </Text>
          {(variant.price.seasonalPrices ?? []).length > 0 && (
            <Text variant="caption" color="secondary">
              + sezónní ceny
            </Text>
          )}
        </div>
      </div>

      {/* Detail stats */}
      {detail && (
        <div className="px-4 pb-4">
          <DetailStats detail={detail} />
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
